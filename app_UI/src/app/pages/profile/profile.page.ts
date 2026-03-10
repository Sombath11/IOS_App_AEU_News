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
    // Load saved avatar from localStorage if exists
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      this.student.avatar = savedAvatar;
      console.log('Loaded saved avatar from localStorage');
    }
    
    // Check if user is authenticated BEFORE calling API
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated - showing guest mode');
      // User not logged in - use default/demo data
      this.student = {
        name: 'Guest User',
        studentId: 'N/A',
        major: 'Please login to view your profile',
        avatar: this.student.avatar, // Keep the saved avatar if exists
        gpa: 'N/A',
        level: 'N/A',
        credits: 0,
      };
      this.loading = false;
      return;
    }
    
    // Only load from API if authenticated
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
        this.student = {
          name: user.name,
          studentId: user.student_id || 'N/A',
          major: 'Computer Science',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          gpa: '3.8',
          level: 'Year 3',
          credits: 120,
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
        
        // If 401 Unauthorized, use cached user data or default data
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
          // No cached user - show default data
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
    console.log('=== HANDLING IMAGE FILE ===');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.error('Not an image file!');
      this.showAlert('Error', 'Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageBase64 = e.target?.result;
      console.log('=== FILE READER COMPLETE ===');
      console.log('Base64 length:', imageBase64?.length);
      
      if (imageBase64) {
        // Create a File object from the base64
        const blob = this.base64ToBlob(imageBase64, file.type);
        const newFile = new File([blob], file.name, { type: file.type });
        
        // Create a proper event object for the cropper
        const event = {
          target: {
            files: [newFile]
          }
        };
        
        console.log('Setting imageChangedEvent...');
        this.imageChangedEvent = event;
        
        // Open modal after a delay to ensure change detection
        setTimeout(() => {
          this.isCropModalOpen = true;
          console.log('Crop modal opened');
        }, 100);
      }
    };
    
    reader.onerror = (error) => {
      console.error('=== FILE READER ERROR ===', error);
      this.showAlert('Error', 'Failed to load image. Please try again.');
    };
    
    reader.readAsDataURL(file);
    console.log('FileReader started');
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
    console.log('=== IMAGE CROPPED EVENT FIRED ===');
    console.log('Event:', event);
    console.log('Base64:', event.base64?.substring(0, 50) + '...');
    console.log('Blob:', event.blob);
    console.log('Base64 length:', event.base64?.length);
    
    // Get the cropped image in base64 format
    this.croppedImage = event.base64 || '';
    console.log('Cropped image set, length:', this.croppedImage?.length);
  }

  imageLoaded() {
    console.log('=== IMAGE LOADED IN CROPPER ===');
  }

  cropperReady(sourceImageDimensions: any) {
    console.log('=== CROPPER READY ===');
    console.log('Source image dimensions:', sourceImageDimensions);
  }

  loadImageFailed() {
    console.error('=== LOAD IMAGE FAILED ===');
    this.showAlert('Error', 'Failed to load image. Please try a different image.');
  }

  rotateLeft() {
    // Note: Rotation requires additional setup with image-cropper
    // For now, this is a placeholder
    console.log('Rotate left - requires cropper instance access');
  }

  rotateRight() {
    console.log('Rotate right - requires cropper instance access');
  }

  flipHorizontal() {
    console.log('Flip horizontal - requires cropper instance access');
  }

  flipVertical() {
    console.log('Flip vertical - requires cropper instance access');
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
    console.log('Save crop clicked');
    console.log('Cropped image exists:', !!this.croppedImage);
    
    // Use the cropped image from the event
    if (this.croppedImage) {
      // Update the student avatar with the cropped image
      this.student.avatar = this.croppedImage;
      
      // Save to localStorage for persistence
      localStorage.setItem('user_avatar', this.croppedImage);
      
      console.log('Avatar saved successfully, length:', this.croppedImage.length);
      this.showAlert('Success', 'Profile picture updated successfully!');
    } else {
      console.error('No cropped image available');
      this.showAlert('Error', 'No image was cropped. Please make sure to crop the image before saving.');
    }
    
    // Close the modal and reset
    this.isCropModalOpen = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  uploadAvatar() {
    // Here you would upload the image to your backend
    console.log('Uploading avatar:', this.student.avatar);
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
