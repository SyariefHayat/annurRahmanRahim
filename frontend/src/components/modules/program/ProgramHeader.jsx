import React from 'react'

const ProgramHeader = () => {
    return (
        <section aria-label="Program Hero" className="relative w-full h-[500px] flex items-center justify-center bg-[url(/4.webp)] bg-cover bg-center text-white">
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <div className="relative mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
                Program Kemitraan & Investasi
                </h1>
                <p className="mt-8 text-lg font-medium sm:text-xl">
                Bergabunglah bersama kami dalam menciptakan dampak sosial yang berkelanjutan. Temukan peluang kemitraan dan investasi untuk mendukung misi Yayasan Annur Rahman Rahim.
                </p>
            </div>
        </section>
    )
}

export default ProgramHeader