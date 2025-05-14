import { useAtom } from 'jotai'
import { useMediaQuery } from 'react-responsive'
import React, { useEffect, useState } from 'react'
import { MessageSquare, Send, AlertCircle } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import CommentItem from './CommentItem'
import EachUtils from '@/utils/EachUtils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { getProfilePicture } from '@/lib/utils'
import { getInitial } from '@/utils/getInitial'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { apiInstanceExpress } from '@/services/apiInstance'
import { articleAtom, commentDataAtom } from '@/jotai/atoms'

const CommentDrawer = () => {
    const { currentUser, userData } = useAuth();
    const [article] = useAtom(articleAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentLength, setCommentLength] = useState("");
    const [commentData, setCommentData] = useAtom(commentDataAtom);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    
    useEffect(() => {
        const getcommentData = async () => {
            try {
                const response = await apiInstanceExpress.get(`comment/get/${article._id}`);
                if (response.status === 200) setCommentData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
    
        getcommentData();
    }, [commentData]);
    
    const handleSubmitComment = async (articleId) => {
        if (!commentText.trim()) return;
        
        if (!userData || !currentUser) {
            setShowLoginAlert(true);
            return;
        }
    
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.post("comment/create", 
                {
                    text: commentText,
                    articleId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            if (response.status === 201) {
                setCommentText('');

                const updated = await apiInstanceExpress.get(`comment/get/${article._id}`);
                if (updated.status === 200) {
                    setCommentLength(updated.data.data.length);
                    setCommentData(updated.data.data);
                };
            };
        } catch (error) {
            console.error(error);
        }
    };

    const handleTextareaFocus = () => {
        if (!userData || !currentUser) {
            setShowLoginAlert(true);
        }
    };

    const CommentContainer = isDesktop ? Sheet : Drawer;
    const CommentTrigger = CommentContainer === Sheet ? SheetTrigger : DrawerTrigger;
    const CommentContent = CommentContainer === Sheet ? SheetContent : DrawerContent;
    const CommentClose = CommentContainer === Sheet ? SheetClose : DrawerClose;
    const CommentHeader = CommentContainer === Sheet ? SheetHeader : DrawerHeader;
    const CommentTitle = CommentContainer === Sheet ? SheetTitle : DrawerTitle;
    const CommentDescription = CommentContainer === Sheet ? SheetDescription : DrawerDescription;
    const CommentFooter = CommentContainer === Sheet ? SheetFooter : DrawerFooter;

    return (
        <>
            <CommentContainer open={isOpen} onOpenChange={setIsOpen}>
                <CommentTrigger asChild onClick={() => setIsOpen(true)}>
                    <Button 
                        variant="outline" 
                        className="rounded-full hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>{commentLength || article?.comments?.length}</span>
                    </Button>
                </CommentTrigger>
                <CommentContent className={isDesktop ? "w-[400px] sm:w-[540px] p-6" : "h-[90vh]"}>
                    <CommentHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CommentTitle className="text-xl font-semibold text-slate-900">Komentar</CommentTitle>
                        </div>
                        <CommentDescription className="text-sm text-slate-500">
                            Diskusikan artikel ini dengan pembaca lainnya
                        </CommentDescription>
                    </CommentHeader>
                    
                    <Separator className="mb-4" />
                    
                    <div className="mb-6 space-y-4 px-4">
                        <div className="flex items-start gap-3">
                            <Avatar className="size-9 ring-2 ring-white shadow-sm">
                                <AvatarImage 
                                    src={userData ? getProfilePicture(userData) : ""}
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-gray-100">
                                    {userData ? getInitial(userData.username) : "?"}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                                <Textarea 
                                    placeholder="Tambahkan komentar Anda..."
                                    className="resize-none break-words break-all min-h-[100px] bg-slate-50 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onFocus={handleTextareaFocus}
                                />
                                
                                <div className="flex justify-end">
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleSubmitComment(article._id)}
                                        disabled={!commentText.trim()}
                                        className="rounded-full px-4 gap-1"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Kirim</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 px-4">
                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{commentLength || article?.comments?.length} Komentar</span>
                        </div>
                        
                        <Select defaultValue="recommended">
                            <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200 bg-slate-50 rounded-full">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="recommended" className="text-xs">Disarankan</SelectItem>
                                <SelectItem value="newest" className="text-xs">Terbaru</SelectItem>
                                <SelectItem value="oldest" className="text-xs">Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <ScrollArea className="flex-1 max-h-[calc(100vh-450px)] px-4">
                        <div className="space-y-6 pr-4">
                            {commentData.length > 0 ? (
                                <EachUtils 
                                    of={commentData}
                                    render={(item, index) => (
                                        <CommentItem key={index} item={item} />
                                    )}
                                />
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mx-auto bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                                        <MessageSquare className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 text-sm">Belum ada komentar</p>
                                    <p className="text-slate-400 text-xs mt-1">Jadilah yang pertama berkomentar</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CommentContent>
            </CommentContainer>

            <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <span>Login Diperlukan</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda perlu login terlebih dahulu untuk dapat memberikan komentar pada artikel ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction>
                            <a href="/sign-in" className="inline-block w-full h-full">
                                Login
                            </a>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CommentDrawer;