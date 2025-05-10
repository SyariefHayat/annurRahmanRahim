import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';

import { auth } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';
import { apiInstanceExpress } from '@/services/apiInstance';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const LogoutBtn = ({ isMobile }) => {
    const { currentUser } = useAuth();
    
    const handleSignOut = async () => {
        const toastId = toast.loading("Mengeluarkan akun anda...");
        try {
            const token = await currentUser.getIdToken();
            const userSignOut = await apiInstanceExpress.post("/sign-out", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (userSignOut.status === 200) {
                toast.success("Sign out berhasil", { id: toastId });
                await signOut(auth);
            }
        } catch (error) {
            console.error(error)
            toast.error("Sign out gagal", { id: toastId });
        } 
    };

    return (
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className={`${isMobile ? "" : "mr-2 h-4 w-4"}`} />
            Keluar
        </DropdownMenuItem>
    )
}

export default LogoutBtn