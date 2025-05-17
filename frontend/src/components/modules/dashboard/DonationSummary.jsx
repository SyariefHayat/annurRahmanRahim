import React from 'react'
import { useAtom } from 'jotai'

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import EachUtils from '@/utils/EachUtils';
import { getProfilePicture } from '@/lib/utils';
import { getInitial } from '@/utils/getInitial';
import { allTransactionsAtom } from '@/jotai/atoms';

const DonationSummary = () => {
    const [transactions] = useAtom(allTransactionsAtom);

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Donatur Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentTransactions.length > 0 ? (
                    <EachUtils 
                        of={recentTransactions}
                        render={(item, index) => (
                            <div key={index} className="flex items-center gap-4 py-2 px-3 border rounded-lg shadow-sm">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={getProfilePicture(item)}
                                        referrerPolicy="no-referrer"
                                    />
                                    <AvatarFallback className="bg-gray-200">{getInitial(item.name)}</AvatarFallback>
                                </Avatar>
                                {/* <Avatar className="h-10 w-10">
                                    {item.provider === "google" ? (
                                        <AvatarImage 
                                            src={item.profilePicture}
                                            alt={item?.username} 
                                            className="object-cover" 
                                        />
                                    ) : (
                                        <AvatarImage className="object-cover" src={
                                            item?.campaignId?.donors[index]?.userId?.profilePicture
                                            ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.campaignId.donors[index].userId.profilePicture}`
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.name)}&background=random`
                                        } />
                                    )}
                                </Avatar> */}
                                
                                <div className="flex-1">
                                    <p className="font-medium text-sm line-clamp-1">{item.username || "Orang Baik"}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">{item.email}</p>
                                    <p className="font-semibold text-sm text-green-600 line-clamp-1">
                                        Rp{item.amount.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-4">Belum ada notifikasi baru</div>
                )}
            </CardContent>
        </Card>
    )
}

export default DonationSummary