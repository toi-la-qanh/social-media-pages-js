export interface Post {
  id: number;
  parent_id: number;
  content: string;
  image_url: string;
  author_id: number;
  views: number;
  created_at: Date;
  reply_to_user_id: number;
  retweet_user_id: number;
}

export interface NewPost {
  parent_id: number;
  content: string;
  image_url?: string;
  user_id: number;
}

export interface UpdatePost {
  parent_id?: number;
  content?: string;
  image_url?: string;
}