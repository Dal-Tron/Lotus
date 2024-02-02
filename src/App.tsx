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
        <UserLayout session={session}>
          <HomePage />
        </UserLayout>
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

  return <RouterProvider router={router} />;
}

export default App;
