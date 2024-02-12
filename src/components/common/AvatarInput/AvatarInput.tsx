import DefaultAvatar from "src/assets/images/60111.png";
import { AvatarInputProps } from "./Types";

// =======================================================================================================

const AvatarInput = ({
  disabled,
  uploading,
  uploadAvatar,
  avatar_url,
}: AvatarInputProps) => {
  return (
    <div>
      <input
        className="absolute h-full w-full text-transparent file:hidden cursor-pointer"
        type="file"
        id="single"
        accept="image/*"
        onChange={(e) => uploadAvatar(e)}
        disabled={disabled}
      />
      {uploading ? (
        "Uploading..."
      ) : avatar_url ? (
        <img width="100%" src={avatar_url} alt="avatar" />
      ) : (
        <img width="100%" src={DefaultAvatar} alt="avatar" />
      )}
    </div>
  );
};

export default AvatarInput;
