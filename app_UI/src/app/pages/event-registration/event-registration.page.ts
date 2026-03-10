import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  locationOutline,
  lockClosed,
  chevronBackOutline
} from 'ionicons/icons';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

interface Registration {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  dietary: string;
  requests: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.page.html',
  styleUrls: ['./event-registration.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    FormsModule,
    CommonModule,
  ],
})
export class EventRegistrationPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  event: Event = {
    id: 1,
    title: 'Annual Tech Symposium 2024',
    date: 'October 14-16, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Main Campus, Grand Auditorium',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  };

  registration: Registration = {
    fullName: 'Alex Johnson',
    studentId: '2024-AEU-8829',
    email: 'alex.johnson@aeu.edu',
    phone: '',
    department: '',
    year: '',
    dietary: '',
    requests: '',
    acceptTerms: false,
  };

  constructor() {
    addIcons({
      calendarOutline,
      locationOutline,
      lockClosed,
      chevronBackOutline
    });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  submitRegistration() {
    if (
      this.registration.fullName &&
      this.registration.studentId &&
      this.registration.department
    ) {
      // Navigate to success page
      this.router.navigate(['/registration-success', this.event.id]);
    }
  }
}
