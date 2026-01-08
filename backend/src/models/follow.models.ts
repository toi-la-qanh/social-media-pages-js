export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
}

export interface NewFollow {
  follower_id: number;
  following_id: number;
}