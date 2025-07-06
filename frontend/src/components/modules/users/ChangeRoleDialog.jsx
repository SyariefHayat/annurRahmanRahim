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
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

const ChangeRoleDialog = ({ 
    open, 
    onOpenChange, 
    selectedUser, 
    selectedRole, 
    onRoleChange, 
    onSave, 
    isLoading 
}) => {
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
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="coordinator">Coordinator</SelectItem>
                            <SelectItem value="product manager">Product Manager</SelectItem>
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