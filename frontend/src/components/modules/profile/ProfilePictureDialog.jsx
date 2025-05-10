import { z } from "zod";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
    Camera, 
    FileText, 
    Loader2 
} from "lucide-react";

import { 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";

import { 
    isOpenAtom, 
    previewAlbumAtom, 
    previewPictureAtom, 
    userDataAtom 
} from "@/jotai/atoms";

import { Form } from '@/components/ui/form';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { apiInstanceExpress } from "@/services/apiInstance";


const PictureSchema = z.object({
    profilePicture: z.any()
        .refine(file => !file || file instanceof File, { message: "File tidak valid" })
        .optional(),
    profileAlbum: z.any()
        .refine(file => !file || file instanceof File, { message: "File tidak valid" })
        .optional(),
});

const ProfilePictureDialog = () => {
    const { currentUser, userData } = useAuth();
    const [, setIsOpen] = useAtom(isOpenAtom);
    const [, setUserData] = useAtom(userDataAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [, setPreviewAlbum] = useAtom(previewAlbumAtom);
    const [, setPreviewPicture] = useAtom(previewPictureAtom);

    const form = useForm({
        resolver: zodResolver(PictureSchema),
        defaultValues: {
            profileAlbum: "",
            profilePicture: "",
        }
    });

    const handleProfileAlbumChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setValue("profileAlbum", file);
            setPreviewAlbum(URL.createObjectURL(file));
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setValue("profilePicture", file);
            setPreviewPicture(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const formData = new FormData();

            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }

            if (data.profileAlbum) {
                formData.append("profileAlbum", data.profileAlbum);
            }

            formData.append("id", userData._id);

            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.put("profile/update", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            
            if (response.status === 200) {
                setUserData(response.data.data);
                toast.success("Profil berhasil diperbarui");
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui profil");
        } finally {
            form.reset();
            setIsOpen(false);
            setIsLoading(false);
            setPreviewAlbum("");
            setPreviewPicture("");
        }
    };

    return (
        <DialogContent className="max-w-xs">
            <DialogHeader>
                <DialogTitle>Kelola Foto Profil</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 space-y-2 mt-4">
                    <label htmlFor="profilePicture" className="w-full">
                        <Button variant="outline" className="w-full justify-start" size="sm" type="button" asChild>
                            <div>
                                <Camera size={16} className="mr-2 inline-block" />
                                Ubah Foto Profil
                            </div>
                        </Button>
                    </label>
                    <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                    />
                    
                    <label htmlFor="profileAlbum" className="w-full">
                        <Button variant="outline" className="w-full justify-start" size="sm" type="button" asChild>
                            <div>
                                <FileText size={16} className="mr-2 inline-block" />
                                Ubah Foto Album
                            </div>
                        </Button>
                    </label>
                    <input
                        id="profileAlbum"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileAlbumChange}
                    />
                    
                    <Button type="submit" disabled={isLoading} className="w-full mt-4 cursor-pointer">
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Mengupload profile...
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    );
};

export default ProfilePictureDialog;