import { Navigate, Outlet } from 'react-router-dom';
import { mobileAuthService } from '../../services/mobileAuth.service';

export const MobileProtectedRoute = () => {
  if (!mobileAuthService.isAutenticado()) {
    return <Navigate to="/mobile/login" replace />;
  }
  return <Outlet />;
};
