import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React, { useState } from 'react';

import { 
    ArrowLeft, 
    CalendarIcon, 
    CheckCircle, 
    Clock, 
    Copy, 
    ExternalLink
} from 'lucide-react';

import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitial } from '@/utils/getInitial';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import DefaultLayout from '@/components/layouts/DefaultLayout';

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

    const icons = {
        settlement: <CheckCircle size={14} className="mr-1" />,
        pending: <Clock size={14} className="mr-1" />,
        failed: <ExternalLink size={14} className="mr-1" />,
    };

    return (
        <Badge variant="outline" className={`${styles[status]} flex items-center`}>
            {icons[status]}
            {labels[status]}
        </Badge>
    );
};

const Detail = ({ transaction, onBack }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const progressPercentage = Math.min(
        Math.round((transaction.campaignId.collectedAmount / transaction.campaignId.targetAmount) * 100),
        100
    );

    return (
        <DefaultLayout>
            <div className="max-w-xl mx-auto my-10">
                <div className="mb-6">
                    <Button 
                        variant="ghost" 
                        className="h-auto mb-4" 
                        onClick={onBack}
                        >
                        <ArrowLeft size={18} className="mr-2" />
                        <span>Kembali ke Riwayat</span>
                    </Button>
                    
                    <h1 className="text-2xl font-semibold">Detail Donasi</h1>
                    <p className="text-gray-500 mt-1">
                    Nomor Donasi: {transaction.orderId}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium">Informasi Kampanye</h2>
                                    <StatusBadge status={transaction.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={transaction.campaignId.createdBy.profilePicture} alt={transaction.campaignId.createdBy.username} />
                                        <AvatarFallback>{getInitial(transaction.campaignId.createdBy.username)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <p className="font-medium">{transaction.campaignId.createdBy.username}</p>
                                    <p className="text-xs text-gray-500">Penggalang Dana</p>
                                    </div>
                                </div>
                                
                                <h3 className="font-medium mb-2">{transaction.campaignId.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{transaction.campaignId.description}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Terkumpul</span>
                                        <span className="font-medium">Rp {transaction.campaignId.collectedAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                    <div className="flex justify-between text-xs text-gray-500">
                                    <span>{progressPercentage}% tercapai</span>
                                    <span>Target: Rp {transaction.campaignId.targetAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <CalendarIcon size={12} />
                                    <span>Berakhir pada {format(transaction.campaignId.deadline, 'd MMMM yyyy', { locale: id })}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-0">
                                <h2 className="text-lg font-medium">Detail Pembayaran</h2>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal Donasi</p>
                                            <p className="font-medium">{format(transaction.date, 'd MMMM yyyy, HH:mm', { locale: id })}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <div className="mt-1">
                                            <StatusBadge status={transaction.status} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Metode Pembayaran</p>
                                            {transaction.vaNumbers ? (
                                                <p className="font-medium capitalize">{transaction.vaNumbers[0].bank} Virtual Account</p>
                                            ) : (
                                                <p className="font-medium capitalize">{transaction.paymentType.replace(/_/g, ' ')}</p>
                                            )}
                                        </div>
                                        {transaction.vaNumbers && (
                                            <div>
                                                <p className="text-sm text-gray-500">Nomor Virtual Account</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{transaction.vaNumbers[0].va_number}</p>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="h-6 w-6 p-0" 
                                                                    onClick={() => copyToClipboard(transaction.vaNumbers[0].vaNumber)}
                                                                >
                                                                    {copySuccess ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Salin nomor</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Rincian Biaya</p>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Nominal Donasi</span>
                                            <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
                                        </div>
                                        {/* {transaction.additionalInfo?.paymentFee && (
                                            <div className="flex justify-between text-sm mb-1">
                                            <span>Biaya Layanan</span>
                                            <span>Rp {transaction.additionalInfo.paymentFee.toLocaleString('id-ID')}</span>
                                            </div>
                                        )} */}
                                        <div className="flex justify-between font-medium mt-2">
                                            <span>Total</span>
                                            <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    
                                    {transaction.message && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Pesan Dukungan</p>
                                                <p className="text-sm italic">{transaction.message}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Detail;