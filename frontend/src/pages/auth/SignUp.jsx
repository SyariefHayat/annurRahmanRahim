import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
    createUserWithEmailAndPassword, 
    updateProfile, 
} from 'firebase/auth';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { auth } from '@/services/firebase';
import mapProvider from '@/utils/mapProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { apiInstanceExpress } from '@/services/apiInstance';
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';
import GoogleBtn from '@/components/modules/auth/GoogleBtn';

const SignUpSchema = z.object({
    fullName: z.string()
        .min(1, { message: "Masukkan Nama anda" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),

    email: z.string()
        .min(1, { message: "Masukkan email anda" })
        .email({ message: "Format email tidak valid" }),

    password: z.string()
        .min(8, { message: "Password minimal 8 karakter" })
        .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
        .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
        .regex(/[0-9]/, { message: "Password harus mengandung angka" })
        .regex(/[^A-Za-z0-9]/, { message: "Password harus mengandung simbol" }),

    confirmPassword: z.string()
        .min(1, { message: "Konfirmasi password harus diisi" }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], 
    message: "Konfirmasi password tidak cocok",
})

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const handleSignUp = async (data) => {
        setIsLoading(true);
        try {
            const register = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            )

            const user = register.user;
            await updateProfile(user, { displayName: data.fullName });

            const providerId = user.providerData[0]?.providerId;
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
                    toast.success("Sign Up berhasil!");
                    await auth.signOut(); 
                    setTimeout(() => {
                        navigate("/sign-in");
                    }, 1000);
                };
            } catch (error) {
                await user.delete();
                throw new Error("Gagal menyimpan data anda: " + error.message);
            }

        } catch (error) {
            let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Format email tidak valid. Silakan masukkan email yang benar.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
            }

            toast.error(errorMessage, {
                duration: 3000,
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="realtive flex w-full h-full items-center justify-center p-6">
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

            <div className="w-full max-w-sm mt-14">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Daftar</CardTitle>
                            <CardDescription>Buat akun baru dengan mengisi formulir di bawah ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSignUp)} className="flex flex-col gap-6">
                                    <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel>Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel>Kata Sandi</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Masukkan kata sandi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Konfirmasi kata sandi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {isLoading ? (
                                        <Button className="w-full" disabled>
                                            <Loader2 className="animate-spin mr-2" />
                                            Sedang membuat akun anda
                                        </Button>
                                    ) : (
                                        <Button className="w-full cursor-pointer">
                                            Daftar
                                        </Button>
                                    )}

                                    <div className="grid grid-cols-3 items-center text-center">
                                        <Separator />
                                        <p className="text-sm italic text-gray-500">Atau</p>
                                        <Separator />
                                    </div>

                                    <GoogleBtn />
                                </form>
                            </Form>

                            <div className="mt-4 text-center text-sm">
                                Sudah punya akun?{" "}
                                <a href="/sign-in" className="text-blue-500 underline underline-offset-4">
                                    Masuk
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ClipPathDown />
        </div>
    )
}

export default SignUp