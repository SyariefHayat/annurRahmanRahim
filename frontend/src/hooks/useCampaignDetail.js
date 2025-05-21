import { useState, useEffect } from 'react';
import { apiInstanceExpress } from '@/services/apiInstance';
import { useAtom } from 'jotai';
import { 
  campaignDataAtom, 
  donorDataAtom, 
  donorPageAtom, 
  donorPaginationAtom, 
  messagePageAtom, 
  messagePaginationAtom, 
  messagesAtom 
} from '@/jotai/atoms';

export const useCampaignDetail = (id) => {
    const [loading, setLoading] = useState(true);
    const [, setMessages] = useAtom(messagesAtom);
    const [, setDonorData] = useAtom(donorDataAtom);
    const [campaignData, setCampaignData] = useAtom(campaignDataAtom);
    
    const [donorPage] = useAtom(donorPageAtom);
    const [, setDonorPagination] = useAtom(donorPaginationAtom);
    
    const [messagePage] = useAtom(messagePageAtom);
    const [, setMessagePagination] = useAtom(messagePaginationAtom); // Fixed: changed useState to useAtom

    // Fetch campaign data
    useEffect(() => {
        if (!id) return;
        
        const getCampaignDataById = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`campaign/get/${id}`);
                if (response.status === 200) {
                    setCampaignData(response.data.data.campaign);
                }
            } catch (error) {
                console.error("Error fetching campaign data:", error);
            } finally {
                setLoading(false);
            }
        };

        getCampaignDataById();
    }, [id, setCampaignData]); // Added missing dependency

    // Fetch donors
    useEffect(() => {
        if (!campaignData?._id || donorPage === undefined) return;
        
        const getDonors = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(
                    `donor/get/${campaignData._id}?page=${donorPage}&limit=6`
                );
                
                if (response.status === 200) {
                    setDonorData(response.data.data.donor);
                    setDonorPagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error("Error fetching donor transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        
        getDonors();
    }, [campaignData, donorPage, setDonorData, setDonorPagination]); // Added missing dependencies

    // Fetch donor messages
    useEffect(() => {
        if (!campaignData?._id || messagePage === undefined) return;
        
        const getDonorMessages = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(
                    `donor/get/message/${campaignData._id}?page=${messagePage}&limit=4`
                );
                
                if (response.status === 200) {
                    setMessages(response.data.data.message);
                    setMessagePagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error("Error fetching donor messages:", error);
            } finally {
                setLoading(false);
            }
        };
        
        getDonorMessages();
    }, [campaignData, messagePage, setMessages, setMessagePagination]); // Added missing dependencies

    return { loading, campaignData };
};