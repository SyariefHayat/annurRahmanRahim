import React from 'react';
import { useAtom } from 'jotai';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { donorPageAtom, donorPaginationAtom } from '@/jotai/atoms';

export const DonorPagination = () => {
    const [donorPagination] = useAtom(donorPaginationAtom);
    const [donorPage, setDonorPage] = useAtom(donorPageAtom);
    
    if (donorPagination.totalPages <= 1) return null;
    
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setDonorPage(prev => Math.max(prev - 1, 1))}
                        className={donorPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                {Array.from({ length: donorPagination.totalPages }).map((_, index) => (
                    <PaginationItem key={index} className="cursor-pointer">
                        <PaginationLink
                            isActive={index + 1 === donorPage}
                            onClick={() => setDonorPage(index + 1)}
                        >
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => setDonorPage(prev => Math.min(prev + 1, donorPagination.totalPages))}
                        className={donorPage === donorPagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};