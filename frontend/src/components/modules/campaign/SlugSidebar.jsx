import React from 'react';

import { 
    Calendar, 
    Users, 
    CreditCard 
} from 'lucide-react';

import { 
    Card, 
    CardContent 
} from "@/components/ui/card";

import { formatDate } from '@/lib/utils';
import { SlugCreator } from './SlugCreator';
import { SlugProgress } from './SlugProgress';
import { SlugInfoItem } from './SlugInfoItem';
import DialogCampaign from './DialogCampaign';
import { getStatusIcon } from '@/utils/campaignStatus';

export const SlugSidebar = ({ campaign }) => {
    return (
        <Card className="sticky top-24 shadow-sm border-gray-100">
            <CardContent className="p-6 space-y-6">
                <SlugProgress campaign={campaign} />

                <DialogCampaign campaignData={campaign} />

                <div className="divide-y divide-gray-100">
                    <SlugInfoItem 
                        icon={getStatusIcon(campaign.status)} 
                        label="Status" 
                        value={campaign.status} 
                    />
                    <SlugInfoItem 
                        icon={<Calendar className="h-5 w-5 text-gray-400" />} 
                        label="Berakhir pada" 
                        value={formatDate(campaign.deadline)} 
                    />
                    <SlugInfoItem 
                        icon={<Users className="h-5 w-5 text-gray-400" />} 
                        label="Dikelola oleh" 
                        value={campaign.createdBy.username} 
                    />
                    <SlugInfoItem 
                        icon={<CreditCard className="h-5 w-5 text-gray-400" />} 
                        label="Metode Pembayaran" 
                        value="Transfer Bank, QRIS, E-Wallet" 
                    />
                </div>

                <SlugCreator creator={campaign.createdBy} />
            </CardContent>
        </Card>
    );
};