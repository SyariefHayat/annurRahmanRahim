import React from 'react';

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

import { DonorList } from './DonorList';
import { MessageList } from './MessageList';

const TabsCampaign = ({ 
    donorsData, 
    donorPagination, 
    donorPage, 
    setDonorPage,
    messages,
    messagePagination,
    messagePage,
    setMessagePage
}) => {
    return (
        <Tabs defaultValue="donors" className="w-full mt-0 sm:mt-14">
            <TabsList className="gap-4 w-full sm:w-fit">
                <TabsTrigger value="donors">
                    Donatur <span className="text-blue-500">{donorPagination.total || 0}</span>
                </TabsTrigger>
                <TabsTrigger value="messages">
                    Doa Orang Baik <span className="text-blue-500">0</span>
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="donors" className="mt-4">
                <DonorList 
                    donors={donorsData} 
                    pagination={donorPagination}
                    currentPage={donorPage}
                    setCurrentPage={setDonorPage}
                />
            </TabsContent>
            
            <TabsContent value="messages" className="mt-4">
                <MessageList 
                    messages={messages}
                    pagination={messagePagination}
                    currentPage={messagePage}
                    setCurrentPage={setMessagePage}
                />
            </TabsContent>
        </Tabs>
    );
};

export default TabsCampaign;