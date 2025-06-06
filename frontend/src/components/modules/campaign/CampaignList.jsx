import React from 'react';

import EachUtils from '@/utils/EachUtils';
import { CampaignCard } from './CampaignCard';
import { CampaignCardSkeleton } from './CampaignCardSkeleton';

export const CampaignList = ({ loading, campaignData }) => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 sm:my-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {!loading ? (
                    <EachUtils
                        of={campaignData}
                        render={(item, index) => <CampaignCard key={index} campaign={item} />}
                    />
                ) : (
                    Array.from({ length: 6 }).map((_, index) => (
                        <CampaignCardSkeleton key={index} />
                    ))
                )}
            </div>
        </div>
    );
};