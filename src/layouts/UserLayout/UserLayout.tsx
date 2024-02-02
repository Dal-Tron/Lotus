import { PropsWithChildren } from "react";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { URL_HOME } from "../../lib/consts";

// =======================================================================================================

const UserLayout = ({
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
      <main className="h-main-height">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
