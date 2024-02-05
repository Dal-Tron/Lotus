import { useNavigate } from "react-router-dom";
import supabase from "../../services/db";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  AUTH_STATES,
  CUS_GREEN,
  ROLES,
  URL_ADMIN,
  URL_DASHBOARD,
} from "../../lib/consts";

// =======================================================================================================

const AuthPages = () => {
  const navigate = useNavigate();
  supabase.auth.onAuthStateChange((e: string, session: any) => {
    if (e == AUTH_STATES.SIGNED_IN) {
      if (session.user.user_metadata.role == ROLES.ADMIN)
        navigate(`/${URL_ADMIN}`);
      else navigate(`/${URL_DASHBOARD}`);
    }
  });

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
                  brand: CUS_GREEN,
                },
              },
            },
          }}
          providers={["google", "facebook"]}
          theme="dark"
          redirectTo={`${process.env.REACT_APP_BASE_URL}/${URL_DASHBOARD}`}
        />
      </div>
    </div>
  );
};

export default AuthPages;
