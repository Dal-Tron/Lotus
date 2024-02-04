import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { URL_HOME, MSG_ERR_NOT_PERMITTED, ROLES } from "../../lib/consts";
import supabase from "../../services/db";

// =======================================================================================================

const AdminLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (
        !session ||
        (session && session.user.user_metadata.role !== ROLES.ADMIN)
      ) {
        toast.error(MSG_ERR_NOT_PERMITTED);
        navigate(`/${URL_HOME}`);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate(`/${URL_HOME}`);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  // useEffect(() => {
  //   if (
  //     !session ||
  //     (session && session.user.user_metadata.role !== ROLES.ADMIN)
  //   ) {
  //     toast.error(MSG_ERR_NOT_PERMITTED);
  //     navigate(`/${URL_HOME}`);
  //   }
  // }, [session]);
  return (
    <div className="bg-cus-black">
      <Header />
      <main className="h-main-height flex gap-4">
        <div className="w-sidebar-width h-full">
          <Sidebar />
        </div>
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
