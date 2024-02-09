import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";
import Sidebar from "src/components/common/Sidebar";
import { MSG_ERRS, ROLES, URLS } from "src/utils/consts";
import supabase from "src/services/db";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

type ClildrenFunction = (isExpanded: boolean) => JSX.Element;
const AdminLayout = ({ children }: { children: ClildrenFunction }) => {
  const { session, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      if (!session || (session && user?.role !== ROLES.ADMIN)) {
        toast.error(MSG_ERRS.NOT_PERMITTED);
        navigate(`/${URLS.HOME}`);
      }
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          navigate(`/${URLS.HOME}`);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [user]);

  return (
    <div className="bg-cus-black">
      <Header />
      <main className="h-main-height flex">
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
