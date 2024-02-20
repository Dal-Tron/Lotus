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
  const isAuthenticated = localStorage.getItem(`sb-${process.env.REACT_APP_SUPABASE_PROJECT_ID}-auth-token`) || checkAuth();
console.log(isAuthenticated, process.env.REACT_APP_SUPABASE_PROJECT_ID)
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};
