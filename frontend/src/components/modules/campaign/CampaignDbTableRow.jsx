import React from 'react'

import { 
    FileText, 
    MoreHorizontal, 
    Pencil, 
    Trash2 
} from 'lucide-react'

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDaysRemaining } from '@/utils/formatDate'
import { TableCell, TableRow } from '@/components/ui/table'

const getStatusColor = (status) => {
    switch (status) {
        case 'Ongoing':
            return 'text-green-600 bg-green-50';
        case 'completed':
            return 'text-gray-600 bg-gray-100';
        case 'ditutup':
            return 'text-red-600 bg-red-50';
        default:
            return 'text-yellow-600 bg-yellow-50';
    }
};

const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case 'pendidikan':
            return 'bg-blue-50 text-blue-700';
        case 'kesehatan':
            return 'bg-pink-50 text-pink-700';
        case 'bencana':
            return 'bg-red-50 text-red-700';
        default:
            return 'bg-gray-50 text-gray-700';
    }
};

const CampaignDbTableRow = ({ 
    campaign, 
    onViewDetail, 
    onEdit, 
    onDelete 
}) => {
    return (
        <TableRow>
            <TableCell className="font-medium">
                {campaign.createdBy?.email}
            </TableCell>
            <TableCell className="max-w-[150px] truncate whitespace-nowrap overflow-hidden">
                {campaign.title}
            </TableCell>
            <TableCell>
                <Badge variant="outline" className={`capitalize ${getCategoryColor(campaign.category)}`}>
                    {campaign.category}
                </Badge>
            </TableCell>
            <TableCell className="text-blue-700">
                {formatCurrency(campaign.targetAmount)}
            </TableCell>
            <TableCell className="text-green-700">
                {formatCurrency(campaign.collectedAmount)}
            </TableCell>
            <TableCell>
                {campaign.donorCount}
            </TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                </span>
            </TableCell>
            <TableCell>
                {getDaysRemaining(campaign.deadline)}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-gray-100">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onViewDetail(campaign)}
                        >
                            <FileText size={14} />
                            <span>Detail</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onEdit(campaign)}
                        >
                            <Pencil size={14} />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => onDelete(campaign)}
                        >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default CampaignDbTableRow