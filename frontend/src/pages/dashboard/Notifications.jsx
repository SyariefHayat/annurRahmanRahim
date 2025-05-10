import React, { useState, useMemo } from 'react';

import { 
    Plus, 
    AlertTriangle, 
    MessageSquare, 
    Heart, 
    Gift, 
    Info,
    MoreHorizontal, 
    Search, 
    ChevronLeft, 
    ChevronRight
} from 'lucide-react';

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';

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

import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layouts/DashboardLayout'

const Notifications = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("newest");
    const [typeFilter, setTypeFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const itemsPerPage = 5;
    
    // Dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const notifications = [
        {
            id: 1,
            title: "Update System",
            message: "Sistem akan mengalami pemeliharaan pada tanggal 12 Mei 2025",
            type: "system",
            priority: "high",
            target: "all",
            status: "active",
            createdAt: "2025-05-08T12:00:00",
            createdBy: "Admin",
        },
        {
            id: 2,
            title: "Donasi baru diterima",
            message: "Donasi sebesar Rp. 1.000.000 telah diterima dari Ahmad",
            type: "donation",
            priority: "medium",
            target: "admins",
            status: "active",
            createdAt: "2025-05-07T15:30:00",
            createdBy: "System",
        },
        {
            id: 3,
            title: "Promosi Artikel Unggulan",
            message: "Kami telah memilih artikel unggulan minggu ini",
            type: "announcement",
            priority: "medium",
            target: "authors",
            status: "active", // sebelumnya scheduled
            createdAt: "2025-05-06T09:15:00",
            createdBy: "Marketing",
        },
        {
            id: 4,
            title: "Peringatan Keamanan",
            message: "Harap perbarui kata sandi Anda untuk keamanan yang lebih baik",
            type: "alert",
            priority: "urgent",
            target: "all",
            status: "active",
            createdAt: "2025-05-05T17:45:00",
            createdBy: "Security",
        },
        {
            id: 5,
            title: "Komentar pada artikel Anda",
            message: "Artikel 'Cara Membantu Sesama' mendapat komentar baru",
            type: "comment",
            priority: "low",
            target: "specific",
            status: "archived",
            createdAt: "2025-05-04T11:20:00",
            createdBy: "System",
        },
    ];

    // Filter and sort notifications
    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(notification => {
                // Search filter
                const matchesSearch = 
                    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    notification.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

                // Type filter
                const matchesType = typeFilter === "all" || notification.type === typeFilter;

                // Priority filter
                const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;

                // Status filter
                const matchesStatus = statusFilter === "all" || notification.status === statusFilter;

                return matchesSearch && matchesType && matchesPriority && matchesStatus;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                
                return sortOrder === "newest" 
                    ? dateB - dateA 
                    : dateA - dateB;
            });
    }, [notifications, searchQuery, typeFilter, priorityFilter, statusFilter, sortOrder]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleDeleteConfirm = () => {
        // Logic to delete notification would go here
        console.log("Deleting notification:", selectedNotification?.id);
        setIsDeleteDialogOpen(false);
        // You would typically update your state or call an API here
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex gap-4 justify-between flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari notifikasi" 
                            className="pl-9 w-full md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button className="h-10">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Notifikasi
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Prioritas</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedNotifications.length > 0 ? (
                                paginatedNotifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>
                                            <NotificationTypeIcon type={notification.type} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{notification.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {notification.type} • {notification.status} • {notification.priority}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {notification.type}
                                        </TableCell>
                                        <TableCell>
                                            <PriorityBadge priority={notification.priority} />
                                        </TableCell>
                                        <TableCell>
                                            <TargetBadge target={notification.target} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={notification.status} />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(notification.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem>
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Edit Notifikasi
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Arsipkan</DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600"
                                                        onClick={() => handleOpenDelete(notification)}
                                                    >
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                        Tidak ada notifikasi yang ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

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
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus notifikasi "{selectedNotification?.title}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}

const NotificationTypeIcon = ({ type }) => {
    switch (type) {
        case 'announcement':
            return <MessageSquare className="h-4 w-4 text-blue-500" />;
        case 'alert':
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'donation':
            return <Gift className="h-4 w-4 text-emerald-500" />;
        case 'like':
            return <Heart className="h-4 w-4 text-pink-500" />;
        case 'comment':
            return <MessageSquare className="h-4 w-4 text-violet-500" />;
        case 'system':
        default:
            return <Info className="h-4 w-4 text-gray-500" />;
    }
};

const PriorityBadge = ({ priority }) => {
    const colorMap = {
        low: "bg-slate-100 text-slate-800",
        medium: "bg-blue-100 text-blue-800",
        high: "bg-amber-100 text-amber-800",
        urgent: "bg-red-100 text-red-800",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[priority]}`}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const colorMap = {
        active: "bg-emerald-100 text-emerald-800",
        scheduled: "bg-purple-100 text-purple-800",
        archived: "bg-gray-100 text-gray-800",
        expired: "bg-rose-100 text-rose-800",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}>
            {status}
        </span>
    );
};

const TargetBadge = ({ target }) => {
    const colorMap = {
        all: "bg-indigo-100 text-indigo-800",
        specific: "bg-cyan-100 text-cyan-800",
        admins: "bg-violet-100 text-violet-800",
        authors: "bg-amber-100 text-amber-800",
        regular: "bg-teal-100 text-teal-800",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[target]}`}>
            {target}
        </span>
    );
};

export default Notifications