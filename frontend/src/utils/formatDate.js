// Menghitung selisih hari antara dua tanggal
const differenceTime = (first, end) => {
    const createdAt = new Date(first);
    const deadline = new Date(end);

    const diffTime = deadline - createdAt; // Selisih dalam milidetik
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Konversi ke hari

    return diffDays;
};

// Format tanggal menjadi "Month DD, YYYY" (contoh: April 9, 2025)
const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
};

// Menampilkan waktu relatif seperti "3 menit yang lalu"
const getRelativeTime = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "baru saja";
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 30) return `${days} hari yang lalu`;
    if (months < 12) return `${months} bulan yang lalu`;
    return `${years} tahun yang lalu`;
};

const getDaysRemaining = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Berakhir";
    if (diffDays === 0) return "Hari ini";
    return `${diffDays} hari`;
}

function getTime(dateInput) {
    const date = new Date(dateInput);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}.${minutes}`;
}

export { differenceTime, formatDate, getRelativeTime, getDaysRemaining, getTime };