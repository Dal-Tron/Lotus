import { PropsWithChildren, ComponentPropsWithoutRef, FC } from "react";

const Footer: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"footer">>
> = () => {
  return (
    <div className="h-footer-height border-t border-cus-gray-dark">Footer</div>
  );
};

export default Footer;
