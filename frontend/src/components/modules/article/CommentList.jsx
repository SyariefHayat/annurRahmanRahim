import React from 'react'
import { MessageSquare } from 'lucide-react'

import CommentItem from './CommentItem'
import EachUtils from '@/utils/EachUtils'

const CommentList = ({ commentData }) => {
    if (commentData.length === 0) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">Belum ada komentar</p>
                <p className="text-slate-400 text-xs mt-1">Jadilah yang pertama berkomentar</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pr-4">
            <EachUtils 
                of={commentData}
                render={(item, index) => (
                    <CommentItem key={index} item={item} />
                )}
            />
        </div>
    )
}

export default CommentList