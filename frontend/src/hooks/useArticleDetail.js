import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'

import { useAuth } from '@/context/AuthContext'
import { apiInstanceExpress } from '@/services/apiInstance'
import { articleAtom, anonymousIdAtomStorage } from '@/jotai/atoms'

export const useArticleDetai = (articleId) => {
    const { userData } = useAuth()
    const [article, setArticle] = useAtom(articleAtom)
    const [anonymousIdStorage, setAnonymousIdStorage] = useAtom(anonymousIdAtomStorage)
    
    const [isLoading, setIsLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState("")
    const [isShared, setIsShared] = useState(false)
    const [shareCount, setShareCount] = useState("")
    
    const getOrCreateAnonymousId = () => {
        let finalAnonymousId = anonymousIdStorage
        
        if (!finalAnonymousId) {
            finalAnonymousId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            setAnonymousIdStorage(finalAnonymousId)
        }
        
        return finalAnonymousId
    }

    useEffect(() => {
        const getArticleData = async () => {
            setIsLoading(true)
            try {
                const response = await apiInstanceExpress.get(`article/get/${articleId}`)
                
                if (response.status === 200) {
                    const articleData = response.data.data
                    setArticle(articleData)
                    setLikesCount(articleData.likes.length)
                    setShareCount(articleData.shares.length)
                    
                    if (userData) {
                        setIsLiked(articleData.likes.some(like => like.userId === userData._id))
                        setIsShared(articleData.shares.some(share => share.userId === userData._id))
                    } else if (anonymousIdStorage) {
                        setIsLiked(articleData.likes.some(like => like.anonymousId === anonymousIdStorage))
                        setIsShared(articleData.shares.some(share => share.anonymousId === anonymousIdStorage))
                    }
                }
            } catch (error) {
                console.error("Error fetching article:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (articleId) {
            getArticleData()
        }
    }, [articleId, userData, anonymousIdStorage, setArticle])

    const handleToggleLike = async (articleId) => {
        const finalAnonymousId = getOrCreateAnonymousId()

        try {
            const response = await apiInstanceExpress.post('like/create', {
                articleId,
                ...(userData ? { userId: userData._id } : { anonymousId: finalAnonymousId })
            })

            if (response.status === 200) {
                const { liked, likesCount } = response.data.data
                setIsLiked(liked)
                setLikesCount(likesCount)
            }
        } catch (error) {
            console.error("Failed to toggle like:", error)
        }
    }

    const handleShare = async (articleId) => {
        const finalAnonymousId = getOrCreateAnonymousId()
        const articleUrl = window.location.href

        try {
            await navigator.clipboard.writeText(articleUrl)
            
            if (!isShared) {
                const response = await apiInstanceExpress.post('share/create', {
                    articleId,
                    ...(userData ? { userId: userData._id } : { anonymousId: finalAnonymousId })
                })
                
                if (response.status === 200) {
                    setIsShared(true)
                    setShareCount(response.data.data.sharesCount)
                }
            }
        } catch (error) {
            console.error("Failed to copy link or share article:", error)
        }
    }

    return {
        article,
        isLoading,
        isLiked,
        likesCount,
        isShared,
        shareCount,
        handleToggleLike,
        handleShare
    }
}