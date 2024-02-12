import {
  AvatarProps,
  ProfileProps,
} from "src/components/scenes/Dashboard/Types";
import supabase from "./db";

// =======================================================================================================

export const fetchUsersReq = async () => {
  const { data, error } = await supabase.from("profiles").select();
  return { data, error };
};

export const updateProfileReq = async (params: ProfileProps) => {
  const { error, data } = await supabase
    .from("profiles")
    .upsert(params)
    .select();
  return {
    error,
    data,
  };
};

export const uploadAvatarReq = async ({ filePath, file }: AvatarProps) => {
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file!);
  return { uploadError };
};

export const downloadImageReq = async (path: string) => {
  const { data, error } = await supabase.storage.from("avatars").download(path);
  return {
    error,
    data,
  };
};
