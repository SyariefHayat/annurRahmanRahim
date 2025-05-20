import React from 'react';

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

export const CampaignCard = ({ campaign }) => {
    return (
        <article className="relative flex max-w-xl flex-col items-start justify-between overflow-hidden">
            <div className="w-full h-64 rounded-xl overflow-hidden">
                <img 
                    src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${campaign.image}`} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover object-center"
                />
            </div>
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