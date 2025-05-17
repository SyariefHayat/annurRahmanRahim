import { z } from 'zod';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
    Check, 
    Facebook, 
    Globe, 
    Instagram, 
    Loader2, 
    Twitter 
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
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel 
} from '@/components/ui/form';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { apiInstanceExpress } from '@/services/apiInstance';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { previewPictureAtom, userDataAtom } from '@/jotai/atoms';
import { getProfilePicture } from '@/lib/utils';
import { getInitial } from '@/utils/getInitial';

// Schema dengan Zod
const profileSchema = z.object({
    profilePicture: z.any()
        .refine(
            (file) => !file || file instanceof File,
            { message: "File tidak valid" }
        )
        .optional(),

    username: z.string()
        .min(1, { message: "Masukkan Nama anda" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),

    email: z.string()
        .min(1, { message: "Masukkan email anda" })
        .email({ message: "Format email tidak valid" }),

    bio: z.string()
        .optional()
        .refine((val) => !val || val.length <= 280, {
            message: "Pesan maksimal 280 karakter",
        }),

    phone: z.string().optional(),

    website: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),

    isPrivate: z.boolean().default(true),
});

export default function EditProfile() {
    const { currentUser } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
    const [userData, setUserData] = useAtom(userDataAtom);
    const [previewPicture, setPreviewPicture] = useAtom(previewPictureAtom);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=random`;
    
    // const profilePictureUrl = userData? userData.provider === "google"? userData.profilePicture: `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData.profilePicture}`: avatarUrl;

    const profilePictureUrl = userData.provider === "google" ? userData.profilePicture ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData.profilePicture}` : avatarUrl : avatarUrl;

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            picture: userData?.profilePicture || '',
            username: userData?.username || '',
            email: userData?.email || '',
            bio: userData?.bio || '',
            phone: userData?.phone || '',
            website: userData?.website || '',
            instagram: userData?.socialMedia?.instagram || '',
            twitter: userData?.socialMedia?.twitter || '',
            facebook: userData?.socialMedia?.facebook || '',
            isPrivate: true,
        },
    });

    const { register, handleSubmit, formState: { errors }, setValue } = form;

    const onSubmit = async (data) => {
        setIsLoading(true);
    
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.put("profile/update", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                toast.success("Profil berhasil diperbarui!");
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui profil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setValue("profilePicture", file);
            setPreviewPicture(URL.createObjectURL(file));
        }
    };

    const handleDeleteBtn = async () => {
        setIsDeletingPhoto(true);
        const toastId = toast.loading("Menghapus foto profil anda...");

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete("profile/delete/picture", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setUserData(response.data.data);
                setPreviewPicture(null);
                toast.success("Foto profil berhasil dihapus", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus foto profil", { id: toastId });
        } finally {
            setIsDeletingPhoto(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Perbarui informasi profil personal Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center justify-between space-y-4 md:w-1/4">
                                <Avatar className="w-24 h-24 border">
                                    <AvatarImage 
                                        src={previewPicture || getProfilePicture(userData)}
                                        referrerPolicy="no-referrer"
                                        className="object-cover"
                                    />
                                    <AvatarFallback>{getInitial(userData.username)}</AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                    <input
                                        id="profilePicture"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureChange}
                                    />

                                    <div className="flex flex-col gap-1">
                                        <Button variant="outline" className="w-full" asChild>
                                            <label htmlFor="profilePicture" className="w-full cursor-pointer">
                                                Ubah Foto
                                            </label>
                                        </Button>
                                        
                                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="ghost"
                                                    className="w-full text-red-300 hover:bg-red-50 hover:text-red-300 cursor-pointer"
                                                    type="button"
                                                >
                                                    Hapus Foto
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Foto Profil</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin menghapus foto profil Anda? Tindakan ini tidak dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDeleteBtn}
                                                        disabled={isDeletingPhoto}
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        {isDeletingPhoto ? (
                                                            <>
                                                                <Loader2 size={16} className="mr-2 animate-spin" />
                                                                Menghapus...
                                                            </>
                                                        ) : (
                                                            "Hapus"
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" {...register("username")} placeholder="Masukkan username Anda" />
                                        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register("email")} placeholder="Masukkan email Anda" />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" {...register("bio")} placeholder="Ceritakan sedikit tentang diri Anda" rows={4} className="resize-none break-all break-words" />
                                    <p className="text-xs text-gray-500">
                                        Biodata singkat tentang diri Anda yang akan ditampilkan di profil publik.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak</CardTitle>
                        <CardDescription>Perbarui informasi kontak dan preferensi privasi Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input id="phone" type="tel" {...register("phone")} placeholder="Masukkan nomor telepon" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="flex">
                                    <div className="bg-gray-100 border border-r-0 rounded-l-md flex items-center px-3">
                                        <Globe size={16} className="text-gray-500" />
                                    </div>
                                    <Input id="website" {...register("website")} placeholder="www.example.com" className="rounded-l-none" />
                                </div>
                                {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Media Sosial</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["instagram", "twitter", "facebook"].map((platform) => {
                                    const Icon = platform === "instagram" ? Instagram : platform === "twitter" ? Twitter : Facebook;
                                    return (
                                        <div key={platform} className="space-y-2">
                                            <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                                            <div className="flex">
                                                <div className="bg-gray-100 border border-r-0 rounded-l-md flex items-center px-3">
                                                    <Icon size={16} className="text-gray-500" />
                                                </div>
                                                <Input id={platform} {...register(platform)} placeholder="username" className="rounded-l-none" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Privasi</h3>
                            <div className="space-y-3">
                                <FormField control={form.control} name="isPrivate" render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="public-profile">Profil Publik</Label>
                                                    <p className="text-xs text-gray-500">Izinkan orang lain melihat profil Anda</p>
                                                </div>
                                            </FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button">Batal</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Check size={16} className="mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}