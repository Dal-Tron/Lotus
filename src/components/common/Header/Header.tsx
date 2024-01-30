import { PropsWithChildren, ComponentPropsWithoutRef, FC } from "react";

const Header: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"header">>
> = () => {
  return (
    <div className="h-header-height border-b border-cus-gray-dark">Header</div>
  );
};

export default Header;
