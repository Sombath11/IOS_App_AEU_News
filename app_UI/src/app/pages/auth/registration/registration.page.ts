import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  AlertController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    FormsModule,
    CommonModule
  ]
})
export class RegistrationPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  name: string = '';
  studentId: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, checkmarkCircleOutline });
  }

  onRegister() {
    // Validation
    if (!this.name || !this.studentId || !this.email || !this.password || !this.confirmPassword) {
      this.showAlert('Error', 'Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Passwords do not match');
      return;
    }

    if (this.password.length < 8) {
      this.showAlert('Error', 'Password must be at least 8 characters');
      return;
    }

    this.isLoading = true;

    // Call Laravel API
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmPassword,
      student_id: this.studentId
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Store token
        const token = response.access_token || response.token;
        if (token) {
          this.authService.setToken(token);
          this.authService.cacheCurrentUser(response.user);
        }

        // Show success and redirect
        this.showAlert(
          'Registration Successful!',
          'Welcome to AEU News Portal!',
          () => {
            this.router.navigate(['/tabs']);
          }
        );
      },
      error: (error) => {
        this.isLoading = false;
        let message = 'Registration failed. Please try again.';
        
        if (error.error?.errors) {
          // Laravel validation errors
          const errors = error.error.errors;
          message = Object.keys(errors).map(key => errors[key][0]).join('\n');
        } else if (error.error?.message) {
          message = error.error.message;
        }
        
        this.showAlert('Registration Failed', message);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async showAlert(header: string, message: string, callback?: () => void) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: callback
      }]
    });
    await alert.present();
  }
}
