import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  bookmarkOutline,
  newspaperOutline,
  calendarOutline,
  documentTextOutline,
  chevronForward
} from 'ionicons/icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface BookmarkData {
  id: number;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  image_url?: string;
}

interface BookmarkItem {
  id: number;
  type: 'news' | 'event';
  data: BookmarkData;
  created_at: string;
  icon: string;
  excerpt: string;
  category: string;
  displayDate: string;
}

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class BookmarksPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  bookmarks: BookmarkItem[] = [];
  loading: boolean = true;

  constructor() {
    addIcons({
      chevronBackOutline,
      bookmarkOutline,
      newspaperOutline,
      calendarOutline,
      documentTextOutline,
      chevronForward,
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadBookmarks();
    } else {
      this.loading = false;
      this.bookmarks = [];
    }
  }

  loadBookmarks() {
    this.loading = true;
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.loading = false;
      this.bookmarks = [];
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    this.http.get<{ bookmarks: BookmarkItem[] }>(`${environment.apiUrl}/bookmarks`, { headers }).subscribe({
      next: (response) => {
        this.bookmarks = response.bookmarks.map(b => ({
          ...b,
          icon: b.type === 'news' ? 'newspaper-outline' : 'calendar-outline',
          excerpt: this.getExcerpt(b.data.content || b.data.description || ''),
          category: b.data.category || b.type.toUpperCase(),
          displayDate: this.formatDate(b.created_at)
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load bookmarks:', error);
        this.loading = false;
        this.bookmarks = [];
      }
    });
  }

  getExcerpt(text: string): string {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '');
    return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  viewBookmark(bookmark: BookmarkItem) {
    if (bookmark.type === 'news') {
      this.router.navigate(['/news-detail', bookmark.data.id]);
    } else if (bookmark.type === 'event') {
      this.router.navigate(['/event-detail', bookmark.data.id]);
    }
  }

  browseContent() {
    this.router.navigate(['/tabs/home']);
  }
}
