import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROLES, URLS } from "src/utils/consts";
import { User } from "./Types";
import { ProtectedRoute } from "src/components/common/ProtectedRoute";
import { UserService, AuthService } from "src/services";

const HomePage = React.lazy(() => import("./pages/Home"));
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboard"));
const AuthPages = React.lazy(() => import("./pages/Auth"));

function App() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AuthService.initSession(setSession);
    return AuthService.onAuthStateChange(setSession);
  }, []);

  useEffect(() => {
    if (session) {
      const {
        user: { id },
      } = session;
      UserService.getProfile(id).then((profile) => {
        if (profile) {
          setUser(profile);
        }
      });
    }
  }, [session]);

  const isAdmin = () => {
    return session && user?.role === ROLES.ADMIN;
  };

  return (
    <AuthContext.Provider value={{ session, user, setUser }}>
      <Router>
        <Suspense>
          <Routes>
            <Route path={`/${URLS.HOME}`} element={<HomePage />} />
            <Route
              path={`/users/:id/${URLS.DASHBOARD}`}
              element={<DashboardPage />}
            />
            <Route
              path={`/${URLS.ADMIN}`}
              element={
                <ProtectedRoute
                  element={<AdminDashboardPage />}
                  checkAuth={isAdmin}
                />
              }
            />
            <Route path={`/${URLS.LOGIN}`} element={<AuthPages />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="colored"
        />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
