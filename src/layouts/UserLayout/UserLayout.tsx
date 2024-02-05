import { useEffect, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";
import supabase from "src/services/db";
import { URL_HOME, MSG_ERR_NOT_LOGIN } from "src/lib/consts";

// =======================================================================================================

const UserLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error(MSG_ERR_NOT_LOGIN);
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
      <main className="h-main-height">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
