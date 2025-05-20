import React from 'react';

import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';

export const CampaignHeader = () => {
    return (
        <header className="relative w-full h-screen flex items-center justify-center">
            <ClipPathUp />
            <div className="mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Jadilah Bagian dari Perubahan
                </h1>
                <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
                    Bantu kami menciptakan dunia yang lebih baik dengan memberikan donasi Anda. 
                    Setiap kontribusi, sekecil apa pun, memiliki dampak besar bagi mereka yang membutuhkan.
                </p>
            </div>
            <ClipPathDown />
        </header>
    );
};