import React from 'react';
import { useParams } from 'react-router-dom';

import Footer from '../landing/Footer';
import Navbar from '../landing/Navbar';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { SlugDetail } from '@/components/modules/campaign/SlugDetail';
import { SlugSkeleton } from '@/components/modules/campaign/SlugSkeleton';

const Slug = () => {
    const { id } = useParams();
    const { 
        campaignData, 
        transactionsData, 
        messages,
        setMessages,
        loading, 
        donorPage, 
        setDonorPage, 
        donorPagination,
        messagePage,
        setMessagePage,
        messagePagination
    } = useCampaignDetail(id);

    return (
        <DefaultLayout>
            <Navbar position="relative" />
            {loading ? (
                <SlugSkeleton />
            ) : (
                campaignData && (
                    <SlugDetail 
                        campaignData={campaignData}
                        transactionsData={transactionsData}
                        donorPagination={donorPagination}
                        donorPage={donorPage}
                        setDonorPage={setDonorPage}
                        messages={messages}
                        setMessages={setMessages}
                        messagePagination={messagePagination}
                        messagePage={messagePage}
                        setMessagePage={setMessagePage}
                    />
                )
            )}
            <Footer />
        </DefaultLayout>
    );
};

export default Slug;