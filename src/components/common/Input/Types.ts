import { ChangeEvent, ReactNode } from "react";

export interface InputProps {
  id?: string;
  type: "text" | "password" | "email" | "file";
  className?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  errMsg?: string;
  err?: boolean;
  value?: string;
  name: string;
  readOnly?: boolean;
  defaultValue?: string;
}
