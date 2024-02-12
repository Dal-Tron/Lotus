import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { CUS_COLORS, URLS } from "src/utils/consts";
import supabase from "src/services/db";
import { useContext, useEffect } from "react";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate(`/users/${user?.username}/${URLS.DASHBOARD}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default SignIn;
