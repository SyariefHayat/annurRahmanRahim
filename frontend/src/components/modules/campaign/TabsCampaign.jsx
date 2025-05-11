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

import EachUtils from '@/utils/EachUtils'
import { Button } from "@/components/ui/button"
import { getInitial } from '@/utils/getInitial'
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from '@/lib/utils'
import { getRelativeTime } from '@/utils/formatDate'
// import { LoadingSpinner } from '@/components/ui/loading-spinner'

const TabsCampaign = ({ campaignData }) => {
    const [donorMessages, setDonorMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState({ donations: 1, prayers: 1 });
    const [loading, setLoading] = useState({ donations: false, prayers: false });
    const [prayLoading, setPrayLoading] = useState({});
    console.log(campaignData)
    
    // Mengubah jumlah item per halaman sesuai permintaan
    const ITEMS_PER_PAGE = {
        donations: 6,
        prayers: 4
    };

    useEffect(() => {
        if (campaignData?.donors?.length) {
            // Filter donors yang memiliki pesan
            const messages = campaignData.donors.filter(donor => donor.message && donor.message.trim() !== "");
            
            // Urutkan semua donor dari yang terbaru (berdasarkan donatedAt)
            const sortedMessages = [...messages].sort((a, b) => 
                new Date(b.donatedAt) - new Date(a.donatedAt)
            );
            
            setDonorMessages(sortedMessages);
        }
    }, [campaignData]);

    useEffect(() => {
        if (campaignData?.donors?.length) {
            // Urutkan semua donor dari yang terbaru
            campaignData.donors = [...campaignData.donors].sort((a, b) => 
                new Date(b.donatedAt) - new Date(a.donatedAt)
            );
        }
    }, [campaignData]);

    // Membuat pagination untuk data
    const paginateItems = (items, page, itemsPerPage) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items?.slice(startIndex, endIndex) || [];
    };

    // Handler untuk Amin button dengan request ke API
    const handlePray = async (donorId) => {
        try {
            setPrayLoading(prev => ({ ...prev, [donorId]: true }));
            
            // Simulasi API request
            // Dalam implementasi nyata, ganti dengan API call ke backend
            // const response = await fetch('/api/prayers/amin', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ donorId })
            // });
            // const data = await response.json();
            
            // Contoh simulasi delay API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update data donatur lokal setelah respon API
            // Di sini Anda perlu mengupdate data dari response API yang sebenarnya
            setDonorMessages(prev => 
                prev.map(message => {
                    if (message.id === donorId) {
                        // Logika toggle amin
                        const userHasPrayed = message.amens?.some(amen => amen.userId === 'current-user');
                        
                        if (userHasPrayed) {
                            // Hapus amin dari user
                            return {
                                ...message,
                                amens: message.amens.filter(amen => amen.userId !== 'current-user')
                            };
                        } else {
                            // Tambah amin dari user
                            return {
                                ...message,
                                amens: [...(message.amens || []), { userId: 'current-user', timestamp: new Date() }]
                            };
                        }
                    }
                    return message;
                })
            );
            
            setPrayLoading(prev => ({ ...prev, [donorId]: false }));
        } catch (error) {
            console.error("Error toggling prayer:", error);
            setPrayLoading(prev => ({ ...prev, [donorId]: false }));
        }
    };

    // Page change handler untuk donasi
    const changeDonationsPage = (newPage) => {
        if (newPage < 1 || newPage > getTotalPages(campaignData?.donors?.length, ITEMS_PER_PAGE.donations)) return;
        
        setLoading(prev => ({ ...prev, donations: true }));
        
        // Simulasi pemanggilan API
        setTimeout(() => {
            setCurrentPage(prev => ({ ...prev, donations: newPage }));
            setLoading(prev => ({ ...prev, donations: false }));
        }, 300);
    };

    // Page change handler untuk doa
    const changePrayersPage = (newPage) => {
        if (newPage < 1 || newPage > getTotalPages(donorMessages?.length, ITEMS_PER_PAGE.prayers)) return;
        
        setLoading(prev => ({ ...prev, prayers: true }));
        
        // Simulasi pemanggilan API
        setTimeout(() => {
            setCurrentPage(prev => ({ ...prev, prayers: newPage }));
            setLoading(prev => ({ ...prev, prayers: false }));
        }, 300);
    };

    // Fungsi untuk menghitung total halaman
    const getTotalPages = (totalItems, itemsPerPage) => {
        return Math.ceil(totalItems / itemsPerPage) || 1;
    };

    // Render empty state untuk donasi
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

    // Render empty state untuk doa
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

    // Render pagination controls
    const renderPagination = (currentPage, totalItems, itemsPerPage, changePage) => {
        const totalPages = getTotalPages(totalItems, itemsPerPage);
        
        if (totalPages <= 1) return null;
        
        // Fungsi untuk menentukan halaman yang ditampilkan
        const getPageNumbers = () => {
            const pageNumbers = [];
            
            // Jika total halaman <= 5, tampilkan semua
            if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Selalu tampilkan halaman pertama
                pageNumbers.push(1);
                
                // Logika untuk menampilkan halaman di sekitar halaman aktif
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
                
                // Selalu tampilkan halaman terakhir
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

    // Paginasi data
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
                                                <AvatarImage 
                                                    src={
                                                        item.userId?.provider === "google"
                                                            ? item.userId.profilePicture
                                                            : item.userId?.profilePicture
                                                            ? item.userId.profilePicture
                                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=random`
                                                    }
                                                />
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
                                                    <AvatarImage 
                                                        src={
                                                            item.userId?.provider === "google"
                                                                ? item.userId.profilePicture
                                                                : item.userId?.profilePicture
                                                                ? item.userId.profilePicture
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=random`
                                                        }
                                                    />
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
                                                {/* Tampilkan pesan doa */}
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
                                                className="mx-auto flex items-center gap-2"
                                                onClick={() => handlePray(item.id)}
                                                disabled={prayLoading[item.id]}
                                            >
                                                {prayLoading[item.id] ? (
                                                    // <LoadingSpinner className="h-4 w-4" />
                                                    <p>Memuat...</p>
                                                ) : (
                                                    <Heart 
                                                        className={`${item.amens?.some(amen => amen.userId === 'current-user') ? "text-red-400 fill-red-400" : ""}`} 
                                                    />
                                                )}
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