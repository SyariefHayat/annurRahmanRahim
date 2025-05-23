import { useAtom } from 'jotai';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react'

import { 
    Search, 
    MoreHorizontal, 
    MessageSquare,  
    ChevronLeft, 
    ChevronRight, 
    Eye, 
    Trash2 
} from 'lucide-react'

import { 
    Table, 
    TableHeader, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell 
} from "@/components/ui/table";

import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/ui/select";

import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";

import { 
    Dialog, 
    DialogContent, 
    DialogHeader,
    DialogTitle, 
    DialogDescription, 
} from "@/components/ui/dialog";

import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/ui/avatar";

import { formatDate, getProfilePicture } from '@/lib/utils';
import EachUtils from '@/utils/EachUtils';
import { getTime } from '@/utils/formatDate';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allArticlesAtom } from '@/jotai/atoms';
import { useAuth } from '@/context/AuthContext';
import { apiInstanceExpress } from '@/services/apiInstance';
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { getInitial } from '@/utils/getInitial';

const Comments = () => {
    const { currentUser } = useAuth();
    const [articles] = useAtom(allArticlesAtom);
    const [comments, setComments] = useState([]);

    const [itemsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedComment, setSelectedComment] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);

    useEffect(() => {
        const allComments = articles.flatMap(article => 
            (article.comments || []).map(comment => ({
                ...comment,
                articleTitle: article.title || "Untitled Article"
            }))
        );
        setComments(allComments);
    }, [articles]);

    // Filter comments based on search query, article filter, and status
    const filteredComments = comments.filter(comment => {
        const matchesSearch = comment.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            comment.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            comment.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());
                            
        return matchesSearch;
    });

    // Sort comments based on date
    const sortedComments = [...filteredComments].sort((a, b) => {
        const dateA = new Date(a.commentAt);
        const dateB = new Date(b.commentAt);
        
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Pagination calculations
    const totalPages = Math.ceil(sortedComments.length / itemsPerPage);
    const currentComments = sortedComments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle sort order change
    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        setCurrentPage(1);
    };

    // Open comment detail dialog
    const openCommentDialog = (comment) => {
        setSelectedComment(comment);
        setCommentDialogOpen(true);
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (comment) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    // Handle delete comment
    const handleDeleteComment = async () => {
        if (!commentToDelete) return;
        const toastId = toast.loading("Menghapus komentar...");

        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`comment/delete/${commentToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success("Komentar berhasil di hapus!", { id: toastId });
                setComments(comments.filter(comment => comment._id !== commentToDelete._id));
            };
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus komentar", { id: toastId });
        } finally {
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
        };
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex gap-4 justify-between">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari komentar atau pengguna" 
                            className="pl-9 md:w-1/2" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Komentar" />
                            </SelectTrigger>
                            <SelectContent>
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
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Artikel</TableHead>
                                <TableHead>Komentar</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {currentComments.length > 0 ? (
                            <EachUtils 
                                of={currentComments}
                                render={(item, index) => (
                                    <TableRow key={index} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage 
                                                        src={getProfilePicture(item.user)}
                                                        referrerPolicy="no-referrer"
                                                        className="object-cover"
                                                    />
                                                        <AvatarFallback className="bg-gray-200">{getInitial(item.user.username)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{item.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                            <span title={item.articleTitle}>
                                                {articles[index].title}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[300px] truncate whitespace-nowrap overflow-hidden">
                                            <span title={item.text}>
                                                {item.text}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(item.commentAt)}
                                        </TableCell>
                                        <TableCell>
                                            {getTime(item.commentAt)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openCommentDialog(item)}>
                                                        <Eye size={14} className="mr-2" />
                                                        Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 focus:text-red-600" 
                                                        onClick={() => openDeleteDialog(item)}
                                                    >
                                                        <Trash2 size={14} className="mr-2" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )}
                            />
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Tidak ada komentar ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>

                    {sortedComments.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, sortedComments.length)} - {Math.min(currentPage * itemsPerPage, sortedComments.length)} dari {sortedComments.length} komentar
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

                {selectedComment && (
                    <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
                        <DialogContent className="sm:max-w-lg p-6 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Detail Komentar</DialogTitle>
                                <DialogDescription>
                                    Komentar dari artikel:{" "}
                                    <span className="font-semibold text-gray-800">{selectedComment.articleTitle}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage className="object-cover" src={selectedComment?.user?.profilePicture} />
                                        <AvatarFallback>
                                            {(selectedComment?.user?.username).slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{selectedComment.user.username}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(selectedComment.commentAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-800">
                                    {selectedComment.text}
                                </div>

                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="inline-flex items-center gap-1">
                                        <MessageSquare size={14} />
                                        {selectedComment.replies?.length || 0} balasan
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Hapus Komentar</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus komentar ini ? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700 text-white" 
                                onClick={handleDeleteComment}
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    )
}

export default Comments