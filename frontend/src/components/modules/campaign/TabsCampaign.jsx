import React from 'react';
import { useAtom } from 'jotai';

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

import { DonorList } from './DonorList';
import { MessageList } from './MessageList';
import { activeTabAtom } from '@/jotai/atoms';

const TabsCampaign = () => {
    const [activeTab, setActiveTab] = useAtom(activeTabAtom);

    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    return (
        <Tabs 
            defaultValue="donors" 
            className="w-full mt-0 sm:mt-14"
            value={activeTab}
            onValueChange={handleTabChange}
        >
            <TabsList className="gap-4 w-full sm:w-fit">
                <TabsTrigger value="donors">
                    Donatur
                </TabsTrigger>
                <TabsTrigger value="messages">
                    Doa Orang Baik
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="donors" className="mt-4">
                <DonorList />
            </TabsContent>
            
            <TabsContent value="messages" className="mt-4">
                <MessageList />
            </TabsContent>
        </Tabs>
    );
};

export default TabsCampaign;