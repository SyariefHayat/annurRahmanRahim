import { useAtom } from 'jotai';
import { Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';

import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader 
} from '@/components/ui/card';

import { messagesAtom } from '@/jotai/atoms';
import { useAuth } from '@/context/AuthContext';
import { getInitial } from '@/utils/getInitial';
import { getProfilePicture } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getRelativeTime } from '@/utils/formatDate';
import { Separator } from '@/components/ui/separator';
import { MessagePagination } from './MessagePagination';
import { apiInstanceExpress } from '@/services/apiInstance';
import { toast } from 'sonner';

export const MessageList = () => {
    const { userData } = useAuth();
    const [messages, setMessages] = useAtom(messagesAtom);

    const [anonymousIdStorage, setAnonymousIdStorage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('anonymousId') || '';
        };

        return '';
    });

    useEffect(() => {
        if (anonymousIdStorage && typeof window !== 'undefined') {
            localStorage.setItem('anonymousId', anonymousIdStorage);
        };
    }, [anonymousIdStorage]);

    const handlePray = async (donorId) => {
        let finalAnonymousId = anonymousIdStorage;
        if (!userData && !finalAnonymousId) {
            finalAnonymousId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setAnonymousIdStorage(finalAnonymousId);
        }

        try {
            const response = await apiInstanceExpress.post("amen/create", {
                donorId,
                ...(userData ? { userId: userData._id } : { anonymousId: finalAnonymousId })
            });

            if (response.status === 200) {
                const { amen, amensCount } = response.data.data;
                
                setMessages(prevMessages => 
                    prevMessages.map(message => {
                        if (message._id === donorId) {
                            const userHasAmen = amen;
                            
                            let updatedAmens = [...message.amens || []];
                            
                            if (userHasAmen) {
                                const alreadyAmen = updatedAmens.some(amenObj => 
                                    (userData && amenObj.userId === userData._id) || 
                                    (!userData && amenObj.anonymousId === finalAnonymousId)
                                );
                                
                                if (!alreadyAmen) {
                                    updatedAmens.push(userData 
                                        ? { userId: userData._id } 
                                        : { anonymousId: finalAnonymousId }
                                    );
                                }
                            } 
                            else {
                                updatedAmens = updatedAmens.filter(amenObj => 
                                    !(userData ? amenObj.userId === userData._id : amenObj.anonymousId === finalAnonymousId)
                                );
                            };
                            
                            return {
                                ...message,
                                amens: updatedAmens
                            };
                        }
                        return message;
                    })
                );
            }
        } catch (error) {
            console.error("Error giving amen:", error);
            toast.error("Gagal mengaminkan doa");
        };
    };

    if (!messages || messages.length === 0) {
        return (
            <Card className="w-full py-12">
                <CardContent className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">Belum Ada Doa</h3>
                        <p className="text-gray-600 mt-2">Jadilah yang pertama memberikan doa untuk kampanye ini</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {messages.map((item, index) => (
                <Card key={index} className="flex flex-col h-full">
                    <CardHeader>
                        <div className="flex items-center gap-x-4">
                            <Avatar className="h-14 w-14 bg-gray-200">
                                <AvatarImage 
                                    src={item.userId ? getProfilePicture(item.userId) : ""} 
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback>
                                    {getInitial(item.isAnonymous ? "Orang baik" : item.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="text-sm/6">
                                <p className="font-semibold text-gray-900">
                                    {item.isAnonymous ? "Orang baik" : item.name}
                                </p>
                                <p className="text-gray-600">{getRelativeTime(item.date)}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                        <div className="flex flex-col h-full">
                            <p className="text-gray-600">{item.message}</p>
                            <p className="text-sm/6 mt-auto pt-5 text-gray-600">
                                <span className="text-gray-900 font-semibold">{(item.amens || []).length} Orang</span> mengaminkan doa ini
                            </p>
                        </div>
                    </CardContent>

                    <Separator />

                    <CardFooter className="h-5 flex items-center">
                        <Button 
                            variant="ghost"
                            className="mx-auto flex items-center gap-2 cursor-pointer"
                            onClick={() => handlePray(item._id)}
                        >
                            <Heart
                                className={`${
                                    item.amens?.some(amen => 
                                        (userData && amen.userId === userData._id) || 
                                        (!userData && amen.anonymousId === anonymousIdStorage)
                                    ) 
                                    ? "text-red-400 fill-red-400" 
                                    : ""
                                }`} 
                            />
                            <span>Amin</span>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            
            <div className="col-span-full flex justify-center mt-6" > 
                <MessagePagination />
            </div>
        </div>
    );
};