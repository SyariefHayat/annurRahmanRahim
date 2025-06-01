import React, { useState } from 'react';

import { 
    FileText, 
    Clock, 
    DollarSign,
    CheckCircle,
} from 'lucide-react';

import TabContent from './TabContent';

const TabsProgram = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Ringkasan', icon: FileText },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'budget', label: 'Anggaran', icon: DollarSign },
        { id: 'support', label: 'Dukungan', icon: CheckCircle }
    ];

    return (
        <div className="space-y-8 px-6 lg:px-0">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                                activeTab === id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <TabContent activeTab={activeTab} />
            </div>
        </div>
    );
};

export default TabsProgram;