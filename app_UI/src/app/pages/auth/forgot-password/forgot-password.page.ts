import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  AlertController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonInput, IonItem, FormsModule, CommonModule]
})
export class ForgotPasswordPage {
  private router = inject(Router);
  private alertController = inject(AlertController);

  email: string = '';
  isLoading: boolean = false;

  goBack() {
    window.history.back();
  }

  onSubmit() {
    if (!this.email) {
      this.showAlert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showAlert('Error', 'Please enter a valid email address');
      return;
    }

    this.isLoading = true;
    // TODO: Implement password reset API call
    this.isLoading = false;
    this.showAlert('Success', 'If your email is registered, you will receive a password reset link');
    this.router.navigate(['/auth/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
