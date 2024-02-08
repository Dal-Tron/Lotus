import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AUTH_STATES, CUS_COLORS, URLS } from "src/utils/consts";
import supabase from "src/services/db";
import { useEffect } from "react";
import { randomStringGenerator } from "src/utils/helpers";

// =======================================================================================================

const AuthPages = () => {
  const navigate = useNavigate();
  const newUsername = randomStringGenerator(12);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e) => {
      if (e === AUTH_STATES.SIGNED_IN) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        navigate(`/${URLS.DASHBOARD}`);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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
          additionalData={{
            role: "normal",
            username: newUsername,
          }}
          providers={["google", "facebook", "linkedin"]}
          showLinks={true}
          theme="dark"
          redirectTo={`${process.env.REACT_APP_BASE_URL}/users/${newUsername}/${URLS.DASHBOARD}`}
        />
      </div>
    </div>
  );
};

export default AuthPages;
