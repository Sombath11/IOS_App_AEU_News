import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
    CommonModule,
  ],
})
export class NewsDetailPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  isBookmarked: boolean = false;
  loading: boolean = true;
  articleId: number | null = null;

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

  relatedNews: Article[] = [];

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
          tags: news?.category ? [news.category] : [],
        };

        this.loading = false;
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

  shareArticle() {
  }

  bookmarkArticle() {
    this.isBookmarked = !this.isBookmarked;
  }

  viewNews(news: Article) {
    this.router.navigate(['/news-detail', news.id]);
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }
}
