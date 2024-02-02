import {
  PropsWithChildren,
  ComponentPropsWithoutRef,
  FC,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import RoundedBtn from "../RoundedBtn";
import {
  LOGIN,
  SIGNUP,
  URL_HOME,
  URL_LOGIN,
  URL_SIGNUP,
} from "../../../lib/consts";

// =======================================================================================================

const Header = ({ session }: { session: any }) => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const handleNav = () => {
    setNav(!nav);
  };
  console.log(session);
  const navItems = [
    { id: 1, text: "Company", to: "company" },
    { id: 2, text: "Resources", to: "resources" },
    { id: 3, text: "About", to: "about" },
    { id: 4, text: "Contact", to: "contact" },
  ];

  return (
    <header>
      <nav className="flex justify-between items-center h-header-height border-b border-cus-gray-dark px-4">
        {/* Logo */}
        <Link to={`/${URL_HOME}`}>
          <h1 className="text-2xl font-bold text-cus-pink">Lotus</h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-3">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="px-3 hover:opacity-80 cursor-pointer duration-300"
            >
              <Link to="#">{item.text}</Link>
            </li>
          ))}
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
            <RoundedBtn
              className="self-center py-1"
              variant="transparent"
              onClick={() => navigate(`/${URL_SIGNUP}`)}
            >
              {SIGNUP}
            </RoundedBtn>
          </div>
        ) : (
          <button className="hidden md:flex">
            <FaRegUser />
          </button>
        )}

        {/* Mobile Navigation Icon */}
        {!session ? (
          <div className="flex items-center gap-2 md:hidden">
            <RoundedBtn
              className="self-center py-1"
              variant="fill"
              onClick={() => navigate(`/${URL_LOGIN}`)}
            >
              {LOGIN}
            </RoundedBtn>
            <RoundedBtn
              className="self-center py-1"
              variant="transparent"
              onClick={() => navigate(`/${URL_SIGNUP}`)}
            >
              {SIGNUP}
            </RoundedBtn>
            <div onClick={handleNav} className="">
              {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 md:hidden">
            <button className="md:hidden">
              <FaRegUser />
            </button>
            <div onClick={handleNav} className="">
              {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        <ul
          className={
            nav
              ? "fixed md:hidden left-0 top-0 w-[80%] sm:w-[60%] h-full bg-cus-brown ease-in-out duration-500"
              : "fixed top-0 bottom-0 left-[-100%] ease-in-out duration-500"
          }
        >
          {/* Mobile Logo */}
          <h1 className="w-full m-4 text-2xl font-bold text-cus-pink">Lotus</h1>
          {/* Mobile Navigation Items */}
          {navItems.map((item) => (
            <li
              key={item.id}
              className="border-b border-cus-gray-dark p-4 hover:text-cus-pink cursor-pointer duration-300"
            >
              {item.text}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
