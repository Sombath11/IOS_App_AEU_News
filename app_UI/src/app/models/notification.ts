/**
 * Notification interface matching Laravel backend model
 */
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string; // news, event, grade, emergency, library, payment, profile
  icon: string;
  target_type: string | null; // news, event, grade, etc.
  target_id: number | null;
  target_url: string | null;
  is_emergency: boolean;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Notification response from API
 */
export interface NotificationResponse {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  unread_count: number;
}

/**
 * Unread count response
 */
export interface UnreadCountResponse {
  unread_count: number;
}
