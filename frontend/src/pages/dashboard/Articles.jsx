import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { 
    Pencil,
    Trash2, 
    Search, 
    MessageSquare, 
    Heart, 
    Share2, 
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Plus,
    FileText
} from 'lucide-react';

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

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { formatDate } from '@/lib/utils';
import EachUtils from '@/utils/EachUtils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { allArticlesAtom } from '@/jotai/atoms';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { apiInstanceExpress } from '@/services/apiInstance';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const Articles = () => {
    const { userData, currentUser } = useAuth();

    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const [articles, setArticles] = useAtom(allArticlesAtom);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || articles.length === 0) return;

        if (userData.role !== "developer" && userData.role !== "project manager") {
            const userArticle = articles.filter(
                article => article.createdBy._id === userData._id
            );

            setArticles(userArticle);
        }
    }, [userData, articles])

    const handleDeleteArticle = async () => {
        if (!articleToDelete) return;
        const toastId = toast.loading("Menghapus artikel...")
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`/article/delete/${articleToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 204) {
                toast.success('Artikel berhasil dihapus.', { id: toastId });

                setArticles(prevArticles => 
                    prevArticles.filter(article => article._id !== articleToDelete._id)
                );
            };
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Gagal menghapus artikel. Silakan coba lagi.', { id: toastId });
        } finally {
            setDeleteDialogOpen(false);
            setArticleToDelete(null);
        }
    };

    const filteredArticles = articles?.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    ) || [];

    const handleSortChange = (value) => {
        const [field, order] = value.split('-');
        setSortBy(field);
        setSortOrder(order);
    };

    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (sortOrder === 'asc') {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'likes') return (a.likes?.length || 0) - (b.likes?.length || 0);
            if (sortBy === 'shares') return (a.shares?.length || 0) - (b.shares?.length || 0);
            if (sortBy === 'comments') return (a.comments?.length || 0) - (b.comments?.length || 0);
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            if (sortBy === 'title') return b.title.localeCompare(a.title);
            if (sortBy === 'likes') return (b.likes?.length || 0) - (a.likes?.length || 0);
            if (sortBy === 'shares') return (b.shares?.length || 0) - (a.shares?.length || 0);
            if (sortBy === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0);
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = sortedArticles.slice(indexOfFirstItem, indexOfLastItem);

    const openDeleteDialog = (article) => {
        setArticleToDelete(article);
        setDeleteDialogOpen(true);
    };

    return (
        <DashboardLayout>
            <Toaster />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari artikel..." 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 justify-between">
                        <Button onClick={() => navigate(`/dashboard/article/create/${userData._id}`)} className="h-8.5 flex items-center gap-2 cursor-pointer">
                            <Plus size={16} />
                            <span>Artikel Baru</span>
                        </Button>

                        <Select 
                            defaultValue="createdAt-desc" 
                            onValueChange={handleSortChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Urut berdasarkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                                <SelectItem value="createdAt-asc">Terlama</SelectItem>
                                <SelectItem value="likes-desc">Like Terbanyak</SelectItem>
                                <SelectItem value="shares-desc">Share Terbanyak</SelectItem>
                                <SelectItem value="comments-desc">Komentar Terbanyak</SelectItem>
                                <SelectItem value="title-asc">Judul (A-Z)</SelectItem>
                                <SelectItem value="title-desc">Judul (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Like</TableHead>
                                <TableHead>Share</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentArticles.length > 0 ? (
                                <EachUtils 
                                    of={currentArticles}
                                    render={(item, index) => (
                                        <TableRow key={item._id || index}>
                                            <TableCell className="font-medium max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                                {item.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.tags?.map((tag, idx) => (
                                                        <Badge key={idx} variant="outline">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(item.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Heart size={14} className="mr-1 text-red-500" />
                                                    {item.likes?.length || 0}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Share2 size={14} className="mr-1 text-green-500" />
                                                    {item.shares?.length || 0}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <MessageSquare size={14} className="mr-1 text-blue-500" />
                                                    {item.comments?.length || 0}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-gray-100">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                            onClick={() => navigate(`/article/${item._id}`)}
                                                        >
                                                            <FileText size={14} />
                                                            <span>Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem  
                                                            className="flex items-center gap-2 hover:bg-blue-100 cursor-pointer text-blue-600" 
                                                            onClick={() => navigate(`/dashboard/article/edit/${item._id}`)} 
                                                        >
                                                            <Pencil size={14} />
                                                                <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2 hover:bg-red-100 cursor-pointer text-red-600"
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
                                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                        Tidak ada artikel ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {filteredArticles.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredArticles.length)} - {Math.min(currentPage * itemsPerPage, filteredArticles.length)} dari {filteredArticles.length} artikel
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

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Artikel</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus artikel "{articleToDelete?.title}" ? 
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteArticle}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
};

export default Articles;