import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, RefreshCw, MailCheck } from 'lucide-react';
import { auth } from '@/services/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { toast, Toaster } from 'sonner';
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';

const VerificationSent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    
    // Parse query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailParam = searchParams.get('email');
        
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);
    
    const handleResendVerification = async () => {
        try {
            const currentUser = auth.currentUser;
            
            if (currentUser) {
                await sendEmailVerification(currentUser, {
                    url: `${window.location.origin}/sign-in`,
                    handleCodeInApp: false
                });
                toast.success('Email verifikasi berhasil dikirim ulang!');
            } else {
                toast.error('Sesi tidak ditemukan. Silakan login kembali.');
                setTimeout(() => {
                navigate('/sign-in');
                }, 2000);
            }
        } catch (error) {
            toast.error('Gagal mengirim email verifikasi. Silakan coba lagi nanti.');
        }
    };

    const handleBackToLogin = () => {
        navigate('/sign-in');
    };

    return (
        <div className="relative flex w-full h-screen items-center justify-center p-6">
            <Toaster />
            
            <ClipPathUp />

            <div className="absolute flex lg:flex-1 top-5 left-5">
                <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Yayasan Annur Rahman Rahim</span>
                <img
                    alt="logo yayasan annur rahman rahim"
                    src="/logo.png"
                    className="h-10 w-auto"
                />
                </a>
            </div>

            <div className="w-full max-w-md mt-14">
                <Card className="border-none shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4">
                    <MailCheck className="h-10 w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verifikasi Email</CardTitle>
                    <CardDescription className="text-base mt-2">
                    Kami telah mengirimkan email verifikasi ke:
                    </CardDescription>
                    <p className="font-medium text-blue-600 text-lg mt-1">{email}</p>
                </CardHeader>
                
                <CardContent className="text-center px-6 pt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-amber-800 text-sm">
                        Silakan periksa kotak masuk email Anda dan klik tautan verifikasi untuk mengaktifkan akun Anda. 
                        Jika tidak melihat email, periksa folder spam atau junk.
                    </p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                    <p>• Email verifikasi biasanya tiba dalam beberapa menit</p>
                    <p>• Link verifikasi berlaku selama 24 jam</p>
                    <p>• Anda perlu memverifikasi email sebelum dapat masuk</p>
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
                    <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2" 
                    onClick={handleResendVerification}
                    >
                    <RefreshCw className="h-4 w-4" />
                    Kirim Ulang Email Verifikasi
                    </Button>
                    
                    <Button 
                    variant="ghost" 
                    className="w-full flex items-center gap-2 mt-2" 
                    onClick={handleBackToLogin}
                    >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Halaman Login
                    </Button>
                </CardFooter>
                </Card>
            </div>

            <ClipPathDown />
        </div>
    );
};

export default VerificationSent;