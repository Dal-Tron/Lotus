import { ChangeEvent } from "react";
import DefaultAvatar from "src/assets/images/60111.png";
import cx from 'classnames'

interface Props {
  avatarUrl: string | null;
  updating: boolean;
  uploadAvatar: (e: ChangeEvent<HTMLInputElement>) => any;
  uploading: boolean;
  loading:boolean
}

const AvatarInput = ({
  updating,
  uploading,
  uploadAvatar,
  avatarUrl,
  loading
}: Props) => {
  return (
    <>
      <input
        className={cx("absolute h-full w-full text-transparent file:hidden", uploading || updating ? "" : "cursor-pointer")}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading || updating}
      />
      {uploading ? (
        "Uploading..."
        ) : loading?null: <img width="100%" src={avatarUrl||DefaultAvatar} alt="avatar" />
      }
    </>
  );
};

export default AvatarInput;
