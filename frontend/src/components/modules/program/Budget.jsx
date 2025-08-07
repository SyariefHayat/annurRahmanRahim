import React from 'react';
import { useAtom } from 'jotai';
import { DollarSign } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { programDataAtom } from '@/jotai/atoms';

const Budget = () => {
    const [programData] = useAtom(programDataAtom);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Rincian Anggaran</h3>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Anggaran</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(programData.targetBudget)}
                    </p>
                </div>
            </div>
            
            {programData.budgetBreakdown && programData.budgetBreakdown.length > 0 ? (
                <div className="space-y-3">
                    {programData.budgetBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{item.item}</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(item.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Rincian anggaran belum tersedia</p>
                </div>
            )}
        </div>
    )
}

export default Budget;