# Laravel Backend Setup Guide

## ✅ Backend Created Successfully

Your Laravel backend has been set up at:
```
c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend
```

---

## 📁 What Was Created

### Database
- **SQLite database** with migrations run
- **Users table** (with Sanctum API tokens)
- **Events table** (for storing events)
- **Event registrations table** (for user registrations)

### Sample Data
- **Test User:**
  - Email: `test@example.com`
  - Password: `password`

- **5 Sample Events:**
  1. iOS App Development Workshop
  2. Mobile UI/UX Design Conference
  3. Swift Programming Bootcamp
  4. App Store Optimization Seminar
  5. Student Hackathon 2026

### API Endpoints

#### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user |

#### Authentication (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/user` | Get current user |

#### Events (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/{id}` | Get single event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |

#### Event Registration (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/{id}/register` | Register for event |
| GET | `/api/events/my-registrations` | Get my registrations |
| DELETE | `/api/events/{id}/register` | Cancel registration |

---

## 🚀 How to Start the Laravel Server

### Step 1: Open a New Terminal/Command Prompt

```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
```

### Step 2: Start the Server

```bash
php artisan serve
```

The server will start at: `http://localhost:8000`

> **Note:** If port 8000 is already in use, try:
> ```bash
> php artisan serve --port=8001
> ```

---

## 🔧 Update Ionic App Configuration

After starting Laravel, update your Ionic app's environment file:

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',  // Match your Laravel URL
};
```

**For mobile device testing**, use your computer's IP:
```typescript
apiUrl: 'http://192.168.1.100:8000/api'
```

---

## 🧪 Test the API

### Test Get Events (Public)
```bash
curl http://localhost:8000/api/events
```

Expected response:
```json
[
  {
    "id": 1,
    "title": "iOS App Development Workshop",
    "description": "...",
    "location": "...",
    "start_date": "2026-03-15T09:00:00.000000Z",
    ...
  }
]
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password\"}"
```

Expected response:
```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  },
  "access_token": "1|abc123..."
}
```

### Test Protected Endpoint (with token)
```bash
curl http://localhost:8000/api/user ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 Using the API in Your Ionic App

### Login Example

```typescript
import { AuthService } from './services/auth.service';

this.authService.login({ 
  email: 'test@example.com', 
  password: 'password' 
}).subscribe({
  next: (response) => {
    // Store the token
    this.authService.setToken(response.access_token);
    console.log('Logged in!', response.user);
  },
  error: (err) => {
    console.error('Login failed', err);
  }
});
```

### Get Events Example

```typescript
import { EventService } from './services/event.service';

this.eventService.getEvents().subscribe({
  next: (events) => {
    this.events = events;
    console.log('Events loaded:', events);
  },
  error: (err) => {
    console.error('Failed to load events', err);
  }
});
```

---

## 📝 Running Both Servers

You need **two terminals**:

**Terminal 1 - Laravel Backend:**
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan serve
```

**Terminal 2 - Ionic Frontend:**
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
ionic serve
```

---

## 🛠️ Useful Laravel Commands

```bash
# Clear application cache
php artisan cache:clear
php artisan config:clear

# View logs
php artisan pail

# Create new model/controller
php artisan make:model ModelName -m
php artisan make:controller ControllerName

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Reset and seed
php artisan migrate:fresh --seed
```

---

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port
php artisan serve --port=8001
```

### CORS Errors
Make sure `config/cors.php` includes your Ionic app URL:
```php
'allowed_origins' => ['http://localhost:8100', 'http://localhost:4200'],
```

### 401 Unauthorized
- Ensure you're sending the token: `Authorization: Bearer {token}`
- Token is stored automatically via `AuthService.setToken()`

### Database Errors
```bash
# Recreate database
del database\database.sqlite
php artisan migrate --seed
```

---

## ✅ Quick Start Checklist

- [ ] Start Laravel server: `php artisan serve`
- [ ] Update `environment.ts` with correct API URL
- [ ] Start Ionic app: `ionic serve`
- [ ] Test login with `test@example.com` / `password`
- [ ] Verify events load in the app

---

**Happy Coding! 🎉**
