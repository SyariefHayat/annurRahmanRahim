import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationHeader = ({ 
    searchQuery, 
    onSearchChange, 
    activeTab, 
    onTabChange, 
    totalCount, 
    unreadCount, 
    readCount 
}) => {
    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari notifikasi..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange}>
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                        <span className="hidden sm:inline">Semua</span>
                        <span className="sm:hidden">All</span>
                        <span className="ml-1 sm:ml-1.5 text-xs bg-gray-100 text-gray-700 px-1 sm:px-1.5 py-0.5 rounded-full">
                            {totalCount}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs sm:text-sm">
                        <span className="hidden sm:inline">Belum Dibaca</span>
                        <span className="sm:hidden">Unread</span>
                        <span className="ml-1 sm:ml-1.5 text-xs bg-blue-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="read" className="text-xs sm:text-sm">
                        <span className="hidden sm:inline">Sudah Dibaca</span>
                        <span className="sm:hidden">Read</span>
                        <span className="ml-1 sm:ml-1.5 text-xs bg-gray-100 text-gray-700 px-1 sm:px-1.5 py-0.5 rounded-full">
                            {readCount}
                        </span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default NotificationHeader;