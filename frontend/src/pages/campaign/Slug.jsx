import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { 
    ChevronRight, 
    Calendar, 
    Users, 
    CreditCard 
} from 'lucide-react'

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import { Badge } from "@/components/ui/badge"
import { getInitial } from '@/utils/getInitial'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { apiInstanceExpress } from '@/services/apiInstance'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import TabsCampaign from '@/components/modules/campaign/TabsCampaign'
import DialogCampaign from '@/components/modules/campaign/DialogCampaign'

const SlugCampaign = () => {
    const { id } = useParams();
    const [campaignData, setCampaignData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCampaignDataById = async () => {
            try {
                setLoading(true);
                const response = await apiInstanceExpress.get(`campaign/get/${id}`);
                if (response.status === 200) {
                    setCampaignData(response.data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getCampaignDataById();
    }, [id]);

    const calculateProgress = (collected, target) => {
        return Math.min((collected / target) * 100, 100);
    };
    
    const formatCurrency = (amount) => {
        return `Rp ${amount.toLocaleString("id-ID")}`;
    };

    if (loading) {
        return (
            <DefaultLayout>
                <Navbar position="relative" />
                <LoadingState />
                <Footer />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Navbar position="relative" />
            {campaignData && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="relative overflow-hidden rounded-xl">
                                <img 
                                    src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${campaignData.image}`} 
                                    alt={campaignData.title} 
                                    className="w-full h-auto object-cover aspect-video shadow-sm"
                                />
                            </div>

                            <div>
                                <Badge variant="outline" className="mb-2 text-blue-700 bg-blue-50 border-blue-200">
                                    {campaignData.category || "Donasi"}
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">{campaignData.title}</h1>
                                <p className="text-gray-600 leading-relaxed">{campaignData.description}</p>
                            </div>

                            <TabsCampaign />
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 shadow-sm border-gray-100">
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(campaignData.collectedAmount)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                dari {formatCurrency(campaignData.targetAmount)}
                                            </span>
                                        </div>
                                        
                                        <Progress 
                                            value={calculateProgress(campaignData.collectedAmount, campaignData.targetAmount)}
                                            className="h-2 [&>div]:bg-blue-600 bg-gray-100 rounded-full"
                                            aria-label={`Progress campaign ${campaignData.title}`}
                                        />
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-blue-700">
                                                {calculateProgress(campaignData.collectedAmount, campaignData.targetAmount).toFixed(1)}%
                                            </span>
                                            <span className="text-gray-500">
                                                {campaignData.donors.length} Donatur
                                            </span>
                                        </div>
                                    </div>

                                    <DialogCampaign donationId={campaignData._id} />

                                    <div className="divide-y divide-gray-100">
                                        <div className="py-3 flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Berakhir pada</p>
                                                <p className="text-sm font-medium">{campaignData.endDate || "30 Juni 2025"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="py-3 flex items-center gap-3">
                                            <Users className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Dikelola oleh</p>
                                                <p className="text-sm font-medium">{campaignData.createdBy.username}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="py-3 flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Metode Pembayaran</p>
                                                <p className="text-sm font-medium">Transfer Bank, QRIS, E-Wallet</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <Avatar className="h-10 w-10 bg-gray-50 border border-gray-100">
                                            <AvatarImage src={campaignData.createdBy.profilePicture} />
                                            <AvatarFallback>{getInitial(campaignData.createdBy.username)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{campaignData.createdBy.username}</p>
                                            <p className="text-xs text-gray-500">{campaignData.createdBy.role}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="ml-auto text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                                            Profil <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </DefaultLayout>
    );
};

// Loading state component
const LoadingState = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="w-full h-96 rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-7 w-32" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-2 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default SlugCampaign;