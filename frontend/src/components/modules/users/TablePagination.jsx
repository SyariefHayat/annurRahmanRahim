import React from 'react';

import { 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

import { Button } from "@/components/ui/button";

const UserTablePagination = ({ 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    onPageChange 
}) => {
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
                Menampilkan {startItem} - {endItem} dari {totalItems} pengguna
            </div>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={16} />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default UserTablePagination;