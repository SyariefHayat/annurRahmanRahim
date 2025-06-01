import {
    Home,
    FileText,
    HandCoins,
    Bell,
    Settings,
    MessageSquareText,
    User,
    Receipt,
    ClipboardList,
} from "lucide-react";

export const LIST_NAVBAR = [
    {
        title: "Beranda",
        url: "/"
    },
    {
        title: "Sosial",
        url: "/campaign"
    },
    {
        title: "Artikel",
        url: "/article"
    },
    {
        title: "Program",
        url: "/program"
    },
    {
        title: "Kontak",
        url: "/contact"
    },
    {
        title: "Tentang kami",
        url: "/about-us"
    }
]

export const LIST_NAVBAR_DB = [
    {
        title: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: Home,
            },
        ],
    },
    {
        title: "Manajemen",
        items: [
            {
                title: "User",
                url: "/dashboard/user",
                icon: User,
            },
            {
                title: "Donasi",
                url: "/dashboard/campaign",
                icon: HandCoins,
            },
            {
                title: "Artikel",
                url: "/dashboard/article",
                icon: FileText,
            },
            {
                title: "Program",
                url: "/dashboard/program",
                icon: ClipboardList,
            },
            {
                title: "Komentar",
                url: "/dashboard/comment",
                icon: MessageSquareText,
            },
            {
                title: "Donatur",
                url: "/dashboard/donor",
                icon: Receipt,
            },
        ],
    },
    {
        title: "Lainnya",
        items: [
            {
                title: "Notifikasi",
                url: "/dashboard/notification",
                icon: Bell,
            },
            {
                title: "Pengaturan",
                url: "/dashboard/setting",
                icon: Settings,
            },
        ],
    },
];
