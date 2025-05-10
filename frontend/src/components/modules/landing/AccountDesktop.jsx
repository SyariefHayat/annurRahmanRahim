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
    AvatarImage 
} from "@/components/ui/avatar"

import LogoutBtn from './LogoutBtn'
import { useAuth } from '@/context/AuthContext'

const AccountDesktop = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=random`;
    
    const profilePictureUrl = userData?.profilePicture 
        ? `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${userData?.profilePicture}`
        : avatarUrl;

    return (
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {userData ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="w-10 h-10 cursor-pointer">
                            <AvatarImage src={profilePictureUrl || avatarUrl} alt={userData?.username} className="object-cover" />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-10 min-w-56 rounded-lg">
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={profilePictureUrl || avatarUrl} alt={userData?.username} className="object-cover" />
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userData?.username || "Guest User"}</span>
                                    <span className="truncate text-xs">{userData?.email || "guest@example.com"}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {userData.role === "admin" && (
                            <>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
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