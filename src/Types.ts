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
  user_id: string;
  file_name: string;
  unique_name: string;
  id: number;
  created_at: string;
  updated_at: string;
}
