import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { URL_HOME } from "../../lib/consts";

// =======================================================================================================

const AdminLayout = ({
  children,
  session,
}: PropsWithChildren<{ session: any }>) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      navigate(`/${URL_HOME}`);
    }
  }, [session]);
  return (
    <div className="bg-cus-black">
      <Header session={session} />
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
