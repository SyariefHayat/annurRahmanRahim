import React from 'react';
import { useAtom } from 'jotai';

import { 
    ArrowDownRight, 
    ArrowUpRight, 
    BanknoteIcon, 
    BookOpenIcon, 
    Users
} from 'lucide-react';

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';

import { 
    allArticlesAtom, 
    allCampaignsAtom, 
    allTransactionsAtom, 
    allUsersAtom 
} from '@/jotai/atoms';

import { formatCurrency } from '@/lib/utils';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DonationSummary from '@/components/modules/dashboard/DonationSummary';
import BarChartComponent from '@/components/modules/dashboard/BarChartComponent';

const Dashboard = () => {
    const [users] = useAtom(allUsersAtom);
    const [articles] = useAtom(allArticlesAtom);
    const [campaigns] = useAtom(allCampaignsAtom);
    const [transactions] = useAtom(allTransactionsAtom);

    const { growthData, totalIncome, donationCompletionRate } = React.useMemo(() => {
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
        const trxGrowth = countGrowth(transactions, "date");
        const articleGrowth = countGrowth(articles, "createdAt");
        const donationGrowth = countGrowth(campaigns, "createdAt");

        // Calculate total income from completed transactions
        const totalIncome = transactions
            .filter(tx => tx.status === 'settlement')
            .reduce((sum, tx) => {
                return tx.amount ? sum + Number(tx.amount) : sum;
            }, 0);
        
        // Calculate donation completion rate
        const completedDonations = campaigns.filter(d => d.status === "Completed").length;
        const donationCompletionRate = campaigns.length > 0 
            ? (completedDonations / campaigns.length * 100).toFixed(1)
            : 0;

        return {
            growthData: {
                users: userGrowth,
                transactions: trxGrowth,
                articles: articleGrowth,
                campaigns: donationGrowth
            },
            totalIncome,
            donationCompletionRate
        };
    }, [users, transactions, articles, campaigns]);

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                User Active
                            </CardTitle>
                            <Users className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {growthData.users.isPositive ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                )}
                                <p className={`text-xs ${growthData.users.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {growthData.users.isPositive ? '+' : '-'}{Math.abs(growthData.users.value)}% dari bulan kemarin
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pendapatan
                            </CardTitle>
                            <BanknoteIcon className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {growthData.transactions.isPositive ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                )}
                                <p className={`text-xs ${growthData.transactions.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {growthData.transactions.isPositive ? '+' : '-'}{Math.abs(growthData.transactions.value)}% dari bulan kemarin
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Article
                            </CardTitle>
                            <BookOpenIcon className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{articles.length}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {growthData.articles.isPositive ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                )}
                                <p className={`text-xs ${growthData.articles.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {growthData.articles.isPositive ? '+' : '-'}{Math.abs(growthData.articles.value)}% dari bulan kemarin
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Donasi Aktif
                            </CardTitle>
                            <BanknoteIcon className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaigns.filter(d => d.status === "Ongoing").length}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <p className="text-xs text-gray-500">
                                    {donationCompletionRate}% tingkat penyelesaian
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3">
                    <BarChartComponent />
                    <DonationSummary />
                </div>
                
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;