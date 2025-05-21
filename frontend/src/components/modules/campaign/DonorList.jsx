import React from 'react';
import { useAtom } from 'jotai';

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';

import { 
    formatCurrency, 
    getProfilePicture 
} from '@/lib/utils';

import { donorDataAtom } from '@/jotai/atoms';
import { getInitial } from '@/utils/getInitial';
import { DonorPagination } from './DonorPagination';
import { getRelativeTime } from '@/utils/formatDate';
import { Card, CardContent } from '@/components/ui/card';

export const DonorList = () => {
    const [donorData] = useAtom(donorDataAtom);

    if (!donorData || donorData.length === 0) {
        return (
            <Card className="w-full py-12">
                <CardContent className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">Belum Ada Donasi</h3>
                        <p className="text-gray-600 mt-2">Jadilah yang pertama berdonasi untuk kampanye ini</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {donorData.map((item, index) => (
                <Card key={index}>
                    <CardContent className="flex items-center gap-x-4 py-4">
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
                            <p className="text-gray-600">
                                Berdonasi sebesar <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                            </p>
                            <p className="text-xs/6 text-gray-600">{getRelativeTime(item.date)}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            <div className="col-span-full flex justify-center mt-6">
                <DonorPagination />
            </div>
        </div>
    );
};