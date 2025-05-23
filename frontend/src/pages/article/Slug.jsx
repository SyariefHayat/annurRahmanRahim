import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import { Button } from '@/components/ui/button'
import { useArticleDetai } from '@/hooks/useArticleDetail'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import SlugHeader from '@/components/modules/article/SlugHeader'
import SlugActions from '@/components/modules/article/SlugActions'
import SlugContent from '@/components/modules/article/SlugContent'
import SlugSkeleton from '@/components/modules/article/SlugSkeleton'

const SlugArticle = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const { 
        article, 
        isLoading, 
        isLiked,
        likesCount,
        isShared,
        shareCount,
        handleToggleLike,
        handleShare
    } = useArticleDetai(id)

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <DefaultLayout>
            <Navbar position="absolute" className="z-10 bg-transparent" />
            
            <main className="min-h-screen bg-white">
                {isLoading ? (
                    <SlugSkeleton />
                ) : (
                    <>
                        <div className="relative w-full h-[70vh] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-0" />
                            <img 
                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${article.cover}`} 
                                alt={article.title} 
                                className="w-full h-full object-cover object-center" 
                            />
                            <div className="absolute top-20 left-6 z-10">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleBack}
                                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full"
                                >
                                    <ChevronLeft className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
                            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                                <SlugHeader article={article} />
                                <SlugContent article={article} />
                                <SlugActions 
                                    articleId={article._id}
                                    isLiked={isLiked}
                                    likesCount={likesCount}
                                    isShared={isShared}
                                    shareCount={shareCount}
                                    onToggleLike={handleToggleLike}
                                    onShare={handleShare}
                                />
                            </div>
                        </div>
                    </>
                )}
                
                <div className="pt-16">
                    <Footer />
                </div>
            </main>
        </DefaultLayout>
    )
}

export default SlugArticle