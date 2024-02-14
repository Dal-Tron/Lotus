import { Suspense, lazy, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "src/components/common/ProtectedRoute";
import { AuthContext } from "src/contexts/AuthContext";
import { AuthService, UserService } from "src/services";
import { ROLES, URLS } from "src/utils/consts";
import { User } from "./Types";

const HomePage = lazy(() => import("./pages/Home"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboard"));
const SignInPage = lazy(() => import("./pages/SignIn"));

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

  const isUser = () => {
    return session;
  };

  return (
    <AuthContext.Provider value={{ session, user, setUser }}>
      <Router>
        <Suspense>
          <Routes>
            <Route path={`/${URLS.HOME}`} element={<HomePage />} />
            <Route
              path={`/users/:id/${URLS.DASHBOARD}`}
              element={
                <ProtectedRoute
                  element={<DashboardPage />}
                  checkAuth={isUser}
                />
              }
            />
            <Route
              path={`/users/:id/${URLS.SETTINGS}`}
              element={
                <ProtectedRoute element={<SettingsPage />} checkAuth={isUser} />
              }
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
            <Route path={`/${URLS.SIGN_IN}`} element={<SignInPage />} />
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
