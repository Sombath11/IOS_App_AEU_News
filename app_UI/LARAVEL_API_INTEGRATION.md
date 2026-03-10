# Laravel API Integration Guide

This Ionic app is now configured to connect to your Laravel backend API.

## 📁 Files Created

```
src/
├── environments/
│   └── environment.ts          # API URL configuration
├── app/
│   ├── interceptors/
│   │   └── api.interceptor.ts  # Handles auth tokens & headers
│   └── services/
│       ├── api.service.ts      # Base HTTP service
│       ├── auth.service.ts     # Authentication (login, register, logout)
│       └── event.service.ts    # Events API example
```

## 🔧 Configuration

### 1. Update API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',  // Change to your Laravel URL
};
```

**For mobile device testing:**
```typescript
apiUrl: 'http://192.168.1.100:8000/api'  // Your computer's IP address
```

### 2. Laravel API Routes Expected

The services expect these Laravel API routes:

```php
// routes/api.php

// Authentication (Laravel Sanctum/Passport)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Events
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::post('/events', [EventController::class, 'store'])->middleware('auth:sanctum');
Route::put('/events/{id}', [EventController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/events/{id}', [EventController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/events/{id}/register', [EventController::class, 'register'])->middleware('auth:sanctum');
Route::get('/events/my-registrations', [EventController::class, 'myRegistrations'])->middleware('auth:sanctum');
Route::delete('/events/{id}/register', [EventController::class, 'cancelRegistration'])->middleware('auth:sanctum');
```

## 📖 Usage Examples

### Authentication

```typescript
import { AuthService } from './services/auth.service';

// Login
this.authService.login({ email: 'user@example.com', password: 'password' })
  .subscribe({
    next: (response) => {
      // Store token automatically
      this.authService.setToken(response.access_token || response.token!);
    },
    error: (err) => console.error(err)
  });

// Register
this.authService.register({ 
  name: 'John Doe', 
  email: 'john@example.com', 
  password: 'password',
  password_confirmation: 'password'
}).subscribe({
  next: (response) => {
    this.authService.setToken(response.access_token || response.token!);
  }
});

// Get current user
this.authService.me().subscribe(user => console.log(user));

// Logout
this.authService.logout().subscribe({
  complete: () => {
    this.authService.clearToken();
  }
});
```

### Events

```typescript
import { EventService } from './services/event.service';

// Get all events
this.eventService.getEvents().subscribe(events => {
  this.events = events;
});

// Get single event
this.eventService.getEvent(1).subscribe(event => {
  console.log(event);
});

// Register for event
this.eventService.registerForEvent(eventId).subscribe({
  next: () => console.log('Registered!')
});

// Get my registrations
this.eventService.getMyRegistrations().subscribe(registrations => {
  console.log(registrations);
});
```

### Custom API Calls

```typescript
import { ApiService } from './services/api.service';

// GET request
this.api.get<User[]>('users').subscribe(users => {
  console.log(users);
});

// POST request
this.api.post<Post>('posts', { title: 'New Post', body: 'Content' })
  .subscribe(post => console.log(post));

// PUT request
this.api.put<User>(`users/${id}`, { name: 'Updated Name' })
  .subscribe(user => console.log(user));

// DELETE request
this.api.delete<void>(`posts/${id}`)
  .subscribe(() => console.log('Deleted!'));
```

## 🔐 Authentication Flow

1. User logs in via `AuthService.login()`
2. Laravel returns JWT/access token
3. Token is stored in localStorage via `setAuthToken()`
4. `ApiInterceptor` automatically adds `Authorization: Bearer {token}` to all API requests
5. On logout, clear token with `clearToken()`

## 🚨 Error Handling

The interceptor handles common Laravel API errors:

- **401 Unauthorized** - Token expired or invalid
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **422 Unprocessable Entity** - Validation errors

## 🧪 Testing with Laravel

1. Start Laravel: `php artisan serve` (runs on http://localhost:8000)
2. Start Ionic: `ionic serve` (runs on http://localhost:8100)
3. Enable CORS in Laravel (`config/cors.php`) to allow requests from Ionic app

### Laravel CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_origins' => ['http://localhost:8100', 'http://localhost:4200'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

## 📱 Building for Mobile

For iOS/Android, update `apiUrl` to point to your production Laravel server:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-laravel-api.com/api',
};
```

Build command:
```bash
ionic build --prod
npx cap sync ios  # or android
```
