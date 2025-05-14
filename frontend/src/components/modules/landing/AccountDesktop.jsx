import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Bell, PanelLeft } from 'lucide-react'

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
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import LogoutBtn from './LogoutBtn'
import { useAuth } from '@/context/AuthContext'
import { getProfilePicture } from '@/lib/utils'
import { getInitial } from '@/utils/getInitial'

const AccountDesktop = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    return (
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {userData ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="size-9 ring-2 ring-white shadow-sm cursor-pointer">
                            <AvatarImage 
                                src={userData ? getProfilePicture(userData) : ""}
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-gray-200">
                                {getInitial(userData.username)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-10 min-w-56 rounded-lg">
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-9 ring-2 ring-white shadow-sm">
                                    <AvatarImage 
                                        src={userData ? getProfilePicture(userData) : ""}
                                        referrerPolicy="no-referrer"
                                    />
                                    <AvatarFallback className="bg-gray-200">
                                        {getInitial(userData.username)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userData?.username}</span>
                                    <span className="truncate text-xs">{userData?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {userData.role === "admin" && (
                            <>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                                        <PanelLeft className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(`/profile/${userData._id}`)}>
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/profile/${userData._id}`)}>
                                <Bell className="mr-2 h-4 w-4" />
                                Pemberitahuan
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <LogoutBtn isMobile={false}/>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <a href="/sign-in" className="text-sm/6 font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                </a>
            )}
        </div>
    )
}

export default AccountDesktop