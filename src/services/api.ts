import {
  AddUserProps,
  AvatarProps,
  ProfileProps,
} from "src/components/scenes/Dashboard/Types";
import supabase, { supabaseAdmin } from "./db";

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

export const addNewUserReq = async ({
  email,
  password,
  user_metadata,
}: AddUserProps) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata,
  });

  return { data, error };
};

export const deleteUserReq = async (id: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);
  return { data, error };
};
