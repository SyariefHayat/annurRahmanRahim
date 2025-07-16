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
    const { currentUser, userData } = useAuth();

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

                const allowedRoles = ["developer", "product manager"];

                const dataCampaign = response.data.data.campaigns;
                const dataArticle = response.data.data.articles;
                const dataProgram = response.data.data.programs;

                if (response.status === 200) {
                    setDonors(response.data.data.donors);
                    
                    if (allowedRoles.includes(userData.role)) {
                        setArticles(dataArticle);
                        setPrograms(dataProgram);
                        setCampaigns(dataCampaign);
                        setUsers(response.data.data.users);
                    }
                    
                    const userCampaign = dataCampaign.filter(
                        campaign => campaign.createdBy._id === userData._id
                    );
                    setCampaigns(userCampaign);

                    const userArticle = dataArticle.filter(
                        article => article.createdBy._id === userData._id
                    );
                    setArticles(userArticle);

                    const userProgram = dataProgram.filter(
                        program => program.createdBy === userData._id
                    )
                    setPrograms(userProgram);
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