import React from 'react'

import { 
    BadgeCheck, 
    Bell, 
    ChevronsUpDown, 
    Menu, 
    PanelLeft 
} from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { 
    Avatar, 
    AvatarImage 
} from "@/components/ui/avatar"

import LogoutBtn from './LogoutBtn'
import EachUtils from '@/utils/EachUtils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { LIST_NAVBAR } from '@/constants/listNavbar'

const AccountMobile = () => {
    const { userData } = useAuth();

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=random`;
    
    const profilePictureUrl = userData?.profilePicture 
        ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData?.profilePicture}`
        : avatarUrl;

    return (
        <div className="flex lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Annur Rahman Rahim</span>
                                <img
                                    alt="logo yayasan annur rahman rahim"
                                    src="/logo.png"
                                    className="h-8 w-auto"
                                />
                            </a>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-2 px-5">
                        <EachUtils
                            of={LIST_NAVBAR}
                            render={(item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {item.title}
                                </a>
                            )}
                        />
                    </div>
                    <SheetFooter>
                        {userData ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="ghost" className="w-full">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={profilePictureUrl || avatarUrl} alt={userData?.name} className="object-cover" />
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{userData.name}</span>
                                            <span className="truncate text-xs">{userData.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56 rounded-lg">
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage src={profilePictureUrl || avatarUrl} alt={userData?.name} className="object-cover" />
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">{userData.name}</span>
                                                <span className="truncate text-xs">{userData.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {userData.role === "admin" && (
                                        <>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <PanelLeft />
                                                    Dashboard
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <BadgeCheck />
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Bell />
                                            Pemberitahuan
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <LogoutBtn isMobile={true} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <a
                                href="/sign-in"
                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                                Log in
                            </a>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default AccountMobile