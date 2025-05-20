import React from 'react';

import { SlugImage } from './SlugImage';
import { SlugHeader } from './SlugHeader';
import TabsCampaign from './TabsCampaign';
import { SlugSidebar } from './SlugSidebar';

export const SlugDetail = ({ 
    campaignData, 
    transactionsData, 
    donorPagination,
    donorPage,
    setDonorPage,
    messages,
    messagePagination,
    messagePage,
    setMessagePage
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SlugImage image={campaignData.image} title={campaignData.title} />
                    <SlugHeader campaign={campaignData} />
                    <TabsCampaign 
                        donorsData={transactionsData}
                        donorPagination={donorPagination}
                        donorPage={donorPage}
                        setDonorPage={setDonorPage}
                        messages={messages}
                        messagePagination={messagePagination}
                        messagePage={messagePage}
                        setMessagePage={setMessagePage}
                    />
                </div>
                <div className="lg:col-span-1">
                    <SlugSidebar campaign={campaignData} />
                </div>
            </div>
        </div>
    );
};