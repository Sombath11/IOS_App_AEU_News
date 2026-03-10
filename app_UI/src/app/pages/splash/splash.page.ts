import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon]
})
export class SplashPage {
  private router = inject(Router);

  navigateToOnboarding() {
    this.router.navigate(['/onboarding']);
  }
}
