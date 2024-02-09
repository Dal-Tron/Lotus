import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: ReactElement;
  checkAuth: () => boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  checkAuth,
}) => {
  const location = useLocation();
  const isAuthenticated = checkAuth();

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
