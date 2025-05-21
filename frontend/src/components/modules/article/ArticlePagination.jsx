import React from 'react';

import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious,
    PaginationEllipsis
} from '@/components/ui/pagination';

const ArticlePagination = ({ pagination, currentPage, setCurrentPage }) => {
    if (pagination.totalPages <= 1) return null;

    // Function to determine which page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        
        // Always show first page
        pageNumbers.push(1);
        
        // Logic for adding ellipsis and surrounding pages
        if (currentPage > 3) {
            pageNumbers.push('ellipsis1');
        }
        
        // Add pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(pagination.totalPages - 1, currentPage + 1); i++) {
            if (!pageNumbers.includes(i)) {
                pageNumbers.push(i);
            }
        }
        
        // Add ellipsis before last page if needed
        if (currentPage < pagination.totalPages - 2) {
            pageNumbers.push('ellipsis2');
        }
        
        // Always show last page if there's more than one page
        if (pagination.totalPages > 1) {
            pageNumbers.push(pagination.totalPages);
        }
        
        return pageNumbers;
    };

    return (
        <div className="mb-10 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                        pageNumber === 'ellipsis1' || pageNumber === 'ellipsis2' ? (
                            <PaginationItem key={pageNumber}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={index} className="cursor-pointer">
                                <PaginationLink
                                    isActive={pageNumber === currentPage}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ArticlePagination;