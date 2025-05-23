import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
    Check, 
    Trash2, 
    Bell, 
    FileText, 
    Heart, 
    MessageCircle, 
    Settings, 
    NotepadText 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NotificationItem = ({ notification, onMarkAsRead, onDelete, index }) => {
    const getNotificationIcon = (type) => {
        const iconProps = "w-4 h-4 sm:w-5 sm:h-5";
        switch (type) {
            case 'campaign':
                return <NotepadText className={`${iconProps} text-blue-500`} />;
            case 'article':
                return <FileText className={`${iconProps} text-green-500`} />;
            case 'like':
                return <Heart className={`${iconProps} text-pink-500`} />;
            case 'comment':
                return <MessageCircle className={`${iconProps} text-purple-500`} />;
            case 'system':
                return <Settings className={`${iconProps} text-orange-500`} />;
            default:
                return <Bell className={`${iconProps} text-gray-500`} />;
        }
    };

    const getTypeBadge = (type) => {
        const badgeClasses = "text-xs px-2 py-1";
        switch(type) {
            case 'campaign':
                return <Badge variant="outline" className={`${badgeClasses} bg-blue-50 text-blue-700`}>Campaign</Badge>;
            case 'article':
                return <Badge variant="outline" className={`${badgeClasses} bg-green-50 text-green-700`}>Article</Badge>;
            case 'like':
                return <Badge variant="outline" className={`${badgeClasses} bg-red-50 text-red-700`}>Like</Badge>;
            case 'comment':
                return <Badge variant="outline" className={`${badgeClasses} bg-yellow-50 text-yellow-700`}>Comment</Badge>;
            case 'system':
                return <Badge variant="outline" className={`${badgeClasses} bg-gray-50 text-gray-700`}>System</Badge>;
            default:
                return <Badge variant="outline" className={`${badgeClasses} bg-gray-50 text-gray-700`}>{type}</Badge>;
        }
    };

    return (
        <div 
            className={`p-3 sm:p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
        >
            <div className="flex items-start gap-2 sm:gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <h4 className={`text-sm font-medium truncate ${
                                !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                                {notification.title}
                            </h4>
                            {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: id })}
                        </span>
                    </div>
                    
                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                    
                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Badge and date */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {getTypeBadge(notification.type)}
                            <span className="text-xs text-gray-500 hidden sm:inline">
                                {format(new Date(notification.createdAt), 'd MMM yyyy, HH:mm', { locale: id })}
                            </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification, index);
                                    }}
                                >
                                    <Check size={12} className="mr-1" />
                                    <span className="hidden sm:inline">Tandai Dibaca</span>
                                    <span className="sm:hidden">Baca</span>
                                </Button>
                            )}
                            
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(notification, index);
                                }}
                            >
                                <Trash2 size={12} className="mr-1" />
                                <span className="hidden sm:inline">Hapus</span>
                                <span className="sm:hidden">Del</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;