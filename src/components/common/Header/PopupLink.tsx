import { Link } from "react-router-dom";
import { ReactNode } from "react";

// =======================================================================================================

interface PopupLinkProps {
  to: string;
  text: string;
  icon?: ReactNode;
}

// =======================================================================================================

const PopupLink = ({ to, text, icon }: PopupLinkProps) => {
  return (
    <li className="px-3 py-1 hover:bg-cus-gray-medium rounded cursor-pointer duration-300">
      <Link to={`/${to}`} className="flex items-center gap-3">
        {icon} {text}
      </Link>
    </li>
  );
};

export default PopupLink;
