import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SlugSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="bg-card border-b">
                <div className="container mx-auto py-6 px-4 sm:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="lg:col-span-1">
                            <Skeleton className="w-full h-48 sm:h-64 lg:h-full rounded-lg" />
                        </div>
                        
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 sm:h-8 w-full" />
                                <Skeleton className="h-4 sm:h-6 w-3/4" />
                                </div>
                                <Skeleton className="w-20 h-6 rounded-full" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Skeleton className="w-5 h-5 rounded" />
                                        <div className="flex-1 space-y-1">
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Skeleton className="w-full sm:w-48 h-10" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-6 px-4 sm:py-8">
                <div className="border-b mb-6 sm:mb-8">
                    <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2 py-2 px-1 min-w-max">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-16 h-4" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-5 h-5" />
                            <Skeleton className="w-32 h-5" />
                        </div>
                        
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlugSkeleton;