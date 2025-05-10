import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;