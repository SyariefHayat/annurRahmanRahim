import { useAtom } from 'jotai'

import { 
    Bell, 
    Edit, 
    FileText, 
    HistoryIcon, 
    Lock, 
    Plus 
} from 'lucide-react'

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from '@/components/ui/tabs'

import { userDataAtom, userTransactionAtom } from '@/jotai/atoms'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import Post from '@/components/modules/profile/Post'
import History from '@/components/modules/profile/History'
import UserInfo from '@/components/modules/profile/UserInfo'
import CoverPhoto from '@/components/modules/profile/CoverPhoto'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import EditProfile from '@/components/modules/profile/EditProfile'
import NewPassword from '@/components/modules/profile/NewPassword'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Notification from '@/components/modules/profile/Notification'
import { apiInstanceExpress } from '@/services/apiInstance'
import { toast } from 'sonner'

const Setting = () => {
    const { currentUser, userData } = useAuth();
    const [user, setUser] = useAtom(userDataAtom);
    const [, setUserTransaction] = useAtom(userTransactionAtom);
    
    useEffect(() => {
        const getUserTransaction = async () => {
            if (!userData || !currentUser) return;
            try {
                const token = await currentUser.getIdToken();
                const userResponse = await apiInstanceExpress.get(`profile/get/me/${userData._id}`);
                if (userResponse.status === 200) setUser(userResponse.data.data);
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

    return (
        <DashboardLayout>
            <main className="gap-4 p-4">
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
                                
                                {(userData.role === "author" || userData.role === "admin") && (
                                    <TabsTrigger value="postingan" className="flex items-center gap-2">
                                        <FileText size={16} /> Postingan
                                    </TabsTrigger>
                                )}
                                
                                <TabsTrigger value="edit-profile" className="flex items-center gap-2">
                                    <Edit size={16} /> Edit Profil
                                </TabsTrigger>
                                
                                <TabsTrigger value="edit-password" className="flex items-center gap-2">
                                    <Lock size={16} /> Ubah Password
                                </TabsTrigger>
                                
                                <TabsTrigger value="notification" className="flex items-center gap-2">
                                    <Bell size={16} /> Pemberitahuan
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <div className="mt-6">
                            {(userData.role === "author" || userData.role === "admin") && (
                                <TabsContent value="postingan" className="animate-in fade-in-50">
                                    <Post />
                                </TabsContent>
                            )}

                            <TabsContent value="history-donation" className="animate-in fade-in-50">
                                <History />
                            </TabsContent>

                            <TabsContent value="edit-profile" className="animate-in fade-in-50">
                                <EditProfile />
                            </TabsContent>

                            <TabsContent value="edit-password" className="animate-in fade-in-50">
                                <NewPassword />
                            </TabsContent>

                            <TabsContent value="notification" className="animate-in fade-in-50">
                                <Notification />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </main>
        </DashboardLayout>
    )
}

export default Setting