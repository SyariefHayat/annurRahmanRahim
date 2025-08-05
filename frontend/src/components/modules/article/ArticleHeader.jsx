import React from 'react'

const ArticleHeader = () => {
    return (
        <section aria-label="Program Hero" className="relative w-full h-[500px] flex items-center justify-center bg-[url(/arah-tujuan.webp)] bg-cover bg-center text-white">
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <div className="relative mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Artikel Kami</h1>
                <p className="mt-8 text-lg font-medium sm:text-xl">Temukan cerita inspiratif, pembaruan aktivitas yayasan, artikel edukatif, dan banyak lagi di sini.</p>
            </div>
        </section>
    )
}

export default ArticleHeader