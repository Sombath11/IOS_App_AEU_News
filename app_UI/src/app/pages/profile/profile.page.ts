import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonActionSheet,
  IonModal,
  IonSegment,
  IonSegmentButton,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { environment } from '../../../environments/environment';
import {
  chevronBackOutline,
  ellipsisVertical,
  cameraOutline,
  schoolOutline,
  bookmark,
  calendar,
  documentText,
  settings,
  logOutOutline,
  chevronForward,
  camera,
  images,
  cropOutline,
  refreshOutline,
  reloadOutline,
  colorPaletteOutline,
  createOutline
} from 'ionicons/icons';
import { AuthService, User } from '../../services/auth.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ActionSheetButton } from '@ionic/core';

interface Student {
  name: string;
  studentId: string;
  major: string;
  avatar: string;
  gpa: string;
  level: string;
  credits: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonActionSheet,
    IonModal,
    IonSegment,
    IonSegmentButton,
    CommonModule,
    FormsModule,
    ImageCropperComponent
  ],
})
export class ProfilePage implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertController = inject(AlertController);

  @ViewChild('imageCropper') cropper!: ImageCropperComponent;

  student: Student = {
    name: 'Alex Johnson',
    studentId: '20240915',
    major: 'Computer Science',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    gpa: '3.8',
    level: 'Year 3',
    credits: 120,
  };

  loading: boolean = false;
  
  // Image editing
  isActionSheetOpen = false;
  isCropModalOpen = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropAction: string = 'crop';
  
  actionSheetButtons: ActionSheetButton[] = [
    {
      text: 'Take Photo',
      icon: 'camera',
      handler: () => {
        this.takePhoto();
      }
    },
    {
      text: 'Choose from Gallery',
      icon: 'images',
      handler: () => {
        this.selectFromGallery();
      }
    },
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      ellipsisVertical,
      cameraOutline,
      schoolOutline,
      bookmark,
      calendar,
      documentText,
      settings,
      logOutOutline,
      chevronForward,
      camera,
      images,
      cropOutline,
      refreshOutline,
      reloadOutline,
      colorPaletteOutline,
      createOutline
    });
  }

  ngOnInit() {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      this.student.avatar = savedAvatar;
    }

    if (!this.authService.isAuthenticated()) {
      this.student = {
        name: 'Guest User',
        studentId: 'N/A',
        major: 'Please login to view your profile',
        avatar: this.student.avatar,
        gpa: 'N/A',
        level: 'N/A',
        credits: 0,
      };
      this.loading = false;
      return;
    }

    this.loadUserProfile();
  }

  /**
   * Load user profile from API
   */
  loadUserProfile() {
    this.loading = true;

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // User not logged in - use default/demo data
      this.student = {
        name: 'Guest User',
        studentId: 'N/A',
        major: 'Please login to view profile',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        gpa: 'N/A',
        level: 'N/A',
        credits: 0,
      };
      this.loading = false;
      return;
    }

    this.authService.me().subscribe({
      next: (user: User) => {
        // Get avatar URL from backend or use default
        const avatarUrl = user.avatar 
          ? `${environment.apiUrl.replace('/api', '')}/storage/${user.avatar}`
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';

        this.student = {
          name: user.name,
          studentId: user.student_id || 'N/A',
          major: 'Computer Science',
          avatar: avatarUrl,
          gpa: '3.8',
          level: 'Year 3',
          credits: 120,
        };
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        const cachedUser = this.authService.getCurrentUser();
        if (cachedUser) {
          this.student = {
            name: cachedUser.name,
            studentId: cachedUser.student_id || 'N/A',
            major: 'Computer Science',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            gpa: '3.8',
            level: 'Year 3',
            credits: 120,
          };
        } else {
          this.student = {
            name: 'Guest User',
            studentId: 'N/A',
            major: 'Please login to view profile',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            gpa: 'N/A',
            level: 'N/A',
            credits: 0,
          };
        }
      },
    });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  navigateToBookmarks() {
    this.router.navigate(['/tabs/bookmarks']);
  }

  navigateToRegistrations() {
    this.router.navigate(['/my-registrations']);
  }

  navigateToGrades() {
    this.router.navigate(['/tabs/academic-records']);
  }

  navigateToSettings() {
    this.router.navigate(['/tabs/settings']);
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  // Image editing methods
  // Hidden file input reference
  fileInput: HTMLInputElement | null = null;

  openImagePicker() {
    this.isActionSheetOpen = true;
  }

  takePhoto() {
    this.openFileSelector('camera');
  }

  selectFromGallery() {
    this.openFileSelector('gallery');
  }

  openFileSelector(source: 'camera' | 'gallery') {
    // Create a hidden file input
    if (!this.fileInput) {
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = 'image/*';
      this.fileInput.style.display = 'none';
      
      this.fileInput.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.handleImageFile(file);
        }
        // Reset the input so the same file can be selected again
        this.fileInput!.value = '';
      };
      
      document.body.appendChild(this.fileInput);
    }
    
    // Set capture attribute for camera
    if (source === 'camera') {
      this.fileInput.setAttribute('capture', 'environment');
    } else {
      this.fileInput.removeAttribute('capture');
    }
    
    // Trigger the file input
    this.fileInput.click();
    
    // Close the action sheet
    this.isActionSheetOpen = false;
  }

  handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.showAlert('Error', 'Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageBase64 = e.target?.result;

      if (imageBase64) {
        const blob = this.base64ToBlob(imageBase64, file.type);
        const newFile = new File([blob], file.name, { type: file.type });

        const event = {
          target: {
            files: [newFile]
          }
        };

        this.imageChangedEvent = event;

        setTimeout(() => {
          this.isCropModalOpen = true;
        }, 100);
      }
    };

    reader.onerror = (error) => {
      this.showAlert('Error', 'Failed to load image. Please try again.');
    };

    reader.readAsDataURL(file);
  }
  
  // Helper method to convert base64 to Blob
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 || '';
  }

  imageLoaded() {
  }

  cropperReady(sourceImageDimensions: any) {
  }

  loadImageFailed() {
    this.showAlert('Error', 'Failed to load image. Please try a different image.');
  }

  rotateLeft() {
  }

  rotateRight() {
  }

  flipHorizontal() {
  }

  flipVertical() {
  }

  onSegmentChange(event: any) {
    this.cropAction = event.detail.value;
  }

  cancelCrop() {
    this.isCropModalOpen = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  async saveCrop() {
    if (this.croppedImage) {
      // First update local state
      this.student.avatar = this.croppedImage;
      localStorage.setItem('user_avatar', this.croppedImage);

      // Upload to backend if authenticated
      if (this.authService.isAuthenticated()) {
        try {
          const blob = this.base64ToBlob(this.croppedImage, 'image/png');
          const file = new File([blob], 'avatar.png', { type: 'image/png' });
          const formData = new FormData();
          formData.append('avatar', file);

          this.authService.updateProfile(formData).subscribe({
            next: (response) => {
              // Update cached user with new avatar URL
              if (response.user) {
                this.authService.cacheCurrentUser(response.user);
                this.student.name = response.user.name;
              }
              this.showAlert('Success', 'Profile picture updated successfully!');
            },
            error: (error) => {
              console.error('Avatar upload error:', error);
              this.showAlert('Warning', 'Avatar saved locally but failed to upload to server.');
            }
          });
        } catch (error) {
          console.error('Upload error:', error);
          this.showAlert('Error', 'Failed to process image. Please try again.');
        }
      } else {
        this.showAlert('Success', 'Profile picture updated successfully!');
      }
    } else {
      this.showAlert('Error', 'No image was cropped. Please make sure to crop the image before saving.');
    }

    this.isCropModalOpen = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  uploadAvatar() {
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
