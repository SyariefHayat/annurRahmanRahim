import React from 'react'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ContactForm from '@/components/modules/contact/ContactForm'

const Contact = () => {

    return (
        <DefaultLayout>
            <Navbar />
            <div className="relative w-full h-[500px] flex items-center justify-center bg-[url(/8.webp)] bg-cover bg-center text-white">
                <div className="absolute inset-0 bg-black/50 z-0"></div>
                <div className="relative mx-auto max-w-3xl mt-20 px-3 sm:px-0 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Hubungi Kami</h1>

                    <p className="mt-8 text-lg font-medium sm:text-xl">Kami percaya bahwa setiap kontribusi, besar atau kecil, dapat membawa perubahan positif. Jangan ragu untuk menghubungi kami.</p>
                </div>
            </div>

            <ContactForm />

            <Footer />
        </DefaultLayout>
    )
}

export default Contact