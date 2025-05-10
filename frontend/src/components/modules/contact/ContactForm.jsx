import { z } from "zod"
import { useRef } from 'react'
import { toast } from "sonner"
import emailjs from '@emailjs/browser'
import { Loader2 } from "lucide-react"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
    firstName: z.string()
        .min(1, { message: "Masukkan Nama Depan" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),

    lastName: z.string()
        .min(1,{ message: "Masukkan Nama Belakang" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),
    
    email: z.string()
        .min(1, { message: "Masukkan email anda" })
        .email({ message: "Format email tidak valid" }),

    subject: z.string()
        .min(1, { message: "Masukkan subject pesan anda" })
        .trim()
        .refine((val) => /^[a-zA-Z\s']+$/.test(val), {
            message: "Nama hanya boleh berisi huruf"
        }),

    contactNumber: z.string()
        .min(10, { message: "Nomor HP minimal 10 digit" })
        .max(15, { message: "Nomor HP maksimal 15 digit" })
        .regex(/^(\+62|62|0)[0-9]{9,14}$/, { message: "Nomor HP tidak valid" }),

    message: z.string()
        .min(1, { message: "Pesan wajib diisi" })
        .max(280, { message: "Pesan maksimal 280 karakter" }),
})

const ContactForm = () => {
    const formRef = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            contactNumber: "",
            message: ""
        }
    })

    const onSubmit = async () => {
        setIsLoading(true);
    
        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAIL_SERVICE_ID,
                import.meta.env.VITE_EMAIL_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAIL_PUBLIC_KEY
            );
    
            toast.success("Pesan berhasil dikirim!");
            form.reset();
        } catch (error) {
            toast.error("Gagal mengirim pesan. Silakan coba lagi.");
            console.log(error?.text || error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Kontak Kami</h2>
                <p className="mt-2 text-lg/8 text-gray-600">Jika Anda memiliki pertanyaan, masukan, atau ingin bekerja sama, jangan ragu untuk menghubungi kami. Kami siap membantu Anda!</p>
            </div>

            <Form {...form}>
                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-16 max-w-xl sm:mt-20 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900">Nama Depan</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900">Nama Belakang</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900">Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900">Subjek</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="contactNumber" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900">No Hp</FormLabel>
                            <FormControl>
                                <Input type="text" inputMode="numeric" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel>Pesan</FormLabel>
                            <Textarea className="resize-none" {...field} />
                            <FormMessage />
                        </FormItem>
                    )} />

                    {isLoading ? (
                        <Button className="sm:col-span-2 bg-blue-600 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer" disabled>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Sedang mengirim pesan anda
                        </Button>
                    ) : (
                        <Button className="sm:col-span-2 bg-blue-600 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer">Kirim</Button>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default ContactForm