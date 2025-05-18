import { useAtom } from 'jotai'
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"

import { 
    formatCurrency, 
    getProfilePicture 
} from '@/lib/utils'

import EachUtils from '@/utils/EachUtils'
import { Button } from "@/components/ui/button"
import { getInitial } from '@/utils/getInitial'
import { useAuth } from '@/context/AuthContext'
import { getRelativeTime } from '@/utils/formatDate'
import { Separator } from "@/components/ui/separator"
import { anonymousIdAtomStorage } from '@/jotai/atoms'
import { apiInstanceExpress } from '@/services/apiInstance'

const TabsCampaign = ({ campaignData }) => {
    const { userData } = useAuth();
    const [donorMessages, setDonorMessages] = useState([]);
    const [anonymousIdStorage, setAnonymousIdStorage] = useAtom(anonymousIdAtomStorage);

    const [currentPage, setCurrentPage] = useState({ donations: 1, prayers: 1 });
    
    const ITEMS_PER_PAGE = {
        donations: 6,
        prayers: 4
    };

    useEffect(() => {
        if (campaignData?.donors?.length) {
            const messages = campaignData.donors.filter(donor => donor.message && donor.message.trim() !== "");
            
            const sortedMessages = [...messages].sort((a, b) => 
                new Date(b.donatedAt) - new Date(a.donatedAt)
            );
            
            setDonorMessages(sortedMessages);
        }
    }, [campaignData]);

    useEffect(() => {
        if (campaignData?.donors?.length) {
            campaignData.donors = [...campaignData.donors].sort((a, b) => 
                new Date(b.donatedAt) - new Date(a.donatedAt)
            );
        }
    }, [campaignData]);

    const paginateItems = (items, page, itemsPerPage) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items?.slice(startIndex, endIndex) || [];
    };

    const handlePray = async (donorId) => {
        const campaignId = campaignData._id;

        let finalAnonymousId = anonymousIdStorage;
        if (!finalAnonymousId) {
            finalAnonymousId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setAnonymousIdStorage(finalAnonymousId);
        }

        try {
            const response = await apiInstanceExpress.post("amen/create", {
                campaignId,
                donorId,
                ...(userData ? { userId: userData._id } : { anonymousId: finalAnonymousId })
            });

            if (response.status === 200) {
                const { amen } = response.data.data;

                const updatedDonors = campaignData.donors.map(donor => {
                    if (donor._id === donorId) {
                        const currentUserAmenIndex = donor.amens?.findIndex(amen => 
                            (userData && amen.userId === userData._id) || 
                            (!userData && amen.anonymousId === finalAnonymousId)
                        );

                        const updatedDonor = { ...donor };

                        if (amen) {
                            if (currentUserAmenIndex === -1) {
                                updatedDonor.amens = [
                                    ...(updatedDonor.amens || []), 
                                    userData ? { userId: userData._id } : { anonymousId: finalAnonymousId }
                                ];
                            }
                        } else {
                            if (currentUserAmenIndex !== -1) {
                                updatedDonor.amens = updatedDonor.amens.filter((_, index) => 
                                    index !== currentUserAmenIndex
                                );
                            }
                        }

                        return updatedDonor;
                    }
                    return donor;
                });

                campaignData.donors = updatedDonors;

                if (donorMessages.length > 0) {
                    setDonorMessages(prevMessages => 
                        prevMessages.map(message => 
                            message._id === donorId 
                                ? { 
                                    ...message, 
                                    amens: campaignData.donors.find(d => d._id === donorId)?.amens || [] 
                                } 
                                : message
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Error giving amen:", error);
        }
    };

    const changeDonationsPage = (newPage) => {
        if (newPage < 1 || newPage > getTotalPages(campaignData?.donors?.length, ITEMS_PER_PAGE.donations)) return;
        
        setCurrentPage(prev => ({ ...prev, donations: newPage }));
    };

    const changePrayersPage = (newPage) => {
        if (newPage < 1 || newPage > getTotalPages(donorMessages?.length, ITEMS_PER_PAGE.prayers)) return;
        
        setCurrentPage(prev => ({ ...prev, prayers: newPage }));
    };

    const getTotalPages = (totalItems, itemsPerPage) => {
        return Math.ceil(totalItems / itemsPerPage) || 1;
    };

    const renderEmptyDonations = () => (
        <Card className="w-full py-12">
            <CardContent className="flex flex-col items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">Belum Ada Donasi</h3>
                    <p className="text-gray-600 mt-2">Jadilah yang pertama berdonasi untuk kampanye ini</p>
                </div>
            </CardContent>
        </Card>
    );

    const renderEmptyPrayers = () => (
        <Card className="w-full py-12">
            <CardContent className="flex flex-col items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">Belum Ada Doa</h3>
                    <p className="text-gray-600 mt-2">Jadilah yang pertama memberikan doa untuk kampanye ini</p>
                </div>
            </CardContent>
        </Card>
    );

    const renderPagination = (currentPage, totalItems, itemsPerPage, changePage) => {
        const totalPages = getTotalPages(totalItems, itemsPerPage);
        
        if (totalPages <= 1) return null;
        
        const getPageNumbers = () => {
            const pageNumbers = [];
            
            if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                
                if (currentPage <= 3) {
                    pageNumbers.push(2, 3, 4);
                    pageNumbers.push('ellipsis');
                } else if (currentPage >= totalPages - 2) {
                    pageNumbers.push('ellipsis');
                    pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1);
                } else {
                    pageNumbers.push('ellipsis');
                    pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
                    pageNumbers.push('ellipsis');
                }
                
                pageNumbers.push(totalPages);
            }
            
            return pageNumbers;
        };
        
        return (
            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            className="cursor-pointer"
                            onClick={() => changePage(currentPage - 1)}
                            tabIndex={currentPage === 1 ? -1 : 0}
                            aria-disabled={currentPage === 1}
                            style={{
                                opacity: currentPage === 1 ? 0.5 : 1,
                                pointerEvents: currentPage === 1 ? 'none' : 'auto'
                            }}
                            aria-label="Go to previous page"
                        ></PaginationPrevious>
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                        page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink 
                                    className="cursor-pointer"
                                    isActive={page === currentPage}
                                    onClick={() => changePage(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}
                    
                    <PaginationItem>
                        <PaginationNext 
                            className="cursor-pointer"
                            onClick={() => changePage(currentPage + 1)}
                            tabIndex={currentPage === totalPages ? -1 : 0}
                            aria-disabled={currentPage === totalPages}
                            style={{
                                opacity: currentPage === totalPages ? 0.5 : 1,
                                pointerEvents: currentPage === totalPages ? 'none' : 'auto'
                            }}
                            aria-label="Go to next page"
                        ></PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    };

    const paginatedDonations = paginateItems(campaignData?.donors, currentPage.donations, ITEMS_PER_PAGE.donations);
    const paginatedPrayers = paginateItems(donorMessages, currentPage.prayers, ITEMS_PER_PAGE.prayers);

    return (
        <Tabs defaultValue="campaign-donation" className="w-full mt-0 sm:mt-14">
            <TabsList className="gap-4 w-full sm:w-fit">
                <TabsTrigger value="campaign-donation">
                    Donasi <span className="text-blue-500">{campaignData?.donors?.length || 0}</span>
                </TabsTrigger>
                <TabsTrigger value="campaign-pray">
                    Doa Orang Baik <span className="text-blue-500">{donorMessages?.length || 0}</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="campaign-donation" className="mt-4">
                {campaignData?.donors?.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <EachUtils
                                of={paginatedDonations}
                                render={(item, index) => (
                                    <Card key={item.id || index}>
                                        <CardContent className="flex items-center gap-x-4 py-4">
                                            <Avatar className="w-14 h-14">
                                                {(item.userId && item.name !== "Orang baik" )&& (
                                                    <AvatarImage src={getProfilePicture(item.userId)}/>
                                                )}
                                                <AvatarFallback>{getInitial(item.name)}</AvatarFallback>
                                            </Avatar>

                                            <div className="text-sm/6">
                                                <p className="font-semibold text-gray-900">
                                                    {item.name || "Anonim"}
                                                </p>
                                                <p className="text-gray-600">
                                                    Berdonasi sebesar <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                                                </p>
                                                <p className="text-xs/6 text-gray-600">{getRelativeTime(item.donatedAt)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            />
                        </div>
                        
                        {renderPagination(
                            currentPage.donations, 
                            campaignData?.donors?.length, 
                            ITEMS_PER_PAGE.donations, 
                            changeDonationsPage
                        )}
                    </>
                ) : renderEmptyDonations()}
            </TabsContent>

            <TabsContent value="campaign-pray" className="mt-4">
                {donorMessages.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <EachUtils
                                of={paginatedPrayers}
                                render={(item, index) => (
                                    <Card key={item.id || index} className="gap-2 pb-0">
                                        <CardHeader>
                                            <div className="flex items-center gap-x-4">
                                                <Avatar className="w-14 h-14">
                                                    {item.userId && (
                                                        <AvatarImage src={getProfilePicture(item.userId)}/>
                                                    )}
                                                    <AvatarFallback>{getInitial(item.name)}</AvatarFallback>
                                                </Avatar>

                                                <div className="text-sm/6">
                                                    <p className="font-semibold text-gray-900">
                                                        {item.name || "Anonim"}
                                                    </p>
                                                    <p className="text-gray-600">{getRelativeTime(item.donatedAt)}</p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="flex flex-col">
                                                <p className="text-gray-600">{item.message}</p>
                                                <p className="text-sm/6 mt-5 text-gray-600">
                                                    <span className="text-gray-900 font-semibold">{(item.amens || []).length} Orang</span> mengaminkan doa ini
                                                </p>
                                            </div>
                                        </CardContent>

                                        <Separator className="mt-2"/>

                                        <CardFooter className="mb-3 mt-1">
                                            <Button 
                                                variant="ghost"
                                                className="mx-auto flex items-center gap-2 cursor-pointer"
                                                onClick={() => handlePray(item._id)}
                                            >
                                                <Heart
                                                    className={`${
                                                        item.amens?.some(amen => 
                                                            (userData && amen.userId === userData._id) || 
                                                            (!userData && amen.anonymousId === anonymousIdStorage)
                                                        ) 
                                                        ? "text-red-400 fill-red-400" 
                                                        : ""
                                                    }`} 
                                                />
                                                <span>Amin</span>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}
                            />
                        </div>
                        
                        {renderPagination(
                            currentPage.prayers, 
                            donorMessages?.length, 
                            ITEMS_PER_PAGE.prayers, 
                            changePrayersPage
                        )}
                    </>
                ) : renderEmptyPrayers()}
            </TabsContent>
        </Tabs>
    )
}

export default TabsCampaign