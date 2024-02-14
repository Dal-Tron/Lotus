export interface User {
  id?: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  role?: "admin" | "normal";
  updated_at?: string;
  username?: string;
}

export interface NewUser {
  avatarUrl?: string;
  email: string;
  fullName: string;
  username: string;
  avatar?: File | null;
}

export interface FileType {
  id: number;
  user_id: string;
  file_name: string;
  external_id: string;
  file_type: string;
  file_size: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}
