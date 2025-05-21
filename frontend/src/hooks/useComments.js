import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'

import { useAuth } from '@/context/AuthContext'
import { apiInstanceExpress } from '@/services/apiInstance'
import { articleAtom, commentDataAtom, isNewCommentAtom } from '@/jotai/atoms'

export const useComments = () => {
    const [article] = useAtom(articleAtom)
    const { currentUser, userData } = useAuth()
    const [commentData, setCommentData] = useAtom(commentDataAtom)
    const [isNewComment, setIsNewComment] = useAtom(isNewCommentAtom)
    
    const [isOpen, setIsOpen] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [commentLength, setCommentLength] = useState("")
    const [showLoginAlert, setShowLoginAlert] = useState(false)

    useEffect(() => {
        const fetchComments = async () => {
        if (!article?._id) return

        try {
            const response = await apiInstanceExpress.get(`comment/get/${article._id}`)
            if (response.status === 200) {
            setCommentData(response.data.data)
            setCommentLength(response.data.data.length)
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
        }

        fetchComments()
    }, [article?._id, isNewComment, setCommentData])

    const handleSubmitComment = async (articleId) => {
        if (!commentText.trim()) return
        
        if (!userData || !currentUser) {
        setShowLoginAlert(true)
        return
        }

        try {
        const token = await currentUser.getIdToken()
        const response = await apiInstanceExpress.post(
            "comment/create", 
            {
            text: commentText,
            articleId
            },
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )

        if (response.status === 201) {
            setCommentText('')
            setIsNewComment(prev => !prev)

            const updated = await apiInstanceExpress.get(`comment/get/${article._id}`)
            if (updated.status === 200) {
            setCommentLength(updated.data.data.length)
            setCommentData(updated.data.data)
            }
        }
        } catch (error) {
        console.error("Error submitting comment:", error)
        }
    }

    const handleTextareaFocus = () => {
        if (!userData || !currentUser) {
        setShowLoginAlert(true)
        }
    }

    return {
        isOpen,
        setIsOpen,
        commentText,
        setCommentText,
        commentData,
        commentLength: commentLength || article?.comments?.length || 0,
        showLoginAlert,
        setShowLoginAlert,
        handleSubmitComment,
        handleTextareaFocus,
        userData,
        article
    }
}