import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { 
    GoogleAuthProvider, 
    signInWithCredential, 
    signInWithPopup
} from 'firebase/auth';

import { 
    GoogleLogin, 
    useGoogleOneTapLogin 
} from '@react-oauth/google';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= 768;

    // Fungsi untuk menangani proses autentikasi setelah mendapatkan user dari Firebase
    const handleAuthProcess = async (user) => {
        try {
            const userSignIn = await apiInstanceExpress.post("sign-in", {
                uid: user.uid,
                email: user.email,
            });
            
            if (userSignIn.status === 200) {
                toast.success("Login berhasil", {
                    duration: 3000,
                });
                
                if (userSignIn.data.data.role === "admin") {
                    return navigate("/dashboard");
                } else {
                    return navigate(`/profile/${userSignIn.data.data._id}`);
                }
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // User belum terdaftar, lakukan sign up
                const providerId = user.providerData[0]?.providerId || 'google.com';
                const provider = mapProvider(providerId);
                try {
                    const userSignUp = await apiInstanceExpress.post("sign-up", {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName || "",
                        profilePicture: user.photoURL || "",
                        provider,
                    });
                    
                    if (userSignUp.status === 201) {
                        toast.success("Pendaftaran berhasil", {
                            duration: 3000,
                        });
                        
                        if (userSignUp.data.data.role === "admin") {
                            return navigate("/dashboard");
                        } else {
                            return navigate(`/profile/${userSignUp.data.data._id}`);
                        }
                    }
                } catch (signUpError) {
                    console.error("Sign-up Error:", signUpError);
                    toast.error("Gagal mendaftarkan akun", {
                        duration: 3000,
                    });
                }
            } else {
                console.error("Sign-in Error:", error);
                toast.error("Gagal login dengan Google", {
                    duration: 3000,
                });
            }
        }
    };
    
    // Handle Firebase auth dengan credential dari Google One Tap
    const handleCredentialResponse = async (credentialResponse) => {
        try {
            // Mendapatkan ID token dari respons Google
            const idToken = credentialResponse.credential;
            
            // Membuat credential untuk Firebase
            const credential = GoogleAuthProvider.credential(idToken);
            
            // Sign in ke Firebase dengan credential
            const result = await signInWithCredential(auth, credential);
            const user = result.user;
            
            // Proses autentikasi setelah berhasil login
            await handleAuthProcess(user);
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            toast.error("Gagal memverifikasi kredensial Google", {
                duration: 3000,
            });
        }
    };

    // Handle Google Popup untuk desktop
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        let user;
        try {
            const provider = new GoogleAuthProvider();
            const signIn = await signInWithPopup(auth, provider);
            user = signIn.user;
            
            // Proses autentikasi setelah berhasil login
            await handleAuthProcess(user);
        } catch (error) {
            console.error("Sign-in Error:", error);
            toast.error("Gagal login dengan Google", {
                duration: 3000,
            });
        }
    };

    // Setup Google One Tap untuk mobile
    useGoogleOneTapLogin({
        onSuccess: handleCredentialResponse,
        onError: () => {
            console.error('Google One Tap Login Failed');
            toast.error("Gagal login dengan Google One Tap", {
                duration: 3000,
            });
        },
        cancel_on_tap_outside: false,
        context: 'signin'
    });

    return (
        <>
            {isMobile ? null : (
                <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer">
                    Lanjutkan dengan Google
                </Button>
            )}
        </>
    );
};

export default GoogleBtn;