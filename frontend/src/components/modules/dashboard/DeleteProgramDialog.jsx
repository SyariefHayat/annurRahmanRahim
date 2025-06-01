import React from 'react';
import { toast } from 'sonner';
import { useAtom } from 'jotai';

import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@/components/ui/alert-dialog';

import { useAuth } from '@/context/AuthContext';
import { allProgramsAtom } from '@/jotai/atoms';
import { apiInstanceExpress } from '@/services/apiInstance';

const DeleteProgramDialog = ({selectedProgram, setSelectedProgram, deleteDialogOpen, setDeleteDialogOpen }) => {
    const { currentUser } = useAuth();
    const [programs, setPrograms] = useAtom(allProgramsAtom);

    const handleDelete = async () => {
        const toastId = toast.loading("menghapus campaign...");

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`campaign/delete/${selectedProgram._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                const updatedProgram = programs.filter(program => program._id !== selectedProgram._id);
                setPrograms(updatedProgram);

                toast.success("Campaign berhasil dihapus", { id: toastId });
                setSelectedProgram(null);
            };
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus campaign", { id: toastId });
        } finally {
            setShowDeleteDialog(false);
        };
    };

    return (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus Program</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus program "{selectedProgram?.title}" ? 
                        Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                        Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteProgramDialog