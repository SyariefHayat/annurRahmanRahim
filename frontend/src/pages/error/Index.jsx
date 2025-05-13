// 1. Buat komponen ErrorBoundary
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorBoundary() {
    const error = useRouteError();
    
    // Jika ini adalah error dari React Router
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
        return (
            <div className="flex flex-col text-center items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
                <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak ditemukan.</p>
                <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Kembali ke Beranda
                </a>
            </div>
        );
        }
        
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Error {error.status}</h1>
            <p className="text-gray-600 mb-6">{error.statusText || error.data?.message}</p>
            <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Kembali ke Beranda
            </a>
        </div>
        );
    }
    
    // Untuk error JavaScript umum
    return (
        <div className="flex flex-col text-center items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Oops! Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-6">Maaf, terjadi kesalahan yang tidak terduga.</p>
            <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Kembali ke Beranda
            </a>
        </div>
    );
}

// 2. Buat komponen NotFound khusus untuk 404
function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak ditemukan.</p>
            <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Kembali ke Beranda
            </a>
        </div>
    );
}

export { ErrorBoundary, NotFound };