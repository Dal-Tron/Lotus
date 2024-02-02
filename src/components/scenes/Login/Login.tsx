import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "../../common/Input";
import RoundedBtn from "../../common/RoundedBtn";
import { useFormFields } from "../../../lib/hooksLib";
import supabase from "../../../services/db";
import {
  CUS_GRAY_MEDIUM,
  LOGIN,
  URL_ADMIN,
  URL_DASHBOARD,
  URL_HOME,
} from "../../../lib/consts";
import googleLogo from "../../../assets/images/logo-google.png";
import fbLogo from "../../../assets/images/logo-facebook.png";

// =======================================================================================================

const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    email: "",
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

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { email, password } = formValues;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      alert("Failed to log in");
    } else {
      if (data?.user?.user_metadata.role === "admin") {
        navigate(`/${URL_ADMIN}`);
      } else {
        navigate(`/${URL_DASHBOARD}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <h1 className="mb-10 text-5xl font-extrabold text-center">Log in</h1>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="flex flex-col gap-2 mb-10">
            <Input
              name="email"
              id="email"
              type="email"
              label="Email"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineEmail style={{ fill: CUS_GRAY_MEDIUM }} />}
              // errMsg="Invalid email"
              err={false}
              value={formValues.email}
              required={true}
            />
            <Input
              name="password"
              id="password"
              type={showPwd ? "text" : "password"}
              label="Password"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineLock style={{ fill: CUS_GRAY_MEDIUM }} />}
              // errMsg="Invalid email"
              err={false}
              value={formValues.password}
              required={true}
            />
            <div className="flex justify-between w-full">
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
              <button
                className="text-cus-gray-medium hover:text-cus-gray-light duration-300"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <RoundedBtn
              variant="fill"
              className="p-3 w-[10rem] align-self"
              onClick={() => console.log(LOGIN)}
              disabled={loading}
            >
              {LOGIN}
            </RoundedBtn>
            <button type="button">
              <img src={googleLogo} width="40" />
            </button>
            <button type="button">
              <img src={fbLogo} width="40" />
            </button>
            <RoundedBtn
              variant="transparent"
              className="p-3 w-[10rem]"
              onClick={() => navigate(`/${URL_HOME}`)}
            >
              Back to home
            </RoundedBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
