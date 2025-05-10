import React from 'react'

const SectionLayout = ({ children, label, divStyle }) => {
    return (
        <section aria-label={label} className="relative py-14 sm:py-24">
            <div className={`mx-auto max-w-7xl ${divStyle ? divStyle : "px-6"} lg:px-8`}>
                {children}
            </div>
        </section>
    )
}

export default SectionLayout