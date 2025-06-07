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

import { useDonationChart, chartConfig } from "@/hooks/useDonationChart";

const BarChartComponent = () => {
    const { processedData, currentSemester, trend, isEmpty } = useDonationChart();

    return (
        <Card className="sm:col-span-1">
            <CardHeader>
                <CardTitle>Donasi vs Target</CardTitle>
                <CardDescription>
                    Bulan: {currentSemester === 1 ? 'Januari - Juni' : 'Juli - Desember'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
                {isEmpty ? (
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
            </CardFooter>
        </Card>
    );
};

export default BarChartComponent;