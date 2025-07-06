import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { apiInstanceExpress } from '@/services/apiInstance';

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
});

export const useCampaignForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
    
        try {
            const formData = new FormData();
            const token = await currentUser.getIdToken();

            if (data.campaignImage) formData.append("campaignImage", data.campaignImage);

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
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal membuat campaign");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        image,
        setImage,
        isLoading,
        onSubmit
    };
};