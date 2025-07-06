import React from 'react';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import CampaignForm from '@/components/modules/campaign/CampaignForm';

const Create = () => {
    return (
        <DashboardLayout>
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <CampaignForm />
            </div>
        </DashboardLayout>
    );
};

export default Create;