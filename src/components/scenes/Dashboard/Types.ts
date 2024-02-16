export interface ProfileProps {
  id?: string;
  email?: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

export interface FileProps {
  fileName: string;
  fileType: string;
  fileSize: string;
  publicUrl?: string;
  filePath?: string;
}

export interface AddUserProps {
  email: string;
  password: string;
  user_metadata: any;
}
