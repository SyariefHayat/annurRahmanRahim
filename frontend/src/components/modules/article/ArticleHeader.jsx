import React from 'react'

import ClipPathUp from '../element/ClipPath/ClipPathUp'
import ClipPathDown from '../element/ClipPath/ClipPathDown'

const ArticleHeader = () => {
    return (
        <header className="relative w-full h-screen flex items-center justify-center">
            <ClipPathUp />
            <div className="mx-auto max-w-3xl mt-20 px-6 sm:px-8 text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Blog Annur Rahman Rahim</h1>
                <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">Temukan cerita inspiratif, pembaruan aktivitas yayasan, artikel edukatif, dan banyak lagi di sini.</p>
            </div>
            <ClipPathDown />
        </header>
    )
}

export default ArticleHeader