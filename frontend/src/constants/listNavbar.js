import {
    Home,
    FileText,
    HandCoins,
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

export const LIST_NAVBAR_DB_PD = [
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
                title: "Pengaturan",
                url: "/dashboard/setting",
                icon: Settings,
            },
        ],
    },
];

export const LIST_NAVBAR_DB_CO = [
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
                title: "Pengaturan",
                url: "/dashboard/setting",
                icon: Settings,
            },
        ],
    },
];
