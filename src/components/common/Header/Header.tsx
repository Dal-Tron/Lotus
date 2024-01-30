import React, { ComponentPropsWithoutRef, FC } from "react";

const Header: FC<
  React.PropsWithChildren<ComponentPropsWithoutRef<"header">>
> = () => {
  return <div className="h-header-height border-b border-black">Header</div>;
};

export default Header;
