import React from 'react'

import EachUtils from '@/utils/EachUtils'
import { LIST_FEATURES } from '@/constants/listFeatures'
import SectionLayout from '@/components/layouts/SectionLayout'

const FeatureSection = () => {
    return (
        <SectionLayout label="Feature Section">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pt-4 lg:pr-8">
                    <div className="lg:max-w-lg">
                        <h2 className="text-base/7 font-semibold text-indigo-600">Dukung Kami</h2>
                        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Kemudahan dalam Berdonasi</p>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Bersama kita bisa membantu lebih banyak orang. Salurkan donasi Anda dengan mudah dan cepat untuk mereka yang membutuhkan.
                        </p>

                        <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                            <EachUtils
                                of={LIST_FEATURES}
                                render={(item, index) => (
                                    <div key={index} className="relative pl-9">
                                        <dt className="font-semibold text-gray-900">
                                            <item.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-600" />
                                            {item.title}
                                        </dt>{' '}
                                        <dd>{item.desc}</dd>
                                    </div>
                                )}
                            />
                        </dl>
                    </div>
                </div>

                <img src="/feature.jpg" alt="Ilustrasi kemudahan berdonasi melalui platform kami" className="hidden sm:block w-full max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-full sm:h-full md:-ml-4 lg:-ml-0 object-cover object-center" />
            </div>
        </SectionLayout>
    )
}

export default FeatureSection