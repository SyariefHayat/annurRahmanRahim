import React from 'react';
import { useParams } from 'react-router-dom';

import Footer from '../landing/Footer';
import Navbar from '../landing/Navbar';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { SlugDetail } from '@/components/modules/campaign/SlugDetail';
import { SlugSkeleton } from '@/components/modules/campaign/SlugSkeleton';
import { useAtom } from 'jotai';
import { campaignDataAtom } from '@/jotai/atoms';

const Slug = () => {
    const { id } = useParams();
    const { loading } = useCampaignDetail(id);
    const [campaignData] = useAtom(campaignDataAtom);

    return (
        <DefaultLayout>
            <Navbar position="relative" />
            {loading ? (
                <SlugSkeleton />
            ) : (
                campaignData && (
                    <SlugDetail />
                )
            )}
            <Footer />
        </DefaultLayout>
    );
};

export default Slug;