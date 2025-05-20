import React from 'react';

import { formatCurrency } from '@/lib/utils';
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from '@/utils/calculateProgress';

export const SlugProgress = ({ campaign }) => {
    const progressPercentage = calculateProgress(campaign.collectedAmount, campaign.targetAmount);
    
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(campaign.collectedAmount)}
                </span>
                <span className="text-sm text-gray-500">
                    dari {formatCurrency(campaign.targetAmount)}
                </span>
            </div>
            
            <Progress 
                value={progressPercentage}
                className="h-2 [&>div]:bg-blue-600 bg-gray-100 rounded-full"
                aria-label={`Progress campaign ${campaign.title}`}
            />
            
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-blue-700">
                    {progressPercentage.toFixed(1)}%
                </span>
                <span className="text-gray-500">
                    {campaign.donorCount} Donatur
                </span>
            </div>
        </div>
    );
};