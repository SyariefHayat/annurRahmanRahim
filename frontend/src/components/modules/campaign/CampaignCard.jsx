import React, { useState } from 'react';

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';
import { getInitial } from '@/utils/getInitial';
import { getProfilePicture } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export const CampaignCard = ({ campaign }) => {
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
        <article className="relative flex max-w-xl flex-col items-start justify-between overflow-hidden">
            <figure className="w-full h-64 rounded-xl overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 w-full h-full">
                        <Skeleton className="w-full h-full" />
                    </div>
                )}

                <img 
                    src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${campaign.image}`} 
                    alt={campaign.title} 
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

            <div className="w-full flex flex-col pt-8">
                <header className="flex items-center gap-x-4 text-xs text-gray-600 h-6">
                    <time dateTime={campaign.createdAt}>{formatDate(campaign?.createdAt)}</time>
                    <Badge className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                        {campaign.category}
                    </Badge>
                </header>

                <div className="min-h-[140px]">
                    <a href={`/campaign/${campaign._id}`}>
                        <h3 className="mt-4 text-lg/6 font-semibold line-clamp-2 h-12">{campaign.title}</h3>
                    </a>
                    <p className="mt-4 line-clamp-3 text-sm/6 text-gray-600 h-18"> 
                        {campaign.description}
                    </p>
                </div>

                <div className="my-8 space-y-3">
                    <Progress 
                        value={Math.min((campaign.collectedAmount / campaign.targetAmount) * 100, 100)}
                        className="h-2 [&>div]:bg-blue-600 bg-gray-200 rounded-full"
                        aria-label={`Progress campaign ${campaign.title}`}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <p>Terkumpul: <span className="font-semibold">{campaign.collectedAmount.toLocaleString("id-Id")}</span></p>
                        <p>Dari: <span className="font-semibold">{campaign.targetAmount.toLocaleString("id-Id")}</span></p>
                    </div>
                </div>

                <footer className="relative flex items-center gap-x-4">
                    <Avatar className="size-10 bg-gray-50">
                        <AvatarImage 
                            src={getProfilePicture(campaign.createdBy)}
                            referrerPolicy="no-referrer"
                        />
                        <AvatarFallback>{getInitial(campaign.createdBy.username)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm/6">
                        <p className="relative font-semibold text-gray-900">
                            <a href={`/user/${campaign.createdBy._id}`} className="hover:underline">
                                {campaign.createdBy?.username}
                            </a>
                        </p>
                        <p className="text-gray-600">{campaign.createdBy?.role}</p>
                    </div>
                </footer>
            </div>
        </article>
    );
};