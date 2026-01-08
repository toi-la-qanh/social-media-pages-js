export interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  is_read: boolean;
  data: JSON;
  created_at: Date;
}

export interface NewNotification {
  user_id: number;
  type: string;
  message: string;
  data: JSON;
}

export interface UpdateNotification {
  is_read?: boolean;
}