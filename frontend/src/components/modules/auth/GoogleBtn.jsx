import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const GoogleBtn = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async (e) => {
        console.log("Google clicked");
    };

    return (
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full cursor-pointer">
            Lanjutkan dengan Google
        </Button>
    );
};

export default GoogleBtn;