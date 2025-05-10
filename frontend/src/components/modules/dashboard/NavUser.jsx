import React from "react"
import { toast } from "sonner";
import { signOut } from "firebase/auth";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Settings,
	Sparkles,
} from "lucide-react";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import { auth } from "@/services/firebase";
import { useAuth } from "@/context/AuthContext";
import { getInitial } from "@/utils/getInitial";
import { apiInstanceExpress } from "@/services/apiInstance";

const NavUser = () => {
    const { userData, currentUser } = useAuth();
	const { isMobile } = useSidebar();

    const handleSignOut = async () => {
        const toastId = toast.loading("Mengeluarkan akun anda...");
        try {
            const token = await currentUser.getIdToken();
            const userSignOut = await apiInstanceExpress.post("/sign-out", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (userSignOut.status === 200) {
                toast.success("Sign out berhasil", { id: toastId });
                await signOut(auth);
            }
        } catch (error) {
            console.error(error)
            toast.error("Sign out gagal", { id: toastId });
        } 
    };

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={userData.profilePicture} />
								<AvatarFallback className="rounded-lg">{getInitial(userData.username)}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{userData.username}</span>
								<span className="truncate text-xs">{userData.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={userData.profilePicture} />
									<AvatarFallback className="rounded-lg">{getInitial(userData.username)}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{userData.username}</span>
									<span className="truncate text-xs">{userData.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* <DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator /> */}
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							{/* <DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem> */}
							<DropdownMenuItem>
								<Settings />
								Pengaturan
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Pemberitahuan
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<LogOut />
							Keluar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export default NavUser