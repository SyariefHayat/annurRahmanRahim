import React from 'react'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import EachUtils from '@/utils/EachUtils'
import { LIST_OPERASIONAL } from '@/constants/listOperasional'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ContactForm from '@/components/modules/contact/ContactForm'
import ClipPathDarkUp from '@/components/modules/element/ClipPath/ClipPathDarkUp'
import ClipPathDarkDown from '@/components/modules/element/ClipPath/ClipPathDarkDown'

const Contact = () => {

    return (
        <DefaultLayout>
            <Navbar />
            <div className="relative w-full h-screen flex items-center justify-center bg-[url(/value-action.webp)] bg-cover bg-center text-white">
                <div className="absolute inset-0 bg-black/50 z-0"></div>
                <div className="relative mx-auto max-w-3xl mt-20 px-3 sm:px-0 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Hubungi Yayasan Annur Rahman Rahim</h1>

                    <p className="mt-8 text-lg font-medium sm:text-xl">Kami percaya bahwa setiap kontribusi, besar atau kecil, dapat membawa perubahan positif. Jangan ragu untuk menghubungi kami.</p>
                </div>
            </div>

            <ContactForm />

            {/* <section className="relative my-12">
                <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                    <ClipPathDarkUp />
                    <ClipPathDarkDown />

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                                Jam Operasional
                            </h2>
                            <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
                                Yayasan kami beroperasi pada hari kerja untuk memastikan pelayanan terbaik bagi Anda.
                            </p>
                        </div>

                        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
                                <EachUtils
                                    of={LIST_OPERASIONAL}
                                    render={(item, index) => (
                                        <div key={index} className="flex flex-col-reverse gap-1">
                                            <dt className="text-base/7 text-gray-300">{item.name}</dt>
                                            <dd className="text-4xl font-semibold tracking-tight text-white">{item.value}</dd>
                                        </div>
                                    )}
                                />
                            </dl>
                        </div>
                    </div>
                </div>
            </section> */}

            <Footer />
        </DefaultLayout>
    )
}

export default Contact