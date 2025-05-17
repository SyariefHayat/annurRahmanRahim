import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!currentUser || !userData) return <Navigate to="/" />;
    
    // return currentUser.role === 'admin' ? children : <Navigate to="/unauthorized" />;
    return userData.role === 'admin' ? children : <p>404 Not found</p>;
};

export default ProtectedAdminRoute;