import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { auth } from "@/services/firebase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { apiInstanceExpress } from '@/services/apiInstance'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")

        try {
            const userForgotPassword = await apiInstanceExpress.post("forgot-password", { email });
            if (userForgotPassword.status === 200) {
                await sendPasswordResetEmail(auth, email);
                return setMessage("Link reset password telah dikirim ke email kamu.")
            };
        } catch (error) {
            console.error(error);
            if (error.status === 404) {
                setError("Email tidak terdaftar");
            } else {
                setError("Gagal mengirim link reset password.")
            }
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader>
                    <CardTitle>Lupa Password?</CardTitle>
                    <CardDescription>
                        Masukkan email kamu untuk mendapatkan link reset password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {message && <p className="text-sm text-green-600">{message}</p>}
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" className="w-full">
                            Kirim Link Reset
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Sudah ingat? <a href="/login" className="underline">Masuk</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ForgotPassword