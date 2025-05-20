import React from 'react'

import EachUtils from '@/utils/EachUtils'
import { LIST_FOOTER, LIST_SOCIAL_MEDIA } from '@/constants/listFooter'

const Footer = () => {
    return (
        <section aria-label="Footer" className="bg-gray-900 px-6 pt-16 pb-6 flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-between w-full max-w-7xl">
                <div className="flex-1 flex flex-col mr-10 mb-8 md:mb-0">
                    <img
                        src="/logo.png"
                        alt="Yayasan Yatalatop Logo"
                        className="w-[200px] h-auto object-contain"
                    />
                    <p className="text-gray-400 text-[16px] mt-4 leading-[28px] max-w-[300px]">
                        Memberi dengan mudah, berbagi dengan aman, dan membangun harapan bersama.
                    </p>
                </div>

                <div className="flex-[1.5] w-full flex flex-wrap justify-between gap-6">
                    <EachUtils
                        of={LIST_FOOTER}
                        render={(item) => (
                            <div key={item.title} className="min-w-[150px]">
                                <h4 className="text-white text-lg font-semibold mb-3">
                                    {item.title}
                                </h4>
                                <ul className="space-y-4">
                                    {item.links.map((link) => (
                                        <li
                                            key={link.name}
                                            className="text-gray-400 text-[16px] hover:text-secondary cursor-pointer"
                                        >
                                            {link.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="w-full max-w-7xl border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-400 text-sm text-center md:text-left">
                    2025 Yayasan Annur Rahman Rahim, All Rights Reserved.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <EachUtils
                        of={LIST_SOCIAL_MEDIA}
                        render={(item, index) => (
                            <item.icon
                                key={index}
                                alt={item.id}
                                className="w-6 h-6 object-contain cursor-pointer hover:opacity-80 transition text-white"
                            />
                        )}
                    />
                </div>
            </div>
        </section>
    );
};

export default Footer;