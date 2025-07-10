import React from 'react'
import SectionLayout from '@/components/layouts/SectionLayout'

const AboutSection = () => {
    return (
        <SectionLayout label="About Section">
            <div className="space-y-8 lg:space-y-12">
                <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 xl:gap-12">
                    <div className="w-full lg:w-[40%] xl:w-[35%]">
                        <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                            Tentang Kami
                        </h2>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:leading-14 text-pretty text-gray-900 sm:text-3xl lg:text-4xl xl:text-5xl">
                            Yayasan An-nur Rahman Rahim
                        </h1>
                    </div>
                    <div className="w-full lg:w-[60%] xl:w-[65%]">
                        <p className="text-lg/8 text-gray-600">
                            Kami adalah lembaga sosial-keagamaan yang berkomitmen menghadirkan dampak positif bagi masyarakat Indonesia melalui program keagamaan, pendidikan, sosial, dan kemanusiaan. Kami percaya bahwa kepedulian, solidaritas, dan gotong royong adalah fondasi penting dalam membangun bangsa yang lebih adil dan berkeadaban.
                        </p>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Melalui aksi nyata dan kolaborasi bersama para dermawan serta relawan, kami terus bergerak menyebarkan kebaikan yang berkelanjutan dan merangkul keberagaman sebagai kekuatan untuk menciptakan masa depan yang lebih sejahtera bagi semua.
                        </p>
                    </div>
                </div>
                
                <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-[550px] 2xl:h-[500px] overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg">
                    <div className="absolute inset-0 bg-[url(/5.webp)] bg-cover bg-center bg-no-repeat" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>
        </SectionLayout>
    )
}

export default AboutSection