import React, { useEffect, useState } from 'react'

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import EachUtils from '@/utils/EachUtils'
import { Badge } from '@/components/ui/badge'
import { getInitial } from '@/utils/getInitial'
import { getProfilePicture } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { getRelativeTime } from '@/utils/formatDate'
import { Separator } from '@/components/ui/separator'
import { apiInstanceExpress } from '@/services/apiInstance'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp'
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown'

const Article = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [articleData, setArticleData] = useState("");

    const itemsPerPage = 6;

    useEffect(() => {
        const getArticleData = async () => {
            try {
                const response = await apiInstanceExpress.get("article/get");

                if (response.status === 200) return setArticleData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        }

        getArticleData();
    }, [])

    const paginatedData = articleData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DefaultLayout>
            <Navbar />
            <header className="relative w-full h-screen flex items-center justify-center">
                <ClipPathUp />

                <div className="mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Blog Annur Rahman Rahim</h1>

                    <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">Temukan cerita inspiratif, pembaruan aktivitas yayasan, artikel edukatif, dan banyak lagi di sini.</p>
                </div>

                <ClipPathDown />
            </header>

            <main className="relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {articleData ? (
                            <EachUtils
                                of={paginatedData}
                                render={(item, index) => (
                                    <article key={index} className="relative flex max-w-xl h-[650px] flex-col items-start justify-between overflow-hidden">
                                        <figure className="w-full h-full rounded-xl overflow-hidden">
                                            <img 
                                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.cover}`}
                                                alt={item.title} 
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </figure>

                                        <div className="w-full h-full flex flex-col pt-8">
                                            <header className="flex items-center gap-x-4 text-xs text-gray-600">
                                                {item?.tags?.map((tag, index) => (
                                                    <Badge key={index} className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 capitalize">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </header>

                                            <div className="flex-grow">
                                                <a href={`/article/${item._id}`}>
                                                    <h3 className="my-4 text-lg/6 font-semibold line-clamp-2">{item.title}</h3>
                                                </a>
                                                <p className="line-clamp-4 text-sm/6 text-gray-600"> 
                                                    {item.content[0].value}
                                                </p>
                                            </div>

                                            <Separator className="my-4" />

                                            <footer className="flex items-center justify-between">
                                                <div className="flex items-center gap-x-4">
                                                    <Avatar className="size-10 bg-gray-50">
                                                        <AvatarImage 
                                                            src={getProfilePicture(item.createdBy)} 
                                                            referrerPolicy="no-referrer"
                                                        />
                                                        <AvatarFallback>{getInitial(item.createdBy?.username)}</AvatarFallback>
                                                    </Avatar>

                                                    <div className="text-sm/6">
                                                        <p className="font-semibold text-gray-900">
                                                            <a href={`/user/${item.createdBy._id}`} className="hover:underline">
                                                                {item.createdBy?.username}
                                                            </a>
                                                        </p>
                                                        <p className="text-gray-600">{item.createdBy.email}</p>
                                                    </div>
                                                </div>

                                                <time dateTime={item.createdAt} className="text-xs text-gray-600">{getRelativeTime(item.createdAt)}</time>
                                            </footer>
                                        </div>
                                    </article>
                                )}
                            />
                        ) : (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="relative flex max-w-xl h-[650px] flex-col items-start justify-between overflow-hidden">
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
                            ))
                        )}
                    </div>

                    {articleData.length > itemsPerPage && (
                        <div className="mb-10 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: Math.ceil(articleData.length / itemsPerPage) }).map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                isActive={index + 1 === currentPage}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(articleData.length / itemsPerPage)))}
                                            className={currentPage === Math.ceil(articleData.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </DefaultLayout>
    )
}

export default Article