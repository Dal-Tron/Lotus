import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AiOutlineBarcode, AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import AvatarInput from "src/components/common/AvatarInput";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";
import { AuthContext } from "src/contexts/AuthContext";
import {
  checkIsAvatarReq,
  getFilePublicUrlReq,
  insertAvatarToFilesTableReq,
  updateAvatarInFilesTableReq,
  updateProfileReq,
  uploadFileReq,
} from "src/services/api";
import { CUS_COLORS } from "src/utils/consts";
import { extractFileInfo } from "src/utils/helpers";
import { ProfileProps } from "../Dashboard/Types";

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarPublicUrl, setAvatarPublicUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");

  useEffect(() => {
    const fetchAvatarPublicUrl = async (filePath: string) => {
      if (filePath) {
        const { publicUrl } = await getFilePublicUrlReq({
          filePath,
          bucket: "avatars",
        });
        setAvatarPublicUrl(publicUrl);
      }
    };
    if (user) {
      fetchAvatarPublicUrl(user.avatar_url);
      setUsername(user.username);
      setFullname(user.full_name || "");
    }
  }, [user]);

  const updateProfile = async (avatarUrl: string) => {
    setLoading(true);
    const updates: ProfileProps = {
      id: user?.id,
      email: user?.email,
      username,
      full_name: fullname,
      avatar_url: avatarUrl,
    };
    const { error, data } = await updateProfileReq(updates);
    if (error) {
      toast.error(error.message);
    } else {
      setUser(data![0]);
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
      const {
        randName: filePath,
        fileType,
        fileSize,
        fileName,
      } = extractFileInfo(file);

      const { error: uploadError } = await uploadFileReq({
        filePath,
        file,
        bucket: "avatars",
      });

      if (uploadError) {
        throw uploadError;
      }

      const { publicUrl } = await getFilePublicUrlReq({
        filePath,
        bucket: "avatars",
      });

      setAvatarPublicUrl(publicUrl);

      const { data, error: checkIfAvatarError } = await checkIsAvatarReq({
        userId: user?.id,
      });
      if (checkIfAvatarError) throw checkIfAvatarError;
      if (!data!.length) {
        const { error: insertAvatarToFilesTableError } =
          await insertAvatarToFilesTableReq({
            userId: user?.id,
            fileName,
            externalId: filePath,
            fileType,
            fileSize,
            fileUrl: publicUrl,
          });
        if (insertAvatarToFilesTableError) throw insertAvatarToFilesTableError;
      } else {
        const { error: updateAvatarInFilesTableError } =
          await updateAvatarInFilesTableReq({
            userId: user?.id,
            fileName,
            externalId: filePath,
            fileType,
            fileSize,
            fileUrl: publicUrl,
          });
        if (updateAvatarInFilesTableError) throw updateAvatarInFilesTableError;
      }
      await updateProfile(filePath);
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
            avatarUrl={avatarPublicUrl}
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
              updateProfile(user ? user.avatar_url : null);
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
