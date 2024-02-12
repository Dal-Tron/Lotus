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
