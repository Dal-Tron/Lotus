import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { FiUsers } from "react-icons/fi";
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";

// =======================================================================================================

interface SidebarItem {
  id: number;
  text: string;
  to: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 1,
    text: "Users management",
    to: "admin",
  },
];

const Sidebar = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <aside
      className={cx(
        "h-full border-r border-cus-gray-dark p-3 bg-cus-brown",
        isExpanded ? "w-sidebar-width" : "w-fit"
      )}
      aria-label="Sidebar"
    >
      <ul className={cx("relative flex flex-col h-full", isExpanded ? "" : "")}>
        {sidebarItems.map((item) => {
          return (
            <li
              title={isExpanded ? "" : item.text}
              key={item.id}
              className="p-3 border-b border-b-cus-gray-dark hover:text-white"
            >
              <Link to={`/${item.to}`} className="flex items-center gap-2">
                <FiUsers /> {isExpanded ? item.text : ""}
              </Link>
            </li>
          );
        })}

        <button
          className="absolute bottom-0 flex justify-center items-center w-full py-3 text-center border-t border-t-cus-gray-dark"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <RiArrowLeftDoubleFill /> : <RiArrowRightDoubleFill />}
        </button>
      </ul>
    </aside>
  );
};

export default Sidebar;
