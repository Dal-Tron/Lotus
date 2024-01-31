import { ChangeEvent, ReactNode } from "react";
import cx from "classnames";

// =======================================================================================================

interface InputProps {
  id?: string;
  type: "text" | "password" | "email";
  className?: string;
  required: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  errMsg?: string;
  err?: boolean;
  value: string;
  name: string;
}

// =======================================================================================================

const Input = ({
  type,
  id,
  className,
  required,
  onChange,
  label,
  placeholder,
  icon,
  errMsg,
  err,
  value,
  name,
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 text-sm font-medium text-cus-gray-medium"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          className={cx(
            "block border w-full bg-cus-black text-cus-gray-medium rounded ps-10 p-2.5",
            err ? "border-cus-pink" : "border-cus-black",
            className
          )}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          value={value}
          name={name}
        />
      </div>
      <p className="mt-1 text-sm text-cus-pink">{errMsg}</p>
    </div>
  );
};

export default Input;
