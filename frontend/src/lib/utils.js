import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
}

export const getProfilePicture = (user) => {
    return user.provider === 'google'
        ? user.profilePicture
        : `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${user.profilePicture}`;
};

// src={
//     item.userId?.provider === "google"
//         ? item.userId.profilePicture
//         : item.userId?.profilePicture
//         ? item.userId.profilePicture
//         : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=random`
// }