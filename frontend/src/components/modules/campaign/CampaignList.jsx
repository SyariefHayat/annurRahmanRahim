import React from 'react';

import EachUtils from '@/utils/EachUtils';
import { CampaignCard } from './CampaignCard';
import { CampaignCardSkeleton } from './CampaignCardSkeleton';

export const CampaignList = ({ loading, campaignData }) => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:my-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <CampaignCardSkeleton key={index} />
                    ))
                ) : campaignData && campaignData.length > 0 ? (
                    <EachUtils
                        of={campaignData}
                        render={(item, index) => <CampaignCard key={index} campaign={item} />}
                    />
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <svg 
                                className="mx-auto h-24 w-24 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
                                />
                            </svg>
                            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                Belum ada campaign
                            </h3>
                            <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">
                                Campaign akan ditampilkan di sini ketika tersedia.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};