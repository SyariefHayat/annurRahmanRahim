import SectionLayout from '@/components/layouts/SectionLayout'
import ClipPathUp from '@/components/modules/element/ClipPath/ClipPathUp'
import { LIST_TEAM } from '@/constants/listTeam'
import EachUtils from '@/utils/EachUtils'
import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ClipPathDown from '@/components/modules/element/ClipPath/ClipPathDown'
import { getInitial } from '@/utils/getInitial'

const TeamSection = () => {
    return (
        <SectionLayout>
            <ClipPathUp />

            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Tim Kami</h2>
                <p className="mt-2 text-lg/8 text-gray-600">Kenali orang-orang hebat di balik Yatallatop. Mereka adalah individu yang berdedikasi untuk menciptakan perubahan positif.</p>
            </div>

            <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-300 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <EachUtils
                    of={LIST_TEAM}
                    render={(item, index) => (
                        <article
                            key={index} 
                            className="group flex max-w-xl h-[450px] flex-col items-center justify-center gap-5 rounded-xl ring-1 shadow-lg ring-gray-400/10 relative overflow-hidden bg-gray-100 transition-transform hover:scale-105"
                        >
                            <Avatar className="w-40 h-40 border-4 border-white rounded-full overflow-hidden">
                                <AvatarImage src={item.image} />
                                <AvatarFallback>{getInitial(item.name)}</AvatarFallback>
                            </Avatar>
                            
                            <header className="text-center">
                                <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.job}</p>
                            </header>
                            <footer className="flex gap-4 text-gray-500">
                                <FaFacebook className="text-xl hover:text-blue-600 transition-colors cursor-pointer" />
                                <FaInstagram className="text-xl hover:text-pink-500 transition-colors cursor-pointer" />
                                <FaTwitter className="text-xl hover:text-blue-400 transition-colors cursor-pointer" />
                            </footer>
                        </article>
                    )}
                />
            </div>

            <ClipPathDown />
        </SectionLayout>
    )
}

export default TeamSection