import { PropsWithChildren, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import {
  URL_HOME,
  MSG_ERR_NOT_LOGIN,
  MSG_ERR_NOT_PERMITTED,
} from "../../lib/consts";

// =======================================================================================================

const AdminLayout = ({ children }: PropsWithChildren) => {
  const session = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      toast.error(MSG_ERR_NOT_LOGIN);
      navigate(`/${URL_HOME}`);
    } else if (session.user.user_metadata.role !== "admin") {
      toast.error(MSG_ERR_NOT_PERMITTED);
      navigate(`/${URL_HOME}`);
    }
  }, [session]);
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
