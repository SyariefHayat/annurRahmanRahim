import React from 'react';

import { SlugImage } from './SlugImage';
import { SlugHeader } from './SlugHeader';
import TabsCampaign from './TabsCampaign';
import { SlugSidebar } from './SlugSidebar';

export const SlugDetail = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SlugImage />
                    <SlugHeader />
                    <TabsCampaign />
                </div>
                <div className="lg:col-span-1">
                    <SlugSidebar />
                </div>
            </div>
        </div>
    );
};