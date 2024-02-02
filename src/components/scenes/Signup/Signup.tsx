import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "../../common/Input";
import RoundedBtn from "../../common/RoundedBtn";
import { useFormFields } from "../../../lib/hooksLib";
import supabase from "../../../services/db";
import { CUS_GRAY_MEDIUM, SIGNUP, URL_HOME } from "../../../lib/consts";

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
    const { email, password, username } = formValues;
    console.log(email, password, username);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: "normal",
        },
        emailRedirectTo: `${process.env.REACT_APP_BASE_URL}/dashboard`,
      },
    });
    setLoading(false);
    if (error) {
      console.log(error.message);
    } else {
      alert(
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
              // errMsg="Invalid email"
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
              // errMsg="Invalid email"
              err={false}
              value={formValues.username}
              required={true}
            />
            <Input
              name="password"
              id="password"
              type="password"
              label="Password"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineLock style={{ fill: CUS_GRAY_MEDIUM }} />}
              // errMsg="Invalid email"
              err={false}
              value={formValues.password}
              required={true}
            />
          </div>
          <div className="flex justify-between">
            {/* <button disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button> */}
            <RoundedBtn
              variant="fill"
              className="p-3 w-[10rem]"
              onClick={() => console.log(SIGNUP)}
              disabled={loading}
            >
              {SIGNUP}
            </RoundedBtn>
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

export default Signup;
