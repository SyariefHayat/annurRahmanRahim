import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Button } from '@/components/ui/button';
import { apiInstanceExpress } from '@/services/apiInstance';

const GoogleBtn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                console.log("lll");
                const result = await getRedirectResult(auth);
                console.log(result);

                if (!result) return; // No redirect result, user hasn't completed sign-in
                
                const user = result.user;
                
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
                    } else {
                        console.error("Sign-in Error:", error);
                        toast.error("Gagal login dengan Google.", {
                            duration: 3000,
                        });
                    }
                }
            } catch (error) {
                console.error("Redirect Result Error:", error);
                toast.error("Gagal login dengan Google.", {
                    duration: 3000,
                });
            }
        };

        handleRedirectResult();
    }, [navigate]);

    const handleGoogleSignIn = (e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        signInWithRedirect(auth, provider);
    };

    return (
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer">
            Lanjutkan dengan Google
        </Button>
    );
};

export default GoogleBtn;