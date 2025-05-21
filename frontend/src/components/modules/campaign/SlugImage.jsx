import React from 'react';
import { useAtom } from 'jotai';

import { campaignDataAtom } from '@/jotai/atoms';

export const SlugImage = () => {
    const [campaignData] = useAtom(campaignDataAtom);

    return (
        <div className="relative overflow-hidden rounded-xl">
            <img 
                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${campaignData.image}`} 
                alt={campaignData.title} 
                className="w-full h-auto object-cover aspect-video shadow-sm"
            />
        </div>
    );
};