import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const ArticleCardSkeleton = () => {
    return (
        <div className="relative flex max-w-xl h-[650px] flex-col items-start justify-between overflow-hidden">
            <Skeleton className="w-full h-full rounded-xl" />
            
            <div className="w-full h-full flex flex-col pt-8">
                <div className="flex gap-2 mb-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-4">
                        <Skeleton className="rounded-full size-10" />
                        <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    )
}

export default ArticleCardSkeleton