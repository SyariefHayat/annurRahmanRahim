import React from 'react'
import { Plus, Search } from 'lucide-react'

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CampaignDbToolbar = ({ 
    searchQuery, 
    onSearchChange, 
    filterCampaign, 
    onFilterChange, 
    onAddCampaign 
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari campaign berdasarkan judul" 
                    className="pl-9 md:w-1/2" 
                    value={searchQuery}
                    onChange={onSearchChange}
                />
            </div>
            <div className="flex gap-2 justify-between">
                <Button 
                    className="h-8.5 flex items-center gap-2 cursor-pointer" 
                    onClick={onAddCampaign}
                >
                    <Plus size={16} />
                    Tambah Campaign
                </Button>

                <Select value={filterCampaign} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="lowest">Terlama</SelectItem>
                        <SelectItem value="collected">Terkumpul</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default CampaignDbToolbar