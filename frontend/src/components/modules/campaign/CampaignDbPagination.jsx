import React from 'react'

import { 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const CampaignDbPagination = ({ 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems, 
    onPageChange 
}) => {
    const handlePrevious = () => {
        onPageChange(Math.max(1, currentPage - 1))
    }

    const handleNext = () => {
        onPageChange(Math.min(totalPages, currentPage + 1))
    }

    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
                Menampilkan {startItem} - {endItem} dari {totalItems} campaign
            </div>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={16} />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    )
}

export default CampaignDbPagination