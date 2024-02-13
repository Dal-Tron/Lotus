import { ChangeEvent } from "react";
import DefaultAvatar from "src/assets/images/60111.png";

interface Props {
  avatarUrl: string;
  disabled: boolean;
  uploadAvatar: (e: ChangeEvent<HTMLInputElement>) => any;
  uploading: boolean;
}

const AvatarInput = ({
  disabled,
  uploading,
  uploadAvatar,
  avatarUrl,
}: Props) => {
  return (
    <>
      <input
        className="absolute h-full w-full text-transparent file:hidden cursor-pointer"
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={disabled}
      />
      {uploading ? (
        "Uploading..."
      ) : avatarUrl ? (
        <img width="100%" src={avatarUrl} alt="avatar" />
      ) : (
        <img width="100%" src={DefaultAvatar} alt="avatar" />
      )}
    </>
  );
};

export default AvatarInput;
