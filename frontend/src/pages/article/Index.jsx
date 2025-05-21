import React from 'react'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import useArticle from '@/hooks/useArticle'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ArticleList from '@/components/modules/article/ArticleList'
import ArticleHeader from '@/components/modules/article/ArticleHeader'
import ArticlePagination from '@/components/modules/article/ArticlePagination'

const Article = () => {
    const { loading, articleData, pagination, currentPage, setCurrentPage } = useArticle();

    return (
        <DefaultLayout>
            <Navbar />
            <ArticleHeader />

            <main className="relative">
                <ArticleList loading={loading} articleData={articleData} />
                <ArticlePagination 
                    pagination={pagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </main>

            <Footer />
        </DefaultLayout>
    )
}

export default Article