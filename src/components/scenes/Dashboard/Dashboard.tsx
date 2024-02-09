import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineBarcode } from "react-icons/ai";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";
import { CUS_COLORS, TEXTS } from "src/utils/consts";
import { AuthContext } from "src/contexts/AuthContext";
import supabase from "src/services/db";

// =======================================================================================================

const Dashboard = () => {
  const { user } = useContext(AuthContext);
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
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
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
    const { error, data } = await supabase.from("profiles").upsert(updates);
    console.log("data:>>", data);
    if (error) {
      toast.error(error.message);
    } else {
      setAvatarUrl(avatarUrl);
      toast.success("Successfully updated");
    }
    setLoading(false);
  };

  return (
    <div className="p-5">
      <div className="pt-10 w-11/12 md:w-1/2 mx-auto">
        <div className="w-40 h-40 mx-auto rounded overflow-hidden relative border flex justify-center items-center">
          <input
            className="absolute h-full w-full text-transparent file:hidden"
            type="file"
            id="single"
            accept="image/*"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              try {
                setUploading(true);
                const file = (e.target as HTMLInputElement).files
                  ? (e.target as HTMLInputElement).files![0]
                  : null;
                const fileExt = file!.name.split(".").pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                  .from("avatars")
                  .upload(filePath, file!);

                if (uploadError) {
                  throw uploadError;
                }
                updateProfile(filePath);
              } catch (error: any) {
                console.log("Error:>>", error.message);
              } finally {
                setUploading(false);
              }
            }}
            disabled={loading}
          />
          {uploading ? (
            "Uploading..."
          ) : avatar_url ? (
            <img width="100%" src={avatar_url} alt="avatar" />
          ) : (
            TEXTS.NO_IMAGE
          )}
        </div>

        <Input
          name="email"
          type="email"
          label="Email"
          icon={<MdOutlineEmail style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          onChange={() => {}}
          value={user ? user.email : ""}
          className="border-cus-gray-medium mb-3 grow"
          readOnly={true}
        />
        <Input
          name="username"
          type="text"
          label="Username"
          icon={<AiOutlineUser style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={user?.username || ""}
          className="border-cus-gray-medium mb-3 grow"
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
          className="border-cus-gray-medium mb-3 grow"
        />
        <Input
          name="id"
          type="text"
          label="UUID"
          icon={<AiOutlineBarcode style={{ fill: CUS_COLORS.GRAY_MEDIUM }} />}
          onChange={() => {}}
          required
          value={user ? user.id : ""}
          className="border-cus-gray-medium mb-3 grow"
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
