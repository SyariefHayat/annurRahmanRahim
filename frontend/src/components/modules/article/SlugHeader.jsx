import React from 'react'

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'
import { getInitial } from '@/utils/getInitial'
import { formatDate, getProfilePicture } from '@/lib/utils'

const SlugHeader = ({ article }) => {
    return (
        <>
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
                    <AvatarImage 
                        src={getProfilePicture(article?.createdBy)}
                        referrerPolicy="no-referrer"
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100">{getInitial(article.createdBy.username)}</AvatarFallback>
                </Avatar>

                <div className="text-sm">
                    <p className="font-semibold text-slate-900">
                        <a href={`/user/${article.createdBy._id}`} className="hover:underline">
                        {article.createdBy?.username}
                        </a>
                    </p>
                    <div className="flex items-center text-slate-500 text-xs mt-1">
                        <span>{article?.createdBy?.role}</span>
                        <span className="mx-2">•</span>
                        <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlugHeader