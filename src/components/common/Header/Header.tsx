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
import {
  APP_NAME,
  LOGIN,
  ROLES,
  SIGNOUT,
  SIGNUP,
  TEXT_URL_ADMIN,
  TEXT_URL_DASHBOARD,
  URL_ADMIN,
  URL_DASHBOARD,
  URL_HOME,
  URL_LOGIN,
  URL_SIGNUP,
} from "src/lib/consts";
import supabase from "src/services/db";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

const Header = () => {
  const session = useContext(AuthContext);
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
      navigate(`/${URL_HOME}`);
    }
  };

  return (
    <header>
      <nav className="flex justify-between items-center h-header-height border-b border-cus-gray-dark px-4">
        <Link to={`/${URL_HOME}`}>
          <h1 className="text-2xl font-bold text-cus-pink">{APP_NAME}</h1>
        </Link>
        <ul className="hidden md:flex gap-3">
          {session ? (
            session.user.user_metadata.role == ROLES.ADMIN ? (
              <>
                <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                  <Link to={`/${URL_ADMIN}`}>{TEXT_URL_ADMIN}</Link>
                </li>
                <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                  <Link to={`/${URL_DASHBOARD}`}>{TEXT_URL_DASHBOARD}</Link>
                </li>
              </>
            ) : (
              <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                {TEXT_URL_DASHBOARD}
              </li>
            )
          ) : null}
        </ul>
        {!session ? (
          <div className="hidden md:flex gap-4">
            <RoundedBtn
              className="self-center py-1"
              variant="fill"
              onClick={() => navigate(`/${URL_LOGIN}`)}
            >
              {LOGIN}
            </RoundedBtn>
            {/* <RoundedBtn
              className="self-center py-1"
              variant="transparent"
              onClick={() => navigate(`/${URL_SIGNUP}`)}
            >
              {SIGNUP}
            </RoundedBtn> */}
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
                    <FaSignOutAlt /> {SIGNOUT}
                  </button>
                </div>
                <div className="block md:hidden" role="none">
                  <ul className="border-b border-cus-gray-medium pb-2">
                    {session ? (
                      session.user.user_metadata.role == ROLES.ADMIN ? (
                        <>
                          <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                            <Link
                              to={`/${URL_ADMIN}`}
                              className="flex items-center gap-3"
                            >
                              <MdOutlineAdminPanelSettings /> {TEXT_URL_ADMIN}
                            </Link>
                          </li>
                          <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                            <Link
                              to={`/${URL_DASHBOARD}`}
                              className="flex items-center gap-3"
                            >
                              <MdOutlineSpaceDashboard /> {TEXT_URL_DASHBOARD}
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
                          <Link
                            to={`/${URL_DASHBOARD}`}
                            className="flex items-center gap-3"
                          >
                            <MdOutlineSpaceDashboard /> {TEXT_URL_DASHBOARD}
                          </Link>
                        </li>
                      )
                    ) : null}
                  </ul>
                  <button
                    className="px-3 py-1 mt-3 hover:bg-cus-gray-medium w-full flex items-center rounded gap-3 duration-300"
                    onClick={signout}
                  >
                    <FaSignOutAlt /> {SIGNOUT}
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
