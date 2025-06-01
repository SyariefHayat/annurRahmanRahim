import React from 'react';
import { useAtom } from 'jotai';
import { Lightbulb, Target } from 'lucide-react';

import { programDataAtom } from '@/jotai/atoms';

const Overview = () => {
    const [programData] = useAtom(programDataAtom);

    return (
        <div className="space-y-6">
            {programData?.summary?.[0]?.background && (
                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Latar Belakang
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        {programData.summary[0].background}
                    </p>
                </div>
            )}

            {programData?.summary?.[0]?.objectives?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" />
                        Tujuan Program
                    </h3>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        {programData.summary[0].objectives.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Overview