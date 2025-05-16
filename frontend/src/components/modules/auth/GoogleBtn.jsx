import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        let user;

        try {
            const provider = new GoogleAuthProvider();
            const signIn = await signInWithPopup(auth, provider);
            user = signIn.user;

            if (signIn) {
                const userSignIn = await apiInstanceExpress.post("sign-in", {
                    uid: user.uid,
                    email: user.email,
                });

                if (userSignIn.status === 200) {
                    if (userSignIn.data.data.role === "admin") {
                        return navigate("/dashboard");
                    } else {
                        return navigate(`/profile/${userSignIn.data.data._id}`);
                    };
                };
            }
        } catch (error) {
            if (error.response?.status === 404) {
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
                        return navigate("/dashboard");
                    } else {
                        return navigate(`/profile/${userSignUp.data.data._id}`);
                    };
                };
            } else {
                console.error("Sign-in Error:", error);
                toast.error("Gagal login dengan Google.", {
                    duration: 3000,
                });
            }
        }
    };

    return (
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer">
            Lanjutkan dengan Google
        </Button>
    );
};

export default GoogleBtn;