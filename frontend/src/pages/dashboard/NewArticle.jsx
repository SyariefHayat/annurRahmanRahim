import React from 'react'
import CreateArticle from '../article/Create'
import DashboardLayout from '@/components/layouts/DashboardLayout'

const NewArticle = () => {
    return (
        <DashboardLayout>
            <CreateArticle />
        </DashboardLayout>
    )
}

export default NewArticle