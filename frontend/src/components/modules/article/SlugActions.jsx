import React from 'react'
import { Heart, Share2, Check, Copy } from 'lucide-react'

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

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CommentDrawer from '@/components/modules/article/CommentDrawer'

const SlugActions = ({ 
    articleId, 
    isLiked, 
    likesCount, 
    isShared, 
    shareCount, 
    onToggleLike, 
    onShare 
}) => {
    const articleUrl = window.location.href
    return (
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => onToggleLike(articleId)}
                    className="rounded-full hover:bg-slate-50 transition-color cursor-pointer"
                >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'text-red-400 fill-red-400' : ''}`} />
                    <span>{likesCount}</span>
                </Button>

                <CommentDrawer />

                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <Share2 className={`h-4 w-4 mr-1 ${isShared ? 'text-blue-500 fill-blue-500' : ''}`} /> 
                            <span>{shareCount}</span>
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
                            <Button type="submit" size="sm" className="px-3" onClick={() => onShare(articleId)}>
                                {isShared ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
        </div>
    )
}

export default SlugActions