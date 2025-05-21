import React from 'react';
import { useAtom } from 'jotai';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

import { donorPageAtom, donorPaginationAtom } from '@/jotai/atoms';

export const DonorPagination = () => {
    const [donorPagination] = useAtom(donorPaginationAtom);
    const [donorPage, setDonorPage] = useAtom(donorPageAtom);
    
    if (donorPagination.totalPages <= 1) return null;
    
    const handlePageChange = (page) => {
        setDonorPage(page);
    };
    
    const getPageNumbers = () => {
        const totalPages = donorPagination.totalPages;
        const currentPage = donorPage;
        
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        let pages = [1, totalPages];
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(2, totalPages - 4);
        };
        
        if (startPage > 2) {
            pages.push('start-ellipsis');
        };
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        };
        
        if (endPage < totalPages - 1) {
            pages.push('end-ellipsis');
        };
        
        return [...new Set(pages)].sort((a, b) => {
            if (a === 'start-ellipsis') return -1;
            if (b === 'start-ellipsis') return 1;
            if (a === 'end-ellipsis') return 1;
            if (b === 'end-ellipsis') return -1;
            return a - b;
        });
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(donorPage - 1, 1))}
                        className={donorPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                
                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === 'start-ellipsis' || pageNum === 'end-ellipsis') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }
                    
                    return (
                        <PaginationItem key={pageNum} className="cursor-pointer">
                            <PaginationLink
                                isActive={pageNum === donorPage}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handlePageChange(Math.min(donorPage + 1, donorPagination.totalPages))}
                        className={donorPage === donorPagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};