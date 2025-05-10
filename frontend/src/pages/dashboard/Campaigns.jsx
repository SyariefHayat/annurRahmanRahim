import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { 
    ChevronLeft, 
    ChevronRight, 
    FileText, 
    MoreHorizontal, 
    Pencil, 
    Plus, 
    Search, 
    Trash2 
} from 'lucide-react'

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

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

import EachUtils from '@/utils/EachUtils'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { allCampaignsAtom } from '@/jotai/atoms'
import { getDaysRemaining } from '@/utils/formatDate'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import DeleteCampaignDialog from '@/components/modules/dashboard/DeleteCampaignDialog'

const Campaigns = () => {
    const { userData } = useAuth();
    const [campaigns] = useAtom(allCampaignsAtom);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCampaign, setFilterCampaign] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Dialog states
    const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState([]);

    const navigate = useNavigate();

    const filteredCampaigns = campaigns
        .filter((campaign) => campaign.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (filterCampaign === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            if (filterCampaign === 'lowest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            if (filterCampaign === 'collected') {
                return b.collectedAmount - a.collectedAmount;
            }
            
            return 0; // Default case for 'all'
        });

    useEffect(() => {
        setCurrentPage(1);
    }, [campaigns, filterCampaign, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    
    const handleFilterCampaignChange = (value) => {
        setFilterCampaign(value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // Dialog handlers
    const openDeleteDialog = (campaign) => {
        setSelectedCampaign(campaign);
        setDeleteDialogOpen(true);
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Toolbar */}
                <div className="flex gap-4 items-center justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari campaign berdasarkan judul" 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Button className="h-8.5" onClick={() => navigate(`/dashboard/campaign/create/${userData._id}`)}>
                        <Plus />
                        Tambah Campaign
                    </Button>
                    <div className="flex justify-end">
                        <Select value={filterCampaign} onValueChange={handleFilterCampaignChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Campaign" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Campaign</SelectItem>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="lowest">Terlama</SelectItem>
                                <SelectItem value="collected">Terkumpul</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="bg-white rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Terkumpul</TableHead>
                                <TableHead>Donatur</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Berakhir</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                <EachUtils 
                                    of={currentItems}
                                    render={(item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.createdBy?.email}</TableCell>
                                            <TableCell className="max-w-[150px] truncate whitespace-nowrap overflow-hidden">{item.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(item.targetAmount)}
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(item.collectedAmount)}
                                            </TableCell>
                                            <TableCell>
                                                {item.donors.length}
                                            </TableCell>
                                            <TableCell>
                                                {item.status}
                                            </TableCell>
                                            <TableCell>
                                                {getDaysRemaining(item.deadline)}
                                            </TableCell>
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
                                                            onClick={() => navigate(`/campaign/${item._id}`)}
                                                        >
                                                            <FileText size={14} />
                                                            <span>Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => navigate(`/dashboard/campaign/edit/${item._id}`)}
                                                        >
                                                            <Pencil size={14} />
                                                            <span>Edit</span>
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
                                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                                        Tidak ada campaign ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredCampaigns.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCampaigns.length)} - {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} dari {filteredCampaigns.length} campaign
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
                
                <DeleteCampaignDialog 
                    selectedCampaign={selectedCampaign}
                    setSelectedCampaign={setSelectedCampaign}
                    deleteDialogOpen={DeleteDialogOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                />
            </div>
        </DashboardLayout>
    )
}

export default Campaigns