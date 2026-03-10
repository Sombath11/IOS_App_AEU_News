import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  searchOutline,
  notificationsOutline,
  calendarOutline,
  locationOutline,
  timeOutline,
  briefcaseOutline,
  peopleOutline,
  trophyOutline,
  chevronForward,
  chevronBackOutline
} from 'ionicons/icons';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';

interface EventItem {
  id: number;
  title: string;
  category: string;
  time: string;
  location: string;
  icon: string;
}

interface EventGroup {
  date: string;
  subtitle: string;
  events: EventItem[];
  hasEvents: boolean;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonChip,
    CommonModule,
  ],
})
export class EventsPage {
  private router = inject(Router);
  private modalController: ModalController;

  todayDate: string = 'Today, Oct 12';
  tomorrowDate: string = 'Tomorrow, Oct 13';

  todayEvents: EventItem[] = [
    {
      id: 1,
      title: 'AI Ethics Seminar',
      category: 'ACADEMIC',
      time: '10:00 AM',
      location: 'Science Building, Auditorium B',
      icon: 'school',
    },
    {
      id: 2,
      title: 'Freshers Mixer',
      category: 'SOCIAL',
      time: '4:00 PM',
      location: 'Student Union Main Hall',
      icon: 'people',
    },
    {
      id: 3,
      title: 'Career Workshop',
      category: 'CAREER',
      time: '6:00 PM',
      location: 'Building 4, Room 402',
      icon: 'briefcase',
    },
  ];

  tomorrowEvents: EventItem[] = [];

  constructor(modalController: ModalController) {
    this.modalController = modalController;
    addIcons({
      schoolOutline,
      searchOutline,
      notificationsOutline,
      calendarOutline,
      locationOutline,
      timeOutline,
      briefcaseOutline,
      peopleOutline,
      trophyOutline,
      chevronForward,
      chevronBackOutline,
    });
  }

  getCategoryColor(category: string): { background: string; color: string } {
    const colors: { [key: string]: { background: string; color: string } } = {
      ACADEMIC: { background: '#e8ecff', color: '#1152d4' },
      SOCIAL: { background: '#fff3e0', color: '#f57c00' },
      CAREER: { background: '#e8f5e9', color: '#2e7d32' },
      SPORTS: { background: '#ffebee', color: '#c62828' },
    };
    return colors[category] || { background: '#e8ecff', color: '#1152d4' };
  }

  getIconColor(category: string): string {
    const colors: { [key: string]: string } = {
      ACADEMIC: '#1152d4',
      SOCIAL: '#f57c00',
      CAREER: '#2e7d32',
      SPORTS: '#c62828',
    };
    return colors[category] || '#1152d4';
  }

  viewEventDetail(event: EventItem) {
    this.router.navigate(['/event-detail', event.id]);
  }

  registerNow(event: EventItem, eventObj: Event) {
    eventObj.stopPropagation();
    this.router.navigate(['/event-registration', event.id]);
  }

  viewDetails(event: EventItem, eventObj: Event) {
    eventObj.stopPropagation();
    this.router.navigate(['/event-detail', event.id]);
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async goToSearch() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      cssClass: 'search-modal',
    });
    await modal.present();
  }
}
