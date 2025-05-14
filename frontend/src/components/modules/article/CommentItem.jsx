import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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

import EachUtils from '@/utils/EachUtils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { getInitial } from '@/utils/getInitial';
import { getProfilePicture } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { getRelativeTime } from '@/utils/formatDate';
import { apiInstanceExpress } from '@/services/apiInstance';
import { articleAtom, commentDataAtom } from '@/jotai/atoms';

const CommentItem = ({ level = 0, item }) => {
    const [article] = useAtom(articleAtom);
    const { currentUser, userData } = useAuth();
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [, setCommentData] = useAtom(commentDataAtom);
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    const handleSubmitReply = async (commentId) => {
        if (!replyText.trim()) return;

        if (!userData || !currentUser) {
            setShowLoginAlert(true);
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.post("comment/create/reply", 
                {
                    text: replyText,
                    articleId: article._id,
                    commentId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) return setCommentData(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setReplyText('');
            setShowReply(false);
        }
    };
    
    const handleReplyClick = () => {
        if (!userData || !currentUser) {
            setShowLoginAlert(true);
            return;
        }
        setShowReply(!showReply);
    };

    return (
        <div className={`${level > 0 ? "pl-6 border-l border-slate-100" : ""}`}>
            <div className="flex gap-3">
                <Avatar className="size-10 ring-2 ring-white shadow-sm">
                    <AvatarImage 
                        src={getProfilePicture(item.user)}
                        referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-gray-100">{getInitial(item.user.username)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-sm text-slate-900">{item?.user?.username}</span>
                            <span className="text-xs text-slate-500 ml-2">{getRelativeTime(item?.commentAt)}</span>
                        </div>
                    </div>
                    
                    <p className="text-sm text-slate-700">{item?.text}</p>
                    
                    {level < 1 && (
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-0 px-1 text-xs text-slate-500 hover:text-slate-900"
                                onClick={handleReplyClick}
                            >
                                Balas
                            </Button>
                        </div>
                    )}
                    
                    {showReply && (
                        <div className="mt-3 space-y-2">
                            <Textarea 
                                placeholder="Tulis balasan..."
                                className="resize-none break-words break-all min-h-[80px] text-sm bg-slate-50 border-slate-200"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs"
                                    onClick={() => setShowReply(false)}
                                >
                                    Batal
                                </Button>
                                <Button 
                                    size="sm" 
                                    className="text-xs rounded-full px-3"
                                    onClick={() => handleSubmitReply(item._id)}
                                    disabled={!replyText.trim()}
                                >
                                    Kirim
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {item?.replies?.length > 0 && (
                        <div className="mt-4 space-y-4">
                            <EachUtils 
                                of={item.replies}
                                render={(replyItem, index) => (
                                    <CommentItem key={index} level={level + 1} item={replyItem} />
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <span>Login Diperlukan</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda perlu login terlebih dahulu untuk dapat membalas komentar pada artikel ini.
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
        </div>
    );
};

export default CommentItem;