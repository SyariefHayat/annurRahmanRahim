import {
    Home,
    FileText,
    HandCoins,
    Bell,
    Settings,
    MessageSquareText,
    User,
    Receipt,
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
            // {
            //     title: "Statistik",
            //     url: "/admin/statistics",
            //     icon: BarChart3,
            // },
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
                title: "Artikel",
                url: "/dashboard/article",
                icon: FileText,
            },
            {
                title: "Donasi",
                url: "/dashboard/campaign",
                icon: HandCoins,
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
