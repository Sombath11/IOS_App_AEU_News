import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonToggle,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  mailOutline,
  pushOutline,
  chatbubbleOutline,
  calendarOutline,
  alarmOutline,
  notificationsOffOutline,
  timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.page.html',
  styleUrls: ['./notification-preferences.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonToggle,
    IonItem,
    IonLabel,
    FormsModule,
    CommonModule,
  ],
})
export class NotificationPreferencesPage {
  private router = inject(Router);

  // Email notifications
  emailNotifications: boolean = true;
  emailEventReminders: boolean = true;
  emailRegistrationConfirmations: boolean = true;
  emailWeeklyDigest: boolean = false;

  // Push notifications
  pushNotifications: boolean = true;
  pushEventAlerts: boolean = true;
  pushAnnouncements: boolean = true;
  pushDeadlineReminders: boolean = true;

  // SMS notifications
  smsNotifications: boolean = false;
  smsEventReminders: boolean = false;
  smsUrgentAlerts: boolean = true;

  constructor() {
    addIcons({
      chevronBackOutline,
      mailOutline,
      pushOutline,
      chatbubbleOutline,
      calendarOutline,
      alarmOutline,
      notificationsOffOutline,
      timeOutline,
    });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  savePreferences() {
    // Save preferences to local storage or backend
    const preferences = {
      email: {
        enabled: this.emailNotifications,
        eventReminders: this.emailEventReminders,
        registrationConfirmations: this.emailRegistrationConfirmations,
        weeklyDigest: this.emailWeeklyDigest,
      },
      push: {
        enabled: this.pushNotifications,
        eventAlerts: this.pushEventAlerts,
        announcements: this.pushAnnouncements,
        deadlineReminders: this.pushDeadlineReminders,
      },
      sms: {
        enabled: this.smsNotifications,
        eventReminders: this.smsEventReminders,
        urgentAlerts: this.smsUrgentAlerts,
      },
    };

    localStorage.setItem(
      'notificationPreferences',
      JSON.stringify(preferences),
    );
    this.goBack();
  }

  disableAll() {
    // Disable all notifications
    this.emailNotifications = false;
    this.emailEventReminders = false;
    this.emailRegistrationConfirmations = false;
    this.emailWeeklyDigest = false;

    this.pushNotifications = false;
    this.pushEventAlerts = false;
    this.pushAnnouncements = false;
    this.pushDeadlineReminders = false;

    this.smsNotifications = false;
    this.smsEventReminders = false;
    this.smsUrgentAlerts = false;
  }
}
