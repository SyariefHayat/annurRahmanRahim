import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { programDataAtom } from "@/jotai/atoms";
import { apiInstanceExpress } from "@/services/apiInstance";

export const useProgramDetail = (id) => {
    const [loading, setLoading] = useState(true);
    const [, setProgramData] = useAtom(programDataAtom);

    useEffect(() => {
        if (!id) return;

        const getProgramDataById = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`program/get/${id}`);
                if (response.status === 200) return setProgramData(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getProgramDataById();
    }, [id, setProgramData]);

    return { loading }
};