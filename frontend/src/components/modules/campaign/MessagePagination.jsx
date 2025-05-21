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

import { messagePageAtom, messagePaginationAtom } from '@/jotai/atoms';

export const MessagePagination = () => {
    const [messagePagination] = useAtom(messagePaginationAtom);
    const [messagePage, setMessagePage] = useAtom(messagePageAtom);
    
    if (messagePagination.totalPages <= 1) return null;
    
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setMessagePage(prev => Math.max(prev - 1, 1))}
                        className={messagePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                {Array.from({ length: messagePagination.totalPages }).map((_, index) => (
                    <PaginationItem key={index} className="cursor-pointer">
                        <PaginationLink
                            isActive={index + 1 === messagePage}
                            onClick={() => setMessagePage(index + 1)}
                        >
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => setMessagePage(prev => Math.min(prev + 1, messagePagination.totalPages))}
                        className={messagePage === messagePagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};