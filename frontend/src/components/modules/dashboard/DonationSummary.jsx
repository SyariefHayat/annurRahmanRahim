import React from 'react'
import { useAtom } from 'jotai'

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
        <div className="space-y-4 p-4 bg-card text-card-foreground rounded-xl border shadow-sm">
            <p className="font-semibold leading-none">Riwayat Donatur</p>
            {recentTransactions.length > 0 ? (
                <EachUtils 
                of={recentTransactions}
                render={(item, index) => (
                    <div key={index} className="flex items-center gap-4 py-2 px-3 border rounded-lg shadow-sm">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={item.userId ? getProfilePicture(item.userId) : ""}
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-gray-200">{getInitial(item.name)}</AvatarFallback>
                            </Avatar>
                            
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
        </div>
    );
};

export default DonationSummary;