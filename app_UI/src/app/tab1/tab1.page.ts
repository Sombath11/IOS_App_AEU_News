import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  AlertController, IonButtons } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { EventService, Event } from '../services/event.service';
import { UserService } from '../services/user.service';
import { addIcons } from 'ionicons';
import { logInOutline, calendarOutline, locationOutline, personOutline, logOutOutline } from 'ionicons/icons';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButtons, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class Tab1Page implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);

  events: Event[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = environment.apiUrl;

  constructor() {
    addIcons({ logInOutline, calendarOutline, locationOutline, personOutline, logOutOutline });
  }

  ngOnInit() {
    this.checkAuthAndLoadEvents();
  }

  checkAuthAndLoadEvents() {
    if (this.userService.isAuthenticated) {
      this.loadEvents();
    } else {
      this.loading = false;
    }
  }

  loadEvents() {
    this.loading = true;
    this.error = null;

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events. Make sure Laravel API is running.';
        this.loading = false;
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            this.userService.logout();
            this.events = [];
            this.error = null;
          },
        },
      ],
    });
    await alert.present();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
