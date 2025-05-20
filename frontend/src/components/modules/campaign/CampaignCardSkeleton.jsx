import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export const CampaignCardSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="pt-8">
                <div className="h-6 flex items-center gap-x-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="min-h-[140px]">
                    <Skeleton className="h-12 w-3/4 mt-4" />
                    <div className="mt-4 h-18">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%] mt-2" />
                        <Skeleton className="h-4 w-[70%] mt-2" />
                    </div>
                </div>
                <div className="my-8 space-y-3">
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
};