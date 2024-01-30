import { PropsWithChildren, ComponentPropsWithoutRef, FC } from "react";

const Header: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"header">>
> = () => {
  return <div className="h-header-height border-b border-black">Header</div>;
};

export default Header;
