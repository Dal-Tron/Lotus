import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import validator from "validator";
import Input from "../../common/Input";
import RoundedBtn from "../../common/RoundedBtn";
import { useFormFields } from "../../../lib/hooksLib";
import {
  BACK_TO_HOME,
  CUS_GRAY_MEDIUM,
  MSG_ERR_UNEXPECTED_ERROR,
  SUBMIT,
  URL_HOME,
} from "../../../lib/consts";
import supabase from "../../../services/db";

// =======================================================================================================

const ForgotPwd = () => {
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    email: "",
  };
  const [formValues, handleFieldChange] = useFormFields(initialForm);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { email } = formValues;
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.REACT_APP_BASE_URL}/update-pwd`,
    });
    if (error) {
      console.error(error.message);
      toast.error(MSG_ERR_UNEXPECTED_ERROR);
    } else {
      toast.success(
        "We've sent a message to your email address. Please confirm to reset password"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <h1 className="mb-2 text-5xl font-extrabold text-center">
          Forgot Password?
        </h1>
        <p className="mb-5 text-center">
          Please input your email to get a magic link.
        </p>
        <form onSubmit={(e) => handleSubmit(e)}>
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
          </div>
          <div className="flex justify-between">
            <RoundedBtn
              variant="fill"
              className="p-3 w-[10rem] align-self"
              disabled={loading}
            >
              {SUBMIT}
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

export default ForgotPwd;
