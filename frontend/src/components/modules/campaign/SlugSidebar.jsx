import React from 'react';
import { useAtom } from 'jotai';

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
import { campaignDataAtom } from '@/jotai/atoms';
import { getStatusIcon } from '@/utils/campaignStatus';

export const SlugSidebar = () => {
    const [campaignData] = useAtom(campaignDataAtom);

    return (
        <Card className="sticky top-24 shadow-sm border-gray-100">
            <CardContent className="p-6 space-y-6">
                <SlugProgress />
                <DialogCampaign />

                <div className="divide-y divide-gray-100">
                    <SlugInfoItem 
                        icon={getStatusIcon(campaignData.status)} 
                        label="Status" 
                        value={campaignData.status} 
                    />
                    <SlugInfoItem 
                        icon={<Calendar className="h-5 w-5 text-gray-400" />} 
                        label="Berakhir pada" 
                        value={formatDate(campaignData.deadline)} 
                    />
                    <SlugInfoItem 
                        icon={<Users className="h-5 w-5 text-gray-400" />} 
                        label="Dikelola oleh" 
                        value={campaignData.createdBy.username} 
                    />
                    <SlugInfoItem 
                        icon={<CreditCard className="h-5 w-5 text-gray-400" />} 
                        label="Metode Pembayaran" 
                        value="Transfer Bank, QRIS, E-Wallet" 
                    />
                </div>

                <SlugCreator />
            </CardContent>
        </Card>
    );
};