import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { MessageSquare, Send } from 'lucide-react'

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import LoginAlert from './LoginAlert'
import CommentList from './CommentList'
import CommentSorter from './CommentSorter'
import { Button } from '@/components/ui/button'
import { getInitial } from '@/utils/getInitial'
import { getProfilePicture } from '@/lib/utils'
import { useComments } from '@/hooks/useComments'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

const CommentDrawer = () => {
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })
    
    const {
        isOpen,
        setIsOpen,
        commentText,
        setCommentText,
        commentData,
        commentLength,
        showLoginAlert,
        setShowLoginAlert,
        handleSubmitComment,
        handleTextareaFocus,
        userData,
        article
    } = useComments()

    const CommentContainer = isDesktop ? Sheet : Drawer
    const CommentTrigger = isDesktop ? SheetTrigger : DrawerTrigger
    const CommentContent = isDesktop ? SheetContent : DrawerContent
    const CommentHeader = isDesktop ? SheetHeader : DrawerHeader
    const CommentTitle = isDesktop ? SheetTitle : DrawerTitle
    const CommentDescription = isDesktop ? SheetDescription : DrawerDescription

    return (
        <>
            <CommentContainer open={isOpen} onOpenChange={setIsOpen}>
                <CommentTrigger asChild onClick={() => setIsOpen(true)}>
                    <Button 
                        variant="outline" 
                        className="rounded-full hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>{commentLength}</span>
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
                            <span>{commentLength} Komentar</span>
                        </div>
                        
                        <CommentSorter />
                    </div>
                    
                    <ScrollArea className="flex-1 max-h-[calc(100vh-450px)] px-4">
                        <CommentList commentData={commentData} />
                    </ScrollArea>
                </CommentContent>
            </CommentContainer>

            <LoginAlert 
                open={showLoginAlert} 
                onOpenChange={setShowLoginAlert} 
            />
        </>
    )
}

export default CommentDrawer