import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonSpinner
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  searchOutline,
  notificationsOutline,
  calendarOutline,
  starOutline,
  mapOutline,
  peopleOutline,
  filterOutline,
  timeOutline,
  chevronBackOutline
} from 'ionicons/icons';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import { NewsService, News } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timeAgo: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private modalController: ModalController;
  private newsService = inject(NewsService);
  private authService = inject(AuthService);

  categories: string[] = ['All News', 'Academic', 'Sports', 'Campus News'];
  selectedCategory: string = 'All News';

  featuredNews: NewsItem[] = [];
  latestNews: NewsItem[] = [];
  filteredNews: NewsItem[] = [];
  showFilterDropdown: boolean = false;
  loading: boolean = false;
  userName: string = 'Alex';

  constructor(modalController: ModalController) {
    this.modalController = modalController;
    addIcons({
      schoolOutline,
      searchOutline,
      notificationsOutline,
      calendarOutline,
      starOutline,
      mapOutline,
      peopleOutline,
      filterOutline,
      timeOutline,
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadNews();
  }

  /**
   * Load current user data from AuthService
   */
  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      this.userName = user.name.split(' ')[0];
    }
  }

  /**
   * Load news from API
   */
  loadNews() {
    this.loading = true;
    
    // Load featured news
    this.newsService.getFeaturedNews().subscribe({
      next: (news) => {
        this.featuredNews = news.map(n => ({
          id: n.id,
          title: n.title,
          description: n.content || '',
          category: n.category || 'FEATURED',
          timeAgo: this.newsService.timeAgo(n.published_date || n.created_at),
          image: n.image_url || 'https://via.placeholder.com/800x400',
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured news:', error);
        this.loading = false;
      },
    });

    // Load latest news
    this.newsService.getLatestNews().subscribe({
      next: (news) => {
        this.latestNews = news.map(n => ({
          id: n.id,
          title: n.title,
          description: n.content || '',
          category: n.category || 'ACADEMIC',
          timeAgo: this.newsService.timeAgo(n.published_date || n.created_at),
          image: n.image_url || 'https://via.placeholder.com/400x300',
        }));
        this.filteredNews = this.latestNews;
      },
      error: (error) => {
        console.error('Error loading latest news:', error);
      },
    });
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.showFilterDropdown = false;
    if (category === 'All News') {
      this.filteredNews = this.latestNews;
    } else {
      const categoryMap: { [key: string]: string } = {
        'Academic': 'ACADEMIC',
        'Sports': 'SPORTS',
        'Campus News': 'CAMPUS NEWS'
      };
      const mappedCategory = categoryMap[category] || category.toUpperCase();
      this.filteredNews = this.latestNews.filter(
        (news) => news.category === mappedCategory
      );
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      ACADEMIC: '#1152d4',
      'CAMPUS NEWS': '#2e7d32',
      SPORTS: '#f35325',
      FEATURED: '#81bc06',
    };
    return colors[category] || '#1152d4';
  }

  viewNewsDetail(news: NewsItem) {
    this.router.navigate(['/news-detail', news.id]);
  }

  viewAllNews() {
    console.log('View all news');
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  async goToSearch() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      cssClass: 'search-modal'
    });
    await modal.present();
  }


}
