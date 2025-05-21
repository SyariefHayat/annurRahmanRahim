import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Clock } from 'lucide-react';

import { 
    Alert, 
    AlertDescription, 
    AlertTitle 
} from '@/components/ui/alert';

import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';

import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { snapTokenAtomStorage } from '@/jotai/atoms';
import { apiInstanceExpress } from '@/services/apiInstance';
import DefaultLayout from '@/components/layouts/DefaultLayout';

const Receipt = () => {
    const [transactionData, setTransactionData] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");
    const [snapToken, setSnapToken] = useAtom(snapTokenAtomStorage);

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("order_id");
        const status = urlParams.get("transaction_status");
        setTransactionStatus(status);

        if (!orderId) return;

        const getTransactionDataByOrderId = async () => {
            try {
                const response = await apiInstanceExpress.get(`donor/get/${orderId}`);
                if (response.status === 200) return setTransactionData(response?.data?.data);
            } catch (error) {
                console.error(error);
            }
        };

        getTransactionDataByOrderId();
    });

    const handleDelete = async (orderId) => {
        try {
            const response = await apiInstanceExpress.delete(`transaction/delete/${orderId}`);
            if (response.status === 200) return setSnapToken(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <DefaultLayout>
            {transactionData && (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    {transactionStatus === "settlement" && (
                        <div className="w-full max-w-md">
                            <Alert className="mb-6 bg-green-50 border-green-200">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <AlertTitle className="text-green-800 font-medium">Donasi Berhasil!</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                        Terima kasih atas kebaikan hati Anda.
                                    </AlertDescription>
                            </Alert>

                            <Card className="shadow-lg border-0">
                                <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg py-10">
                                    <CardTitle className="text-3xl font-bold">Terima Kasih!</CardTitle>
                                    <CardDescription className="text-blue-50">
                                        Donasi Anda sangat berarti bagi kami
                                    </CardDescription>
                                </CardHeader>
                            
                                <div className="relative">
                                    <div className="absolute -top-8 left-0 right-0 flex justify-center">
                                        <Badge className="bg-yellow-400 hover:bg-yellow-400 text-yellow-900 text-lg py-1 px-4">
                                            Rp {transactionData.amount.toLocaleString("id-ID")}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="pt-8 pb-4">
                                    <div className="space-y-4 mt-2">
                                        <p className="text-center text-gray-600">
                                            Halo <span className="font-semibold">{transactionData.name}</span>, donasi Anda telah kami terima. 
                                            Dukungan seperti ini membantu kami melanjutkan misi kami.
                                        </p>
                                    
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ID Donasi</span>
                                                <span className="font-medium max-w-[250px] truncate text-right">{transactionData.orderId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tanggal</span>
                                                <span className="font-medium">{formatDate(transactionData.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Status</span>
                                                <span className="text-green-600 font-medium">Berhasil</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            
                                <CardFooter className="flex flex-col gap-2">
                                    <Button variant="outline" asChild>
                                        <a href="/campaign">Kembali ke Campaign</a>
                                    </Button>
                                </CardFooter>
                            </Card>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Untuk pertanyaan lebih lanjut, silakan hubungi kami di 
                                <a href="mailto:support@contoh.com" className="text-blue-600 ml-1">support@contoh.com</a>
                            </p>
                        </div>
                    )}

                    {transactionStatus === "pending" && (
                        <div className="w-full max-w-md">
                            {/* Success Message */}
                            <Alert className="mb-6 bg-orange-50 border-orange-200">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                    <AlertTitle className="text-orange-800 font-medium">Donasi Menunggu Pembayaran</AlertTitle>
                                    <AlertDescription className="text-orange-700">
                                        Silakan selesaikan pembayaran Anda sesuai instruksi.
                                    </AlertDescription>
                            </Alert>

                            {/* Thank You Card */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="text-center bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-t-lg py-10">
                                    <CardTitle className="text-3xl font-bold">Menunggu Pembayaran</CardTitle>
                                    <CardDescription className="text-blue-50">
                                        Selesaikan pembayaran untuk melanjutkan donasi
                                    </CardDescription>
                                </CardHeader>
                            
                                <div className="relative">
                                    <div className="absolute -top-8 left-0 right-0 flex justify-center">
                                        <Badge className="bg-orange-400 text-white text-lg py-1 px-4">
                                            Rp {transactionData.amount.toLocaleString("id-ID")}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="pt-8 pb-4">
                                    <div className="space-y-4 mt-2">
                                        <p className="text-center text-gray-600">
                                            Halo <span className="font-semibold">{transactionData.name}</span>, donasi Anda masih menunggu pembayaran. Silakan selesaikan pembayaran sesuai petunjuk dari metode pembayaran yang Anda pilih.
                                        </p>
                                    
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ID Donasi</span>
                                                <span className="font-medium max-w-[250px] truncate text-right">{transactionData.orderId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tanggal</span>
                                                <span className="font-medium">{formatDate(transactionData.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Status</span>
                                                <span className="text-orange-600 font-medium">{transactionData.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            
                                <CardFooter className="flex flex-col gap-2">
                                    <Button
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() => window.location.href = snapToken.redirect_url}
                                    >
                                        Lanjutkan Pembayaran
                                    </Button>

                                    <Button 
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            handleDelete(transactionData.orderId);
                                            navigate("/campaign");
                                        }} 
                                    >
                                        Kembali ke Campaign
                                    </Button>
                                </CardFooter>
                            </Card>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Untuk pertanyaan lebih lanjut, silakan hubungi kami di 
                                <a href="mailto:support@contoh.com" className="text-blue-600 ml-1">support@contoh.com</a>
                            </p>
                        </div>
                    )}

                    {transactionStatus === "expire" && (
                        <div className="w-full max-w-md">
                            {/* Success Message */}
                            <Alert className="mb-6 bg-red-50 border-red-200">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <AlertTitle className="text-red-800 font-medium">Donasi Tidak Berhasil</AlertTitle>
                                    <AlertDescription className="text-red-700">
                                        Batas waktu pembayaran telah berakhir.
                                    </AlertDescription>
                            </Alert>

                            {/* Thank You Card */}
                            <Card className="shadow-lg border-0">
                                <CardHeader className="text-center bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-t-lg py-10">
                                    <CardTitle className="text-3xl font-bold">Pembayaran Kedaluwarsa</CardTitle>
                                    <CardDescription className="text-blue-50">
                                        Batas waktu pembayaran telah berakhir
                                    </CardDescription>
                                </CardHeader>
                            
                                <div className="relative">
                                    <div className="absolute -top-8 left-0 right-0 flex justify-center">
                                        <Badge className="bg-red-400 hover:bg-red-400 text-white text-lg py-1 px-4">
                                            Rp {transactionData.amount.toLocaleString("id-ID")}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="pt-8 pb-4">
                                    <div className="space-y-4 mt-2">
                                        <p className="text-center text-gray-600">
                                            Halo <span className="font-semibold">{transactionData.name}</span>, sayang sekali batas waktu pembayaran untuk donasi Anda telah berakhir. Anda dapat mencoba berdonasi kembali kapan saja.
                                        </p>
                                    
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ID Donasi</span>
                                                <span className="font-medium max-w-[250px] truncate text-right">{transactionData.orderId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tanggal</span>
                                                <span className="font-medium">{formatDate(transactionData.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Status</span>
                                                <span className="text-red-600 font-medium">{transactionData.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            
                                <CardFooter className="flex flex-col gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => {
                                            handleDelete(transactionData.orderId);
                                            navigate("/");
                                        }} 
                                    >
                                        Kembali ke Beranda
                                    </Button>
                                </CardFooter>
                            </Card>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Untuk pertanyaan lebih lanjut, silakan hubungi kami di 
                                <a href="mailto:support@contoh.com" className="text-blue-600 ml-1">support@contoh.com</a>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </DefaultLayout>
    );
};

export default Receipt;