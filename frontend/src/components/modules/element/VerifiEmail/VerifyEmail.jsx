import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Home } from 'lucide-react';
import { auth } from '@/services/firebase';
import { applyActionCode } from 'firebase/auth';
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';

// Komponen ini digunakan untuk halaman yang diakses ketika user mengklik link di email verifikasi
// URL biasanya mirip seperti: /verify-email?mode=verifyEmail&oobCode=CODE_FROM_EMAIL&apiKey=API_KEY

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [verificationState, setVerificationState] = useState({
        isLoading: true,
        isVerified: false,
        error: null
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const oobCode = searchParams.get('oobCode');
        
        const verifyEmailCode = async (code) => {
        if (!code) {
            setVerificationState({
            isLoading: false,
            isVerified: false,
            error: "Kode verifikasi tidak ditemukan"
            });
            return;
        }
        
        try {
            await applyActionCode(auth, code);
            setVerificationState({
                isLoading: false,
                isVerified: true,
                error: null
            });
        } catch (error) {
            setVerificationState({
                isLoading: false,
                isVerified: false,
                error: error.message
            });
        }
        };

        if (oobCode) {
        verifyEmailCode(oobCode);
        } else {
        setVerificationState({
            isLoading: false,
            isVerified: false,
            error: "Parameter verifikasi tidak valid"
        });
        }
    }, [location]);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoToSignIn = () => {
        navigate('/sign-in');
    };

    return (
        <div className="relative flex w-full h-screen items-center justify-center p-6">
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
            <CardHeader className="text-center pb-4">
                {verificationState.isLoading ? (
                <>
                    <div className="mx-auto flex justify-center mb-4">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Memverifikasi Email</CardTitle>
                    <CardDescription className="text-base mt-2">
                    Mohon tunggu, sedang memproses verifikasi email Anda...
                    </CardDescription>
                </>
                ) : verificationState.isVerified ? (
                <>
                    <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Email Terverifikasi!</CardTitle>
                    <CardDescription className="text-base mt-2">
                    Selamat! Email Anda telah berhasil diverifikasi.
                    </CardDescription>
                </>
                ) : (
                <>
                    <div className="mx-auto bg-red-100 p-3 rounded-full mb-4">
                    <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verifikasi Gagal</CardTitle>
                    <CardDescription className="text-base mt-2">
                    Maaf, kami tidak dapat memverifikasi email Anda.
                    </CardDescription>
                </>
                )}
            </CardHeader>
            
            <CardContent className="text-center px-6">
                {verificationState.isLoading ? (
                <p className="text-gray-600">Ini hanya akan membutuhkan beberapa saat.</p>
                ) : verificationState.isVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                    Akun Anda sekarang aktif dan Anda dapat masuk menggunakan email dan kata sandi Anda.
                    </p>
                </div>
                ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                    {verificationState.error || "Link verifikasi mungkin sudah kedaluwarsa atau tidak valid. Silakan minta link verifikasi baru."}
                    </p>
                </div>
                )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3 pt-4 pb-6">
                {!verificationState.isLoading && (
                verificationState.isVerified ? (
                    <>
                    <Button 
                        className="w-full"
                        onClick={handleGoToSignIn}
                    >
                        Masuk ke Akun
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 mt-2"
                        onClick={handleGoHome}
                    >
                        <Home className="h-4 w-4" />
                        Kembali ke Beranda
                    </Button>
                    </>
                ) : (
                    <>
                    <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/sign-in')}
                    >
                        Coba Masuk
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full flex items-center gap-2 mt-2"
                        onClick={() => navigate('/verification-sent')}
                    >
                        Kirim Ulang Verifikasi
                    </Button>
                    </>
                )
                )}
            </CardFooter>
            </Card>
        </div>

        <ClipPathDown />
        </div>
    );
};

export default VerifyEmail;