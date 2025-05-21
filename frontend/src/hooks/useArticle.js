import { useEffect, useState } from "react";
import { apiInstanceExpress } from "@/services/apiInstance";

const useArticle = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [articleData, setArticleData] = useState([]);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0
    });

    useEffect(() => {
        const getArticleData = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`article/get?page=${currentPage}&limit=6`);
                
                if (response.status === 200) {
                    setArticleData(response.data.data.article);
                    setPagination(response.data.data.pagination);
                };
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        getArticleData();
    }, [currentPage]);

    return {
        loading,
        articleData,
        pagination,
        currentPage,
        setCurrentPage
    };
}

export default useArticle;