import { PropsWithChildren, ComponentPropsWithoutRef, FC } from "react";

const Footer: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"footer">>
> = () => {
  return (
    <div className="h-footer-height border-t border-cus-gray-dark text-center">
      <p>We are inevitable!</p>
      <p>© 2024</p>
    </div>
  );
};

export default Footer;
