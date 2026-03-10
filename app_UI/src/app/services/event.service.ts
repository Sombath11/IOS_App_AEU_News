import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Event {
  id: number;
  title: string;
  description: string;
  location?: string;
  start_date: string;
  end_date?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

/**
 * Events service for Laravel API
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly api = inject(ApiService);

  /**
   * Get all events
   */
  getEvents(): Observable<Event[]> {
    return this.api.get<Event[]>('events');
  }

  /**
   * Get single event by ID
   */
  getEvent(id: number): Observable<Event> {
    return this.api.get<Event>(`events/${id}`);
  }

  /**
   * Create new event
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.api.post<Event>('events', eventData);
  }

  /**
   * Update event
   */
  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    return this.api.put<Event>(`events/${id}`, eventData);
  }

  /**
   * Delete event
   */
  deleteEvent(id: number): Observable<void> {
    return this.api.delete<void>(`events/${id}`);
  }

  /**
   * Register for an event
   */
  registerForEvent(eventId: number): Observable<EventRegistration> {
    return this.api.post<EventRegistration>(`events/${eventId}/register`, {});
  }

  /**
   * Get user's registrations
   */
  getMyRegistrations(): Observable<EventRegistration[]> {
    return this.api.get<EventRegistration[]>('events/my-registrations');
  }

  /**
   * Cancel registration
   */
  cancelRegistration(eventId: number): Observable<void> {
    return this.api.delete<void>(`events/${eventId}/register`);
  }
}
