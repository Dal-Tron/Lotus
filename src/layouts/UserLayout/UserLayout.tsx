import { useEffect, PropsWithChildren } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";
import supabase from "src/services/db";
import { MSG_ERRS, URLS } from "src/utils/consts";
import { extractUsernameFromPath } from "src/utils/helpers";

// =======================================================================================================

const UserLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const extractedUsername = extractUsernameFromPath(pathname);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error(MSG_ERRS.NOT_LOGGED_IN);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        navigate(`/${URLS.HOME}`);
      } else if (session.user.user_metadata.username !== extractedUsername) {
        toast.error(MSG_ERRS.NOT_FOUND);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        navigate(`/${URLS.HOME}`);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate(`/${URLS.HOME}`);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-cus-black">
      <Header />
      <main className="min-h-[var(--main-height)]">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
