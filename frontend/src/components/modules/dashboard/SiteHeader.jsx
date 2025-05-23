import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const SiteHeader = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Add navigate function or use proper routing method
    const navigate = (path) => {
        window.location.href = path;
    };

    return (
        <header className="sticky z-50 -top-2 sm:top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {/* Home breadcrumb */}
                    <BreadcrumbItem className="cursor-pointer">
                        <BreadcrumbLink onClick={() => navigate("/")}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    {/* Looping untuk path selanjutnya */}
                    {pathSegments.map((segment, index) => {
                        const formattedText = segment
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase());

                        const currentPath = "/" + pathSegments.slice(0, index + 1).join("/");

                        // Cek apakah segment terakhir adalah ID setelah '/create' atau '/edit'
                        const isLast = index === pathSegments.length - 1;
                        const isCreateOrEditWithId =
                            pathSegments.length >= 4 &&
                            ["article", "campaign"].includes(pathSegments[pathSegments.length - 3]) &&
                            ["create", "edit"].includes(pathSegments[pathSegments.length - 2]) &&
                            isLast;

                        if (isCreateOrEditWithId) {
                            return null; // Jangan render breadcrumb untuk ID
                        }

                        return (
                            <React.Fragment key={segment + index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="cursor-pointer">
                                    {isLast ? (
                                        <BreadcrumbPage>{formattedText}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink onClick={() => navigate(currentPath)}>
                                            {formattedText}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    )
}

export default SiteHeader