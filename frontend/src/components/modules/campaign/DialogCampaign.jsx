import { z } from "zod"
import { toast } from "sonner"
import { useAtom } from "jotai"
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { snapTokenAtomStorage } from "@/jotai/atoms"
import { apiInstanceExpress } from "@/services/apiInstance"

const FormSchema = z.object({
    fullName: z.string()
        .min(1, { message: "Masukkan Nama Lengkap" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),

    email: z.string()
        .min(1, { message: "Masukkan email anda" })
        .email({ message: "Format email tidak valid" }),

    amount: z.string()
        .min(1, { message: "Masukkan nominal" })
        .regex(/^\d+$/, { message: "Nominal harus berupa angka" })
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 5000, { message: "Nominal minimal Rp 5000" }),

    message: z.string()
        .optional()
        .refine((val) => !val || val.length <= 280, {
            message: "Pesan maksimal 280 karakter",
        }),

    isAnonymous: z.boolean().default(false),
})

const DialogCampaign = ({ donationId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setSnapToken] = useAtom(snapTokenAtomStorage);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            amount: "",
            message: "",
            isAnonymous: false,
        },
    })

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    
    const formatAmount = (value) => {
        if (!value) return "";
        return `Rp ${Number(value).toLocaleString("id-ID")}`;
    }
    
    const onSubmit = async (data) => {
        try {
            const response = await apiInstanceExpress.post("/transaction/create", {
                donationId,
                email: data.email,
                name: data.fullName,
                message: data.message,
                amount: data.amount,
                isAnonymous: data.isAnonymous,
            });
            if (response.status === 201) setSnapToken(response.data.data.transaction);

            if (window.snap) {
                setIsOpen(false);
                window.snap.pay(response.data.data.transaction.token, {
                    onSuccess: (result) => {
                        console.log(result);
                    },
                    onPending: (result) => {
                        console.log(result);
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                    onClose: async () => {
                        try {
                            const deleteResponse = await apiInstanceExpress.delete(`transaction/delete/${response.data.data.orderId}`);

                            if (deleteResponse.status === 200) {
                                setSnapToken(null);
                                toast.error("Transaksi dibatalkan!");
                            };
                        } catch (error) {
                            console.error(error);
                        }
                    }
                });
            } else {
                toast.error("Midtrans belum dimuat. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            toast.error("Gagal memulai transaksi. Silakan coba beberapa saat lagi.");
        } finally {
            form.reset();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="my-6 cursor-pointer w-full sm:w-fit">Donasi Sekarang</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ingin Berdonasi ?</DialogTitle>
                    <DialogDescription>
                        Terima kasih atas niat baik Anda untuk berdonasi. Silakan lanjutkan proses donasi dengan mengisi informasi yang diperlukan.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5 w-full">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="John Doe" {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="example@gmail.com" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nominal</FormLabel>
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sertakan doa dan dukungan (opsional)</FormLabel>
                                    <Textarea placeholder="Tulis doa untuk penggalang dana atau dirimu agar bisa diamini oleh orang baik lainnya" {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="isAnonymous" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormLabel>Sembunyikan nama saya</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button>Pilih Metode Pembayaran</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogCampaign