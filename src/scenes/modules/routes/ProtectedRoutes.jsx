import { Navigate, useLocation } from 'react-router-dom';
import { appConfig } from '../../../config/appConfig';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!sessionStorage.getItem('token');
    const location = useLocation();
    const authLogin = appConfig.api.auth.login;
    if (!isAuthenticated) {
        return <Navigate to={authLogin} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;