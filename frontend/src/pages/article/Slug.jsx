import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { 
    ThumbsUp, 
    Share2, 
    Bookmark, 
    ChevronLeft, 
    Check,
    Copy
} from 'lucide-react'

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import EachUtils from '@/utils/EachUtils'
import { articleAtom } from '@/jotai/atoms'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from "@/components/ui/toggle"
import { getInitial } from '@/utils/getInitial'
import { formatDate } from '@/utils/formatDate'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { apiInstanceExpress } from '@/services/apiInstance'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import CommentDrawer from '@/components/modules/article/CommentDrawer'

const SlugArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const articleUrl = window.location.href;
    
    const { currentUser } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [shareCount, setShareCount] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [article, setArticle] = useAtom(articleAtom);

    useEffect(() => {
        const getArticleData = async () => {
            setIsLoading(true);
            try {
                const response = await apiInstanceExpress.get(`article/get/${id}`)
                if (response.status === 200) {
                    setArticle(response.data.data);
                    setLikesCount(response.data.data.likes.length);
                    setShareCount(response.data.data.shares.length);
                }
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getArticleData();
    }, [id]);

    const handleToggleLike = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.post(`like/create`,
                { articleId: article._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setIsLiked(response.data.data.liked);
                setLikesCount(response.data.data.likesCount);
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(articleUrl);
    
            if (!isShared) {
                const token = await currentUser.getIdToken();
                const response = await apiInstanceExpress.post(
                    `share/create`,
                    { articleId: article._id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
    
                setShareCount(response.data.data.sharesCount); 
            }
    
            setIsShared(true);
        } catch (error) {
            console.error("Gagal menyalin link atau share artikel:", error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <DefaultLayout>
            <Navbar position="absolute" className="z-10 bg-transparent" />
            
            <main className="min-h-screen bg-white">
                {isLoading || !article ? (
                    <ArticleSkeleton />
                ) : (
                    <>
                        <div className="relative w-full h-[70vh] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-0" />
                            <img 
                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${article.cover}`} 
                                alt={article.title} 
                                className="w-full h-full object-cover object-center" 
                            />
                            <div className="absolute top-20 left-6 z-10">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleBack}
                                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full"
                                >
                                    <ChevronLeft className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
                            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {article.tags.map((tag, index) => (
                                        <Badge 
                                            key={index} 
                                            className="rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                                    {article.title}
                                </h1>

                                <div className="flex items-center gap-x-4 mb-8 pb-6 border-b border-slate-100">
                                    <Avatar className="size-10 ring-2 ring-white shadow-sm">
                                        <AvatarImage src={article?.createdBy?.profilePicture} />
                                        <AvatarFallback className="bg-slate-200 text-slate-800">{getInitial(article?.createdBy?.username)}</AvatarFallback>
                                    </Avatar>

                                    <div className="text-sm">
                                        <p className="font-semibold text-slate-900">
                                            <a href="#" className="hover:text-blue-600 transition-colors">
                                                {article?.createdBy?.username}
                                            </a>
                                        </p>
                                        <div className="flex items-center text-slate-500 text-xs mt-1">
                                            <span>{article?.createdBy?.role}</span>
                                            <span className="mx-2">•</span>
                                            <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                                        </div>
                                    </div>
                                </div>

                                <ScrollArea className="pr-4">
                                    <div className="space-y-6 mb-8">
                                        <EachUtils 
                                            of={article.content}
                                            render={(item, index) => {
                                                if (item.type === "heading-1") {
                                                    return (
                                                        <h2 key={index} className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4">
                                                            {item.value}
                                                        </h2>
                                                    )
                                                }

                                                if (item.type === "heading-2") {
                                                    return (
                                                        <h3 key={index} className="text-xl sm:text-2xl font-semibold text-slate-900 mt-8 mb-3">
                                                            {item.value}
                                                        </h3>
                                                    )
                                                }

                                                if (item.type === "heading-3") {
                                                    return (
                                                        <h4 key={index} className="text-lg sm:text-xl font-medium text-slate-900 mt-6 mb-2">
                                                            {item.value}
                                                        </h4>
                                                    )
                                                }

                                                if (item.type === "text") {
                                                    return (
                                                        <p key={index} className="text-slate-600 leading-relaxed">
                                                            {item.value}
                                                        </p>
                                                    )
                                                }

                                                if (item.type === "image") {
                                                    return (
                                                        <figure key={index} className="my-8">
                                                            <img 
                                                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.value}`} 
                                                                alt="Article image" 
                                                                className="w-full h-auto object-cover rounded-lg shadow-sm" 
                                                            />
                                                        </figure>
                                                    )
                                                }
                                            }}
                                        />
                                    </div>
                                </ScrollArea>

                                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <Toggle 
                                            variant="outline" 
                                            aria-label="Like" 
                                            pressed={isLiked} 
                                            onPressedChange={handleToggleLike} 
                                            className={`rounded-full hover:bg-slate-50 transition-colors ${isLiked ? 'text-red-500 bg-red-50' : ''}`}
                                        >
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            <span>{likesCount}</span>
                                        </Toggle>

                                        <CommentDrawer />

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className={`rounded-full hover:bg-slate-50 transition-colors ${isLiked ? 'text-red-500 bg-red-50' : ''}`}>
                                                    <Share2 /> {shareCount}
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Bagikan Tautan</DialogTitle>
                                                    <DialogDescription>
                                                        Siapa pun yang memiliki tautan ini dapat melihat konten ini.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="flex items-center space-x-2">
                                                    <div className="grid flex-1 gap-2">
                                                        <Label htmlFor="link" className="sr-only">Link</Label>
                                                        <Input
                                                            id="link"
                                                            value={articleUrl}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                                                        {isShared ? <Check /> : <Copy />}
                                                    </Button>
                                                </div>

                                                <DialogFooter className="sm:justify-start">
                                                    <DialogClose asChild>
                                                        <Button>Tutup</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* <div className="flex gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="rounded-full hover:bg-slate-50 transition-colors"
                                        >
                                            <Bookmark className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="rounded-full hover:bg-slate-50 transition-colors"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="pt-16">
                    <Footer />
                </div>
            </main>
        </DefaultLayout>
    )
}

const ArticleSkeleton = () => (
    <>
        <div className="relative w-full h-[70vh] bg-slate-200 animate-pulse" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                {/* Tags Skeleton */}
                <div className="flex gap-2 mb-6">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-14 h-6 rounded-full" />
                </div>
                
                {/* Title Skeleton */}
                <Skeleton className="w-full h-9 mb-2 rounded" />
                <Skeleton className="w-2/3 h-9 mb-6 rounded" />
                
                {/* Author Skeleton */}
                <div className="flex items-center gap-x-4 mb-8 pb-6 border-b border-slate-100">
                    <Skeleton className="size-10 rounded-full" />
                    <div>
                        <Skeleton className="w-32 h-4 mb-2 rounded" />
                        <Skeleton className="w-40 h-3 rounded" />
                    </div>
                </div>
                
                {/* Content Skeleton */}
                <div className="space-y-6 mb-10">
                    <Skeleton className="w-full h-5 rounded" />
                    <Skeleton className="w-11/12 h-5 rounded" />
                    <Skeleton className="w-4/5 h-5 rounded" />
                    <Skeleton className="w-full h-60 rounded-lg" />
                    <Skeleton className="w-full h-5 rounded" />
                    <Skeleton className="w-3/4 h-5 rounded" />
                </div>
                
                {/* Actions Skeleton */}
                <div className="pt-6 border-t border-slate-100 flex justify-between">
                    <div className="flex gap-3">
                        <Skeleton className="w-20 h-9 rounded-full" />
                        <Skeleton className="w-20 h-9 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <Skeleton className="w-9 h-9 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default SlugArticle