export interface User {
  id: number;
  username: string;
  full_name: string;
  bio: string;
  email: string;
  password: string;
  image_url: string;
  created_at: Date;
}

export interface NewUser {
  id: number;
  username: string;
  full_name: string;
  bio: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  username?: string;
  full_name?: string;
  bio?: string;
  email?: string;
  password?: string;
  image_url?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
}