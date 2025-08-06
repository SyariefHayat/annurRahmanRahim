import { apiInstanceExpress } from "@/services/apiInstance";
import { useEffect, useState } from "react";

const useProgram = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [programData, setProgramData] = useState([]);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0,
    });

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await apiInstanceExpress.get(`program/get?page=${currentPage}&limit=6`);
                if (response.status === 200) {
                    setProgramData(response.data.data.data);
                    setPagination(response.data.data.pagination);
                };
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [currentPage]);

    return {
        loading,
        programData,
        pagination,
        currentPage,
        setCurrentPage,
    };
};

export default useProgram;