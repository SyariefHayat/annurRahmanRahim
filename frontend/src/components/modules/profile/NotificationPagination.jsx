import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotificationPagination = ({ 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    onPageChange 
}) => {
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
                <span className="hidden sm:inline">
                    Menampilkan {startItem} - {endItem} dari {totalItems} notifikasi
                </span>
                <span className="sm:hidden">
                    {startItem}-{endItem} dari {totalItems}
                </span>
            </div>
            <div className="flex gap-1 justify-center sm:justify-end">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                >
                    <ChevronLeft size={16} />
                </Button>
                
                {/* Page numbers for larger screens */}
                <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="icon"
                                onClick={() => onPageChange(pageNum)}
                                className="h-10 w-10"
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>
                
                {/* Current page indicator for mobile */}
                <div className="sm:hidden flex items-center px-3 py-2 text-sm bg-gray-100 rounded-md">
                    {currentPage} / {totalPages}
                </div>
                
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default NotificationPagination;