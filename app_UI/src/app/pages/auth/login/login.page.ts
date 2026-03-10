import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  AlertController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline, 
  logInOutline, 
  eyeOutline, 
  eyeOffOutline,
  logoGoogle,
  logoMicrosoft
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonText,
    FormsModule,
    CommonModule
  ]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  // Icons
  personOutline = personOutline;
  mailOutline = mailOutline;
  lockClosedOutline = lockClosedOutline;
  logInOutline = logInOutline;
  eyeOutline = eyeOutline;
  eyeOffOutline = eyeOffOutline;
  logoGoogle = logoGoogle;
  logoMicrosoft = logoMicrosoft;

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  onLogin() {
    // Validation - the email field can contain either email or student ID
    const loginIdentifier = this.email.trim();

    if (!loginIdentifier || !this.password) {
      this.showAlert('Error', 'Please enter email/student ID and password');
      return;
    }

    this.isLoading = true;

    // Prepare login credentials
    const credentials: any = { password: this.password };

    // Determine if input is email or student ID
    const isEmail = loginIdentifier.includes('@');
    if (isEmail) {
      credentials.email = loginIdentifier;
    } else {
      credentials.student_id = loginIdentifier;
    }

    // Call Laravel API
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Store token
        const token = response.access_token || response.token;
        if (token) {
          this.authService.setToken(token);
          this.authService.cacheCurrentUser(response.user);
        }

        // Navigate to tabs
        this.router.navigate(['/tabs']);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Invalid credentials. Please try again.';
        this.showAlert('Login Failed', message);
      }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  navigateToRegistration() {
    this.router.navigate(['/auth/registration']);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithMicrosoft() {
    console.log('Login with Microsoft');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
