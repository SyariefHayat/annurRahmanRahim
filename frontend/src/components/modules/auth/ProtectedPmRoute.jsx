import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!currentUser || !userData) return <Navigate to="/" />;

    // Daftar role yang diizinkan
    const allowedRoles = ['coordinator', 'product manager', 'developer'];

    // Cek apakah role user termasuk yang diizinkan
    if (allowedRoles.includes(userData.role)) {
        return children;
    }

    // Arahkan ke halaman unauthorized
    return <Navigate to="/unauthorized" />;
};

export default ProtectedAdminRoute;