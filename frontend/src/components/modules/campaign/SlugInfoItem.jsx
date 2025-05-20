import React from 'react';

export const SlugInfoItem = ({ icon, label, value }) => {
    return (
        <div className="py-3 flex items-center gap-3">
            {icon}
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
};