import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import { Button } from '@/components/ui/button';

const GoogleBtn = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async (e) => {
        console.log("Google clicked");
    };

    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleBtn;