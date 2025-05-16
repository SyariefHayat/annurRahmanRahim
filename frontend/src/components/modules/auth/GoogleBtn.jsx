import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleBtn = () => {
    const handleGoogleSignIn = async (e) => {
        console.log("google clicked");
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