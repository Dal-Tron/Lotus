import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "./services/db";
import { URLS } from "./lib/consts";

const HomePage = React.lazy(() => import("./pages/Home"));
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboard"));
const AuthPages = React.lazy(() => import("./pages/Auth"));

// =======================================================================================================

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={session}>
      <Router>
        <Suspense>
          <Routes>
            <Route path={`/${URLS.HOME}`} element={<HomePage />} />
            <Route path={`/${URLS.DASHBOARD}`} element={<DashboardPage />} />
            <Route path={`/${URLS.ADMIN}`} element={<AdminDashboardPage />} />
            <Route path={`/${URLS.LOGIN}`} element={<AuthPages />} />
            <Route path="*" element={<Navigate to="/" replace />} />
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
