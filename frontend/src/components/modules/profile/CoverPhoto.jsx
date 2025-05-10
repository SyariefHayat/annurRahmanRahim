import { toast } from "sonner";
import { useAtom } from "jotai";
import { Camera, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";
import { apiInstanceExpress } from "@/services/apiInstance";
import { previewAlbumAtom, userDataAtom } from "@/jotai/atoms";

const CoverPhoto = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useAtom(userDataAtom);
    const [previewAlbum, setPreviewAlbum] = useAtom(previewAlbumAtom);

    const handleDeleteAlbum = async () => {
        const toastId = toast.loading("Menghapus album...");

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete("profile/delete/album", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setPreviewAlbum("");
                setUserData(response.data.data);
                toast.success("Album berhasil di hapus", { id: toastId });
            };
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus album", { id: toastId });
        }
    };

    return (
        <div className="relative w-full">
            <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 overflow-hidden">
                {(previewAlbum || userData?.profileAlbum) && (
                    <img 
                        src={previewAlbum || `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData.profileAlbum}`} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                    />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer z-20"
                            aria-label="Kelola Foto"
                        >
                            <Camera size={18} className="text-gray-700" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="z-50 bg-white shadow-lg rounded-md p-1">
                        <DropdownMenuItem
                            onSelect={handleDeleteAlbum}
                            className="flex items-center gap-2 text-red-600 focus:bg-red-50 cursor-pointer px-2 py-1 rounded"
                        >
                            <Trash2 size={14} />
                            <span>Hapus Album</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default CoverPhoto;