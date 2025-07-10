import React from 'react'

import ArticleCard from './ArticleCard'
import EachUtils from '@/utils/EachUtils'
import ArticleCardSkeleton from './ArticleCardSkeleton'

const ArticleList = ({ loading, articleData }) => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <ArticleCardSkeleton key={index} />
                    ))
                ) : articleData && articleData.length > 0 ? (
                    <EachUtils
                        of={articleData}
                        render={(item, index) => <ArticleCard key={index} article={item} />}
                    />
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <svg 
                                className="mx-auto h-24 w-24 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                />
                            </svg>
                            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                Belum ada artikel
                            </h3>
                            <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">
                                Artikel akan ditampilkan di sini ketika tersedia.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ArticleList