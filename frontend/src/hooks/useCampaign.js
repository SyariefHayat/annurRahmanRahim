import { useState, useEffect } from 'react';

import { apiInstanceExpress } from '@/services/apiInstance';

const useCampaign = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [campaignData, setCampaignData] = useState([]);
    
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0
    });

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`campaign/get?page=${currentPage}&limit=6`);

                if (response.status === 200) {
                    setCampaignData(response.data.data.data);
                    setPagination(response.data.data.pagination);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [currentPage]);

    return {
        loading,
        campaignData,
        pagination,
        currentPage,
        setCurrentPage
    };
};

export default useCampaign;