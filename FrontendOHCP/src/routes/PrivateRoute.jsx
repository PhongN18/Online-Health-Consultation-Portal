import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
