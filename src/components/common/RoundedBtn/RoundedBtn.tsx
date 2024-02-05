import { MouseEvent, PropsWithChildren } from "react";
import cx from "classnames";
import { RoundedBtnProps } from "./Types";

// =======================================================================================================

const RoundedBtn = ({
  variant,
  children,
  className,
  onClick,
  disabled,
}: PropsWithChildren<RoundedBtnProps>) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cx(
        "rounded-full px-4 duration-300",
        variant == "fill"
          ? "border border-cus-pink bg-cus-pink hover:opacity-80"
          : "border border-cus-gray-light bg-transparent hover:opacity-80",
        className
      )}
    >
      {disabled ? "Loading..." : children}
    </button>
  );
};

export default RoundedBtn;
