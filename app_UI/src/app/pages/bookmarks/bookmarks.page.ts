import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  bookmarkOutline,
  newspaperOutline,
  calendarOutline,
  documentTextOutline,
  chevronForward
} from 'ionicons/icons';

interface Bookmark {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  type: 'news' | 'event' | 'article';
  icon: string;
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
    CommonModule,
  ],
})
export class BookmarksPage {
  private router = inject(Router);

  bookmarks: Bookmark[] = [
    {
      id: 1,
      title: 'AEU Wins National Innovation Award 2025',
      excerpt:
        'Our university has been recognized for excellence in research...',
      category: 'News',
      date: 'Feb 18, 2025',
      type: 'news',
      icon: 'newspaper-outline',
    },
    {
      id: 2,
      title: 'Annual Tech Symposium 2024',
      excerpt: 'Join us for the biggest technology event of the year...',
      category: 'Event',
      date: 'Feb 15, 2025',
      type: 'event',
      icon: 'calendar-outline',
    },
    {
      id: 3,
      title: 'Research Paper: AI in Education',
      excerpt:
        'Exploring the impact of artificial intelligence on modern education...',
      category: 'Article',
      date: 'Feb 10, 2025',
      type: 'article',
      icon: 'document-text-outline',
    },
  ];

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

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  viewBookmark(bookmark: Bookmark) {
    if (bookmark.type === 'news') {
      this.router.navigate(['/news-detail', bookmark.id]);
    } else if (bookmark.type === 'event') {
      this.router.navigate(['/event-detail', bookmark.id]);
    }
  }

  browseContent() {
    this.router.navigate(['/tabs/home']);
  }
}
