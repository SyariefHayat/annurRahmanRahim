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

const editArticleSchema = z.object({
    cover: z
    .any()
    .optional(),
    title: z.string().min(1, { message: "Title is required" }),
    content: z.array(
        z.object({
            type: z.enum(["heading-1", "heading-2", "heading-3", "text", "image"]),
            value: z.any(),
        }).refine(
            (data) => {
                if (data.type === "image") {
                    if (typeof data.value === "string" && data.value.startsWith("http")) {
                        return true;
                    }
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

const EditArticle = () => {
    const navigate = useNavigate();

    const { articleId } = useParams();
    const { currentUser, userData } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingArticle, setIsLoadingArticle] = useState(true);
    const [existingCoverUrl, setExistingCoverUrl] = useState("");
    
    const [contents, setContents] = useState([
        {
            type: "text",
            placeholder: "Start writing your content...",
            value: ""
        },
    ]);

    const form = useForm({
        resolver: zodResolver(editArticleSchema),
        defaultValues: {
            cover: "",
            title: "",
            content: [],
            tags: [],
        }
    });

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const response = await apiInstanceExpress.get(`article/get/${articleId}`);
                const article = response?.data?.data;
    
                if (!article) {
                    toast.error("Article not found");
                    return;
                }
                
                if (!article.createdBy?.uid || !currentUser?.uid) {
                    toast.error("Invalid user data");
                    return;
                }
    
                form.setValue("title", article.title || "");
                form.setValue("tags", article.tags || []);
    
                try {
                    const content = article.content;
                    if (Array.isArray(content)) {
                        const updatedContent = content.map(item => ({
                            ...item,
                            placeholder: item.type === "text" ? "Start writing your content..." : ""
                        }));
                        setContents(updatedContent);
                        form.setValue("content", content);
                    }
                } catch (parseError) {
                    console.error("Error parsing article content:", parseError);
                    toast.error("Failed to parse article content.");
                }
    
                if (article.cover) {
                    setExistingCoverUrl(article.cover);
                };
    
            } catch (error) {
                console.error("Error fetching article:", error);
                toast.error("Failed to load article. Please try again.");
            } finally {
                setIsLoadingArticle(false);
            }
        };
    
        if (articleId && currentUser) {
            fetchArticleData();
        }
    }, [articleId, currentUser, form]);
    

    useEffect(() => {
        const filteredContents = contents.map(({ type, value }) => ({ type, value }));
        form.setValue("content", filteredContents);
    }, [contents, form]);

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
    
        if (data.cover && data.cover instanceof File) {
            formData.append("cover", data.cover);
        }
    
        formData.append("title", data.title);
        formData.append("description", "");
    
        (data.tags || []).forEach((tag) => {
            formData.append("tags", tag);
        });
    
        const newContentImages = [];
        const processedContent = data.content.map((item, index) => {
            if (item.type === "image") {
                if (item.value instanceof File) {
                    const imageName = `content_image_${index}`;
                    formData.append("image", item.value);
                    newContentImages.push({ index, name: imageName });
                    return { ...item, value: `__IMAGE_PLACEHOLDER_${imageName}__` };
                }
            }
            return item;
        });
        
        formData.append("content", JSON.stringify(processedContent));
        formData.append("newContentImages", JSON.stringify(newContentImages));
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.put(`article/update/${articleId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                toast.success("Article updated successfully!");

                setTimeout(() => {
                    navigate("/dashboard/article");
                }, 1000)
            }
        } catch (error) {
            console.error("Update error:", error);
            if (error?.response?.status === 400) {
                toast.error(error?.response?.data?.message || "Invalid data. Please check your inputs.");
            } else if (error?.response?.status === 401) {
                toast.error("Your session has expired. Please log in again.");
            } else if (error?.response?.status === 403) {
                toast.error("You don't have permission to edit this article.");
            } else {
                toast.error("An error occurred while updating the article. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingArticle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen max-w-3xl mx-auto px-4 py-12 w-full h-full bg-white text-neutral-900">
                
                <FormCover form={form} existingUrl={existingCoverUrl} />

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
                            Updating...
                        </Button>
                    ) : (
                        <Button type="submit" className="cursor-pointer min-w-32">
                            Update Article
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default EditArticle;