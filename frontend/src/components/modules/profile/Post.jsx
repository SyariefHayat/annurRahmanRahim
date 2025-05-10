import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { 
    Calendar, 
    ChevronRight, 
    Edit, 
    Menu, 
    MessageSquare, 
    MoreHorizontal, 
    Search, 
    Share2, 
    ThumbsUp, 
    Trash2, 
} from 'lucide-react';

import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader 
} from "@/components/ui/card";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import EachUtils from '@/utils/EachUtils';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Separator } from "@/components/ui/separator";
import { apiInstanceExpress } from '@/services/apiInstance';

const StatusBadge = ({ status }) => {
    const styles = {
        published: "bg-green-100 text-green-600 hover:bg-green-100 mt-1 sm:mt-0",
        draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
        archived: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    };

    const labels = {
        published: "Dipublikasikan",
        draft: "Draft",
        archived: "Diarsipkan",
    };

    return (
        <Badge variant="outline" className={styles[status] || styles.published}>
            {labels[status] || "Dipublikasikan"}
        </Badge>
    );
};

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Tanggal tidak valid';
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    } catch {
        return 'Tanggal tidak valid';
    }
};

const Post = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userArticle, setUserArticle] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [selectedArticleId, setSelectedArticleId] = useState(null);

    useEffect(() => {
        const getUserArticle = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await apiInstanceExpress.get("profile/get/article", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUserArticle(response.data.data);
                    setFilteredArticles(response.data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Gagal mengambil data artikel");
            } finally {
                setLoading(false);
            }
        };

        getUserArticle();
    }, [currentUser]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredArticles(userArticle);
        } else {
            const filtered = userArticle.filter(article => 
                article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (article.content?.[0]?.value && article.content[0].value.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredArticles(filtered);
        }
        // Reset visibleCount ketika hasil pencarian berubah
        setVisibleCount(3);
    }, [searchQuery, userArticle]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteArticle = async (articleId) => {
        if (!currentUser || !articleId) return;
        const toastId = toast.loading("Menghapus artikel...");
        
        try {
            const token = await currentUser.getIdToken();
            await apiInstanceExpress.delete(`article/delete/${articleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const updatedArticles = userArticle.filter(article => article._id !== articleId);
            setUserArticle(updatedArticles);
            setFilteredArticles(updatedArticles);
            
            toast.success("Artikel berhasil dihapus", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus artikel", { id: toastId });
        }
    };

    const getContentPreview = (content) => {
        if (!content || !Array.isArray(content) || content.length === 0) {
            return "Tidak ada konten";
        }
        
        const textContent = content.find(item => item.value)?.value || "";
        return textContent;
    };

    // Fungsi untuk menambah jumlah item yang ditampilkan
    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 3);
    };

    // Mengambil array artikel yang akan ditampilkan berdasarkan visibleCount
    const visibleArticles = filteredArticles.slice(0, visibleCount);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <p className="mt-4 text-gray-600">Memuat artikel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold">Postingan Saya</h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            type="search" 
                            placeholder="Cari postingan..." 
                            className="pl-10 w-full h-10 rounded-lg"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            <Separator className="my-4" />
            
            {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-sm">
                        <Menu className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {searchQuery ? "Tidak ada postingan yang cocok" : "Belum ada postingan"}
                    </h3>
                    <p className="text-gray-500 text-center mt-2 max-w-md px-4">
                        {searchQuery 
                            ? "Coba gunakan kata kunci yang berbeda untuk menemukan postingan Anda."
                            : "Anda belum membuat postingan apapun. Mulai berbagi pengetahuan Anda sekarang."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <EachUtils 
                        of={visibleArticles}
                        render={(item, index) => (
                            <Card 
                                key={index} 
                                className="overflow-hidden transition-all hover:shadow-md rounded-xl border-gray-200"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-72 h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img 
                                            src={item.cover ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.cover}` : "/api/placeholder/256/192"} 
                                            alt={item.title || "Cover gambar artikel"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/api/placeholder/256/192";
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col p-1">
                                        <CardHeader className="p-3 pb-1">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-medium text-lg line-clamp-2">{item.title}</h3>
                                                    <StatusBadge status={"published"} />
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        <span>{formatDate(item.createdAt)}</span>
                                                    </div>
                                                    <div className="hidden sm:flex flex-wrap gap-1">
                                                        {item.tags && item.tags.length > 0 && item.tags.slice(0, 3).map((tag, idx) => (
                                                            <Badge key={idx} variant="outline" className="bg-gray-50 text-xs px-2 py-0">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {item.tags && item.tags.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="px-3 py-2 flex-grow">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {getContentPreview(item.content)}
                                            </p>
                                        </CardContent>
                                        
                                        <CardFooter className="justify-between px-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <ThumbsUp size={14} />
                                                    <span>{item.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Share2 size={14} />
                                                    <span>{item.shares?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MessageSquare size={14} />
                                                    <span>{item.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2 rounded-lg"
                                                    onClick={() => navigate(`/article/${item._id}`)}
                                                >
                                                    <span>Lihat</span> <ChevronRight size={16} />
                                                </Button>
                                                
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 cursor-pointer"
                                                            onClick={() => navigate(`/article/edit/${item._id}`)}
                                                        >
                                                            <Edit size={14} />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 cursor-pointer text-red-600"
                                                            onClick={() => {
                                                                setSelectedArticleId(item._id);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus permanen dari server.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => {
                                                                handleDeleteArticle(selectedArticleId);
                                                                setIsDialogOpen(false);
                                                                }}
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardFooter>
                                    </div>
                                </div>
                            </Card>
                        )}
                    />
                </div>
            )}
            
            {/* Tampilkan tombol "Muat Lebih Banyak" hanya jika ada lebih banyak item yang bisa ditampilkan */}
            {filteredArticles.length > visibleCount && (
                <div className="flex justify-center mt-8">
                    <Button 
                        variant="outline" 
                        className="rounded-lg px-6"
                        onClick={handleLoadMore}
                    >
                        Muat Lebih Banyak
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Post;