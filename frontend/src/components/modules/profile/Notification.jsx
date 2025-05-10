import React, { useState } from 'react';
import { Bell, Check, Heart, Mail, MoreVertical, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitial } from '@/utils/getInitial';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock data untuk notifikasi
const notificationsData = [
  {
    id: 1,
    type: 'donation',
    title: 'Donasi Berhasil',
    message: 'Terima kasih! Donasi Anda sebesar Rp 250.000 untuk "Bantu Anak-anak Panti Asuhan" telah berhasil.',
    date: new Date(2025, 4, 5, 16, 34),
    read: true,
  },
  {
    id: 2,
    type: 'like',
    title: 'Artikel Anda Disukai',
    message: 'Ahmad menyukai artikel Anda "Manfaat Olahraga Teratur untuk Kesehatan Mental".',
    date: new Date(2025, 4, 4, 9, 12),
    read: false,
    user: {
      name: 'Ahmad',
      avatar: 'https://i.pravatar.cc/150?img=3',
    }
  },
  {
    id: 3,
    type: 'comment',
    title: 'Komentar Baru',
    message: 'Budi mengomentari artikel Anda "Dampak Positif Teknologi dalam Dunia Pendidikan".',
    date: new Date(2025, 4, 3, 14, 20),
    read: false,
    user: {
      name: 'Budi',
      avatar: 'https://i.pravatar.cc/150?img=4',
    }
  },
  {
    id: 4,
    type: 'system',
    title: 'Pembaruan Sistem',
    message: 'Sistem kami telah diperbarui dengan fitur baru. Silakan cek panduan pengguna untuk informasi lebih lanjut.',
    date: new Date(2025, 4, 2, 10, 0),
    read: true,
  },
];

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'donation':
                return <Mail className="w-5 h-5 text-blue-500" />;
            case 'like':
                return <Heart className="w-5 h-5 text-pink-500" />;
            case 'comment':
                return <Mail className="w-5 h-5 text-purple-500" />;
            case 'system':
                return <Bell className="w-5 h-5 text-orange-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className={`p-4 rounded-lg transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {notification.user ? (
                        <Avatar>
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback>{getInitial(notification.user.name)}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                        </div>
                    )}
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-blue-600' : ''}`}>
                            {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.date, { addSuffix: true, locale: id })}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                        {format(notification.date, 'd MMM yyyy, HH:mm', { locale: id })}
                        </span>
                        
                        <div className="flex items-center gap-2">
                        {!notification.read && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-blue-600 hover:text-blue-700"
                                onClick={() => onMarkAsRead(notification.id)}
                            >
                                <Check size={16} className="mr-1" />
                                Tandai Sudah Dibaca
                            </Button>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {!notification.read && (
                                    <DropdownMenuItem 
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    >
                                        <Check size={14} />
                                        <span>Tandai Sudah Dibaca</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                    onClick={() => onDelete(notification.id)}
                                >
                                    <Trash2 size={14} />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Notification = () => {
    const [notifications, setNotifications] = useState(notificationsData);
    const [activeTab, setActiveTab] = useState('all');
    
    const filteredNotifications = activeTab === 'all' 
        ? notifications 
        : activeTab === 'unread'
        ? notifications.filter(notification => !notification.read)
        : notifications.filter(notification => notification.read);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const unreadCount = notifications.filter(notification => !notification.read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan Notifikasi</CardTitle>
                        <CardDescription>
                        Kelola preferensi notifikasi dan pemberitahuan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifikasi</Label>
                                    <p className="text-xs text-gray-500">
                                        Terima notifikasi melalui email
                                    </p>
                                </div>
                                <Switch id="email-notifications" defaultChecked={true} />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="donation-updates">Update Donasi</Label>
                                    <p className="text-xs text-gray-500">
                                        Dapatkan berita tentang donasi yang Anda lakukan
                                    </p>
                                </div>
                                <Switch id="donation-updates" defaultChecked={true} />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="article-likes">Like pada Artikel</Label>
                                    <p className="text-xs text-gray-500">
                                        Dapatkan notifikasi saat seseorang menyukai artikel Anda
                                    </p>
                                </div>
                                <Switch id="article-likes" defaultChecked={true} />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="article-comments">Komentar pada Artikel</Label>
                                    <p className="text-xs text-gray-500">
                                        Dapatkan notifikasi saat seseorang mengomentari artikel Anda
                                    </p>
                                </div>
                                <Switch id="article-comments" defaultChecked={true} />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="system-updates">Pembaruan Sistem</Label>
                                    <p className="text-xs text-gray-500">
                                        Dapatkan notifikasi tentang pembaruan dan berita penting
                                    </p>
                                </div>
                                <Switch id="system-updates" defaultChecked={true} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle>Pemberitahuan</CardTitle>
                            {unreadCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={handleMarkAllAsRead}
                                >
                                    Tandai Semua Sudah Dibaca
                                </Button>
                            )}
                        </div>
                        <CardDescription>
                            Lihat dan kelola pemberitahuan Anda
                        </CardDescription>
                    </CardHeader>
                    
                    <div className="px-6">
                        <Tabs defaultValue="all" onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="all" className="text-sm">
                                    Semua
                                    <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger value="unread" className="text-sm">
                                    Belum Dibaca
                                    <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger value="read" className="text-sm">
                                    Sudah Dibaca
                                    <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
                                        {notifications.length - unreadCount}
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    
                    <CardContent className="pt-6">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Bell className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {activeTab === 'unread' 
                                        ? 'Tidak ada notifikasi yang belum dibaca' 
                                        : activeTab === 'read'
                                        ? 'Tidak ada notifikasi yang sudah dibaca'
                                        : 'Tidak ada notifikasi'
                                    }
                                </h3>
                                <p className="text-gray-500 text-center mt-2 max-w-sm">
                                    {activeTab === 'unread' 
                                        ? 'Semua notifikasi Anda telah ditandai sebagai sudah dibaca.' 
                                        : activeTab === 'read'
                                        ? 'Notifikasi yang sudah Anda baca akan muncul di sini.'
                                        : 'Anda akan menerima notifikasi saat ada aktivitas yang terkait dengan akun Anda.'
                                    }
                                </p>
                            </div>
                            ) : (
                            <div className="space-y-2">
                                {filteredNotifications.map(notification => (
                                    <NotificationItem 
                                        key={notification.id} 
                                        notification={notification} 
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                    
                    {filteredNotifications.length > 0 && (
                        <CardFooter className="flex justify-center pb-6">
                            <Button variant="outline">Muat Lebih Banyak</Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Notification;