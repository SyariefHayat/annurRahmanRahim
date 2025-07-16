import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!currentUser || !userData) return <Navigate to="/" />;

    const allowedRoles = ['fundraiser', 'project curator', 'project manager', 'developer'];

    if (allowedRoles.includes(userData.role)) return children;

    return <Navigate to="/unauthorized" />;
};

export default ProtectedAdminRoute;