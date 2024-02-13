import { useContext } from "react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "src/contexts/AuthContext";
import { AuthService } from "src/services";
import { APP_NAME, ROLES, TEXT_URLS, URLS } from "src/utils/consts";

const Header = () => {
  const { session, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate(`/${URLS.SIGN_IN}`);
  };

  const handleSignOut = async () => {
    const { error } = await AuthService.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      navigate(`/${URLS.HOME}`);
    }
  };

  return (
    <header>
      <div className="flex flex-row p-4 justify-between">
        <Link to={`/${URLS.HOME}`}>
          <h1 className="text-2xl font-bold text-cus-pink">{APP_NAME}</h1>
        </Link>
        <div className="flex gap-4">
          {session && user?.role === ROLES.ADMIN && (
            <Link to={`/${URLS.ADMIN}`}>{TEXT_URLS.ADMIN}</Link>
          )}
          {session && (
            <Link to={`/users/${user?.username}/${URLS.DASHBOARD}`}>
              {TEXT_URLS.DASHBOARD}
            </Link>
          )}
          {session && (
            <Link to={`/users/${user?.username}/${URLS.SETTINGS}`}>
              {TEXT_URLS.SETTINGS}
            </Link>
          )}
        </div>
        {session ? (
          <button onClick={handleSignOut}>
            <FaSignOutAlt />
          </button>
        ) : (
          <button onClick={handleSignIn}>
            <FaSignInAlt />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
