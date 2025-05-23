import React, { useState } from 'react'

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'
import { getProfilePicture } from '@/lib/utils'
import { getInitial } from '@/utils/getInitial'
import { Skeleton } from '@/components/ui/skeleton'
import { getRelativeTime } from '@/utils/formatDate'
import { Separator } from '@/components/ui/separator'

const ArticleCard = ({ article }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    const handleImageError = () => {
        setImageError(true)
        setImageLoaded(true)
    }

    return (
        <article className="relative flex max-w-xl h-[650px] flex-col items-start justify-between overflow-hidden">
            <figure className="w-full h-full rounded-xl overflow-hidden relative">
                {!imageLoaded && (
                    <div className="absolute inset-0 w-full h-full">
                        <Skeleton className="w-full h-full" />
                    </div>
                )}
                
                <img 
                    src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${article.cover}`}
                    alt={article.title} 
                    className={`w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                
                {imageError && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                )}
            </figure>

            <div className="w-full h-full flex flex-col pt-8">
                <header className="flex items-center gap-x-4 text-xs text-gray-600">
                    {article?.tags?.map((tag, index) => (
                        <Badge key={index} className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 capitalize">
                            {tag}
                        </Badge>
                    ))}
                </header>

                <div className="flex-grow">
                    <a href={`/article/${article._id}`}>
                        <h3 className="my-4 text-lg/6 font-semibold line-clamp-2">{article.title}</h3>
                    </a>
                    <p className="line-clamp-4 text-sm/6 text-gray-600"> 
                        {article.content[0].value}
                    </p>
                </div>

                <Separator className="my-4" />

                <footer className="flex items-center justify-between">
                    <div className="flex items-center gap-x-4">
                        <Avatar className="size-10 bg-gray-50">
                            <AvatarImage 
                                src={getProfilePicture(article.createdBy)} 
                                referrerPolicy="no-referrer"
                                className="object-cover"
                            />
                            <AvatarFallback>{getInitial(article.createdBy?.username)}</AvatarFallback>
                        </Avatar>

                        <div className="text-sm/6">
                            <p className="font-semibold text-gray-900">
                                <a href={`/user/${article.createdBy._id}`} className="hover:underline">
                                    {article.createdBy?.username}
                                </a>
                            </p>
                            <p className="text-gray-600">{article.createdBy.email}</p>
                        </div>
                    </div>

                    <time dateTime={article.createdAt} className="text-xs text-gray-600">{getRelativeTime(article.createdAt)}</time>
                </footer>
            </div>
        </article>
    )
}

export default ArticleCard