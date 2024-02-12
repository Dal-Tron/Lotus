import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineMenu } from "react-icons/ai";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import RoundedBtn from "../RoundedBtn";
import { APP_NAME, ROLES, TEXT_BTNS, TEXT_URLS, URLS } from "src/utils/consts";
import supabase from "src/services/db";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

const Header = () => {
  const { session, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target as Node)
    ) {
      setShowPopup(false);
    }
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      navigate(`/${URLS.HOME}`);
    }
  };

  return (
    <header>
      <nav className="flex justify-between items-center h-header-height border-b border-cus-gray-dark px-4">
        <Link to={`/${URLS.HOME}`}>
          <h1 className="text-2xl font-bold text-cus-pink">{APP_NAME}</h1>
        </Link>
        <ul className="hidden md:flex gap-3">
          {session ? (
            user?.role === ROLES.ADMIN ? (
              <>
                <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                  <Link to={`/${URLS.ADMIN}`}>{TEXT_URLS.ADMIN}</Link>
                </li>
                <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                  <Link to={`/users/${user?.username}/${URLS.DASHBOARD}`}>
                    {TEXT_URLS.DASHBOARD}
                  </Link>
                </li>
              </>
            ) : (
              <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                <Link to={`/users/${user?.username}/${URLS.DASHBOARD}`}>
                  {TEXT_URLS.DASHBOARD}
                </Link>
              </li>
            )
          ) : null}
        </ul>
        {!session ? (
          <div className="hidden md:flex gap-4">
            <RoundedBtn
              className="self-center py-1"
              variant="fill"
              onClick={() => navigate(`/${URLS.SIGN_IN}`)}
            >
              {TEXT_BTNS.SIGN_IN}
            </RoundedBtn>
          </div>
        ) : (
          <div className="relative">
            <button
              className=""
              id="menu-button"
              aria-haspopup={true}
              type="button"
              onClick={() => setShowPopup(!showPopup)}
            >
              <FaRegUser className="hidden md:block" />
              <AiOutlineMenu size={20} className="block md:hidden" />
            </button>
            {showPopup ? (
              <div
                className="absolute right-0 top-5 z-10 mt-2 w-40 origin-top-right rounded-md bg-cus-gray-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
                ref={dropdownMenuRef}
              >
                <div className="hidden md:block" role="none">
                  <button
                    className="px-3 py-1 w-full flex items-center gap-3 hover:bg-cus-gray-medium rounded duration-300"
                    onClick={signout}
                  >
                    <FaSignOutAlt /> {TEXT_BTNS.SIGNOUT}
                  </button>
                </div>
                <div className="block md:hidden" role="none">
                  <ul className="border-b border-cus-gray-medium pb-2">
                    {session ? (
                      user?.role === ROLES.ADMIN ? (
                        <>
                          <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                            <Link
                              to={`/${URLS.ADMIN}`}
                              className="flex items-center gap-3"
                            >
                              <MdOutlineAdminPanelSettings /> {TEXT_URLS.ADMIN}
                            </Link>
                          </li>
                          <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                            <Link
                              to={`/users/${user?.username}/${URLS.DASHBOARD}`}
                              className="flex items-center gap-3"
                            >
                              <MdOutlineSpaceDashboard /> {TEXT_URLS.DASHBOARD}
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                          <Link
                            to={`/users/${user?.username}/${URLS.DASHBOARD}`}
                            className="flex items-center gap-3"
                          >
                            <MdOutlineSpaceDashboard /> {TEXT_URLS.DASHBOARD}
                          </Link>
                        </li>
                      )
                    ) : null}
                  </ul>
                  <button
                    className="px-3 py-1 mt-3 hover:bg-cus-gray-medium w-full flex items-center rounded gap-3 duration-300"
                    onClick={signout}
                  >
                    <FaSignOutAlt /> {TEXT_BTNS.SIGNOUT}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
