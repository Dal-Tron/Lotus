import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";
import Sidebar from "src/components/common/Sidebar";
import { URL_HOME, MSG_ERR_NOT_PERMITTED, ROLES } from "src/lib/consts";
import supabase from "src/services/db";

// =======================================================================================================
type ClildrenFunction = (isExpanded: boolean) => JSX.Element;
const AdminLayout = ({ children }: { children: ClildrenFunction }) => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

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
  return (
    <div className="bg-cus-black">
      <Header />
      <main className="h-main-height flex gap-4">
        <div className="min-w-fit h-full">
          <Sidebar
            isExpanded={isSidebarExpanded}
            setIsExpanded={setIsSidebarExpanded}
          />
        </div>
        <div className="w-full h-full">{children(isSidebarExpanded)}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
