import React from 'react';

import EachUtils from '@/utils/EachUtils';
import { Toaster } from '@/components/ui/sonner';
import { LIST_NAVBAR } from '@/constants/listNavbar';
import AccountMobile from '@/components/modules/landing/AccountMobile';
import AccountDesktop from '@/components/modules/landing/AccountDesktop';

const Navbar = ({ position }) => {
    return (
        <header className={`w-full ${position ? `${position}` : "absolute z-10"}`}>
            <Toaster />
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Yayasan Annur Rahman Rahim</span>
                        <img
                            alt="logo yayasan annur rahman rahim"
                            src="/logo.png"
                            className="h-14 w-auto"
                        />
                    </a>
                </div>

                <AccountMobile />

                <div className="hidden lg:flex lg:gap-x-12">
                    <EachUtils
                        of={LIST_NAVBAR}
                        render={(item, index) => (
                            <a key={index} href={item.url} className="text-sm/6 font-semibold text-gray-900 cursor-pointer">
                                {item.title}
                            </a>
                        )}
                    />
                </div>

                <AccountDesktop />
            </nav>
        </header>
    );
};

export default Navbar;