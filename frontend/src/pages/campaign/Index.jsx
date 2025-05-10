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

import Footer from '../landing/Footer'
import Navbar from '../landing/Navbar'
import EachUtils from '@/utils/EachUtils'
import { Badge } from '@/components/ui/badge'
import { getInitial } from '@/utils/getInitial'
import { formatDate } from '@/utils/formatDate'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { apiInstanceExpress } from '@/services/apiInstance'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp'
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown'

const Campaign = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [campaignData, setCampaignData] = useState("");
    
    const itemsPerPage = 6;

    const paginatedData = campaignData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const getCampaignData = async () => {
            try {
                const response = await apiInstanceExpress.get("campaign/get");

                if (response.status === 200) return setCampaignData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        getCampaignData();
    }, [])

    return (
        <DefaultLayout>
            <Navbar />

            <header className="relative w-full h-screen flex items-center justify-center">
                <ClipPathUp />

                <div className="mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Jadilah Bagian dari Perubahan</h1>

                    <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">Bantu kami menciptakan dunia yang lebih baik dengan memberikan donasi Anda. Setiap kontribusi, sekecil apa pun, memiliki dampak besar bagi mereka yang membutuhkan.</p>
                </div>

                <ClipPathDown />
            </header>

            <main className="relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 sm:my-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {campaignData ? (
                            <EachUtils
                                of={paginatedData}
                                render={(item, index) => (
                                    <article key={index} className="relative flex max-w-xl h-[650px] flex-col items-start justify-between overflow-hidden">
                                        <figure className="w-full h-full rounded-xl overflow-hidden">
                                            <img src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.image}`} alt={item.title} className="w-full h-full object-cover object-center" />
                                        </figure>
                                        <div className="w-full h-full flex flex-col pt-8">
                                            <header className="flex items-center gap-x-4 text-xs text-gray-600">
                                                <time dateTime={item.createdAt}>{formatDate(item?.createdAt)}</time>
                                                <Badge className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                                                    {item.category}
                                                </Badge>
                                            </header>

                                            <div>
                                                <a href={`/campaign/${item._id}`}>
                                                    <h3 className="mt-4 text-lg/6 font-semibold line-clamp-2">{item.title}</h3>
                                                </a>
                                                <p className="mt-4 line-clamp-3 text-sm/6 text-gray-600"> 
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="my-8 space-y-3">
                                                <Progress 
                                                    value={Math.min((item.collectedAmount / item.targetAmount) * 100, 100)}
                                                    className="h-2 [&>div]:bg-blue-600 bg-gray-200 rounded-full"
                                                    aria-label={`Progress campaign ${item.title}`}
                                                />
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <p>Terkumpul: <span className="font-semibold">{item.collectedAmount.toLocaleString("id-Id")}</span></p>
                                                    <p>Dari: <span className="font-semibold">{item.targetAmount.toLocaleString("id-Id")}</span></p>
                                                </div>
                                            </div>

                                            <footer className="relative flex items-center gap-x-4">
                                                <Avatar className="size-10 bg-gray-50">
                                                    <AvatarImage src={item.createdBy.profilePicture} />
                                                    <AvatarFallback>{getInitial(item.createdBy.username)}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm/6">
                                                    <p className="relative font-semibold text-gray-900">
                                                        <a href={`/user/${item.createdBy._id}`} className="hover:underline">
                                                            {item.createdBy?.username}
                                                        </a>
                                                    </p>
                                                    <p className="text-gray-600">{item.createdBy?.role}</p>
                                                </div>
                                            </footer>
                                        </div>
                                    </article>
                                )}
                            />
                        ) : (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="space-y-4">
                                    <Skeleton className="h-[300px] w-full rounded-xl" />
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[70%]" />
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {campaignData.length > itemsPerPage && (
                        <div className="mb-10 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: Math.ceil(campaignData.length / itemsPerPage) }).map((_, index) => (
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
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(campaignData.length / itemsPerPage)))}
                                            className={currentPage === Math.ceil(campaignData.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
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

export default Campaign