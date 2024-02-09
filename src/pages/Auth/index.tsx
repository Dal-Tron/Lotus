import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { CUS_COLORS, URLS } from "src/utils/consts";
import supabase from "src/services/db";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

const AuthPages = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      navigate(`/users/${user?.username}/${URLS.DASHBOARD}`);
    }
  }, [user]);

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: CUS_COLORS.GREEN,
                },
              },
            },
          }}
          providers={["google", "facebook", "linkedin"]}
          showLinks={true}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default AuthPages;
