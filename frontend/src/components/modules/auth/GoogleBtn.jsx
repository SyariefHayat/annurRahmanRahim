import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from 'firebase/auth';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();
    const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);
    const [authError, setAuthError] = useState(null);
    
    // Handle redirect result when component mounts
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                setIsProcessingRedirect(true);
                console.log("Checking for redirect result...");
                
                const result = await getRedirectResult(auth);
                
                if (result?.user) {
                    console.log("Redirect successful, user:", result.user.email);
                    await processUserLogin(result.user);
                } else {
                    console.log("No redirect result found or login canceled");
                }
            } catch (error) {
                console.error("Redirect result error:", error);
                console.error(`Error code: ${error.code || 'unknown'}`);
                console.error(`Error message: ${error.message || 'unknown'}`);
                
                setAuthError({
                    code: error.code,
                    message: error.message
                });
                
                toast.error(`Login Error: ${error.message || "Authentication failed"}`, {
                    duration: 4000,
                });
            } finally {
                setIsProcessingRedirect(false);
            }
        };

        handleRedirectResult();
    }, [navigate]);

    // Process user login/signup
    const processUserLogin = async (user) => {
        try {
            console.log("Processing user login for:", user.email);
            
            const userSignIn = await apiInstanceExpress.post("sign-in", {
                uid: user.uid,
                email: user.email,
            });

            console.log("Sign-in response:", userSignIn.status);
            
            if (userSignIn.status === 200) {
                toast.success("Login berhasil!");
                if (userSignIn.data.data.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate(`/profile/${userSignIn.data.data._id}`);
                }
                return;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // User doesn't exist, create a new account
                console.log("User not found, creating new account");
                await handleNewUserSignup(user);
            } else {
                console.error("Sign-in Error:", error);
                toast.error("Gagal login dengan Google.", {
                    duration: 3000,
                });
            }
        }
    };

    // Handle new user signup
    const handleNewUserSignup = async (user) => {
        try {
            const providerId = user.providerData[0]?.providerId || 'google.com';
            const provider = mapProvider(providerId);

            console.log("Creating new user with provider:", provider);
            
            const userSignUp = await apiInstanceExpress.post("sign-up", {
                uid: user.uid,
                email: user.email,
                username: user.displayName || "",
                profilePicture: user.photoURL || "",
                provider,
            });

            console.log("Sign-up response:", userSignUp.status);
            
            if (userSignUp.status === 201) {
                toast.success("Pendaftaran berhasil!");
                if (userSignUp.data.data.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate(`/profile/${userSignUp.data.data._id}`);
                }
            }
        } catch (error) {
            console.error("Sign-up Error:", error);
            toast.error("Gagal mendaftar dengan Google.", {
                duration: 3000,
            });
        }
    };

    // Configure Google provider based on environment
    const configureGoogleProvider = () => {
        const provider = new GoogleAuthProvider();
        
        // Add basic scopes
        provider.addScope('email');
        provider.addScope('profile');
        
        // Force account selection to prevent automatic login
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        return provider;
    };

    // Determine if we're on Vercel, localhost, or other environment
    const getEnvironmentType = () => {
        const currentUrl = window.location.origin;
        
        if (currentUrl.includes('localhost')) {
            return 'localhost';
        } else if (currentUrl.includes('vercel.app')) {
            return 'vercel';
        } else {
            return 'other';
        }
    };

    // Choose best authentication method based on environment and device
    const getBestAuthMethod = () => {
        const environment = getEnvironmentType();
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // For Vercel environment
        if (environment === 'vercel') {
            // On mobile devices in production, redirect is generally more reliable
            if (isMobile) {
                return 'redirect';
            } else {
                // On desktop in production, we can try popup first
                return 'popup';
            }
        } 
        // For localhost, popup is more reliable for debugging
        else if (environment === 'localhost') {
            return 'popup';
        }
        // For other environments, follow mobile/desktop best practice
        else {
            return isMobile ? 'redirect' : 'popup';
        }
    };

    // Handle Google sign in button click
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        
        if (isProcessingRedirect) {
            toast.info("Sedang memproses login sebelumnya, harap tunggu...");
            return;
        }
        
        try {
            setAuthError(null);
            const provider = configureGoogleProvider();
            const authMethod = getBestAuthMethod();
            const currentEnvironment = getEnvironmentType();
            
            console.log(`Current environment: ${currentEnvironment}`);
            console.log(`Using auth method: ${authMethod}`);
            
            if (authMethod === 'popup') {
                toast.info("Membuka popup login Google...");
                const signIn = await signInWithPopup(auth, provider);
                if (signIn?.user) {
                    await processUserLogin(signIn.user);
                }
            } else {
                toast.info("Mengarahkan ke halaman login Google...");
                await signInWithRedirect(auth, provider);
                // The result will be handled in useEffect
            }
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            setAuthError({
                code: error.code,
                message: error.message
            });
            
            // Provide more specific error messages
            let errorMessage = "Gagal login dengan Google.";
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Popup login ditutup. Silakan coba lagi.";
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Popup diblokir oleh browser. Coba izinkan popup atau gunakan metode redirect.";
                // Offer redirect as fallback if popup is blocked
                if (confirm("Popup diblokir. Coba login dengan metode redirect?")) {
                    try {
                        const provider = configureGoogleProvider();
                        await signInWithRedirect(auth, provider);
                    } catch (redirectError) {
                        console.error("Redirect error:", redirectError);
                    }
                }
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = "Permintaan popup dibatalkan.";
            } else if (error.code === 'auth/unauthorized-domain') {
                errorMessage = "Domain tidak diizinkan di Firebase Console. Hubungi administrator.";
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = "Operasi tidak diizinkan. Provider Google mungkin tidak diaktifkan di Firebase.";
            }
            
            toast.error(errorMessage, {
                duration: 4000,
            });
        }
    };

    return (
        <>
            <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer" disabled={isProcessingRedirect}>
                {isProcessingRedirect ? "Memproses..." : "Lanjutkan dengan Google"}
            </Button>
            
            {/* Debugging info for development environment */}
            {(process.env.NODE_ENV === 'development' || authError) && (
                <div className={`mt-2 p-2 text-xs rounded border ${authError ? 'bg-red-50 text-red-800 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                    <p><strong>Environment:</strong> {getEnvironmentType()}</p>
                    <p><strong>Current URL:</strong> {window.location.href}</p>
                    {authError && (
                        <>
                            <p><strong>Error Code:</strong> {authError.code || 'Unknown'}</p>
                            <p><strong>Message:</strong> {authError.message || 'No message'}</p>
                        </>
                    )}
                    <Button 
                        variant="link" 
                        className="mt-1 p-0 h-auto text-xs text-blue-600"
                        onClick={() => {
                            // Toggle between popup and redirect for testing
                            const currentMethod = localStorage.getItem('preferredAuthMethod');
                            const newMethod = currentMethod === 'redirect' ? 'popup' : 'redirect';
                            localStorage.setItem('preferredAuthMethod', newMethod);
                            toast.info(`Mode auth diubah ke: ${newMethod}`, { duration: 3000 });
                        }}
                    >
                        Toggle Auth Method
                    </Button>
                </div>
            )}
        </>
    );
};

export default GoogleBtn;