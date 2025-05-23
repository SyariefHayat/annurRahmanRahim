import React from 'react';
import { Bell } from 'lucide-react';

const NotificationEmptyState = ({ activeTab, searchQuery }) => {
    const getEmptyStateContent = () => {
        if (activeTab === 'unread') {
            return {
                title: 'Tidak ada notifikasi yang belum dibaca',
                description: 'Semua notifikasi telah ditandai sebagai sudah dibaca.'
            };
        }
        
        if (activeTab === 'read') {
            return {
                title: 'Tidak ada notifikasi yang sudah dibaca',
                description: 'Notifikasi yang sudah dibaca akan muncul di sini.'
            };
        }
        
        if (searchQuery) {
            return {
                title: 'Tidak ditemukan',
                description: 'Tidak ada notifikasi yang sesuai dengan pencarian.'
            };
        }
        
        return {
            title: 'Tidak ada notifikasi',
            description: 'Notifikasi sistem akan muncul di sini.'
        };
    };

    const { title, description } = getEmptyStateContent();

    return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
                {description}
            </p>
        </div>
    );
};

export default NotificationEmptyState;