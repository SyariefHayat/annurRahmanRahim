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
    Heart,
    FileText
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

import { formatDate } from '@/lib/utils'
import EachUtils from '@/utils/EachUtils'
import { allDonorsAtom } from '@/jotai/atoms'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import { apiInstanceExpress } from '@/services/apiInstance'
import DashboardLayout from '@/components/layouts/DashboardLayout'

const Donors = () => {
    const { currentUser } = useAuth();
    const [donors, setDonors] = useAtom(allDonorsAtom);
    
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPaymentType, setFilterPaymentType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter donors based on status, payment type and search query
    const filteredDonors = Array.isArray(donors) ? donors.filter(donor => {
        // Filter based on status
        if (filterStatus !== 'all' && donor.status !== filterStatus) return false;
        
        // Filter based on payment type
        if (filterPaymentType !== 'all' && donor.paymentType !== filterPaymentType) return false;
        
        // Filter based on search query
        if (searchQuery && !donor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !donor.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !donor.donorId.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        return true;
    }) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [donors, filterStatus, filterPaymentType, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredDonors.length / itemsPerPage));
    
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    
    const currentDonors = filteredDonors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteDonor = async () => {
        if (!selectedDonor) return;
        setIsLoading(true);
        const toastId = toast.loading("Menghapus donasi...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`admin/donor/delete/${selectedDonor.donorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 204) {
                toast.success("Berhasil menghapus donasi", { id: toastId });
                if (Array.isArray(donors)) {
                    const updatedDonors = donors.filter(donor => donor.donorId !== selectedDonor.donorId);
                    setDonors(updatedDonors);
                };
            };
        } catch (error) {
            console.error("Error deleting donor:", error);
            toast.error("Gagal menghapus donasi", { id: toastId });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setSelectedDonor(null);
        }
    };

    // Open detail dialog
    const openDetailDialog = (donor) => {
        setSelectedDonor(donor);
        setDetailDialogOpen(true);
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (donor) => {
        setSelectedDonor(donor);
        setDeleteDialogOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch(status) {
            case 'settlement':
                return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Berhasil</Badge>;
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
            case 'capture':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Ditangkap</Badge>;
            case 'deny':
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Ditolak</Badge>;
            case 'cancel':
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">Dibatalkan</Badge>;
            case 'expire':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Kadaluarsa</Badge>;
            case 'refund':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Refund</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">{status}</Badge>;
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Handler for filter status change
    const handleFilterStatusChange = (value) => {
        setFilterStatus(value);
    };

    // Handler for filter payment type change
    const handleFilterPaymentTypeChange = (value) => {
        setFilterPaymentType(value);
    };

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari donor berdasarkan nama, email, atau ID..." 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2 justify-between">
                        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="settlement">Berhasil</SelectItem>
                                <SelectItem value="capture">Ditangkap</SelectItem>
                                <SelectItem value="deny">Ditolak</SelectItem>
                                <SelectItem value="cancel">Dibatalkan</SelectItem>
                                <SelectItem value="expire">Kadaluarsa</SelectItem>
                                <SelectItem value="refund">Refund</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterPaymentType} onValueChange={handleFilterPaymentTypeChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Payment</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="gopay">GoPay</SelectItem>
                                <SelectItem value="shopeepay">ShopeePay</SelectItem>
                                <SelectItem value="qris">QRIS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Donor</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentDonors.length > 0 ? (
                                <EachUtils 
                                    of={currentDonors}
                                    render={(item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.isAnonymous ? "Anonim" : item.name}
                                            </TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>
                                                {formatCurrency(item.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.paymentType || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell>
                                                {item.date && formatDate(item.date)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="cursor-pointer" size="icon">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => openDetailDialog(item)}
                                                        >
                                                            <FileText size={14} />
                                                            <span>Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2 text-red-600"
                                                            onClick={() => openDeleteDialog(item)}
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        Tidak ada donor ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredDonors.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDonors.length)} - {Math.min(currentPage * itemsPerPage, filteredDonors.length)} dari {filteredDonors.length} donor
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

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Donasi</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap tentang donasi ini.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedDonor && (
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nama Donor</label>
                                    <p className="text-sm">{selectedDonor.isAnonymous ? "Anonim" : selectedDonor.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="text-sm">{selectedDonor.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Donor ID</label>
                                    <p className="text-sm font-mono">{selectedDonor.donorId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Jumlah</label>
                                    <p className="text-sm font-semibold">{formatCurrency(selectedDonor.amount)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
                                    <p className="text-sm capitalize">{selectedDonor.paymentType || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedDonor.status)}</div>
                                </div>
                                {selectedDonor.vaNumbers?.va_number && (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">VA Number</label>
                                            <p className="text-sm font-mono">{selectedDonor.vaNumbers.va_number}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Bank</label>
                                            <p className="text-sm uppercase">{selectedDonor.vaNumbers.bank}</p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                                    <p className="text-sm">{formatDate(selectedDonor.date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Amens</label>
                                    <p className="text-sm">{selectedDonor.amens?.length || 0} amens</p>
                                </div>
                            </div>
                            {selectedDonor.message && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Pesan</label>
                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{selectedDonor.message}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Donor Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Donasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus donasi dari "{selectedDonor?.isAnonymous ? 'Anonim' : selectedDonor?.name}" sebesar {selectedDonor && formatCurrency(selectedDonor.amount)}? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteDonor}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}

export default Donors