import { useAtom } from "jotai";
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { allCampaignsAtom, allTransactionsAtom, } from "@/jotai/atoms";

const chartConfig = {
    donation: {
        label: "Donasi",
        color: "#4ade80",
    },
    target: {
        label: "Target",
        color: "#94a3b8",
    },
};

const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const BarChartComponent = () => {
    const [transactions] = useAtom(allTransactionsAtom);
    const [campaigns] = useAtom(allCampaignsAtom);

    // Total donasi berdasarkan transaksi yang sudah settle
    const totalIncome = useMemo(() => {
        if (!transactions || transactions.length === 0) return 0;

        return transactions
            .filter(tx => tx.status === 'settlement')
            .reduce((total, t) => total + Number(t.amount || 0), 0);
    }, [transactions]);

    const { processedData, currentSemester } = useMemo(() => {
        if (!transactions || !transactions.length || !campaigns || !campaigns.length) 
            return { processedData: [], currentSemester: 1 };

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const currentSemester = currentMonth < 6 ? 1 : 2;

        const monthlyData = {};
        const semesterMonths = currentSemester === 1
            ? [0, 1, 2, 3, 4, 5]
            : [6, 7, 8, 9, 10, 11];

        // Initialize data for all months in the semester
        semesterMonths.forEach(monthIndex => {
            const month = monthNames[monthIndex];
            monthlyData[month] = {
                month: month,
                donation: 0,
                target: 0
            };
        });

        // Process transactions to get donation amounts by month
        transactions
            .filter(transaction => transaction.status === 'settlement')
            .forEach(transaction => {
                const date = new Date(transaction.date);
                // Only count transactions from the current year and semester
                if (date.getFullYear() !== currentYear) return;
                
                const monthIndex = date.getMonth();
                const month = monthNames[monthIndex];

                if (semesterMonths.includes(monthIndex) && monthlyData[month]) {
                    monthlyData[month].donation += Number(transaction.amount || 0);
                }
            });

        // Process campaigns to get target amounts by month
        campaigns.forEach(donation => {
            const createdAt = new Date(donation.createdAt);
            // Only count campaigns from the current year and semester
            if (createdAt.getFullYear() !== currentYear) return;
            
            const monthIndex = createdAt.getMonth();
            const month = monthNames[monthIndex];

            if (semesterMonths.includes(monthIndex) && monthlyData[month]) {
                monthlyData[month].target += Number(donation.targetAmount || 0);
            }
        });

        return {
            processedData: semesterMonths.map(monthIndex => monthlyData[monthNames[monthIndex]]),
            currentSemester
        };
    }, [transactions, campaigns]);

    const trend = useMemo(() => {
        if (processedData.length < 2) return { percentage: 0, isUp: true };

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const currentMonthName = monthNames[currentMonthIndex];

        const currentMonthData = processedData.find(data => data.month === currentMonthName);
        if (!currentMonthData) return { percentage: 0, isUp: true };

        const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
        const previousMonthName = monthNames[previousMonthIndex];
        const previousMonthData = processedData.find(data => data.month === previousMonthName);

        if (!previousMonthData) return { percentage: 0, isUp: true };

        const currentDonation = currentMonthData.donation;
        const previousDonation = previousMonthData.donation;

        if (previousDonation === 0) return { percentage: 100, isUp: true };

        const percentage = ((currentDonation - previousDonation) / previousDonation) * 100;
        return {
            percentage: Math.abs(percentage).toFixed(1),
            isUp: percentage >= 0
        };
    }, [processedData]);

    // Calculate achievement rate (donation vs target)
    const achievementRate = useMemo(() => {
        const totalDonation = processedData.reduce((sum, data) => sum + data.donation, 0);
        const totalTarget = processedData.reduce((sum, data) => sum + data.target, 0);
        
        if (totalTarget === 0) return 0;
        return ((totalDonation / totalTarget) * 100).toFixed(1);
    }, [processedData]);

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Donasi vs Target</CardTitle>
                <CardDescription>
                    Bulan: {currentSemester === 1 ? 'Januari - Juni' : 'Juli - Desember'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
                {processedData.length === 0 ? (
                    <div className="flex items-center justify-center h-44">
                        <p className="text-muted-foreground">Belum ada data donasi</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full h-44">
                        <BarChart accessibilityLayer data={processedData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="donation" name="Donasi" fill="#4ade80" radius={4} />
                            <Bar dataKey="target" name="Target" fill="#94a3b8" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {trend.isUp ? (
                        <>
                            Donasi naik {trend.percentage}% bulan ini <TrendingUp className="h-4 w-4 text-green-500" />
                        </>
                    ) : (
                        <>
                            Donasi turun {trend.percentage}% bulan ini <TrendingDown className="h-4 w-4 text-red-500" />
                        </>
                    )}
                </div>
                {/* <div className="w-full flex items-center justify-between">

                <div className="leading-none text-muted-foreground">
                    Menampilkan data semester {currentSemester} tahun {new Date().getFullYear()}
                </div>
                <div className="leading-none text-muted-foreground">
                    Total donasi terkumpul: Rp {totalIncome.toLocaleString("id-ID")}
                </div>
                <div className="leading-none text-muted-foreground">
                    Pencapaian target: {achievementRate}%
                </div>
                </div> */}
            </CardFooter>
        </Card>
    );
};

export default BarChartComponent;