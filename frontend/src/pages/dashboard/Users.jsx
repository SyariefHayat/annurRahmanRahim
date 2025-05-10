import { toast } from 'sonner'
import { useAtom } from 'jotai'
import React, { useState, useEffect } from 'react'

import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    MoreHorizontal,
    ShieldCheck,
    UserX
} from 'lucide-react'

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"

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

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import { formatDate } from '@/lib/utils'
import EachUtils from '@/utils/EachUtils'
import { allUsersAtom } from '@/jotai/atoms'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import { apiInstanceExpress } from '@/services/apiInstance'
import DashboardLayout from '@/components/layouts/DashboardLayout'

const Users = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useAtom(allUsersAtom);
    
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Filter users based on role and search query
    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        // Filter based on role
        if (filterRole !== 'all' && user.role !== filterRole) return false;
        
        // Filter based on search query
        if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        return true;
    }) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [users, filterRole, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
    
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRoleChange = async () => {
        if (!selectedUser || !selectedRole) return;
        setIsLoading(true);
        const toastId = toast.loading("Merubah role...");

        try {
            const token = await currentUser.getIdToken();
            
            const updatedUserData = {
                id: selectedUser._id,
                role: selectedRole
            };
            
            const response = await apiInstanceExpress.put("admin/update/role", updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Berhasil mengubah role", { id: toastId })
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                } else {
                    const updatedUsers = users.map(user => {
                        if (user._id === selectedUser._id) {
                            return { ...user, role: selectedRole };
                        }
                        return user;
                    });
                    setUsers(updatedUsers);
                }
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Gagal mengubah role pengguna", { id: toastId });
        } finally {
            setIsLoading(false);
            setChangeRoleDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        const toastId = toast.loading("Menghapus akun...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`admin/user/delete/${selectedUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 204) {
                toast.success("Berhasil menghapus akun", { id: toastId });
                if (Array.isArray(users)) {
                    const updatedUsers = users.filter(user => user._id !== selectedUser._id);
                    setUsers(updatedUsers);
                };
            };
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Gagal menghapus pengguna", { id: toastId });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    };

    // Open role change dialog
    const openRoleDialog = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setChangeRoleDialogOpen(true);
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    // Get role badge
    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin':
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Admin</Badge>;
            case 'author':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Author</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">User</Badge>;
        }
    };

    // Handler for filter role change
    const handleFilterRoleChange = (value) => {
        setFilterRole(value);
    };

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Toolbar */}
                <div className="flex gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari pengguna berdasarkan username atau email..." 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Select value={filterRole} onValueChange={handleFilterRoleChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Role</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="author">Author</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.length > 0 ? (
                                <EachUtils 
                                    of={currentUsers}
                                    render={(item, index) => (
                                        <TableRow key={index} >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {item.provider === "google" ? (
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage className="object-cover" src={item?.profilePicture} />
                                                                <AvatarFallback>
                                                                    {(item?.username || 'U').slice(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage className="object-cover" src={
                                                                item?.profilePicture
                                                                ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.profilePicture}`
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.username)}&background=random`
                                                            } />
                                                        </Avatar>
                                                    )}
                                                    {item.username}
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.provider}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(item.role)}
                                            </TableCell>
                                            <TableCell>
                                                {item.createdAt && formatDate(item.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => openRoleDialog(item)}
                                                        >
                                                            <ShieldCheck size={14} />
                                                            <span>Ubah Role</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2 text-red-600"
                                                            onClick={() => openDeleteDialog(item)}
                                                        >
                                                            <UserX size={14} />
                                                            <span>Hapus User</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        Tidak ada pengguna ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} pengguna
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

            {/* Change Role Dialog */}
            <Dialog open={changeRoleDialogOpen} onOpenChange={setChangeRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Role Pengguna</DialogTitle>
                        <DialogDescription>
                            Pilih role baru untuk pengguna {selectedUser?.username}.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="author">Author</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setChangeRoleDialogOpen(false)} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button onClick={handleRoleChange} disabled={isLoading}>
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna "{selectedUser?.username}" ? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}

export default Users