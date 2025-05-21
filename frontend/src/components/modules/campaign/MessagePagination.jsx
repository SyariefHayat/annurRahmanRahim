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

import { messagePageAtom, messagePaginationAtom } from '@/jotai/atoms';

export const MessagePagination = () => {
    const [messagePagination] = useAtom(messagePaginationAtom);
    const [messagePage, setMessagePage] = useAtom(messagePageAtom);
    
    if (messagePagination.totalPages <= 1) return null;
    
    const handlePageChange = (page) => {
        setMessagePage(page);
    };
    
    const getPageNumbers = () => {
        const totalPages = messagePagination.totalPages;
        const currentPage = messagePage;
        
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
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
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
                        onClick={() => handlePageChange(Math.max(messagePage - 1, 1))}
                        className={messagePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                                isActive={pageNum === messagePage}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handlePageChange(Math.min(messagePage + 1, messagePagination.totalPages))}
                        className={messagePage === messagePagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};