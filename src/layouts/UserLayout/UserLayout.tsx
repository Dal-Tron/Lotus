import { PropsWithChildren } from "react";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MSG_ERR_NOT_LOGIN, URL_HOME } from "../../lib/consts";
import { toast } from "react-toastify";

// =======================================================================================================

const UserLayout = ({
  children,
  session,
}: PropsWithChildren<{ session: any }>) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) {
      toast.error(MSG_ERR_NOT_LOGIN);
      navigate(`/${URL_HOME}`);
    }
  }, [session]);
  return (
    <div className="bg-cus-black">
      <Header session={session} />
      <main className="h-main-height">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
