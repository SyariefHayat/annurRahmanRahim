import React from 'react';

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger,
    SelectValue, 
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { getRoleLevel } from '@/utils/getRoleLevel';

const ChangeRoleDialog = ({ 
    open, 
    onOpenChange, 
    selectedUser, 
    selectedRole, 
    onRoleChange, 
    onSave, 
    isLoading 
}) => {
    const { userData } = useAuth();
    const allRoles = ['user', 'fundraiser', 'project curator', 'product manager', 'developer'];

    const allowedRoles = allRoles.filter(
        (role) => getRoleLevel(role) < getRoleLevel(userData.role)
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ubah Role Pengguna</DialogTitle>
                    <DialogDescription>
                        Pilih role baru untuk pengguna {selectedUser?.username}.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                    <Select value={selectedRole} onValueChange={onRoleChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {allowedRoles.map((role) => (
                                <SelectItem key={role} value={role} className="capitalize">
                                    {role === 'user' ? 'User' : role.replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button onClick={onSave} disabled={isLoading}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRoleDialog;