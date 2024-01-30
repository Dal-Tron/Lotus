import React, { ComponentPropsWithoutRef, FC } from "react";

const Footer: FC<
  React.PropsWithChildren<ComponentPropsWithoutRef<"footer">>
> = () => {
  return <div className="h-footer-height border-t border-black">Footer</div>;
};

export default Footer;
