import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from 'firebase/auth';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { apiInstanceExpress } from '@/services/apiInstance';
import GoogleBtn from '@/components/modules/auth/GoogleBtn';
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';

const SignInSchema = z.object({
    email: z.string()
        .min(1, { message: "Masukkan email anda" })
        .email({ message: "Format email tidak valid" }),

    password: z.string()
        .min(8, { message: "Password minimal 8 karakter" })
        .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
        .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
        .regex(/[0-9]/, { message: "Password harus mengandung angka" })
        .regex(/[^A-Za-z0-9]/, { message: "Password harus mengandung simbol" }),
});

const Signin = () => {
    const navigate = useNavigate();
    const isMobile = window.innerWidth <= 768;
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleSignIn = async (data) => {
        setIsLoading(true);
        
        try {
            const signIn = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = signIn.user;

            const userSignin = await apiInstanceExpress.post("sign-in", {
                uid: user.uid,
                email: data.email,
            });

            if (userSignin.status === 200) {
                toast.success("Login berhasil !");

                if (userSignin.data.data.role === "user") {
                    setTimeout(() => {
                        navigate(`/profile/${userSignin.data.data._id}`);
                    }, 1000)
                } else {
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1000)
                }

            }

        } catch (error) {
            let errorMessage = "Gagal masuk. Silakan coba lagi.";

            if (error.code === "auth/invalid-email") {
                errorMessage = "Format email tidak valid. Silakan masukkan email yang benar.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Terlalu banyak percobaan masuk. Silakan coba lagi nanti.";
            } else if (error.code === "auth/invalid-credential") {
                errorMessage = "Email atau kata sandi salah. Silakan coba lagi.";
            }

            toast.error(errorMessage, {
                duration: 3000,
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
            <Toaster />
            <ClipPathUp />

            <div className=" mb-10 md:mb-0 md:absolute flex lg:flex-1 top-5 left-5">
                <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Yayasan Annur Rahman Rahim</span>
                    <img
                        alt="logo yayasan annur rahman rahim"
                        src="/logo.png"
                        className="h-10 w-auto"
                    />
                </a>
            </div>

            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Masukkan email Anda untuk masuk ke akun
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSignIn)} className="flex flex-col gap-6">
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
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                <a href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                                                    Lupa kata sandi?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input type="password" placeholder="Masukkan kata sandi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {isLoading ? (
                                        <Button className="w-full" disabled>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            Sedang memeriksa akun anda
                                        </Button>
                                    ) : (
                                        <Button type="submit" className="w-full">Login</Button>
                                    )}

                                    {!isMobile && (
                                        <div className="grid grid-cols-3 items-center text-center">
                                            <Separator />
                                            <p className="text-sm italic text-gray-500">Atau</p>
                                            <Separator />
                                        </div>
                                    )}

                                    <GoogleBtn />
                                </form>
                            </Form>

                            <div className="mt-4 text-center text-sm">
                                Belum punya akun?{" "}
                                <a href="/sign-up" className="text-blue-500 underline underline-offset-4">
                                    Sign up
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

export default Signin