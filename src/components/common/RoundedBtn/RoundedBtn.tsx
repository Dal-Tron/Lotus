import { MouseEvent, PropsWithChildren } from "react";
import cx from "classnames";

interface RoundedBtnProps {
  variant: "fill" | "transparent";
  className?: string;
  onClick: VoidFunction;
}

const RoundedBtn = ({
  variant,
  children,
  className,
  onClick,
}: PropsWithChildren<RoundedBtnProps>) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cx(
        "rounded-full",
        "px-4",
        "duration-300",
        `${className}`,
        `${
          variant == "fill"
            ? "border border-cus-pink bg-cus-pink hover:opacity-75"
            : "border border-cus-gray-light bg-transparent hover:opacity-75"
        }`
      )}
    >
      {children}
    </button>
  );
};

export default RoundedBtn;
