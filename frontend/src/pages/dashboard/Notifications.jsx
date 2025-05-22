import { toast } from 'sonner'
import { useAtom } from 'jotai'
import React, { useState, useEffect } from 'react'

import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    MoreHorizontal,
    Eye,
    Trash2,
    Bell,
    BellOff,
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

import { formatDate } from '@/lib/utils'
import EachUtils from '@/utils/EachUtils'
import { allNotificationsAtom } from '@/jotai/atoms'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import { apiInstanceExpress } from '@/services/apiInstance'
import DashboardLayout from '@/components/layouts/DashboardLayout'

const Notifications = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useAtom(allNotificationsAtom);
    
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter notifications based on type, status and search query
    const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notification => {
        // Filter based on type
        if (filterType !== 'all' && notification.type !== filterType) return false;
        
        // Filter based on status
        if (filterStatus !== 'all') {
            if (filterStatus === 'read' && !notification.isRead) return false;
            if (filterStatus === 'unread' && notification.isRead) return false;
        }
        
        // Filter based on search query
        if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        return true;
    }) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [notifications, filterType, filterStatus, searchQuery]);

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

    const handleMarkAsRead = async (notification) => {
        if (notification.isRead) return;
        
        const toastId = toast.loading("Menandai sebagai dibaca...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.put(`admin/notifications/${notification._id}/read`, {}, {
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

    const handleDeleteNotification = async () => {
        if (!selectedNotification) return;
        setIsLoading(true);
        const toastId = toast.loading("Menghapus notifikasi...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`admin/notifications/${selectedNotification._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 204) {
                toast.success("Berhasil menghapus notifikasi", { id: toastId });
                if (Array.isArray(notifications)) {
                    const updatedNotifications = notifications.filter(notif => notif._id !== selectedNotification._id);
                    setNotifications(updatedNotifications);
                };
            };
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("Gagal menghapus notifikasi", { id: toastId });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setSelectedNotification(null);
        }
    };

    // Open detail dialog
    const openDetailDialog = (notification) => {
        setSelectedNotification(notification);
        setDetailDialogOpen(true);
        // Mark as read when opening detail
        if (!notification.isRead) {
            handleMarkAsRead(notification);
        }
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (notification) => {
        setSelectedNotification(notification);
        setDeleteDialogOpen(true);
    };

    // Get type icon
    const getTypeIcon = (type) => {
        switch(type) {
            case 'campaign':
                return <NotepadText size={16} className="text-blue-600" />;
            case 'article':
                return <FileText size={16} className="text-green-600" />;
            case 'like':
                return <Heart size={16} className="text-red-600" />;
            case 'comment':
                return <MessageCircle size={16} className="text-yellow-600" />;
            case 'system':
                return <Settings size={16} className="text-gray-600" />;
            default:
                return <Bell size={16} className="text-gray-600" />;
        }
    };

    // Get type badge
    const getTypeBadge = (type) => {
        switch(type) {
            case 'campaign':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Campaign</Badge>;
            case 'article':
                return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Article</Badge>;
            case 'like':
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Like</Badge>;
            case 'comment':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Comment</Badge>;
            case 'system':
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">System</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">{type}</Badge>;
        }
    };

    // Handler for filter type change
    const handleFilterTypeChange = (value) => {
        setFilterType(value);
    };

    // Handler for filter status change
    const handleFilterStatusChange = (value) => {
        setFilterStatus(value);
    };

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Get unread count
    const unreadCount = Array.isArray(notifications) ? notifications.filter(notif => !notif.isRead).length : 0;

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Notifikasi</h1>
                        <p className="text-muted-foreground">
                            {unreadCount > 0 && `${unreadCount} notifikasi belum dibaca`}
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari notifikasi berdasarkan judul atau pesan..." 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="unread">Belum Dibaca</SelectItem>
                                <SelectItem value="read">Sudah Dibaca</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterType} onValueChange={handleFilterTypeChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="campaign">Campaign</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="like">Like</SelectItem>
                                <SelectItem value="comment">Comment</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-2">
                    {currentNotifications.length > 0 ? (
                        <EachUtils 
                            of={currentNotifications}
                            render={(item, index) => (
                                <div 
                                    key={index}
                                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !item.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                    }`}
                                    onClick={() => openDetailDialog(item)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-medium truncate ${!item.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        {item.title}
                                                    </h3>
                                                    {!item.isRead && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {getTypeBadge(item.type)}
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem 
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDetailDialog(item);
                                                    }}
                                                >
                                                    <Eye size={14} />
                                                    <span>Lihat Detail</span>
                                                </DropdownMenuItem>
                                                {!item.isRead && (
                                                    <DropdownMenuItem 
                                                        className="flex items-center gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(item);
                                                        }}
                                                    >
                                                        <BellOff size={14} />
                                                        <span>Tandai Dibaca</span>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem 
                                                    className="flex items-center gap-2 text-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDialog(item);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )}
                        />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Tidak ada notifikasi ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
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
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedNotification && getTypeIcon(selectedNotification.type)}
                            Detail Notifikasi
                        </DialogTitle>
                        <DialogDescription>
                            Informasi lengkap tentang notifikasi ini.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedNotification && (
                        <div className="py-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Judul</label>
                                <p className="text-sm mt-1 font-medium">{selectedNotification.title}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Pesan</label>
                                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md border">{selectedNotification.message}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipe</label>
                                    <div className="mt-1">{getTypeBadge(selectedNotification.type)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">
                                        <Badge variant={selectedNotification.isRead ? "secondary" : "default"}>
                                            {selectedNotification.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                                    <p className="text-sm mt-1">{formatDate(selectedNotification.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Notification Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Notifikasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus notifikasi "{selectedNotification?.title}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteNotification}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}

export default Notifications