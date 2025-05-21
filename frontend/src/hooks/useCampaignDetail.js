import { useState, useEffect } from 'react';

import { apiInstanceExpress } from '@/services/apiInstance';

export const useCampaignDetail = (id) => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [campaignData, setCampaignData] = useState(null);
    const [transactionsData, setDonorData] = useState([]);
    
    // Pagination for latest donors
    const [donorPage, setDonorPage] = useState(1);
    const [donorPagination, setDonorPagination] = useState({
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0
    });
    
    // Pagination for donor messages
    const [messagePage, setMessagePage] = useState(1);
    const [messagePagination, setMessagePagination] = useState({
        total: 0,
        page: 1,
        limit: 4,
        totalPages: 0
    });

        useEffect(() => {
        const getCampaignDataById = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`campaign/get/${id}`);
                if (response.status === 200) {
                    setCampaignData(response.data.data.campaign);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getCampaignDataById();
    }, [id]);

    useEffect(() => {
        const getTransactions = async () => {
            if (!campaignData) return;
            
            try {
                const response = await apiInstanceExpress.get(
                    `donor/get/${campaignData._id}?page=${donorPage}&limit=6`
                );
                
                if (response.status === 200) {
                    setDonorData(response.data.data.data);
                    setDonorPagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error("Error fetching donor transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        
        getTransactions();
    }, [id, campaignData, donorPage]);

    // useEffect(() => {
    //     const getDonorMessages = async () => {
    //         if (!campaignData) return;
            
    //         try {
    //             const response = await apiInstanceExpress.get(
    //                 `campaign/${id}/messages?page=${messagePage}&limit=4`
    //             );
                
    //             if (response.status === 200) {
    //                 setMessages(response.data.data.messages);
    //                 setMessagePagination(response.data.data.pagination);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching donor messages:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
        
    //     getDonorMessages();
    // }, [id, campaignData, messagePage]);

        return {
        campaignData,
        transactionsData,
        messages,
        loading,
        donorPage,
        setDonorPage,
        donorPagination,
        messagePage,
        setMessagePage,
        messagePagination
    };
};