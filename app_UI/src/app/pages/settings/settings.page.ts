import { Component, OnInit, inject } from '@angular/core';
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
  IonToast
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  notifications,
  language,
  chevronForward,
  chevronDown,
  shieldCheckmark,
  server,
  logOutOutline,
  heart,
  moon
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
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
    IonToast,
    FormsModule,
    CommonModule
  ]
})
export class SettingsPage implements OnInit {
  private router = inject(Router);
  private themeService = inject(ThemeService);

  selectedLanguage: string = 'English (US)';
  isDarkMode: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastDuration: number = 2000;

  ngOnInit() {
    addIcons({
      chevronBackOutline,
      notifications,
      language,
      chevronForward,
      chevronDown,
      shieldCheckmark,
      server,
      logOutOutline,
      heart,
      moon
    });

    // Load saved preferences
    this.loadPreferences();
  }

  loadPreferences() {
    // Load language preference
    const savedLanguage = localStorage.getItem('selectedLanguageName');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    }

    // Load dark mode preference from theme service
    this.isDarkMode = this.themeService.isDarkMode();
  }

  onDarkModeToggle(event: CustomEvent) {
    const isDark = (event.target as HTMLIonToggleElement).checked;
    this.themeService.setDarkMode(isDark);
    this.isDarkMode = isDark;
    this.showMessage(isDark ? 'Dark mode enabled' : 'Dark mode disabled');
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
 
  openNotificationPreferences() {
    this.router.navigate(['/notification-preferences']);
  }

  openLanguageSelector() {
    this.router.navigate(['/language-selector']);
  }

  openAccountPrivacy() {
    this.router.navigate(['/account-privacy']);
  }

  openDataStorage() {
    this.router.navigate(['/data-storage']);
  }

  async logout() {
    // Clear user session data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    
    // Clear app data (optional - keep preferences)
    // localStorage.clear();
    
    this.showMessage('Logging out...');
    
    // Navigate to login after short delay
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 500);
  }

  showMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}
