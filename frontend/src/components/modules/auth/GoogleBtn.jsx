import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithCredential
} from 'firebase/auth';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const googleButtonRef = useRef(null);
    
    // Deteksi apakah perangkat adalah mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    useEffect(() => {
        // Inisialisasi Google Identity Services untuk semua perangkat
        // Tidak perlu membatasi hanya untuk mobile
        loadGoogleIdentityServices();
    }, []);
    
    // Load Google Identity Services script
    const loadGoogleIdentityServices = () => {
        if (document.getElementById('google-identity-script')) return;
        
        // Google Client ID - Pastikan nilai ini ada di environment variables
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        
        if (!googleClientId) {
            console.error("Google Client ID tidak ditemukan di environment variables");
            return;
        }
        
        // Load Google Identity script
        const script = document.createElement('script');
        script.id = 'google-identity-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            initializeGoogleOneTap(googleClientId);
        };
        
        document.head.appendChild(script);
    };
    
    // Inisialisasi Google One Tap
    const initializeGoogleOneTap = (clientId) => {
        if (!window.google || !window.google.accounts) {
            console.error("Google Identity Services tidak tersedia");
            return;
        }
        
        // Konfigurasi Google Identity Services
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleOneTapResponse,
            nonce: crypto.randomUUID?.(),
            auto_select: false,
            cancel_on_tap_outside: true,
            // Penting: Tetapkan context ke 'signin' untuk menghindari popup
            context: 'signin',
            // Pastikan tidak menggunakan mode popup
            use_fedcm_for_prompt: true
        });
        
        // Render tombol GSI jika ref-nya sudah tersedia
        if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { 
                    type: 'standard',
                    theme: 'outline', 
                    size: 'large', 
                    text: 'continue_with',
                    width: '100%',
                    // Logo alignment bisa diatur untuk tampilan lebih baik
                    logo_alignment: 'center'
                }
            );
        }
    };
    
    // Callback untuk Google One Tap
    const handleGoogleOneTapResponse = async (response) => {
        if (!response || !response.credential) {
            console.error("Respons Google One Tap tidak valid");
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Buat credential Firebase dari JWT token Google
            const credential = GoogleAuthProvider.credential(response.credential);
            
            // Sign in ke Firebase dengan credential
            const userCredential = await signInWithCredential(auth, credential);
            
            // Proses autentikasi user
            await processUserAuth(userCredential.user);
        } catch (error) {
            console.error("Google One Tap Error:", error);
            toast.error("Gagal login dengan Google. Silakan coba lagi.", {
                duration: 3000,
            });
            setIsLoading(false);
        }
    };
    
    // Fungsi umum untuk memproses autentikasi user
    const processUserAuth = async (user) => {
        try {
            const userSignIn = await apiInstanceExpress.post("sign-in", {
                uid: user.uid,
                email: user.email,
            });

            if (userSignIn.status === 200) {
                if (userSignIn.data.data.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate(`/profile/${userSignIn.data.data._id}`);
                }
            }
        } catch (error) {
            if (error.response?.status === 404) {
                try {
                    const providerId = user.providerData[0]?.providerId || 'google.com';
                    const provider = mapProvider(providerId);

                    const userSignUp = await apiInstanceExpress.post("sign-up", {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName || "",
                        profilePicture: user.photoURL || "",
                        provider,
                    });

                    if (userSignUp.status === 201) {
                        if (userSignUp.data.data.role === "admin") {
                            navigate("/dashboard");
                        } else {
                            navigate(`/profile/${userSignUp.data.data._id}`);
                        }
                    }
                } catch (signupError) {
                    console.error("Sign-up Error:", signupError);
                    toast.error("Gagal mendaftarkan akun Google.", {
                        duration: 3000,
                    });
                }
            } else {
                console.error("Auth Process Error:", error);
                toast.error("Gagal memproses autentikasi.", {
                    duration: 3000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Metode Google Sign-In untuk mobile yang digunakan jika tombol GSI tidak dapat dirender
    const handleGoogleSignInFallback = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Gunakan prompt dari GSI untuk mobile jika tersedia
            if (window.google && window.google.accounts) {
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Jika One Tap tidak dapat ditampilkan, gunakan fallback ke popup
                        console.log('One Tap tidak dapat ditampilkan, menggunakan fallback', notification);
                        handleGooglePopupSignIn();
                    } else {
                        setIsLoading(false);
                    }
                });
            } else {
                // Fallback ke popup jika GSI tidak tersedia
                handleGooglePopupSignIn();
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            toast.error("Gagal login dengan Google. Silakan coba lagi.", {
                duration: 3000,
            });
            setIsLoading(false);
        }
    };
    
    // Metode sign-in menggunakan popup (fallback)
    const handleGooglePopupSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await signInWithPopup(auth, provider);
            await processUserAuth(result.user);
        } catch (error) {
            console.error("Google Popup Sign-In Error:", error);
            toast.error("Gagal login dengan Google. Silakan coba lagi.", {
                duration: 3000,
            });
            setIsLoading(false);
        }
    };

    // Menampilkan UI:
    // 1. Untuk mobile, utamakan tombol GSI yang dirender oleh Google
    // 2. Sebagai fallback, gunakan tombol kustom yang akan memanggil prompt GSI atau popup
    return (
        <div className="w-full">
            {/* Google Identity Services Button Container */}
            <div 
                ref={googleButtonRef}
                id="google-signin-button"
                className="w-full mb-2"
                style={{ display: window.google && window.google.accounts ? 'block' : 'none' }}
            />
            
            {/* Fallback Button jika GSI tidak tersedia atau tombol tidak dirender */}
            {(!window.google || !window.google.accounts || !googleButtonRef.current) && (
                <Button 
                    variant="outline" 
                    onClick={handleGoogleSignInFallback} 
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? "Memproses..." : "Lanjutkan dengan Google"}
                </Button>
            )}
            
            {/* Div untuk One Tap prompt */}
            <div id="google-one-tap-container" />
        </div>
    );
};

export default GoogleBtn;