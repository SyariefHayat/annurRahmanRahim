import React from 'react';

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

import { formatCurrency } from '@/lib/utils';
import useDashboardData from '@/hooks/useDashboardData';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DonationSummary from '@/components/modules/dashboard/DonationSummary';
import BarChartComponent from '@/components/modules/dashboard/BarChartComponent';

const Dashboard = () => {
    const { counts, growthData, totalIncome, donationCompletionRate } = useDashboardData();

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
                            <div className="text-2xl font-bold">{counts.users}</div>
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
                                {growthData.donors.isPositive ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                )}
                                <p className={`text-xs ${growthData.donors.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {growthData.donors.isPositive ? '+' : '-'}{Math.abs(growthData.donors.value)}% dari bulan kemarin
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
                            <div className="text-2xl font-bold">{counts.articles}</div>
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
                            <div className="text-2xl font-bold">{counts.activeDonations}</div>
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