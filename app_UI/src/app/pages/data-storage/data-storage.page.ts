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
  IonItem,
  IonLabel,
  IonProgressBar,
  AlertController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  serverOutline,
  cloudDownloadOutline,
  trashOutline,
  wifiOutline,
  phonePortraitOutline,
  refreshOutline,
  timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-data-storage',
  templateUrl: './data-storage.page.html',
  styleUrls: ['./data-storage.page.scss'],
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
    IonItem,
    IonLabel,
    IonProgressBar,
    FormsModule,
    CommonModule,
  ],
})
export class DataStoragePage {
  private router = inject(Router);
  private alertController = inject(AlertController);

  // Storage info
  totalStorage: number = 500; // MB
  usedStorage: number = 245; // MB
  availableStorage: number = 255; // MB;
  storagePercentage: number = 49;

  // Cache settings
  cacheEnabled: boolean = true;
  autoClearCache: boolean = false;
  cacheExpiryDays: number = 30;

  // Download settings
  wifiOnlyDownloads: boolean = true;
  autoDownloadUpdates: boolean = false;
  downloadQuality: string = 'high';

  // Data usage
  mobileDataUsage: number = 125; // MB
  wifiDataUsage: number = 375; // MB

  constructor() {
    addIcons({
      chevronBackOutline,
      serverOutline,
      cloudDownloadOutline,
      trashOutline,
      wifiOutline,
      phonePortraitOutline,
      refreshOutline,
      timeOutline,
    });
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }

  get usedStoragePercent(): number {
    return (this.usedStorage / this.totalStorage) * 100;
  }

  async clearCache() {
    // Simulate clearing cache
    const cachedSize = 45; // MB
    this.usedStorage -= cachedSize;
    this.availableStorage += cachedSize;
    this.storagePercentage = Math.round(
      (this.usedStorage / this.totalStorage) * 100,
    );

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Cache cleared successfully! Freed up 45 MB',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async clearAllData() {
    const alert = await this.alertController.create({
      header: 'Clear All Data',
      message:
        'Are you sure you want to clear all data? This will reset the app to its initial state.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            localStorage.clear();
            this.usedStorage = 0;
            this.availableStorage = this.totalStorage;
            this.storagePercentage = 0;
            this.showMessage('All data cleared successfully');
            setTimeout(() => this.goBack(), 1000);
          },
        },
      ],
    });
    await alert.present();
  }

  async showMessage(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  saveSettings() {
    const settings = {
      cache: {
        enabled: this.cacheEnabled,
        autoClear: this.autoClearCache,
        expiryDays: this.cacheExpiryDays,
      },
      downloads: {
        wifiOnly: this.wifiOnlyDownloads,
        autoDownload: this.autoDownloadUpdates,
        quality: this.downloadQuality,
      },
    };
    localStorage.setItem('dataStorageSettings', JSON.stringify(settings));
    this.goBack();
  }
}
