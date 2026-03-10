import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule]
})
export class OnboardingPage {
  private router = inject(Router);

  currentSlide = 0;
  totalSlides = 2;

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
    } else {
      this.completeOnboarding();
    }
  }

  skipOnboarding() {
    this.completeOnboarding();
  }

  completeOnboarding() {
    this.router.navigate(['/auth/login']);
  }
}
