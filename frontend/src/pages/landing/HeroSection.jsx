import React from 'react';

import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown';
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp';

const HeroSection = () => {
    return (
        <section aria-label="Hero section" className="relative w-full h-screen flex items-center justify-center">
            <ClipPathUp />

            <div className="mx-auto max-w-3xl mt-20 px-3 sm:px-0 text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Bersama Kita Bisa Membuat Perubahan
                </h1>
                <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
                    Bergabunglah dalam gerakan kebaikan. Donasikan sebagian dari rezeki Anda atau baca cerita inspiratif di blog kami.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/campaign"
                        className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Donasi Sekarang
                    </a>
                    <a href="/article" className="text-sm font-semibold text-gray-900">
                        Baca Blog <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>

            <ClipPathDown />
        </section>
    );
};

export default HeroSection;