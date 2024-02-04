import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "./services/db";
import {
  URL_ADMIN,
  URL_DASHBOARD,
  URL_FORGOT_PWD,
  URL_HOME,
  URL_LOGIN,
  URL_SIGNUP,
  URL_UPDATE_PWD,
} from "./lib/consts";

const HomePage = React.lazy(() => import("./pages/Home"));
const LoginPage = React.lazy(() => import("./pages/Login"));
const SignupPage = React.lazy(() => import("./pages/Signup"));
const ForgotPwdPage = React.lazy(() => import("./pages/ForgotPwd"));
const UpdatePwdPage = React.lazy(() => import("./pages/UpdatePwd"));
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboard"));

// =======================================================================================================

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={session}>
      <Router>
        <Suspense>
          <Routes>
            <Route path={`/${URL_HOME}`} element={<HomePage />} />
            <Route path={`/${URL_LOGIN}`} element={<LoginPage />} />
            <Route path={`/${URL_SIGNUP}`} element={<SignupPage />} />
            <Route path={`/${URL_FORGOT_PWD}`} element={<ForgotPwdPage />} />
            <Route path={`/${URL_UPDATE_PWD}`} element={<UpdatePwdPage />} />
            <Route path={`/${URL_DASHBOARD}`} element={<DashboardPage />} />
            <Route path={`/${URL_ADMIN}`} element={<AdminDashboardPage />} />
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
