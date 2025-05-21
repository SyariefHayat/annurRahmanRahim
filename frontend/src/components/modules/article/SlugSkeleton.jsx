import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SlugSkeleton = () => {
    return (
        <>
            <div className="relative w-full h-[70vh] bg-slate-200 animate-pulse" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="flex gap-2 mb-6">
                        <Skeleton className="w-16 h-6 rounded-full" />
                        <Skeleton className="w-20 h-6 rounded-full" />
                        <Skeleton className="w-14 h-6 rounded-full" />
                    </div>
                    
                    <Skeleton className="w-full h-9 mb-2 rounded" />
                    <Skeleton className="w-2/3 h-9 mb-6 rounded" />
                    
                    <div className="flex items-center gap-x-4 mb-8 pb-6 border-b border-slate-100">
                        <Skeleton className="size-10 rounded-full" />
                        <div>
                            <Skeleton className="w-32 h-4 mb-2 rounded" />
                            <Skeleton className="w-40 h-3 rounded" />
                        </div>
                    </div>
                    
                    <div className="space-y-6 mb-10">
                        <Skeleton className="w-full h-5 rounded" />
                        <Skeleton className="w-11/12 h-5 rounded" />
                        <Skeleton className="w-4/5 h-5 rounded" />
                        <Skeleton className="w-full h-60 rounded-lg" />
                        <Skeleton className="w-full h-5 rounded" />
                        <Skeleton className="w-3/4 h-5 rounded" />
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-between">
                        <div className="flex gap-3">
                            <Skeleton className="w-20 h-9 rounded-full" />
                            <Skeleton className="w-20 h-9 rounded-full" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <Skeleton className="w-9 h-9 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlugSkeleton