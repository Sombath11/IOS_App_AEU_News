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
  calendarOutline,
  timeOutline,
  locationOutline
} from 'ionicons/icons';

interface Registration {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-my-registrations',
  templateUrl: './my-registrations.page.html',
  styleUrls: ['./my-registrations.page.scss'],
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
export class MyRegistrationsPage {
  private router = inject(Router);

  registrations: Registration[] = [
    {
      id: 1,
      eventId: 1,
      eventTitle: 'Annual Tech Symposium 2024',
      eventDate: 'October 14-16, 2024',
      eventTime: '9:00 AM - 5:00 PM',
      eventLocation: 'Main Campus, Grand Auditorium',
      registrationDate: 'Feb 20, 2024',
      status: 'confirmed',
    },
    {
      id: 2,
      eventId: 2,
      eventTitle: 'AI & Machine Learning Workshop',
      eventDate: 'November 5, 2024',
      eventTime: '10:00 AM - 3:00 PM',
      eventLocation: 'Computer Lab 2, Building B',
      registrationDate: 'Feb 18, 2024',
      status: 'pending',
    },
    {
      id: 3,
      eventId: 3,
      eventTitle: 'Career Fair 2024',
      eventDate: 'December 1, 2024',
      eventTime: '9:00 AM - 4:00 PM',
      eventLocation: 'Student Center Hall',
      registrationDate: 'Feb 15, 2024',
      status: 'confirmed',
    },
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      calendarOutline,
      timeOutline,
      locationOutline
    });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  viewEventDetails(eventId: number) {
    this.router.navigate([`/event-detail/${eventId}`]);
  }

  browseEvents() {
    this.router.navigate(['/tabs/events']);
  }
}
