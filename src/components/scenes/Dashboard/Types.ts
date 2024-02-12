export interface ProfileProps {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  updated_at: Date;
}

export interface AvatarProps {
  filePath: string;
  file: File | null;
}
