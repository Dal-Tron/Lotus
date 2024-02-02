import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import supabase from "./services/db";
import { useState, useEffect } from "react";
import {
  URL_ADMIN,
  URL_DASHBOARD,
  URL_HOME,
  URL_LOGIN,
  URL_SIGNUP,
} from "./lib/consts";
import DashboardPage from "./pages/Dashboard";
import AdminDashboardPage from "./pages/AdminDashboard";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import AnonLayout from "./layouts/AnonLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const router = createBrowserRouter([
    {
      path: URL_HOME,
      element: (
        <AnonLayout session={session}>
          <HomePage />
        </AnonLayout>
      ),
    },
    {
      path: URL_ADMIN,
      element: (
        <AdminLayout session={session}>
          <AdminDashboardPage />
        </AdminLayout>
      ),
    },
    {
      path: URL_DASHBOARD,
      element: (
        <UserLayout session={session}>
          <DashboardPage session={session} />
        </UserLayout>
      ),
    },
    {
      path: URL_LOGIN,
      element: <LoginPage />,
    },
    {
      path: URL_SIGNUP,
      element: <SignupPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
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
    </>
  );
}

export default App;
