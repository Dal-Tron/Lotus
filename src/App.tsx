import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import supabase from "./services/db";
import { useState, useEffect } from "react";

// =======================================================================================================

// =======================================================================================================

function App() {
  // const [session, setSession] = useState(null)

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  // }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <UserLayout>
          <Home />
        </UserLayout>
      ),
    },
    {
      path: "admin",
      element: <AdminLayout>Starter</AdminLayout>,
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
