import React from 'react'

import SectionLayout from './SectionLayout'
import ClipPathUp from '../modules/element/ClipPath/ClipPathUp'
import ClipPathDown from '../modules/element/ClipPath/ClipPathDown'

const FlexLayout = ({ isClip, isReverse, image, children }) => {
    return (
        <SectionLayout>
            {isClip && <ClipPathUp />}

            <div className={`mx-auto grid max-w-2xl lg:h-screen grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 ${isReverse ? 'lg:flex lg:flex-row-reverse lg:items-center' : 'lg:flex lg:items-center'}`}>
                <div className="lg:w-1/2 lg:pt-4 lg:pr-8">
                    <div className="lg:max-w-lg">
                        {children}
                    </div>
                </div>

                <div className="lg:w-1/2 h-full hidden lg:block">
                    <img
                        src={image}
                        alt=""
                        className="w-[48rem] h-full max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-full md:-ml-4 lg:-ml-0 object-cover object-center"
                    />
                </div>
            </div>

            {isClip && <ClipPathDown />}
        </SectionLayout>
    )
}

export default FlexLayout