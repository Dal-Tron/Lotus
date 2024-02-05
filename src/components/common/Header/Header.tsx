import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import RoundedBtn from "../RoundedBtn";
import {
  APP_NAME,
  LOGIN,
  ROLES,
  SIGNOUT,
  SIGNUP,
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
  const [nav, setNav] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const handleNav = () => {
    setNav(!nav);
  };
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
                  <Link to={`/${URL_ADMIN}`}>Admin</Link>
                </li>
                <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                  <Link to={`/${URL_DASHBOARD}`}>Dashboard</Link>
                </li>
              </>
            ) : (
              <li className="px-3 hover:opacity-80 cursor-pointer duration-300">
                Dashboard
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
          <div className="relative hidden md:flex">
            <button
              className="hidden md:flex"
              id="menu-button"
              aria-expanded={true}
              aria-haspopup={true}
              type="button"
              onClick={() => setShowPopup(!showPopup)}
            >
              <FaRegUser />
            </button>
            {showPopup ? (
              <div
                className="absolute right-0 top-5 z-10 mt-2 w-40 origin-top-right rounded-md bg-cus-gray-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <div className="p-3" role="none" ref={dropdownMenuRef}>
                  <button
                    className="w-full flex items-center gap-3"
                    onClick={signout}
                  >
                    <FaSignOutAlt /> {SIGNOUT}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {!session ? (
          <div className="flex items-center gap-2 md:hidden">
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
            <div onClick={handleNav} className="">
              {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 md:hidden">
            <div className="relative">
              <button
                className="md:hidden"
                id="menu-button"
                aria-expanded={true}
                aria-haspopup={true}
                onClick={() => setShowPopup(!showPopup)}
              >
                <FaRegUser />
              </button>
              {showPopup ? (
                <div
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-cus-gray-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                >
                  <div className="p-3" role="none">
                    <button
                      className="w-full flex items-center gap-3"
                      onClick={signout}
                    >
                      <FaSignOutAlt /> {SIGNOUT}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <div onClick={handleNav} className="">
              {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>
          </div>
        )}
        <ul
          className={
            nav
              ? "fixed md:hidden left-0 top-0 w-[80%] sm:w-[60%] h-full bg-cus-brown ease-in-out duration-500 z-10"
              : "fixed top-0 bottom-0 left-[-100%] ease-in-out duration-500"
          }
        >
          <h1 className="w-full m-4 text-2xl font-bold text-cus-pink">
            {APP_NAME}
          </h1>
          {session ? (
            session.user.user_metadata.role == ROLES.ADMIN ? (
              <>
                <li className="border-b border-cus-gray-dark p-4 hover:text-cus-pink cursor-pointer duration-300">
                  <Link to={`/${URL_ADMIN}`}>Admin</Link>
                </li>
                <li className="border-b border-cus-gray-dark p-4 hover:text-cus-pink cursor-pointer duration-300">
                  <Link to={`/${URL_DASHBOARD}`}>Dashboard</Link>
                </li>
              </>
            ) : (
              <li className="border-b border-cus-gray-dark p-4 hover:text-cus-pink cursor-pointer duration-300">
                Dashboard
              </li>
            )
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
