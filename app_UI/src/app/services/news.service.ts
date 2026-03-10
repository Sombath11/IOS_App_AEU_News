import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  author?: string;
  image_url: string;
  source_url?: string;
  published_date: string;
  is_featured: boolean;
  is_active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  timeAgo?: string;
}

/**
 * News service for fetching news articles from Laravel API
 */
@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly api = inject(ApiService);

  /**
   * Get all news articles
   */
  getAllNews(): Observable<News[]> {
    return this.api.get<News[]>('news');
  }

  /**
   * Get featured news (limit 3)
   */
  getFeaturedNews(): Observable<News[]> {
    return this.api.get<News[]>('news/featured');
  }

  /**
   * Get latest news (limit 10)
   */
  getLatestNews(): Observable<News[]> {
    return this.api.get<News[]>('news/latest');
  }

  /**
   * Get news by category
   */
  getNewsByCategory(category: string): Observable<News[]> {
    return this.api.get<News[]>(`news/category/${category}`);
  }

  /**
   * Get single news article by ID
   */
  getNewsById(id: number): Observable<News> {
    return this.api.get<News>(`news/${id}`);
  }

  /**
   * Convert created_at to time ago format
   */
  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
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
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (seconds < intervals['month']) {
      const weeks = Math.floor(seconds / intervals['week']);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (seconds < intervals['year']) {
      const months = Math.floor(seconds / intervals['month']);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(seconds / intervals['year']);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}
