import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormMessage 
} from "@/components/ui/form";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FormTag from "@/components/modules/article/FormTag";
import { apiInstanceExpress } from "@/services/apiInstance";
import FormCover from "@/components/modules/article/FormCover";
import FormContent from "@/components/modules/article/FormContent";

const postArticleSchema = z.object({
    cover: z
    .any()
    .refine(
        (file) => file instanceof File || (file && file.length > 0),
        { message: "Cover image is required",}
    ),

    title: z.string().min(1, { message: "Title is required" }),

    content: z.array(
        z.object({
            type: z.enum(["heading-1", "heading-2", "heading-3", "text", "image"]),
            value: z.any(),
        }).refine(
            (data) => {
                if (data.type === "image") {
                return data.value instanceof File || (data.value && data.value.length > 0);
                } else {
                return typeof data.value === "string" && data.value.trim().length > 0;
                }
            },
            {
                message: "Content cannot be empty",
                path: ["value"],
            }
        )
        ).min(1, { message: "Article content is required" }),

    tags: z
        .array(z.string().min(1, "Tag cannot be empty"))
        .max(3, "Maximum 3 tags allowed")
});

const CreateArticle = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const { currentUser, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [contents, setContents] = useState([
        {
            type: "text",
            placeholder: "Start writing your content...",
            value: ""
        },
    ]);

    const form = useForm({
        resolver: zodResolver(postArticleSchema),
        defaultValues: {
            cover: "",
            title: "",
            content: [],
            author: "",
            tags: [],
        }
    });

    useEffect(() => {
        const filteredContents = contents.map(({ type, value }) => ({ type, value }));
        form.setValue("content", filteredContents);
    }, [contents]);

    const handleAddContent = () => {
        setContents([
            ...contents,
            {
                type: "text",
                placeholder: "Start writing your content...",
                value: ""
            }
        ]);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();
    
        if (data.cover) {
            formData.append("cover", data.cover);
        }
    
        formData.append("title", data.title);
        formData.append("description", "");
        formData.append("createdBy", userId );
    
        (data.tags || []).forEach((tag) => {
            formData.append("tags", tag);
        });
    
        formData.append("content", JSON.stringify(data.content));
    
        data.content.forEach((item) => {
            if (item.type === "image" && item.value) {
                formData.append("image", item.value);
            }
        });

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.post("article/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201) {
                toast.success("Artikel berhasil diterbitkan!");

                if (userData.role === "admin") {
                    navigate("/dashboard/article")
                } else {
                    navigate(`/profile/${userId}`)
                };
            };
        } catch (error) {
            if (error?.response?.status === 400) {
                toast.error("Data tidak valid. Harap periksa masukan Anda.");
            } else if (error?.response?.status === 401) {
                toast.error("Sesi Anda telah berakhir. Silakan masuk lagi.");
            } else {
                toast.error("Terjadi kesalahan saat membuat artikel. Silakan coba lagi.");
            };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen max-w-3xl mx-auto px-4 py-12 w-full h-full bg-white text-neutral-900">
                
                <FormCover form={form} />

                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="mb-8">
                        <FormControl>
                            <Textarea 
                                rows={1} 
                                placeholder="Judul Artikel" 
                                className="w-full min-h-0 px-0 py-2 resize-none overflow-hidden border-none outline-none shadow-none bg-transparent text-4xl font-bold text-neutral-900 placeholder:text-gray-300 break-words focus-visible:ring-0" 
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormTag form={form} />

                <FormContent contents={contents} setContents={setContents} form={form} />

                <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4 px-2 flex justify-between items-center">
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddContent}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tambah Blok Konten
                    </Button>

                    {isLoading ? (
                        <Button disabled className="min-w-32">
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Publishing...
                        </Button>
                    ) : (
                        <Button type="submit" className="cursor-pointer min-w-32">
                            Publish Article
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default CreateArticle;