import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  documentTextOutline,
  downloadOutline,
  chevronForward
} from 'ionicons/icons';

interface Semester {
  id: number;
  name: string;
  gpa: number;
  credits: number;
  courses: number;
  status: 'completed' | 'in-progress';
}

interface Transcript {
  id: number;
  title: string;
  date: string;
}

@Component({
  selector: 'app-academic-records',
  templateUrl: './academic-records.page.html',
  styleUrls: ['./academic-records.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    CommonModule
  ]
})
export class AcademicRecordsPage {
  private router = inject(Router);

  semesters: Semester[] = [
    {
      id: 1,
      name: 'Semester 1, 2024-2025',
      gpa: 3.9,
      credits: 15,
      courses: 5,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Semester 2, 2023-2024',
      gpa: 3.8,
      credits: 18,
      courses: 6,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Semester 1, 2023-2024',
      gpa: 3.7,
      credits: 15,
      courses: 5,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Semester 2, 2022-2023',
      gpa: 3.8,
      credits: 18,
      courses: 6,
      status: 'completed'
    }
  ];

  transcripts: Transcript[] = [
    {
      id: 1,
      title: 'Official Transcript 2024',
      date: 'January 2024'
    },
    {
      id: 2,
      title: 'Official Transcript 2023',
      date: 'January 2023'
    }
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      documentTextOutline,
      downloadOutline,
      chevronForward
    });
  }

  goBack() {
    window.history.back();
  }

  viewSemesterDetails(semester: Semester) {
  }

  downloadTranscript(transcript: Transcript) {
  }

  getGpaClass(gpa: number): string {
    if (gpa >= 3.5) return 'high';
    if (gpa >= 3.0) return 'medium';
    return 'low';
  }
}
