import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonContent,
  IonList,
  IonItem,
  IonChip,
  IonIcon,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  calendarOutline,
  newspaperOutline,
  timeOutline,
  locationOutline,
  closeOutline
} from 'ionicons/icons';

interface SearchResult {
  id: number;
  title: string;
  excerpt?: string;
  category: string;
  type: 'news' | 'event';
  timeAgo?: string;
  location?: string;
  image?: string;
}

@Component({
  selector: 'app-search-modal',
  template: `
    <div class="search-modal-container">
      <div class="search-header">
        <div class="search-input-wrapper">
          <ion-icon name="search-outline" class="search-icon"></ion-icon>
          <ion-input
            [(ngModel)]="searchQuery"
            (ionInput)="onSearchInput()"
            placeholder="Search news and events..."
            class="search-input"
            autofocus>
          </ion-input>
          <ion-button fill="clear" class="close-btn" (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="category-filters">
        <ion-chip
          *ngFor="let category of categories"
          [class.active]="selectedCategory === category"
          (click)="filterByCategory(category)">
          {{ category === 'all' ? 'All' : category }}
        </ion-chip>
      </div>

      <ion-content class="search-content">
        <!-- No results state -->
        <div class="no-results" *ngIf="hasSearched && searchResults.length === 0">
          <ion-icon name="search-outline" class="no-results-icon"></ion-icon>
          <h3>No results found</h3>
          <p>Try different keywords or categories</p>
        </div>

        <!-- Initial state -->
        <div class="initial-state" *ngIf="!hasSearched">
          <ion-icon name="search-outline" class="initial-icon"></ion-icon>
          <h3>Search</h3>
          <p>Find news and events by name or category</p>
        </div>

        <!-- Search Results -->
        <ion-list class="results-list" *ngIf="hasSearched && searchResults.length > 0">
          <ion-item
            *ngFor="let result of searchResults"
            class="result-item"
            (click)="selectResult(result)"
            button>
            <div class="result-content">
              <div class="result-icon-wrapper" [ngStyle]="{'background': getTypeColor(result.type)}">
                <ion-icon [name]="getTypeIcon(result.type)" [style.color]="getTypeColor(result.type)"></ion-icon>
              </div>
              <div class="result-info">
                <h4 class="result-title">{{ result.title }}</h4>
                <p class="result-excerpt" *ngIf="result.excerpt">{{ result.excerpt }}</p>
                <div class="result-meta">
                  <ion-chip class="result-category" [ngStyle]="{'background': getCategoryColor(result.category), 'color': 'white'}">
                    {{ result.category }}
                  </ion-chip>
                  <span class="result-time" *ngIf="result.timeAgo">
                    <ion-icon name="time-outline"></ion-icon>
                    {{ result.timeAgo }}
                  </span>
                  <span class="result-location" *ngIf="result.location">
                    <ion-icon name="location-outline"></ion-icon>
                    {{ result.location }}
                  </span>
                </div>
              </div>
            </div>
          </ion-item>
        </ion-list>
      </ion-content>
    </div>
  `,
  styles: [`
    .search-modal-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
    }

    .search-header {
      padding: 16px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 12px;
      padding: 8px 12px;
    }

    .search-icon {
      font-size: 20px;
      color: #666;
      margin-right: 8px;
    }

    .search-input {
      color: #333;
      flex: 1;
      --padding-start: 0;
      --padding-end: 0;
    }

    .close-btn {
      --padding-start: 0;
      --padding-end: 0;
      min-width: 32px;
      height: 32px;
      --color: #666;
    }

    .category-filters {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      overflow-x: auto;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
    }

    .category-filters ion-chip {
      background: #f5f5f5;
      color: #666;
      font-size: 13px;
      white-space: nowrap;
    }

    .category-filters ion-chip.active {
      background: #1152d4;
      color: white;
    }

    .search-content {
      --background: #fff;
    }

    .no-results,
    .initial-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #999;
    }

    .no-results-icon,
    .initial-icon {
      font-size: 64px;
      margin-bottom: 16px;
      color: #ddd;
    }

    .no-results h3,
    .initial-state h3 {
      font-size: 18px;
      margin: 0 0 8px 0;
      color: #666;
    }

    .no-results p,
    .initial-state p {
      font-size: 14px;
      margin: 0;
    }

    .results-list {
      padding: 0;
    }

    .result-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      --min-height: auto;
      border-bottom: 1px solid #f0f0f0;
    }

    .result-content {
      display: flex;
      gap: 12px;
      width: 100%;
    }

    .result-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .result-icon-wrapper ion-icon {
      font-size: 20px;
    }

    .result-info {
      flex: 1;
      min-width: 0;
    }

    .result-title {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-excerpt {
      font-size: 13px;
      color: #666;
      margin: 0 0 6px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .result-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .result-category {
      --background: transparent;
      --color: white;
      font-size: 11px;
      height: 20px;
      padding: 0 8px;
    }

    .result-time,
    .result-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #999;
    }

    .result-time ion-icon,
    .result-location ion-icon {
      font-size: 14px;
    }
  `],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonChip,
    IonIcon,
    IonButton,
    IonInput,
    CommonModule,
    FormsModule
  ],
})
export class SearchModalComponent {
  private router = inject(Router);
  private modalController: ModalController;

  searchQuery: string = '';
  selectedCategory: string = 'all';
  searchResults: SearchResult[] = [];
  hasSearched: boolean = false;

  categories: string[] = ['all', 'Academic', 'Sports', 'Campus News', 'Social', 'Career', 'Featured'];

  allNews: SearchResult[] = [
    {
      id: 1,
      title: 'New Digital Library Open 24/7',
      excerpt: 'Access over 500,000 journals and e-books today.',
      category: 'FEATURED',
      type: 'news',
      timeAgo: '2 hours ago',
      image: 'https://www.khmertimeskh.com/wp-content/uploads/2016/03/files+news+23223+1459096883.jpg',
    },
    {
      id: 2,
      title: 'AEU Sports Day 2025',
      excerpt: 'Join us for the annual sports competition.',
      category: 'SPORTS',
      type: 'news',
      timeAgo: '1 day ago',
      image: 'https://www.khmertimeskh.com/wp-content/uploads/2024/06/IMG_8023.jpg',
    },
    {
      id: 3,
      title: 'International Conference on AI',
      excerpt: 'Leading experts gather at AEU.',
      category: 'ACADEMIC',
      type: 'news',
      timeAgo: '2 days ago',
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800',
    },
    {
      id: 4,
      title: 'Research Grants Applications Now Open for 2024',
      excerpt: '',
      category: 'ACADEMIC',
      type: 'news',
      timeAgo: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
    },
    {
      id: 5,
      title: 'Sustainability Week: Join the Green Campus Initiative',
      excerpt: '',
      category: 'CAMPUS NEWS',
      type: 'news',
      timeAgo: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    },
    {
      id: 6,
      title: 'AI Ethics Seminar Series Starting Next Monday',
      excerpt: '',
      category: 'ACADEMIC',
      type: 'news',
      timeAgo: 'Yesterday',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    },
    {
      id: 7,
      title: 'Student Council Elections Results Announced',
      excerpt: '',
      category: 'CAMPUS NEWS',
      type: 'news',
      timeAgo: '2 days ago',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
    },
  ];

  allEvents: SearchResult[] = [
    {
      id: 1,
      title: 'AI Ethics Seminar',
      excerpt: 'Explore ethical considerations in AI development.',
      category: 'ACADEMIC',
      type: 'event',
      timeAgo: '10:00 AM',
      location: 'Science Building, Auditorium B',
    },
    {
      id: 2,
      title: 'Freshers Mixer',
      excerpt: 'Meet new friends and get oriented.',
      category: 'SOCIAL',
      type: 'event',
      timeAgo: '4:00 PM',
      location: 'Student Union Main Hall',
    },
    {
      id: 3,
      title: 'Career Workshop',
      excerpt: 'Prepare for your professional future.',
      category: 'CAREER',
      type: 'event',
      timeAgo: '6:00 PM',
      location: 'Building 4, Room 402',
    },
  ];

  constructor(modalController: ModalController) {
    this.modalController = modalController;
    addIcons({
      searchOutline,
      calendarOutline,
      newspaperOutline,
      timeOutline,
      locationOutline,
      closeOutline
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onSearchInput() {
    this.hasSearched = true;
    this.performSearch();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.performSearch();
  }

  performSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    const category = this.selectedCategory === 'all' ? null : this.selectedCategory.toUpperCase();

    let results: SearchResult[] = [];

    // Search in news
    results = results.concat(this.allNews.filter(item => {
      const matchesQuery = !query || item.title.toLowerCase().includes(query) ||
                          (item.excerpt && item.excerpt.toLowerCase().includes(query));
      const matchesCategory = !category || item.category === category;
      return matchesQuery && matchesCategory;
    }));

    // Search in events
    results = results.concat(this.allEvents.filter(item => {
      const matchesQuery = !query || item.title.toLowerCase().includes(query) ||
                          (item.excerpt && item.excerpt.toLowerCase().includes(query));
      const matchesCategory = !category || item.category === category;
      return matchesQuery && matchesCategory;
    }));

    this.searchResults = results;
  }

  selectResult(result: SearchResult) {
    this.dismiss();
    if (result.type === 'news') {
      this.router.navigate(['/news-detail', result.id]);
    } else {
      this.router.navigate(['/event-detail', result.id]);
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      ACADEMIC: '#1152d4',
      'CAMPUS NEWS': '#2e7d32',
      SPORTS: '#f35325',
      FEATURED: '#81bc06',
      SOCIAL: '#f57c00',
      CAREER: '#7b1fa2',
    };
    return colors[category] || '#1152d4';
  }

  getTypeIcon(type: 'news' | 'event'): string {
    return type === 'news' ? 'newspaper-outline' : 'calendar-outline';
  }

  getTypeColor(type: 'news' | 'event'): string {
    return type === 'news' ? '#e3f2fd' : '#f3e5f5';
  }
}
