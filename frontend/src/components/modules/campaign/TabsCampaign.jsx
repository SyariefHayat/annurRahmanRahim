import React from 'react';
import { useAtom } from 'jotai';

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

import { 
    activeTabAtom,
    donorDataAtom,
    messagesAtom
} from '@/jotai/atoms';

import { DonorList } from './DonorList';
import { MessageList } from './MessageList';

const TabsCampaign = () => {
    const [messages] = useAtom(messagesAtom);
    const [donorData] = useAtom(donorDataAtom);
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
                    Donatur <span className="text-blue-500">{donorData.length || 0}</span>
                </TabsTrigger>
                <TabsTrigger value="messages">
                    Doa Orang Baik <span className="text-blue-500">{messages.length || 0}</span>
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