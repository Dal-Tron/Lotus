export interface ProfileProps {
  id?: string;
  email?: string;
  username: string;
  full_name: string;
  avatarUrl: string;
  updated_at: Date;
}

export interface AvatarProps {
  filePath: string;
  file: File | null;
}

export interface AddUserProps {
  email: string;
  password: string;
  user_metadata: any;
}
