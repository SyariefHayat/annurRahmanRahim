import { useAtom } from 'jotai';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';

import { 
    CalendarIcon, 
    ChevronRight, 
    Clock, 
    CreditCard, 
    Filter, 
    Search 
} from 'lucide-react';

import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import EachUtils from '@/utils/EachUtils';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userTransactionAtom } from '@/jotai/atoms';
import { Separator } from "@/components/ui/separator";
import Detail from '@/components/modules/profile/Detail';

const StatusBadge = ({ status }) => {
    const styles = {
        settlement: "bg-green-100 text-green-600 hover:bg-green-100",
        pending: "bg-yellow-100 text-yellow-600 hover:bg-yellow-100",
        failed: "bg-red-100 text-red-600 hover:bg-red-100",
    };

    const labels = {
        settlement: "Berhasil",
        pending: "Menunggu",
        failed: "Gagal",
    };

    return (
        <Badge variant="outline" className={styles[status]}>
            {labels[status]}
        </Badge>
    );
};

const History = () => {
    const [userTransaction] = useAtom(userTransactionAtom);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    
    const [visibleCount, setVisibleCount] = useState(5);
    const [hasMore, setHasMore] = useState(false);
    
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        let filtered = [...userTransaction];
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => {
                if (statusFilter === 'success') return item.status === 'settlement';
                if (statusFilter === 'pending') return item.status === 'pending';
                if (statusFilter === 'failed') return item.status === 'failed';
                return true;
            });
        }
        
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                item.campaignId.title.toLowerCase().includes(term) || 
                item.campaignId.createdBy.username.toLowerCase().includes(term)
            );
        }
        
        setFilteredTransactions(filtered);
        
        setHasMore(filtered.length > visibleCount);
    }, [userTransaction, searchTerm, statusFilter, visibleCount]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setVisibleCount(5);
    };

    const handleFilterChange = (value) => {
        setStatusFilter(value);
        setVisibleCount(5);
    };
    
    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetail(true);
    };
    
    const handleBackToHistory = () => {
        setShowDetail(false);
        setSelectedTransaction(null);
    };

    const displayedTransactions = filteredTransactions.slice(0, visibleCount);

    if (showDetail && selectedTransaction) {
        return <Detail transaction={selectedTransaction} onBack={handleBackToHistory} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-medium">Riwayat Donasi</h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            type="search" 
                            placeholder="Cari donasi..." 
                            className="pl-9 w-full sm:w-64"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    
                    <Select 
                        value={statusFilter} 
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <div className="flex items-center gap-2">
                                <Filter size={16} />
                                <SelectValue placeholder="Filter" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="success">Berhasil</SelectItem>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="failed">Gagal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />
            
            {displayedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <CreditCard className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {userTransaction.length === 0 ? 
                            "Belum ada riwayat donasi" : 
                            "Tidak ada donasi yang sesuai"
                        }
                    </h3>
                    <p className="text-gray-500 text-center mt-2">
                        {userTransaction.length === 0 ? 
                            "Anda belum melakukan donasi apapun. Mulai berbagi untuk membantu sesama." :
                            "Coba ubah filter atau kata kunci pencarian Anda."
                        }
                    </p>
                    {userTransaction.length === 0 && (
                        <Button className="mt-6" asChild>
                            <a href="/campaign">
                                Mulai Donasi
                            </a>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <EachUtils 
                        of={displayedTransactions}
                        render={(item, index) => (
                            <Card key={index} className="overflow-hidden transition-all hover:border-gray-300">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-medium">{item.campaignId.title}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <CalendarIcon size={14} />
                                                <span>{format(item.date, 'd MMMM yyyy', { locale: id })}</span>
                                                <Clock size={14} className="ml-2" />
                                                <span>{format(item.date, 'HH:mm', { locale: id })}</span>
                                            </div>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pb-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-gray-500">Penerima</span>
                                            <span className="text-sm">{item.campaignId.createdBy.username}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-gray-500">Metode Pembayaran</span>
                                            {item.vaNumbers ? (
                                                <EachUtils 
                                                    of={item.vaNumbers}
                                                    render={(vaItem, vaIndex) => (
                                                        <span key={vaIndex} className="text-sm capitalize">{vaItem.bank}</span>
                                                    )}
                                                />
                                            ) : (
                                                <span className="text-sm capitalize">{item.paymentType}</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <CardFooter className="justify-between bg-gray-50 py-3">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">Nominal Donasi</span>
                                        <p className="text-lg font-medium">
                                            Rp {item.amount.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => handleViewDetail(item)}
                                    >
                                        Detail <ChevronRight size={16} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    />
                </div>
            )}
            
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <Button 
                        variant="outline" 
                        onClick={handleLoadMore}
                    >
                        Muat Lebih Banyak
                    </Button>
                </div>
            )}
        </div>
    );
};

export default History;