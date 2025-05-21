import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const CommentSorter = () => {
    return (
        <Select defaultValue="recommended">
            <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200 bg-slate-50 rounded-full">
                <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem value="recommended" className="text-xs">Disarankan</SelectItem>
                <SelectItem value="newest" className="text-xs">Terbaru</SelectItem>
                <SelectItem value="oldest" className="text-xs">Terlama</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default CommentSorter