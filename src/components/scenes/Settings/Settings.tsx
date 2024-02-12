import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineBarcode } from "react-icons/ai";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";
import AvatarInput from "src/components/common/AvatarInput";
import { CUS_COLORS } from "src/utils/consts";
import { AuthContext } from "src/contexts/AuthContext";
import {
  downloadImageReq,
  updateProfileReq,
  uploadAvatarReq,
} from "src/services/api";

// =======================================================================================================

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar_url, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url);
      setUsername(user.username);
      setFullname(user.full_name || "");
    }
  }, [user]);

  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url);
  }, [avatar_url]);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await downloadImageReq(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data!);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const updateProfile = async (avatarUrl: string) => {
    setLoading(true);
    const updates = {
      id: user?.id,
      email: user?.email,
      username,
      full_name: fullname,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };
    const { error, data } = await updateProfileReq(updates);
    if (error) {
      toast.error(error.message);
    } else {
      setUser(data![0]);
      setAvatarUrl(avatarUrl);
      toast.success("Successfully updated");
    }
    setLoading(false);
  };

  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = (e.target as HTMLInputElement).files
        ? (e.target as HTMLInputElement).files![0]
        : null;
      const fileExt = file!.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { uploadError } = await uploadAvatarReq({ filePath, file });

      if (uploadError) {
        throw uploadError;
      }
      updateProfile(filePath);
    } catch (error: any) {
      console.log("Error:>>", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="mx-auto md:w-1/2 pt-10 w-11/12">
        <div className="relative flex justify-center items-center mx-auto w-40 h-40 border rounded overflow-hidden">
          <AvatarInput
            disabled={loading}
            uploading={uploading}
            uploadAvatar={(e: ChangeEvent<HTMLInputElement>) => uploadAvatar(e)}
            avatar_url={avatar_url}
          />
        </div>
        <Input
          name="email"
          type="email"
          label="Email"
          icon={<MdOutlineEmail style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          onChange={() => {}}
          value={user ? user.email : ""}
          className="grow mb-3 border-cus-gray-medium"
          readOnly={true}
        />
        <Input
          name="username"
          type="text"
          label="Username"
          icon={"@"}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={user?.username || ""}
          className="grow mb-3 border-cus-gray-medium"
          readOnly={true}
        />
        <Input
          name="fullname"
          id="fullname"
          type="text"
          label="Full name"
          onChange={(e) => setFullname(e.target.value)}
          icon={<AiOutlineUser style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          // errMsg="Invalid email"
          err={false}
          value={fullname}
          className="grow mb-3 border-cus-gray-medium"
        />
        <Input
          name="id"
          type="text"
          label="UUID"
          icon={<AiOutlineBarcode style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          onChange={() => {}}
          required
          value={user ? user.id : ""}
          className="grow mb-3 border-cus-gray-medium"
          readOnly={true}
        />
        <div className="flex justify-center items-center gap-3">
          <RoundedBtn
            variant="fill"
            onClick={() => {
              updateProfile(avatar_url);
            }}
          >
            {loading ? "Updating..." : "Update"}
          </RoundedBtn>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
