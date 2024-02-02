import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import supabase from "./services/db";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import {
  URL_ADMIN,
  URL_DASHBOARD,
  URL_HOME,
  URL_LOGIN,
  URL_SIGNUP,
} from "./lib/consts";

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
        <UserLayout>
          <Home />
        </UserLayout>
      ),
    },
    {
      path: URL_ADMIN,
      element: (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      ),
    },
    {
      path: URL_DASHBOARD,
      element: (
        <UserLayout>
          <Dashboard session={session} />
        </UserLayout>
      ),
    },
    {
      path: URL_LOGIN,
      element: <Login />,
    },
    {
      path: URL_SIGNUP,
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
