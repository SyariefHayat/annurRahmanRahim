import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { 
    SidebarInset, 
    SidebarProvider 
} from '@/components/ui/sidebar'

import { 
    allArticlesAtom, 
    allCampaignsAtom, 
    allDonorsAtom, 
    allProgramsAtom, 
    allUsersAtom 
} from '@/jotai/atoms';

import { useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import AppSidebar from '../modules/dashboard/AppSidebar';
import SiteHeader from '../modules/dashboard/SiteHeader';
import { apiInstanceExpress } from '@/services/apiInstance';

const DashboardLayout = ({ children }) => {
    const { currentUser } = useAuth();

    const [, setUsers] = useAtom(allUsersAtom);
    const [, setDonors] = useAtom(allDonorsAtom);
    const [, setArticles] = useAtom(allArticlesAtom);
    const [, setPrograms] = useAtom(allProgramsAtom);
    const [, setCampaigns] = useAtom(allCampaignsAtom);
        
    useEffect(() => {
        if (!currentUser) return;
        const getAdminData = async () => {
            try {
                const token = await currentUser.getIdToken();
                const response = await apiInstanceExpress.get("admin/get/summary", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    setUsers(response.data.data.users);
                    setArticles(response.data.data.articles);
                    setDonors(response.data.data.donors);
                    setCampaigns(response.data.data.campaigns);
                    setPrograms(response.data.data.programs);
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        getAdminData();
    }, [currentUser]);

    return (
        <SidebarProvider>
            <Toaster />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                { children }
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout