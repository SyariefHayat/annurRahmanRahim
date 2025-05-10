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
import { allCampaignsAtom } from '@/jotai/atoms';
import { apiInstanceExpress } from '@/services/apiInstance';

const DeleteCampaignDialog = ({selectedCampaign, setSelectedCampaign, deleteDialogOpen, setDeleteDialogOpen }) => {
    const { currentUser } = useAuth();
    const [campaigns, setCampaigns] = useAtom(allCampaignsAtom);

    const handleDelete = async () => {
        const toastId = toast.loading("menghapus campaign...");

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`campaign/delete/${selectedCampaign._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                const updatedCampaign = campaigns.filter(campaign => campaign._id !== selectedCampaign._id);
                setCampaigns(updatedCampaign);

                toast.success("Campaign berhasil dihapus", { id: toastId });
                setSelectedCampaign(null);
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
                    <AlertDialogTitle>Konfirmasi Hapus Campaign</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus campaign "{selectedCampaign?.title}" ? 
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

export default DeleteCampaignDialog