import React from 'react';
import { useAtom } from 'jotai';
import { CheckCircle } from 'lucide-react';

import { programDataAtom } from '@/jotai/atoms'

const Support = () => {
    const [programData] = useAtom(programDataAtom);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Dukungan yang Diharapkan</h3>
            {programData.supportExpected && programData.supportExpected.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {programData.supportExpected.map((support, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{support}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Informasi dukungan belum tersedia</p>
                </div>
            )}
        </div>
    )
}

export default Support