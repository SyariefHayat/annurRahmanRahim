import React from 'react'

import ArticleCard from './ArticleCard'
import EachUtils from '@/utils/EachUtils'
import ArticleCardSkeleton from './ArticleCardSkeleton'

const ArticleList = ({ loading, articleData }) => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {!loading ? (
                    <EachUtils
                        of={articleData}
                        render={(item, index) => <ArticleCard key={index} article={item} />}
                    />
                ) : (
                    Array.from({ length: 3 }).map((_, index) => (
                        <ArticleCardSkeleton key={index} />
                    ))
                )}
            </div>
        </div>
    )
}

export default ArticleList