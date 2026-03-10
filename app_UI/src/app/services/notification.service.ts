import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Notification, NotificationResponse, UnreadCountResponse } from '../models/notification';

/**
 * Service for managing notifications
 * Handles fetching, marking as read, and navigation
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly api = inject(ApiService);

  /**
   * Get all notifications for the current user
   */
  getNotifications(params?: {
    type?: string;
    unread?: boolean;
    emergency?: boolean;
    per_page?: number;
  }): Observable<NotificationResponse> {
    return this.api.get<NotificationResponse>('notifications', params);
  }

  /**
   * Get a single notification by ID
   */
  getNotification(id: number): Observable<{ notification: Notification }> {
    return this.api.get<{ notification: Notification }>(`notifications/${id}`);
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.api.get<UnreadCountResponse>('notifications/unread-count');
  }

  /**
   * Mark a notification as read
   */
  markAsRead(id: number): Observable<{ message: string; notification: Notification }> {
    return this.api.post<{ message: string; notification: Notification }>(
      `notifications/${id}/mark-as-read`,
      {}
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('notifications/mark-all-read', {});
  }

  /**
   * Mark a notification as unread
   */
  markAsUnread(id: number): Observable<{ message: string; notification: Notification }> {
    return this.api.post<{ message: string; notification: Notification }>(
      `notifications/${id}/mark-as-unread`,
      {}
    );
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`notifications/${id}`);
  }

  /**
   * Get the target URL for navigation based on notification type
   */
  getTargetUrl(notification: Notification): string {
    // If target_url is provided, use it
    if (notification.target_url) {
      return notification.target_url;
    }

    // Fallback based on type
    const urlMap: Record<string, string> = {
      news: `/news/${notification.target_id}`,
      event: `/tabs/event/${notification.target_id}`,
      grade: '/tabs/grades',
      emergency: '/tabs/alerts',
      library: '/tabs/library',
      payment: '/tabs/finance',
      profile: '/tabs/profile',
    };

    return urlMap[notification.type] || '/tabs/alerts';
  }

  /**
   * Get icon class based on notification type
   */
  getIconClass(type: string, isEmergency: boolean): string {
    if (isEmergency) {
      return 'emergency';
    }

    const classMap: Record<string, string> = {
      news: 'news',
      event: 'event',
      grade: 'grade',
      emergency: 'emergency',
      library: 'library',
      payment: 'payment',
      profile: 'profile',
    };

    return classMap[type] || 'default';
  }

  /**
   * Check if notification is unread (read_at is null)
   */
  isUnread(notification: Notification): boolean {
    return !notification.is_read && notification.read_at === null;
  }

  /**
   * Check if notification is from today
   */
  isToday(notification: Notification): boolean {
    const notificationDate = new Date(notification.created_at);
    const today = new Date();
    return (
      notificationDate.getDate() === today.getDate() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Format time ago for display
   */
  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    if (seconds < intervals['minute']) {
      return 'Just now';
    } else if (seconds < intervals['hour']) {
      const minutes = Math.floor(seconds / intervals['minute']);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds < intervals['day']) {
      const hours = Math.floor(seconds / intervals['hour']);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (seconds < intervals['week']) {
      const days = Math.floor(seconds / intervals['day']);
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
}
