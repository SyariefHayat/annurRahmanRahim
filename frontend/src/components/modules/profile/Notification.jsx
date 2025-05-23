import React from 'react';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import {
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@/components/ui/alert-dialog';

import NotificationItem from './NotificationItem';
import NotificationHeader from './NotificationHeader';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationPagination from './NotificationPagination';
import EachUtils from '@/utils/EachUtils';
import { useNotification } from '@/hooks/useNotification';

const Notifications = () => {
    const {
        // State
        activeTab,
        searchQuery,
        currentPage,
        deleteDialogOpen,
        isLoading,
        
        // Computed values
        currentNotifications,
        filteredNotifications,
        unreadCount,
        readCount,
        totalPages,
        itemsPerPage,
        notifications,
        
        // Actions
        setActiveTab,
        setSearchQuery,
        setCurrentPage,
        setDeleteDialogOpen,
        handleMarkAsRead,
        handleDeleteClick,
        handleDeleteNotification
    } = useNotification();

    return (
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4">
            <Card>
                <CardHeader className="pb-3">
                    <div>
                        <CardTitle className="text-lg sm:text-xl">
                            Notifikasi
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Kelola dan pantau semua notifikasi sistem
                        </CardDescription>
                    </div>
                </CardHeader>
                
                <div className="px-4 sm:px-6">
                    <NotificationHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        totalCount={notifications?.length || 0}
                        unreadCount={unreadCount}
                        readCount={readCount}
                    />
                </div>
                
                <CardContent className="pt-6">
                    {currentNotifications.length === 0 ? (
                        <NotificationEmptyState 
                            activeTab={activeTab}
                            searchQuery={searchQuery}
                        />
                    ) : (
                        <div className="space-y-3">
                            <EachUtils 
                                of={currentNotifications}
                                render={(notification, index) => (
                                    <NotificationItem 
                                        key={notification._id || index}
                                        notification={notification} 
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDeleteClick}
                                        index={index}
                                    />
                                )}
                            />
                        </div>
                    )}
                </CardContent>
                
                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                    <CardFooter>
                        <NotificationPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredNotifications.length}
                            onPageChange={setCurrentPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="mx-4 sm:mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Notifikasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteNotification}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Notifications;