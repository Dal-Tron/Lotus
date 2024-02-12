import { ChangeEvent } from "react";

// =======================================================================================================

export interface AvatarInputProps {
  disabled: boolean;
  uploading: boolean;
  uploadAvatar: (e: ChangeEvent<HTMLInputElement>) => any;
  avatar_url: string;
}
