import React from 'react';
import { Search } from 'lucide-react';

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

const TableToolbar = ({ 
    searchQuery, 
    onSearchChange, 
    filterRole, 
    onFilterRoleChange 
}) => {
    return (
        <div className="flex gap-4 justify-between">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari pengguna berdasarkan username atau email..." 
                    className="pl-9 md:w-1/2" 
                    value={searchQuery}
                    onChange={onSearchChange}
                />
            </div>
            <div className="flex justify-end">
                <Select value={filterRole} onValueChange={onFilterRoleChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Role</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="product manager">Product Manager</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default TableToolbar;