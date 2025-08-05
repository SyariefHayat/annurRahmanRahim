import React from 'react';

export const CampaignHeader = () => {
    return (
        <section aria-label="Program Hero" className="relative w-full h-[500px] flex items-center justify-center bg-[url(/6.webp)] bg-cover bg-center text-white">
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <div className="relative mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
                    Jadilah Bagian dari Perubahan
                </h1>
                <p className="mt-8 text-lg font-medium sm:text-xl">
                    Bantu kami menciptakan dunia yang lebih baik dengan memberikan donasi Anda. 
                    Setiap kontribusi, sekecil apa pun, memiliki dampak besar bagi mereka yang membutuhkan.
                </p>
            </div>
        </section>
    );
};