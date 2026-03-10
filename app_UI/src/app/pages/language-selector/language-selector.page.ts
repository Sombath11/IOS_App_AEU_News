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
  IonList,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  languageOutline,
  checkmarkCircle
} from 'ionicons/icons';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.page.html',
  styleUrls: ['./language-selector.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonRadio,
    IonRadioGroup,
    FormsModule,
    CommonModule,
  ],
})
export class LanguageSelectorPage {
  private router = inject(Router);

  selectedLanguage: string = 'en-US';

  languages: Language[] = [
    {
      code: 'en-US',
      name: 'English (US)',
      nativeName: 'English (US)',
      flag: '🇺🇸',
    },
    {
      code: 'en-GB',
      name: 'English (UK)',
      nativeName: 'English (UK)',
      flag: '🇬🇧',
    },
    {
      code: 'zh-CN',
      name: 'Chinese (Simplified)',
      nativeName: '简体中文',
      flag: '🇨🇳',
    },
    {
      code: 'zh-TW',
      name: 'Chinese (Traditional)',
      nativeName: '繁體中文',
      flag: '🇹🇼',
    },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'km-KH', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      languageOutline,
      checkmarkCircle,
    });

    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    }
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  selectLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
    localStorage.setItem('selectedLanguage', languageCode);

    // Get language name for display
    const language = this.languages.find((l) => l.code === languageCode);
    if (language) {
      localStorage.setItem('selectedLanguageName', language.name);
    }

    // Navigate back after selection
    setTimeout(() => {
      this.goBack();
    }, 300);
  }
}
