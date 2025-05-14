import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from 'firebase/auth';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();

    // Fungsi reusable untuk proses setelah login berhasil
    const handleFirebaseUser = async (user) => {
        try {
            const response = await apiInstanceExpress.post("sign-in", {
                uid: user.uid,
                email: user.email,
            });

            const userData = response.data.data;
            if (userData.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate(`/profile/${userData._id}`);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                const providerId = user.providerData[0]?.providerId || "google.com";
                const provider = mapProvider(providerId);

                const signUp = await apiInstanceExpress.post("sign-up", {
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || "",
                    profilePicture: user.photoURL || "",
                    provider,
                });

                const userData = signUp.data.data;
                if (userData.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate(`/profile/${userData._id}`);
                }
            } else {
                console.error("Sign-in Error:", error);
                toast.error("Gagal login dengan Google.", { duration: 3000 });
            }
        }
    };

    // Menangani hasil redirect (untuk mobile)
    useEffect(() => {
        const fetchRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                await handleFirebaseUser(result.user);
                }
            } catch (error) {
                console.error("Redirect Login Error:", error);
            }
        };

        fetchRedirectResult();
    }, []);

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();

        const provider = new GoogleAuthProvider();

        try {
        if (window.innerWidth < 768) {
            // Mobile = redirect
            await signInWithRedirect(auth, provider);
        } else {
            // Desktop = popup
            const result = await signInWithPopup(auth, provider);
            await handleFirebaseUser(result.user);
        }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            toast.error("Gagal login dengan Google.");
        }
    };

    return (
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer">
        Lanjutkan dengan Google
        </Button>
    );
};

export default GoogleBtn;