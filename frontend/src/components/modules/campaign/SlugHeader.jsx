import React from 'react';
import { useAtom } from 'jotai';

import { Badge } from "@/components/ui/badge";
import { campaignDataAtom } from '@/jotai/atoms';

export const SlugHeader = () => {
    const [campaignData] = useAtom(campaignDataAtom);

    return (
        <div>
            <Badge variant="outline" className="mb-2 text-blue-700 bg-blue-50 border-blue-200">
                {campaignData.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">{campaignData.title}</h1>
            <p className="text-gray-600 leading-relaxed">{campaignData.description}</p>
        </div>
    );
};