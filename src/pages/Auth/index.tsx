import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AUTH_STATES, CUS_COLORS, ROLES, URLS } from "src/lib/consts";
import supabase from "src/services/db";

// =======================================================================================================

const AuthPages = () => {
  const navigate = useNavigate();
  supabase.auth.onAuthStateChange((e: string, session: any) => {
    console.log(session);
    if (e === AUTH_STATES.SIGNED_IN) {
      if (session.user.user_metadata.role == ROLES.ADMIN)
        navigate(`/${URLS.ADMIN}`);
      else navigate(`/${URLS.DASHBOARD}`);
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
                  brand: CUS_COLORS.GREEN,
                },
              },
            },
          }}
          providers={["google", "facebook", "linkedin"]}
          theme="dark"
          redirectTo={`${process.env.REACT_APP_BASE_URL}/${URLS.DASHBOARD}`}
        />
      </div>
    </div>
  );
};

export default AuthPages;
