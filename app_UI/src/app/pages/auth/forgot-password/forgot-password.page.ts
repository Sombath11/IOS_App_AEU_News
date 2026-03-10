import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem
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

  email: string = '';

  goBack() {
    window.history.back();
  }

  onSubmit() {
    if (this.email) {
      // Implement password reset logic
      console.log('Password reset email sent to:', this.email);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
