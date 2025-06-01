import React from 'react'
import { useAtom } from 'jotai'
import { CheckCircle, Clock } from 'lucide-react';

import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { programDataAtom } from '@/jotai/atoms';

const Timeline = () => {
    const [programData] = useAtom(programDataAtom);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-6">Timeline Kegiatan</h3>
            {programData.timeline && programData.timeline.length > 0 ? (
                programData.timeline.map((timelineItem, index) => (
                    <div key={index} className="relative">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                    {index + 1}
                                </span>
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {timelineItem.title}
                                    </h4>
                                    <Badge variant="outline" className="text-xs">
                                        {formatDate(timelineItem.date)}
                                    </Badge>
                                </div>
                                {timelineItem.activities && timelineItem.activities.length > 0 && (
                                    <ul className="space-y-1">
                                        {timelineItem.activities.map((activity, actIndex) => (
                                            <li key={actIndex} className="text-gray-600 flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                {activity}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {index < programData.timeline.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Timeline belum tersedia</p>
                </div>
            )}
        </div>
    )
}

export default Timeline;