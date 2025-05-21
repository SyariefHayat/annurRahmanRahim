import React from 'react';
import { Heart } from 'lucide-react';

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

import { getInitial } from '@/utils/getInitial';
import { getProfilePicture } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DonorPagination } from './DonorPagination';
import { getRelativeTime } from '@/utils/formatDate';
import { Separator } from '@/components/ui/separator';

export const MessageList = ({ messages, pagination, currentPage, setCurrentPage }) => {
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
                <Card key={index} className="gap-2 pb-0">
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

                    <CardContent>
                        <div className="flex flex-col">
                            <p className="text-gray-600">{item.message}</p>
                            <p className="text-sm/6 mt-5 text-gray-600">
                                <span className="text-gray-900 font-semibold">{(item.amens || []).length} Orang</span> mengaminkan doa ini
                            </p>
                        </div>
                    </CardContent>

                    <Separator className="mt-2"/>

                    <CardFooter className="mb-3 mt-1">
                        <Button 
                            variant="ghost"
                            className="mx-auto flex items-center gap-2 cursor-pointer"
                            // onClick={() => handlePray(item._id)}
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
                <DonorPagination 
                    pagination={pagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};