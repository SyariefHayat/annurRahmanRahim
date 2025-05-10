import React from "react"
import { Link } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

import NavUser from "./NavUser"
import EachUtils from "@/utils/EachUtils"
import { LIST_NAVBAR_DB } from "@/constants/listNavbar"

const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-10 p-1 items-center justify-center rounded-lg text-sidebar-primary-foreground bg-gray-300">
                                    <img src="/logo.png" alt="logo yayasan" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="truncate font-semibold">Annur Rahman Rahim</span>
                                    <span className="truncate">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <EachUtils
                    of={LIST_NAVBAR_DB}
                    render={(item, index) => (
                        <SidebarGroup key={index}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <EachUtils
                                        of={item.items}
                                        render={(item, index) => (
                                            <SidebarMenuItem key={index}>
                                                <SidebarMenuButton asChild>
                                                    <Link to={item.url}>
                                                        <item.icon size={20} color='#9ca3af' />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )}
                                    />
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar