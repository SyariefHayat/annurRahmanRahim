import { useAtom } from 'jotai';
import { useMemo } from 'react';

import { 
    allArticlesAtom, 
    allCampaignsAtom, 
    allDonorsAtom, 
    allUsersAtom 
} from '@/jotai/atoms';

const useDashboardData = () => {
    const [users] = useAtom(allUsersAtom);
    const [donors] = useAtom(allDonorsAtom);
    const [articles] = useAtom(allArticlesAtom);
    const [campaigns] = useAtom(allCampaignsAtom);

    const dashboardData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const isSameMonth = (date, month, year) => {
            const d = new Date(date);
            return d.getMonth() === month && d.getFullYear() === year;
        };

        const isCurrentMonth = (date) => isSameMonth(date, currentMonth, currentYear);
        const isLastMonth = (date) =>
            currentMonth === 0
                ? isSameMonth(date, 11, currentYear - 1)
                : isSameMonth(date, currentMonth - 1, currentYear);

        const countGrowth = (arr, field = "createdAt") => {
            let current = 0, last = 0;

            arr.forEach(item => {
                const date = item[field];
                if (isCurrentMonth(date)) current++;
                else if (isLastMonth(date)) last++;
            });

            if (last === 0) return { value: 100, isPositive: current >= 0 };
            const growth = ((current - last) / Math.abs(last)) * 100;
            return { value: Math.abs(growth).toFixed(1), isPositive: growth >= 0 };
        };

        const userGrowth = countGrowth(users, "createdAt");
        const trxGrowth = countGrowth(donors, "date");
        const articleGrowth = countGrowth(articles, "createdAt");
        const donationGrowth = countGrowth(campaigns, "createdAt");

        // Calculate total income from completed donors
        const totalIncome = donors
            .filter(tx => tx.status === 'settlement')
            .reduce((sum, tx) => {
                return tx.amount ? sum + Number(tx.amount) : sum;
            }, 0);
        
        // Calculate donation completion rate
        const completedDonations = campaigns.filter(d => d.status === "Completed").length;
        const donationCompletionRate = campaigns.length > 0 
            ? (completedDonations / campaigns.length * 100).toFixed(1)
            : 0;

        // Count active donations
        const activeDonations = campaigns.filter(d => d.status === "Ongoing").length;

        return {
            counts: {
                users: users.length,
                articles: articles.length,
                activeDonations
            },
            growthData: {
                users: userGrowth,
                donors: trxGrowth,
                articles: articleGrowth,
                campaigns: donationGrowth
            },
            totalIncome,
            donationCompletionRate
        };
    }, [users, donors, articles, campaigns]);

    return dashboardData;
};

export default useDashboardData;