import React, { useState } from 'react';

import { 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    updatePassword 
} from 'firebase/auth';

import { 
    AlertCircle, 
    Check, 
    Eye, 
    EyeOff, 
    Loader2, 
    Lock, 
    ShieldCheck 
} from 'lucide-react';

import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import { 
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Progress } from "@/components/ui/progress";

const NewPassword = () => {
    const { userData, currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(false);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        
        if (password.length > 0) strength += 20;
        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        return strength;
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 20) return { text: "Sangat Lemah", color: "text-red-500" };
        if (passwordStrength <= 40) return { text: "Lemah", color: "text-orange-500" };
        if (passwordStrength <= 60) return { text: "Sedang", color: "text-yellow-500" };
        if (passwordStrength <= 80) return { text: "Kuat", color: "text-blue-500" };
        return { text: "Sangat Kuat", color: "text-green-500" };
    };

    const getProgressColor = () => {
        if (passwordStrength <= 20) return "bg-red-500";
        if (passwordStrength <= 40) return "bg-orange-500";
        if (passwordStrength <= 60) return "bg-yellow-500";
        if (passwordStrength <= 80) return "bg-blue-500";
        return "bg-green-500";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setFormError("Mohon lengkapi semua field.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormError("Password baru dan konfirmasi password tidak cocok.");
            return;
        }

        if (passwordStrength < 60) {
            setFormError("Password terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.");
            return;
        }

        if (!currentUser) {
            setFormError("User tidak ditemukan. Silakan login ulang.");
            return;
        }

        if (userData.provider === "google") {
            setFormError("Anda login dengan google. Password tidak bisa diubah disini");
            return;
        }

        setIsLoading(true);

        try {
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            await updatePassword(currentUser, newPassword);

            setFormSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordStrength(0);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Ubah Password
                </CardTitle>
                <CardDescription>
                    Perbarui password akun Anda. Kami menyarankan untuk menggunakan password yang kuat dan unik.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {formError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                )}
                
                {formSuccess && (
                    <Alert className="mb-6 border-green-500 text-green-500">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>Password Anda berhasil diperbarui.</AlertDescription>
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Password Saat Ini</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                placeholder="Masukkan password saat ini"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                placeholder="Masukkan password baru"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        
                        {newPassword && (
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span>Kekuatan Password:</span>
                                    <span className={getPasswordStrengthText().color}>
                                        {getPasswordStrengthText().text}
                                    </span>
                                </div>
                                <Progress value={passwordStrength} className={getProgressColor()} />
                                <ul className="text-xs text-gray-500 space-y-1 mt-2">
                                    <li className={`flex items-center gap-1 ${newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                                        <Check size={12} className={newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                                        Minimal 8 karakter
                                    </li>
                                    <li className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}`}>
                                        <Check size={12} className={/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'} />
                                        Minimal 1 huruf besar
                                    </li>
                                    <li className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                                        <Check size={12} className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'} />
                                        Minimal 1 angka
                                    </li>
                                    <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                                        <Check size={12} className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'} />
                                        Minimal 1 simbol
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                placeholder="Masukkan konfirmasi password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                    Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Check size={16} className="mr-2" />
                            Perbarui Password
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default NewPassword;