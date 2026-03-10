import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  checkmarkOutline,
  calendarOutline,
  timeOutline,
  locationOutline,
  informationCircleOutline
} from 'ionicons/icons';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.page.html',
  styleUrls: ['./registration-success.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule
  ]
})
export class RegistrationSuccessPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  event: Event = {
    id: 1,
    title: 'Workshop: Mobile App Development with Ionic',
    date: 'February 20, 2025',
    time: '9:00 AM - 12:00 PM',
    location: 'Computer Lab 3, Building A'
  };

  constructor() {
    addIcons({ 
      checkmarkOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
      informationCircleOutline
    });
  }

  backToHome() {
    this.router.navigate(['/tabs/home']);
  }

  viewMyRegistrations() {
    this.router.navigate(['/my-registrations']);
  }
}
