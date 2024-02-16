import {
  AddUserProps,
  FileProps,
  ProfileProps,
} from "src/components/scenes/Dashboard/Types";
import { InsertFileProps, UpdateFileProps, UploadFileProps } from "src/Types";
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

export const fetchFilesReq = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabase
    .from("files")
    .select()
    .eq("user_id", userId)
    .eq("is_avatar", false);
  return { data, error };
};

export const checkIsAvatarReq = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabase
    .from("files")
    .select("is_avatar")
    .eq("user_id", userId)
    .eq("is_avatar", true);
  return { data, error };
};

export const insertAvatarToFilesTableReq = async ({
  userId,
  fileName,
  externalId,
  fileType,
  fileSize,
}: InsertFileProps) => {
  const { data, error } = await supabase
    .from("files")
    .insert({
      user_id: userId,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      external_id: externalId,
      is_avatar: true,
    })
    .select();
  return { data, error };
};

export const updateAvatarInFilesTableReq = async ({
  userId,
  fileName,
  fileType,
  fileSize,
  externalId,
}: UpdateFileProps) => {
  const { data, error } = await supabase
    .from("files")
    .update({
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      external_id: externalId,
    })
    .eq("user_id", userId)
    .eq("is_avatar", true);
  return { data, error };
};

export const uploadFileReq = async ({
  filePath,
  file,
  bucket,
}: UploadFileProps) => {
  const { error } = await supabase.storage.from(bucket).upload(filePath, file!);
  return { error };
};

export const updateFilesTableReq = async ({
  fileName,
  fileType,
  fileSize,
  publicUrl,
  filePath,
}: FileProps) => {
  const { error } = await supabase
    .from("files")
    .update({
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      file_url: publicUrl,
    })
    .eq("external_id", filePath);
  return { error };
};

export const getFilePublicUrlReq = async (filePath: string) => {
  const {
    data: { publicUrl },
  } = await supabase.storage.from("files").getPublicUrl(filePath);
  return { publicUrl };
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
