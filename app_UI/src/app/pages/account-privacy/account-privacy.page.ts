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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  AlertController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
  personOutline,
  mailOutline,
  keyOutline,
  trashOutline,
  atOutline,
  chatbubbleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-account-privacy',
  templateUrl: './account-privacy.page.html',
  styleUrls: ['./account-privacy.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule,
    CommonModule,
  ],
})
export class AccountPrivacyPage {
  private router = inject(Router);
  private alertController = inject(AlertController);

  // Profile visibility
  profileVisible: boolean = true;
  showEmail: boolean = false;
  showStudentId: boolean = false;

  // Privacy settings
  allowMessages: boolean = true;
  showOnlineStatus: boolean = false;
  allowTagging: boolean = true;

  // Password change
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor() {
    addIcons({
      chevronBackOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      shieldCheckmarkOutline,
      personOutline,
      mailOutline,
      keyOutline,
      trashOutline,
      atOutline,
      chatbubbleOutline,
    });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      await this.showAlert('Error', 'Please fill in all password fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      await this.showAlert('Error', 'New passwords do not match');
      return;
    }

    if (this.newPassword.length < 6) {
      await this.showAlert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Simulate password change
    await this.showAlert('Success', 'Password changed successfully');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.goBack();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message:
        'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // Implement account deletion logic
            console.log('Account deleted');
          },
        },
      ],
    });
    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  savePrivacySettings() {
    const settings = {
      profileVisible: this.profileVisible,
      showEmail: this.showEmail,
      showStudentId: this.showStudentId,
      allowMessages: this.allowMessages,
      showOnlineStatus: this.showOnlineStatus,
      allowTagging: this.allowTagging,
    };
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    this.goBack();
  }
}
