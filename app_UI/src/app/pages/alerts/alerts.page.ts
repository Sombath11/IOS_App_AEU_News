import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  warningOutline,
  bookOutline,
  calendarOutline,
  documentTextOutline,
  walletOutline,
  personOutline,
  notificationsOffOutline,
  chevronBackOutline,
  trashOutline,
  checkmarkDoneOutline,
  newspaperOutline,
  lockClosedOutline
} from 'ionicons/icons';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Notification } from '../../models/notification';

interface Alert {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconClass: string;
  isEmergency?: boolean;
  isToday?: boolean;
  notification?: Notification;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule
  ]
})
export class AlertsPage implements OnInit {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);
  private authService = inject(AuthService);

  alerts: Alert[] = [];
  isLoading = true;
  unreadCount = 0;
  isLoggedIn = false;
  hasError = false;

  constructor() {
    addIcons({
      warningOutline,
      bookOutline,
      calendarOutline,
      documentTextOutline,
      walletOutline,
      personOutline,
      notificationsOffOutline,
      chevronBackOutline,
      trashOutline,
      checkmarkDoneOutline,
      newspaperOutline,
      lockClosedOutline
    });
  }

  async ngOnInit() {
    // Force check token immediately
    this.checkAuth();
  }

  checkAuth() {
    const token = localStorage.getItem('auth_token');
    const user = this.authService.getCurrentUser();

    this.isLoggedIn = token !== null && token !== undefined && token !== '';

    if (this.isLoggedIn) {
      this.loadNotifications();
    } else {
      this.isLoading = false;
      this.hasError = false;
    }
  }

  async loadNotifications() {
    this.isLoading = true;
    this.hasError = false;

    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.alerts = data.notifications.data.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          time: this.notificationService.timeAgo(notification.created_at),
          read: notification.is_read,
          icon: notification.icon,
          iconClass: this.notificationService.getIconClass(notification.type, notification.is_emergency),
          isEmergency: notification.is_emergency,
          isToday: this.notificationService.isToday(notification),
          notification: notification
        }));
        this.unreadCount = data.unread_count;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;

        if (error.status === 401) {
          this.isLoggedIn = false;
          this.showToast('Session expired. Please login again.', 'danger');
        } else if (error.status === 0) {
          this.showToast('Cannot connect to server. Make sure Laravel is running on port 8888.', 'danger');
        } else {
          this.showToast('Failed to load notifications: ' + (error.error?.message || 'Unknown error'), 'danger');
        }
      }
    });
  }

  goBack() {
    window.history.back();
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  async clearAll() {
    const loading = await this.loadingController.create({
      message: 'Clearing notifications...'
    });
    await loading.present();

    const deletePromises = this.alerts.map(alert =>
      this.notificationService.deleteNotification(alert.id).toPromise()
    );

    try {
      await Promise.all(deletePromises);
      this.alerts = [];
      this.unreadCount = 0;
      await loading.dismiss();
      this.showToast('All notifications cleared', 'success');
    } catch (error) {
      await loading.dismiss();
      this.showToast('Failed to clear notifications', 'danger');
    }
  }

  get todayAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.isToday);
  }

  get earlierAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.isToday);
  }

  get allAlerts(): Alert[] {
    return this.alerts;
  }

  async markAllAsRead() {
    const loading = await this.loadingController.create({
      message: 'Marking all as read...'
    });
    await loading.present();

    try {
      await this.notificationService.markAllAsRead().toPromise();
      this.alerts.forEach(alert => alert.read = true);
      this.unreadCount = 0;
      await loading.dismiss();
      this.showToast('All notifications marked as read', 'success');
    } catch (error) {
      await loading.dismiss();
      this.showToast('Failed to mark all as read', 'danger');
    }
  }

  async viewAlert(alert: Alert) {
    alert.read = true;
    this.unreadCount = Math.max(0, this.unreadCount - 1);

    if (alert.notification) {
      this.notificationService.markAsRead(alert.id).subscribe({
        error: (error) => { /* Silent error handling */ }
      });
    }

    if (alert.notification) {
      const targetUrl = this.notificationService.getTargetUrl(alert.notification);
      this.router.navigateByUrl(targetUrl);
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
