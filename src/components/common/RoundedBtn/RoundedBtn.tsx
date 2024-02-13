import cx from "classnames";
import { MouseEvent, PropsWithChildren } from "react";

interface Props {
  variant: "fill" | "transparent";
  className?: string;
  onClick?: VoidFunction;
  disabled?: boolean;
}

const RoundedBtn = ({
  variant,
  children,
  className,
  onClick,
  disabled,
}: PropsWithChildren<Props>) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cx(
        "rounded-full px-4 duration-300",
        variant === "fill"
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
