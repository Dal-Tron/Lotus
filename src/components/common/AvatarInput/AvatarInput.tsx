import { ChangeEvent } from "react";
import DefaultAvatar from "src/assets/images/60111.png";

interface AvatarInputProps {
  avatarUrl: string;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
  uploading: boolean;
}

const AvatarInput = ({
  disabled,
  uploading,
  onChange,
  avatarUrl,
}: AvatarInputProps) => {
  return (
    <>
      <input
        className="absolute h-full w-full text-transparent file:hidden cursor-pointer"
        type="file"
        id="single"
        accept="image/*"
        onChange={(e) => onChange(e)}
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
