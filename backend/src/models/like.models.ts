export interface Like {
  id: number;
  post_id: number;
  user_id: number;
}

export interface NewLike {
  post_id: number;
  user_id: number;
}