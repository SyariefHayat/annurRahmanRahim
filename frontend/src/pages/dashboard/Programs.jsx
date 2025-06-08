import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import React, { useState, useMemo } from 'react'

import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    FileText, 
    Pencil, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    ShieldCheck
} from 'lucide-react'

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table'

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

import { 
    formatCurrency, 
    formatDate 
} from '@/lib/utils'

import EachUtils from '@/utils/EachUtils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { allProgramsAtom } from '@/jotai/atoms'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import DeleteProgramDialog from '@/components/modules/dashboard/DeleteProgramDialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiInstanceExpress } from '@/services/apiInstance'
import { toast } from 'sonner'

const Programs = () => {
    const { userData, currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [programs, setPrograms] = useAtom(allProgramsAtom);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProgram, setSelectedProgram] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
    
    const itemsPerPage = 10;

    const handleFilterStatusChange = (value) => {
        setFilterStatus(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openDeleteDialog = (program) => {
        setSelectedProgram(program);
        setDeleteDialogOpen(true);
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Disetujui':
                return 'default';
            case 'Menunggu Persetujuan':
                return 'secondary';
            case 'Ditolak':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const openStatusDialog = (program) => {
        setSelectedProgram(program);
        setSelectedStatus(program.status);
        setChangeStatusDialogOpen(true);
    };

    const handleStatusChange = async () => {
        if (!selectedProgram || !selectedStatus) return;
        setLoading(true);
        const toastId = toast.loading("Memperbarui status program...");

        try {
            const token = await currentUser.getIdToken();

            const updatedProgramData = {
                programId: selectedProgram._id,
                status: selectedStatus
            };

            const response = await apiInstanceExpress.post("program/update/status", updatedProgramData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Berhasil mengubah status", { id: toastId });
                
                // Update local state dengan status baru
                const updatedPrograms = programs.map(program => {
                    if (program._id === selectedProgram._id) {
                        return { ...program, status: selectedStatus }; // Perbaikan: gunakan 'status' bukan 'role'
                    }
                    return program;
                });
                setPrograms(updatedPrograms);
                
                // Tutup dialog dan reset state
                setChangeStatusDialogOpen(false);
                setSelectedProgram(null);
                setSelectedStatus('');
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengubah status program", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = useMemo(() => {
        let filtered = programs || [];

        if (searchQuery) {
            filtered = filtered.filter(program =>
                program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.proposer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(program => {
                switch (filterStatus) {
                    case 'approved':
                        return program.status === 'Disetujui';
                    case 'pending':
                        return program.status === 'Menunggu Persetujuan';
                    case 'rejected':
                        return program.status === 'Ditolak';
                    case 'newest':
                        return true;
                    case 'oldest':
                        return true;
                    default:
                        return true;
                }
            });
        }

        if (filterStatus === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filterStatus === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return filtered;
    }, [programs, searchQuery, filterStatus]);

    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
    const currentItems = filteredPrograms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari program berdasarkan judul, proposer, atau lokasi" 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2 justify-between">
                        <Button 
                            className="h-8.5 flex items-center gap-2 cursor-pointer" 
                            onClick={() => navigate(`/dashboard/program/create/${userData._id}`)}
                        >
                            <Plus size={16} />
                            Tambah Program
                        </Button>

                        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Program" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="approved">Disetujui</SelectItem>
                                <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="oldest">Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-white rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Budget</TableHead>
                                <TableHead>Durasi</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                <EachUtils
                                    of={currentItems}
                                    render={(item, index) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {item.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(item.budget)}
                                            </TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="cursor-pointer">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => navigate(`/program/${item._id}`)}
                                                        >
                                                            <FileText size={14} />
                                                            <span>Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => navigate(`/dashboard/program/edit/${item._id}`)}
                                                        >
                                                            <Pencil size={14} />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2" 
                                                            onClick={() => openStatusDialog(item)}
                                                        >
                                                            <ShieldCheck size={14} />
                                                            <span>Ubah Status</span>
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
                                        Tidak ada program ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredPrograms.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPrograms.length)} - {Math.min(currentPage * itemsPerPage, filteredPrograms.length)} dari {filteredPrograms.length} program
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

                <Dialog open={changeStatusDialogOpen} onOpenChange={setChangeStatusDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ubah Status Program</DialogTitle>
                            <DialogDescription>
                                Pilih status baru untuk program {selectedProgram?.title}.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Menunggu Persetujuan">Menunggu Persetujuan</SelectItem>
                                    <SelectItem value="Disetujui">Disetujui</SelectItem>
                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setChangeStatusDialogOpen(false)} disabled={loading}>
                                Batal
                            </Button>
                            <Button onClick={handleStatusChange} disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                <DeleteProgramDialog
                    selectedProgram={selectedProgram}
                    setSelectedProgram={setSelectedProgram}
                    deleteDialogOpen={deleteDialogOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                />
            </div>
        </DashboardLayout>
    )
}

export default Programs