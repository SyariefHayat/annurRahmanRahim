import React from 'react'
import { Search } from "lucide-react"
import { Bell, Sun } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInput } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"

const SiteHeader = () => {
    return (
        <header className="sticky z-50 -top-2 sm:top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* <form className="w-full sm:ml-auto sm:w-auto">
                <div className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder="Type to search..."
                        className="pl-7"
                    />
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                </div>
            </form> */}
            {/* <Notification /> */}
            {/* <TopUpButton /> */}
        </header>
    )
}

export default SiteHeader