import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "../../components/common/Input";
import RoundedBtn from "../../components/common/RoundedBtn";
import { useFormFields } from "../../lib/hooksLib";
import { strongPwdConfig } from "../../lib/validate";
import supabase from "../../services/db";

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
    const { email } = formValues;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.log(error.message);
      // alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <h1 className="mb-10 text-5xl font-extrabold text-center">Welcome!</h1>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="flex flex-col gap-2 mb-10">
            <Input
              name="email"
              id="email"
              type="email"
              label="Email"
              onChange={(e) => handleFieldChange(e)}
              icon={<MdOutlineEmail style={{ fill: "#9b8e95" }} />}
              errMsg="Invalid email"
              err={true}
              value={formValues.email}
              required={true}
            />
            {/* <Input
              id="password"
              type={showPwd ? "text" : "password"}
              required={true}
              label="Password"
              onChange={(e) => console.log(e.target.value)}
              icon={<MdOutlineLock style={{ fill: "#9b8e95" }} />}
            /> */}
            {/* <div className="flex justify-between w-full">
              <button
                className="flex items-center gap-1 text-cus-gray-medium hover:text-cus-gray-light duration-300"
                type="button"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? (
                  <IoMdEyeOff style={{ fill: "#9b8e95" }} />
                ) : (
                  <IoMdEye style={{ fill: "#9b8e95" }} />
                )}
                Show password
              </button>
              <button
                className="text-cus-gray-medium hover:text-cus-gray-light duration-300"
                type="button"
              >
                Forgot password?
              </button>
            </div> */}
          </div>
          <div className="flex justify-around">
            <button disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
            {/* <RoundedBtn
              variant="fill"
              className="p-3 w-[10rem]"
              onClick={handleLogin}
            >
              Log in
            </RoundedBtn> */}
            <RoundedBtn
              variant="transparent"
              className="p-3 w-[10rem]"
              onClick={() => navigate("/")}
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
