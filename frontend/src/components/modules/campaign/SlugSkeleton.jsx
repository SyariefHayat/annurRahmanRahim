import React from 'react';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const SlugSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="w-full h-96 rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-7 w-32" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-2 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);