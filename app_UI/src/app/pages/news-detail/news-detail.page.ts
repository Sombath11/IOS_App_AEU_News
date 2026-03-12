import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  shareOutline,
  bookmarkOutline,
  bookmark,
  timeOutline,
  chevronBackOutline,
  homeOutline,
  calendarOutline,
  notificationsOutline,
  personOutline
} from 'ionicons/icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  dateSubtitle: string;
  image: string;
  author: string;
  authorImage: string;
  readingTime: number;
  tags: string[];
}

interface RelatedNews {
  id: number;
  title: string;
  category: string;
  image: string;
  readingTime: number;
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonChip,
    IonSpinner,
  ],
})
export class NewsDetailPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private newsService = inject(NewsService);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);

  isBookmarked: boolean = false;
  loading: boolean = true;
  articleId: number | null = null;
  checkingBookmark: boolean = false;
  togglingBookmark: boolean = false;

  article: Article = {
    id: 1,
    title: 'Loading...',
    excerpt: '',
    content: '',
    category: '',
    date: '',
    dateSubtitle: 'Published on',
    image: '',
    author: 'Admin',
    authorImage: '',
    readingTime: 5,
    tags: [],
  };

  relatedNews: RelatedNews[] = [];

  constructor() {
    addIcons({
      shareOutline,
      bookmarkOutline,
      bookmark,
      timeOutline,
      chevronBackOutline,
      homeOutline,
      calendarOutline,
      notificationsOutline,
      personOutline
    });
  }

  ngOnInit() {
    this.articleId = this.route.snapshot.params['id'];

    if (this.articleId) {
      this.loadArticle(this.articleId);
      if (this.authService.isAuthenticated()) {
        this.checkBookmarkStatus(this.articleId);
      }
    } else {
      this.loading = false;
      this.article.title = 'No Article Selected';
      this.article.content = 'Please select an article to view.';
    }
  }

  loadArticle(id: number) {
    this.loading = true;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.loadDemoArticle();
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/news/${id}`).subscribe({
      next: (response) => {
        const news = response.news || response.data || response;

        const content = news?.content || news?.description || news?.body || 'No content available for this article.';
        const title = news?.title || 'Untitled Article';

        this.article = {
          id: news?.id || id,
          title: title,
          excerpt: content && content.length > 200 ? content.substring(0, 200) + '...' : content,
          content: content,
          category: news?.category || 'GENERAL',
          date: this.formatDate(news?.created_at || news?.published_date || new Date().toISOString()),
          dateSubtitle: 'Published on',
          image: news?.image_url || news?.image || '',
          author: news?.author || 'Admin',
          authorImage: '',
          readingTime: this.calculateReadingTime(content),
          tags: news?.tags || (news?.category ? [news.category] : []),
        };

        // Load related news from API response
        if (response.related && Array.isArray(response.related)) {
          this.relatedNews = response.related.map((r: any) => ({
            id: r.id,
            title: r.title,
            category: r.category || 'GENERAL',
            image: r.image_url || '',
            readingTime: this.calculateReadingTime(r.content || ''),
          }));
        } else {
          // Fallback: load latest news as related
          this.loadRelatedNews();
        }

        this.loading = false;

        // Check bookmark status after article loads
        if (this.authService.isAuthenticated()) {
          this.checkBookmarkStatus(id);
        }
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401 || error.status === 404) {
          this.loadDemoArticle();
        } else {
          this.article = {
            id: id,
            title: 'Article Not Found',
            excerpt: '',
            content: 'Sorry, the article you are looking for could not be found.',
            category: '',
            date: '',
            dateSubtitle: '',
            image: '',
            author: '',
            authorImage: '',
            readingTime: 0,
            tags: [],
          };
        }
      }
    });
  }

  loadRelatedNews() {
    if (!this.article.category) return;

    this.newsService.getNewsByCategory(this.article.category).subscribe({
      next: (newsList) => {
        this.relatedNews = newsList
          .filter(n => n.id !== this.articleId)
          .slice(0, 4)
          .map(n => ({
            id: n.id,
            title: n.title,
            category: n.category || 'GENERAL',
            image: n.image_url || '',
            readingTime: this.calculateReadingTime(n.content || ''),
          }));
      },
      error: () => {
        this.relatedNews = [];
      }
    });
  }

  checkBookmarkStatus(id: number) {
    this.checkingBookmark = true;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.checkingBookmark = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    this.http.post<{ bookmarked: boolean }>(`${environment.apiUrl}/bookmarks/check`, { type: 'news', id }, { headers }).subscribe({
      next: (response) => {
        this.isBookmarked = response.bookmarked;
        this.checkingBookmark = false;
      },
      error: () => {
        this.checkingBookmark = false;
        this.isBookmarked = false;
      }
    });
  }

  loadDemoArticle() {
    // Show sample article if API fails
    this.article = {
      id: 1,
      title: 'AEU Launches New iOS App Development Program for 2026',
      excerpt: 'Asia Euro University is proud to announce the launch of our comprehensive iOS App Development program...',
      content: `Asia Euro University is proud to announce the launch of our comprehensive iOS App Development program starting in Semester 2, 2026. This cutting-edge curriculum covers Swift programming, SwiftUI, UIKit, Core Data, and App Store deployment.

Students will work on real-world projects and have opportunities for internships with leading tech companies. The program is designed to meet the growing demand for skilled iOS developers in Cambodia and the ASEAN region.

The curriculum includes:
- Swift Programming Fundamentals
- SwiftUI and UIKit Frameworks
- Core Data and Data Management
- iOS App Architecture Patterns
- App Store Submission and Marketing
- User Interface Design Principles
- Mobile App Security Best Practices

Our experienced faculty members bring years of industry experience from leading tech companies. Students will have access to state-of-the-art computer labs and collaborative workspaces.

Dean of Computer Science, Dr. Sok Chanthy, stated: "This program represents our commitment to providing world-class education in mobile app development. We are preparing the next generation of iOS developers who will shape the future of mobile technology in Cambodia."

The program is now accepting applications for Semester 2, 2026. Interested students are encouraged to apply early as seats are limited.`,
      category: 'ACADEMIC',
      date: 'March 1, 2026',
      dateSubtitle: 'Published on',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      author: 'AEU Communications Office',
      authorImage: '',
      readingTime: 3,
      tags: ['iOS', 'App Development', 'Education', 'Technology'],
    };
    this.loading = false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  async shareArticle() {
    const shareData = {
      title: this.article.title,
      text: this.article.excerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        const toast = await this.toastController.create({
          message: 'Link copied to clipboard!',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }

  async bookmarkArticle() {
    if (!this.authService.isAuthenticated()) {
      const toast = await this.toastController.create({
        message: 'Please login to bookmark articles',
        duration: 2000,
        position: 'bottom',
        buttons: [
          {
            text: 'Login',
            handler: () => {
              this.router.navigate(['/auth/login']);
            }
          }
        ]
      });
      await toast.present();
      return;
    }

    if (!this.articleId || this.togglingBookmark) return;

    this.togglingBookmark = true;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.togglingBookmark = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    this.http.post<{ message: string; bookmarked: boolean }>(`${environment.apiUrl}/bookmarks/toggle`, { type: 'news', id: this.articleId }, { headers }).subscribe({
      next: async (response) => {
        this.isBookmarked = response.bookmarked;
        this.togglingBookmark = false;

        const toast = await this.toastController.create({
          message: response.bookmarked ? 'Article bookmarked!' : 'Bookmark removed',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      },
      error: async (error) => {
        this.togglingBookmark = false;
        console.error('Bookmark error:', error);
        const toast = await this.toastController.create({
          message: 'Failed to update bookmark',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  viewNews(news: RelatedNews) {
    this.router.navigate(['/news-detail', news.id]);
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }
}
