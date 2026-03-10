import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  shareOutline,
  calendarOutline,
  timeOutline,
  locationOutline,
  chevronBackOutline,
  homeOutline,
  notificationsOutline,
  personOutline
} from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Speaker {
  name: string;
  image: string;
}

interface Event {
  id: number;
  title: string;
  category: string;
  university: string;
  date: string;
  dateSubtitle: string;
  time: string;
  timeSubtitle: string;
  location: string;
  locationSubtitle: string;
  description: string;
  image: string;
  speakers: Speaker[];
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
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
export class EventDetailPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  loading: boolean = true;
  eventId: number | null = null;

  event: Event = {
    id: 1,
    title: 'Loading...',
    category: '',
    university: 'Asia Euro University',
    date: '',
    dateSubtitle: 'Save the date to your calendar',
    time: '',
    timeSubtitle: '',
    location: '',
    locationSubtitle: '',
    description: '',
    image: '',
    speakers: []
  };

  constructor() {
    addIcons({
      shareOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
      chevronBackOutline,
      homeOutline,
      notificationsOutline,
      personOutline
    });
  }

  ngOnInit() {
    // Get event ID from route
    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number) {
    this.loading = true;
    console.log('Loading event ID:', id);
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('No authentication token - showing demo event data');
      this.loadDemoEvent();
      return;
    }
    
    // Fetch from Laravel API
    this.http.get<any>(`${environment.apiUrl}/events/${id}`).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        // Handle Laravel API response structure (data is in 'event' property)
        const eventData = response.event || response.data || response;
        console.log('Event object:', eventData);
        
        this.event = {
          id: eventData?.id || id,
          title: eventData?.title || 'Untitled Event',
          category: eventData?.category || 'GENERAL EVENT',
          university: 'Asia Euro University',
          date: this.formatDate(eventData?.event_date || eventData?.date),
          dateSubtitle: 'Save the date to your calendar',
          time: this.formatTime(eventData?.event_time || eventData?.time),
          timeSubtitle: 'Event time',
          location: eventData?.location || 'TBA',
          locationSubtitle: 'Event location',
          description: eventData?.description || '',
          image: eventData?.image_url || eventData?.image || '',
          speakers: eventData?.speakers || []
        };
        console.log('Event loaded:', this.event);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.loading = false;
        
        // If 401 or 404, show demo data instead
        if (error.status === 401 || error.status === 404) {
          console.log('Showing demo event data');
          this.loadDemoEvent();
        } else {
          this.event = {
            id: id,
            title: 'Event Not Found',
            category: '',
            university: 'Asia Euro University',
            date: '',
            dateSubtitle: '',
            time: '',
            timeSubtitle: '',
            location: '',
            locationSubtitle: '',
            description: 'Sorry, the event you are looking for could not be found.',
            image: '',
            speakers: []
          };
        }
      }
    });
  }
  
  loadDemoEvent() {
    // Show sample event data if API fails
    this.event = {
      id: 1,
      title: 'Annual Tech Symposium 2024',
      category: 'ACADEMIC EVENT',
      university: 'Asia Euro University',
      date: 'Thursday, Oct 24, 2024',
      dateSubtitle: 'Save the date to your calendar',
      time: '09:00 AM - 05:00 PM',
      timeSubtitle: 'Full day of sessions & networking',
      location: 'Great Hall, AEU Campus',
      locationSubtitle: 'Main University Complex',
      description: `Join us for the most anticipated tech event of the year at AEU. The Annual Tech Symposium 2024 brings together industry leaders, academic researchers, and innovative students to explore the future of artificial intelligence, sustainable engineering, and digital transformation.

Highlights include keynote speeches from global tech pioneers, interactive workshops, and a networking lunch in the campus gardens.`,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      speakers: [
        {
          name: 'Dr. Alan Chen',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'
        },
        {
          name: 'Sarah Jenkins',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
        },
        {
          name: 'Markus Vogt',
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200'
        }
      ]
    };
    this.loading = false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    // Assuming time is in HH:MM format
    return timeString;
  }

  shareEvent() {
    console.log('Share event');
  }

  registerNow() {
    this.router.navigate(['/event-registration', this.event.id]);
  }

  goBack() {
    window.history.back();
  }

  navigateTo(page: string) {
    this.router.navigate([`/tabs/${page}`]);
  }
}
