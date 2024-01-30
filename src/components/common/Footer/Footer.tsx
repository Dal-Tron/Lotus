import { PropsWithChildren, ComponentPropsWithoutRef, FC } from "react";

const Footer: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"footer">>
> = () => {
  return <div className="h-footer-height border-t border-black">Footer</div>;
};

export default Footer;
