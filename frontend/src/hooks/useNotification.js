import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiInstanceExpress } from '@/services/apiInstance';

export const useNotification = () => {
    const { currentUser, userData } = useAuth();
    const [notifications, setNotifications] = useState(userData?.notifications || []);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const itemsPerPage = 10;

    // Update notifications when userData changes
    useEffect(() => {
        if (userData?.notifications) {
            setNotifications(userData.notifications);
        }
    }, [userData]);

    // Get filtered notifications based on tab and search
    const getFilteredNotifications = () => {
        if (!Array.isArray(notifications)) return [];
        
        let filtered = notifications.filter(notification => {
            if (searchQuery && 
                !notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !notification.message?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            return true;
        });

        switch(activeTab) {
            case 'unread':
                return filtered.filter(notif => !notif.isRead);
            case 'read':
                return filtered.filter(notif => notif.isRead);
            default:
                return filtered;
        }
    };

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = Array.isArray(notifications) ? notifications.filter(notif => !notif.isRead).length : 0;
    const readCount = Array.isArray(notifications) ? notifications.filter(notif => notif.isRead).length : 0;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [notifications, activeTab, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / itemsPerPage));
    
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    
    const currentNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleMarkAsRead = async (notification, index) => {
        if (notification.isRead) return;
        
        const toastId = toast.loading("Menandai sebagai dibaca...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.put(`notification/update/${index}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 200) {
                toast.success("Berhasil menandai sebagai dibaca", { id: toastId });
                const updatedNotifications = notifications.map(notif => {
                    if (notif._id === notification._id) {
                        return { ...notif, isRead: true };
                    }
                    return notif;
                });
                setNotifications(updatedNotifications);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Gagal menandai notifikasi", { id: toastId });
        }
    };

    const handleDeleteClick = (notification, index) => {
        setSelectedNotification(notification);
        setSelectedIndex(index);
        setDeleteDialogOpen(true);
    };

    const handleDeleteNotification = async () => {
        if (!selectedNotification || selectedIndex === null) return;
        
        setIsLoading(true);
        const toastId = toast.loading("Menghapus notifikasi...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`notification/delete/${selectedIndex}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 204) {
                toast.success("Berhasil menghapus notifikasi", { id: toastId });
                const updatedNotifications = notifications.filter(notif => notif._id !== selectedNotification._id);
                setNotifications(updatedNotifications);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("Gagal menghapus notifikasi", { id: toastId });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setSelectedNotification(null);
            setSelectedIndex(null);
        }
    };

    return {
        // State
        notifications,
        activeTab,
        searchQuery,
        currentPage,
        deleteDialogOpen,
        selectedNotification,
        isLoading,
        
        // Computed values
        filteredNotifications,
        currentNotifications,
        unreadCount,
        readCount,
        totalPages,
        itemsPerPage,
        
        // Actions
        setActiveTab,
        setSearchQuery,
        setCurrentPage,
        setDeleteDialogOpen,
        handleMarkAsRead,
        handleDeleteClick,
        handleDeleteNotification
    };
};