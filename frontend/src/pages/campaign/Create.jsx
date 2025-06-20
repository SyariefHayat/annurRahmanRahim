import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, ImagePlus, Loader2 } from 'lucide-react';

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { apiInstanceExpress } from '@/services/apiInstance';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const PostDonationSchema = z.object({
    campaignImage: z.any()
        .refine(
            (file) => file instanceof File || (file && file.length > 0),
            { message: "Gambar kampanye diperlukan"}
        ),

    category: z.string()
        .min(1, { message: "Pilih kategori kampanye" }),

    title: z.string()
        .min(1, { message: "Judul kampanye diperlukan" })
        .trim(),
    
    description: z.string()
        .trim()
        .min(1, { message: "Deskripsi kampanye diperlukan" })
        .max(280, { message: "Maksimal 280 karakter" }),
    
    targetAmount: z.string()
        .min(1, { message: "Target donasi diperlukan" })
        .regex(/^\d+$/, { message: "Hanya masukkan angka" })
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 100_000, { message: "Minimal Rp 100.000" }),

    deadline: z
        .preprocess((arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                return new Date(arg);
            }
            return arg;
        }, z.date({ required_error: "Tentukan tanggal berakhir" }))
        .refine((date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, { message: "Tanggal tidak boleh di masa lalu" }),
})

const CreateCampaign = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const fileInputRef = useRef(null);
    const { currentUser } = useAuth();

    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const MAX_SIZE = 5 * 1024 * 1024;

        if (file && file.size > MAX_SIZE) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        form.setValue("campaignImage", file);
    };

    const form = useForm({
        resolver: zodResolver(PostDonationSchema),
        defaultValues: {
            campaignImage: "",
            category: "",
            title: "",
            description: "",
            targetAmount: "",
            deadline: "",
        }
    })

    const formatAmount = (value) => {
        if (!value) return "";
        return `Rp ${Number(value).toLocaleString("id-ID")}`;
    }

    const onSubmit = async (data) => {
        setIsLoading(true);
    
        try {
            const formData = new FormData();
            const token = await currentUser.getIdToken();

            if (data.campaignImage) {
                formData.append("campaignImage", data.campaignImage);
            };

            formData.append("title", data.title);
            formData.append("category", data.category);
            formData.append("description", data.description);
            formData.append("targetAmount", data.targetAmount);
            formData.append("deadline", data.deadline);
            formData.append("createdBy", userId);

            const response = await apiInstanceExpress.post("campaign/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                toast.success("Kampanye berhasil dibuat");

                setTimeout(() => {
                    navigate("/dashboard/program/sosial");
                }, 1000)
            };
        } catch (error) {
            console.error(error);
            toast.error("Gagal membuat campaign");
        } finally {
            setIsLoading(false);
        };
    };    

    return (
        <DashboardLayout>
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto border rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Buat Campaign Donasi</h2>

                    <Form {...form}>
                        <Toaster />
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="campaignImage" render={() => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-2">Foto Kampanye</FormLabel>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className={`
                                            w-full h-64 rounded-lg border-2 border-dashed cursor-pointer
                                            transition-all duration-200 group hover:border-blue-400
                                            flex items-center justify-center
                                            ${image ? 'border-transparent' : 'border-gray-300'}
                                        `}
                                    >
                                        {image ? (
                                            <img src={image} alt="Preview" className="w-full h-full object-cover object-center rounded-lg" />
                                        ) : (
                                            <div className="text-center p-6">
                                                <ImagePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500" />
                                                <p className="mt-2 text-sm text-gray-500 group-hover:text-blue-500">
                                                    Klik untuk unggah gambar
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Format: JPG, PNG, GIF (Maks. 5MB)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <FormControl>
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </FormControl>
                                    <FormMessage className="mt-1" />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium">Judul Kampanye</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Masukkan judul kampanye" 
                                                className="w-full rounded-md" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium">Kategori</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full rounded-md">
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kesehatan">Kesehatan</SelectItem>
                                                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                                                    <SelectItem value="bencana alam">Bencana Alam</SelectItem>
                                                    <SelectItem value="kemanusiaan & sosial">Kemanusiaan & Sosial</SelectItem>
                                                    <SelectItem value="Pembangunan Fasilitas">Pembangunan Fasilitas</SelectItem>
                                                    <SelectItem value="acara khusus">Acara Khusus</SelectItem>
                                                    <SelectItem value="darurat">Darurat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium">Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Jelaskan tujuan kampanye Anda..." 
                                            className="resize-none h-32 rounded-md" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {field.value?.length || 0}/280 karakter
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="targetAmount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium">Target Donasi</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatAmount(field.value)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^\d]/g, "");
                                                    field.onChange(raw);
                                                }}
                                                placeholder="Rp"
                                                className="rounded-md"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="deadline" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium">Tanggal Berakhir</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal rounded-md",
                                                        !field.value && "text-gray-400"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? formatDate(field.value) : <span>Pilih tanggal</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="pt-4">
                                {isLoading ? (
                                    <Button className="w-full rounded-md bg-blue-600 hover:bg-blue-700" disabled>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        Sedang membuat kampanye
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        Buat Kampanye
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CreateCampaign;