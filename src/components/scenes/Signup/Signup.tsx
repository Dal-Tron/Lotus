import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { toast } from "react-toastify";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";
import { useFormFields } from "src/lib/hooksLib";
import {
  BACK_TO_HOME,
  CUS_GRAY_MEDIUM,
  SIGNUP,
  URL_HOME,
} from "src/lib/consts";
import supabase from "src/services/db";

// =======================================================================================================

const Signup = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    email: "",
    username: "",
    password: "",
  };
  const [formValues, handleFieldChange] = useFormFields(initialForm);
  // useEffect(() => {
  //   const { email, password } = formValues;
  //   if (validateForm({ email, password })) {
  //     setIsFormValidated(true);
  //   } else {
  //     setIsFormValidated(false);
  //   }
  // }, [formValues]);

  // const validateForm = ({
  //   email,
  //   password,
  // }: {
  //   email: string;
  //   password: string;
  // }) => {
  //   return (
  //     email.trim().length > 0 && validator.isEmail(email.trim())
  //     // && validator.isStrongPassword(password.trim(), { returnScore: false })
  //   );
  // };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    const { email, password, username, fullname } = formValues;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullname,
          role: "normal",
        },
        emailRedirectTo: `${process.env.REACT_APP_BASE_URL}/dashboard`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "We've sent an email with magic link. Please confirm your email with it."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <h1 className="mb-10 text-5xl font-extrabold text-center">{SIGNUP}</h1>
        <form onSubmit={(e) => handleSignup(e)}>
          <div className="flex flex-col gap-2 mb-10">
            <Input
              name="email"
              id="email"
              type="email"
              label="Email"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineEmail style={{ fill: CUS_GRAY_MEDIUM }} />}
              err={false}
              value={formValues.email}
              required={true}
            />
            <Input
              name="username"
              id="username"
              type="text"
              label="Username"
              onChange={(e) => handleFieldChange(e)}
              icon={<AiOutlineUser style={{ fill: CUS_GRAY_MEDIUM }} />}
              err={false}
              value={formValues.username}
              required={true}
            />
            <Input
              name="fullname"
              id="fullname"
              type="text"
              label="Full name"
              onChange={(e) => handleFieldChange(e)}
              icon={<AiOutlineUser style={{ fill: CUS_GRAY_MEDIUM }} />}
              err={false}
              value={formValues.fullname}
              required={true}
            />
            <Input
              name="password"
              id="password"
              type={showPwd ? "text" : "password"}
              label="Password"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineLock style={{ fill: CUS_GRAY_MEDIUM }} />}
              err={false}
              value={formValues.password}
              required={true}
            />
            <button
              className="flex items-center gap-1 text-cus-gray-medium hover:text-cus-gray-light duration-300"
              type="button"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? (
                <IoMdEyeOff style={{ fill: CUS_GRAY_MEDIUM }} />
              ) : (
                <IoMdEye style={{ fill: CUS_GRAY_MEDIUM }} />
              )}
              Show password
            </button>
          </div>
          <div className="flex justify-between">
            <RoundedBtn
              variant="fill"
              className="p-3 w-[10rem]"
              disabled={loading}
            >
              {SIGNUP}
            </RoundedBtn>
            <RoundedBtn
              variant="transparent"
              className="p-3 w-[10rem]"
              onClick={() => navigate(`/${URL_HOME}`)}
            >
              {BACK_TO_HOME}
            </RoundedBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
