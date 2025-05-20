import React from 'react';

import { Badge } from "@/components/ui/badge";

export const SlugHeader = ({ campaign }) => {
    return (
        <div>
            <Badge variant="outline" className="mb-2 text-blue-700 bg-blue-50 border-blue-200">
                {campaign.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">{campaign.title}</h1>
            <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
        </div>
    );
};