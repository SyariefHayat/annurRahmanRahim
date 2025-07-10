import React from 'react'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import EachUtils from '@/utils/EachUtils'
import { LIST_MISI } from '@/constants/listMisi'
import FlexLayout from '@/components/layouts/FlexLayout'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import TeamSection from '@/components/modules/about/TeamSection'
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp'
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown'

const About = () => {
    return (
        <DefaultLayout>
            <Navbar textColor="text-gray-900" />
            <section className="relative w-full h-screen flex items-center justify-center">
                <ClipPathUp />
                
                <div className="mx-auto max-w-3xl mt-20 px-3 sm:px-0 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Selamat Datang di Website Annur Rahman Rahim</h1>
                    <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">Kami adalah komunitas yang bergerak dalam bidang sosial dan edukasi, siap memberikan kontribusi nyata bagi masa depan yang inklusif dan berkelanjutan.</p>
                </div>

                <ClipPathDown />
            </section>

            <FlexLayout image="/langkah-awal.webp">
                <h2 className="text-base/7 font-semibold text-blue-600">Langkah Awal</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Tentang Kami</p>
                <p className="mt-6 text-lg/8 text-gray-600">
                    Terinspirasi dari berbagai isu sosial dan tantangan zaman, organisasi ini lahir sebagai bentuk kepedulian terhadap sesama. Kami berusaha menjembatani kesenjangan melalui program-program pendidikan, pelatihan keterampilan, dan bantuan sosial.
                </p>
                <p className="mt-6 text-lg/8 text-gray-600">
                    Dengan semangat kolaboratif dan pemanfaatan teknologi, kami terus mengembangkan ekosistem yang mendukung pertumbuhan sosial yang adil dan merata.
                </p>
            </FlexLayout>

            <FlexLayout isClip={true} isReverse={true} image="arah-tujuan.webp">
                <h2 className="text-base/7 font-semibold text-blue-600">Arah dan Tujuan</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Visi Kami</p>
                <p className="mt-6 text-lg/8 text-gray-600">
                    Menjadi pusat kolaborasi sosial terdepan yang mendorong perubahan melalui inovasi, edukasi, dan penguatan komunitas.
                </p>
                <p className="mt-6 text-lg/8 text-gray-600">
                    Visi ini menjadi pedoman kami dalam merancang setiap program dan inisiatif yang berdampak luas, terukur, dan berkelanjutan.
                </p>
            </FlexLayout>

            <FlexLayout image="/value-action.webp">
                <h2 className="text-base/7 font-semibold text-indigo-600">Nilai dan Tindakan</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Misi Kami</p>
                <ol className="list-decimal pl-4 text-gray-600 text-lg/8">
                    <EachUtils
                        of={LIST_MISI}
                        render={(item, index) => (
                            <li key={index} className="mt-6">
                                {item.content}
                            </li>
                        )}
                    />
                </ol>
            </FlexLayout>

            <TeamSection />

            <Footer/>
        </DefaultLayout>
    )
}

export default About