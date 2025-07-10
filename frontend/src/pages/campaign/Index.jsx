import React from 'react';

import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
import useCampaign from '@/hooks/useCampaign';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { CampaignList } from '@/components/modules/campaign/CampaignList';
import { CampaignHeader } from '@/components/modules/campaign/CampaignHeader';
import { CampaignPagination } from '@/components/modules/campaign/CampaignPagination';

const Campaign = () => {
    const { loading, campaignData, pagination, currentPage, setCurrentPage } = useCampaign();

    return (
        <DefaultLayout>
            <Navbar />
            <CampaignHeader />
            
            <main className="relative">
                <CampaignList loading={loading} campaignData={campaignData} />
                <CampaignPagination 
                    pagination={pagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </main>
            
            <Footer />
        </DefaultLayout>
    );
};

export default Campaign;