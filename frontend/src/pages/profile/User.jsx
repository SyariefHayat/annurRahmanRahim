import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { 
    Globe, 
    Mail, 
    Phone, 
    Instagram, 
    Twitter, 
    Facebook, 
    ExternalLink, 
    Lock
} from 'lucide-react'

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
} from '@/components/ui/card'

import Footer from '../landing/Footer'
import Navbar from '../landing/Navbar'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Separator } from '@/components/ui/separator'
import { apiInstanceExpress } from '@/services/apiInstance'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import DefaultLayout from '@/components/layouts/DefaultLayout'

const User = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=random`;
    
    const profilePictureUrl = userData?.profilePicture 
        ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData.profilePicture}`
        : avatarUrl;

    useEffect(() => {
        const getUserData = async () => {
            if (!id) return

            try {
                const response = await apiInstanceExpress.get(`profile/get/me/${id}`);
                if (response.status === 200) setUserData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        }

        getUserData()
    }, [id]);

    if (!userData) {
        return (
            <DefaultLayout>
                <Navbar position="relative" />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200"></div>
                        <div className="h-6 w-48 bg-gray-200 rounded mx-auto"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
                    </div>
                </div>
            </DefaultLayout>
        )
    }

    return (
        <DefaultLayout>
            <Navbar position="relative" />
            <Toaster />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative mb-8">
                    <div className="w-full h-56 md:h-64 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 overflow-hidden">
                        {userData?.profileAlbum && (
                            <img 
                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData.profileAlbum}`} 
                                alt="Cover" 
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 sm:-mt-16 px-4 relative z-10">
                        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-md">
                            <AvatarImage 
                                src={profilePictureUrl} 
                                alt={userData?.username} 
                                className="object-cover" 
                            />
                        </Avatar>
                        
                        <div className="space-y-1 sm:pb-2">
                            <h1 className="text-2xl font-medium">{userData?.username}</h1>
                            <p className="text-sm text-gray-500">{userData?.email}</p>
                        </div>

                        <div className="flex-grow"></div>
                        
                        <div className="hidden md:flex mt-4 md:mt-0 md:pb-6">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ExternalLink size={16} /> Visit
                            </Button>
                        </div>
                    </div>
                </div>
                
                {userData?.preferences?.isPrivate ? (
                    <div className="flex items-center justify-center p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-md">
                                    <Lock size={32} className="text-gray-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-medium text-gray-900">Profil Privat</h1>
                                    <p className="text-sm text-gray-500 max-w-md">
                                        Pengguna ini telah memilih untuk menjaga privasi datanya
                                    </p>
                                </div>
                            </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Card className="overflow-hidden border-gray-200">
                            <CardHeader className="bg-gray-50/50 pb-3">
                                <CardTitle className="text-lg font-medium">Informasi Dasar</CardTitle>
                                <CardDescription>Informasi dasar tentang profil pengguna</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 pb-1 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">Bio</h3>
                                    <div className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">
                                        {userData?.bio ? (
                                            <p>{userData.bio}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">Pengguna ini belum menambahkan bio.</p>
                                        )}
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">Detail Umum</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 shadow-sm">
                                                <Mail size={18} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-medium">{userData?.email || 'Tidak tersedia'}</p>
                                            </div>
                                        </div>
                                        
                                        {userData?.website && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 shadow-sm">
                                                    <Globe size={18} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Website</p>
                                                    <p className="text-sm font-medium">{userData.website}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="overflow-hidden border-gray-200">
                            <CardHeader className="bg-gray-50/50 pb-3">
                                <CardTitle className="text-lg font-medium">Informasi Kontak</CardTitle>
                                <CardDescription>Informasi kontak dan media sosial pengguna</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">Detail Kontak</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                                <Phone size={18} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Nomor Telepon</p>
                                                <p className="text-sm font-medium">{userData?.phone || 'Tidak tersedia'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                                <Mail size={18} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-medium">{userData?.email || 'Tidak tersedia'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">Media Sosial</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { name: 'Instagram', icon: Instagram, username: userData?.instagram },
                                            { name: 'Twitter', icon: Twitter, username: userData?.twitter },
                                            { name: 'Facebook', icon: Facebook, username: userData?.facebook }
                                        ].map((social) => (
                                            <div key={social.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                                                    <social.icon size={18} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">{social.name}</p>
                                                    <p className="text-sm font-medium">
                                                        {social.username || 'Tidak tersedia'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                
            </main>
            
            <Footer />
        </DefaultLayout>
    )
}

export default User