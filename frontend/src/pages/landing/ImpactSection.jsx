import React from 'react'

import SectionLayout from '@/components/layouts/SectionLayout'
import RadialPath from '@/components/modules/element/RadialPath'

const ImpactSection = () => {
    return (
        <SectionLayout label="Impact Section" divStyle="px-0">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 pb-16 sm:pb-0 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                <RadialPath />

                <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                    <h2 className="text-base/7 font-semibold text-indigo-600">Dampak Kami</h2>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Perubahan Nyata bagi Sesama</p>
                    <p className="mt-6 text-lg/8 text-gray-300">
                        Berkat dukungan Anda, kami telah menyalurkan bantuan kepada ribuan penerima manfaat.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                        <a
                            href="/program/sosial"
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Donasi Sekarang
                        </a>
                        <a href="/program/sosial" className="text-sm/6 font-semibold text-white">
                            Lihat Lainnya <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>

                <div className="hidden sm:block relative mt-16 h-80 lg:mt-8">
                    <img
                        alt="App screenshot"
                        src="img.jpg"
                        className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                    />
                </div>
            </div>
        </SectionLayout>
    );
};

export default ImpactSection;