import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { MdOutlineLock } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "../../common/Input";
import RoundedBtn from "../../common/RoundedBtn";
import { useFormFields } from "../../../lib/hooksLib";
import supabase from "../../../services/db";
import {
  BACK_TO_HOME,
  CUS_GRAY_MEDIUM,
  SUBMIT,
  URL_HOME,
} from "../../../lib/consts";
import { toast } from "react-toastify";

// =======================================================================================================

const UpdatePwd = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    password: "",
  };
  const [formValues, handleFieldChange] = useFormFields(initialForm);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { password } = formValues;
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Success.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cus-black">
      <div className="p-10 w-[40rem] bg-cus-brown rounded-lg shadow-lg">
        <h1 className="mb-10 text-5xl font-extrabold text-center">
          Update password
        </h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2 mb-10">
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
            </div>
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

export default UpdatePwd;
