import { useAtom } from 'jotai';
import { toast, Toaster } from 'sonner';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { 
    Plus, 
    Edit, 
    History as HistoryIcon, 
    Lock, 
} from 'lucide-react';

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

import { 
    ScrollArea, 
    ScrollBar 
} from "@/components/ui/scroll-area";


import { 
    userDataAtom, 
    userTransactionAtom 
} from '@/jotai/atoms';

import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import History from '@/components/modules/profile/History';
import { apiInstanceExpress } from '@/services/apiInstance';
import UserInfo from '@/components/modules/profile/UserInfo';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import CoverPhoto from '@/components/modules/profile/CoverPhoto';
import EditProfile from '@/components/modules/profile/EditProfile';
import NewPassword from '@/components/modules/profile/NewPassword';
import ProfileSkeleton from '@/components/modules/profile/ProfileSkeleton';

const Profile = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [userData, setUserData] = useAtom(userDataAtom);
    const [, setUserTransaction] = useAtom(userTransactionAtom);

    useEffect(() => {
        const getUserTransaction = async () => {
            if (!id || !currentUser) return;

            try {
                const token = await currentUser.getIdToken();
                const userResponse = await apiInstanceExpress.get(`profile/get/me/${id}`);
                if (userResponse.status === 200) setUserData(userResponse.data.data);

                const trxResponse = await apiInstanceExpress.get("profile/get/transaction", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (trxResponse.status === 200) return setUserTransaction(trxResponse.data.data);
            } catch (error) {
                console.error("Error fetching user transactions:", error);
                toast.error("Gagal memuat riwayat transaksi");
            }
        };
        
        getUserTransaction();
    }, [setUserTransaction]);

    if (!userData) {
        return (
            <DefaultLayout>
                <Navbar position="relative" />
                <ProfileSkeleton />
                <Footer />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Navbar position="relative" textColor="text-gray-900" />
            <Toaster />
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
                <CoverPhoto />

                <UserInfo />

                <div className="sm:hidden mt-4 px-4">
                    <Button className="w-full flex items-center justify-center gap-2 shadow-sm" asChild>
                        <Link to={`/article/create/${userData._id}`}>
                            <Plus size={16} /> Tambah Konten
                        </Link>
                    </Button>
                </div>

                <div className="mt-8 px-4">
                    <Tabs defaultValue="history-donation" className="w-full">
                        <ScrollArea className="w-full pb-4">
                            <TabsList className="flex w-max bg-gray-50 p-1">
                                <TabsTrigger value="history-donation" className="flex items-center gap-2">
                                    <HistoryIcon size={16} /> Riwayat Donasi
                                </TabsTrigger>
                                
                                <TabsTrigger value="edit-profile" className="flex items-center gap-2">
                                    <Edit size={16} /> Edit Profil
                                </TabsTrigger>
                                
                                <TabsTrigger value="edit-password" className="flex items-center gap-2">
                                    <Lock size={16} /> Ubah Password
                                </TabsTrigger>
                                
                                {/* <TabsTrigger value="notification" className="flex items-center gap-2">
                                    <Bell size={16} /> Pemberitahuan
                                </TabsTrigger> */}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <div className="mt-6">
                            <TabsContent value="history-donation" className="animate-in fade-in-50">
                                <History />
                            </TabsContent>

                            <TabsContent value="edit-profile" className="animate-in fade-in-50">
                                <EditProfile />
                            </TabsContent>

                            <TabsContent value="edit-password" className="animate-in fade-in-50">
                                <NewPassword />
                            </TabsContent>

                            {/* <TabsContent value="notification" className="animate-in fade-in-50">
                                <Notification />
                            </TabsContent> */}
                        </div>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </DefaultLayout>
    );
};

export default Profile;