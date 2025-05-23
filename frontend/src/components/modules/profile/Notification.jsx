import { toast } from 'sonner'
import { useAtom } from 'jotai'
import React, { useState, useEffect } from 'react'
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    MoreVertical,
    Eye,
    Trash2,
    Bell,
    Check,
    FileText,
    Heart,
    MessageCircle,
    Settings,
    NotepadText
} from 'lucide-react'

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@/components/ui/alert-dialog'

import EachUtils from '@/utils/EachUtils'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import { apiInstanceExpress } from '@/services/apiInstance'

const NotificationItem = ({ notification, onMarkAsRead, onDelete, index }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'campaign':
                return <NotepadText className="w-5 h-5 text-blue-500" />;
            case 'article':
                return <FileText className="w-5 h-5 text-green-500" />;
            case 'like':
                return <Heart className="w-5 h-5 text-pink-500" />;
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-purple-500" />;
            case 'system':
                return <Settings className="w-5 h-5 text-orange-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTypeBadge = (type) => {
        switch(type) {
            case 'campaign':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">Campaign</Badge>;
            case 'article':
                return <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Article</Badge>;
            case 'like':
                return <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">Like</Badge>;
            case 'comment':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">Comment</Badge>;
            case 'system':
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">System</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">{type}</Badge>;
        }
    };

    return (
        <div 
            className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                                !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                                {notification.title}
                            </h4>
                            {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: id })}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getTypeBadge(notification.type)}
                            <span className="text-xs text-gray-500">
                                {format(new Date(notification.createdAt), 'd MMM yyyy, HH:mm', { locale: id })}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {!notification.isRead && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification, index);
                                    }}
                                >
                                    <Check size={12} className="mr-1" />
                                    Tandai Dibaca
                                </Button>
                            )}
                            
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 h-7 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(notification, index);
                                }}
                            >
                                <Trash2 size={12} />
                                <span>Hapus</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Notifications = () => {
    const { currentUser, userData } = useAuth();
    const [notifications, setNotifications] = useState(userData?.notifications || []);
    
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            // Filter based on search query
            if (searchQuery && 
                !notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !notification.message?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            return true;
        });

        // Filter based on active tab
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

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle>Notifikasi</CardTitle>
                            <CardDescription>
                                Kelola dan pantau semua notifikasi sistem
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <div className="px-6">
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari notifikasi..." 
                                className="pl-9" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="all" className="text-sm">
                                Semua
                                <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
                                    {notifications?.length || 0}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="text-sm">
                                Belum Dibaca
                                <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="read" className="text-sm">
                                Sudah Dibaca
                                <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
                                    {readCount}
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                <CardContent className="pt-6">
                    {currentNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Bell className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {activeTab === 'unread' 
                                    ? 'Tidak ada notifikasi yang belum dibaca' 
                                    : activeTab === 'read'
                                    ? 'Tidak ada notifikasi yang sudah dibaca'
                                    : 'Tidak ada notifikasi'
                                }
                            </h3>
                            <p className="text-gray-500 text-center mt-2 max-w-sm">
                                {activeTab === 'unread' 
                                    ? 'Semua notifikasi telah ditandai sebagai sudah dibaca.' 
                                    : activeTab === 'read'
                                    ? 'Notifikasi yang sudah dibaca akan muncul di sini.'
                                    : searchQuery 
                                    ? 'Tidak ada notifikasi yang sesuai dengan pencarian.'
                                    : 'Notifikasi sistem akan muncul di sini.'
                                }
                            </p>
                        </div>
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
                    <CardFooter className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredNotifications.length)} - {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} dari {filteredNotifications.length} notifikasi
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Notifikasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteNotification}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Notifications