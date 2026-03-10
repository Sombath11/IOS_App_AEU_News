# Laravel API + Ionic App Integration Guide

## ✅ Setup Complete!

Your Ionic app is now connected to the Laravel backend with full authentication and real-time data fetching.

---

## 🚀 How to Run

### Step 1: Start Laravel Backend

Open a terminal and run:
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
```

Or double-click the `start_laravel.bat` file.

### Step 2: Start Ionic Frontend

Open another terminal and run:
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
ionic serve
```

The app will open at: `http://localhost:8100`

---

## 🔐 Test Credentials

**Email:** `test@example.com`  
**Password:** `password`

---

## 📱 Features Implemented

### 1. Login Page (`/login`)
- Email and password login form
- Token-based authentication with Laravel Sanctum
- Automatic token storage in localStorage
- Error handling with alerts
- Redirects to tabs after successful login

### 2. Events Page (Tab 1)
- **Not Logged In:** Shows login prompt with test credentials
- **Logged In:** Displays real events from Laravel API
- Shows event title, description, location, and date
- Logout button in header
- Auto-refresh on login/logout

### 3. Authentication Flow
1. User opens app → Tab 1 shows login prompt
2. User clicks "Login" → Navigates to login page
3. User enters credentials → Token stored in localStorage
4. User redirected to Tab 1 → Events loaded from API
5. User can logout → Token cleared, events hidden

---

## 📁 Files Created/Modified

### New Files:
```
src/app/pages/login/
├── login.page.ts       # Login page component
├── login.page.html     # Login page template
└── login.page.scss     # Login page styles

src/app/services/
└── user.service.ts     # User state management service
```

### Modified Files:
```
src/app/services/
├── auth.service.ts     # Enhanced with token caching
└── api.service.ts      # Base API service (already created)

src/app/tab1/
├── tab1.page.ts        # Updated with auth check
└── tab1.page.html      # Updated with login/logout UI

src/app/
└── app.routes.ts       # Added login route
```

---

## 🔧 API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/user` - Get current user (protected)

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/{id}` - Get single event (protected)
- `POST /api/events/{id}/register` - Register for event (protected)
- `GET /api/events/my-registrations` - Get user's registrations (protected)

---

## 💾 Data Flow

### Login Flow:
```
1. User enters email/password
2. POST /api/auth/login
3. Laravel returns: { user: {...}, access_token: "..." }
4. Token stored in localStorage as 'auth_token'
5. User data cached in localStorage as 'current_user'
6. Redirect to /tabs
```

### Load Events Flow:
```
1. Check if authenticated (token exists)
2. If yes → GET /api/events with Authorization header
3. Laravel validates token
4. Returns events array from database
5. Display events in UI
```

### Logout Flow:
```
1. POST /api/auth/logout (optional, token revocation)
2. Clear 'auth_token' from localStorage
3. Clear 'current_user' from localStorage
4. Clear events from UI
5. Show login prompt
```

---

## 🎨 UI States

### Tab 1 - Not Logged In:
```
┌─────────────────────────┐
│  Events           [👤]  │
├─────────────────────────┤
│                         │
│      🔐 Login Icon      │
│                         │
│    Please Login         │
│                         │
│  Login to view events   │
│                         │
│  ┌─────────────────┐   │
│  │    Login        │   │
│  └─────────────────┘   │
│                         │
│  Test Account:          │
│  test@example.com       │
│  password               │
└─────────────────────────┘
```

### Tab 1 - Logged In:
```
┌─────────────────────────┐
│  Events           [🚪]  │
├─────────────────────────┤
│  ┌───────────────────┐ │
│  │ iOS Workshop      │ │
│  │ Learn iOS dev     │ │
│  │ 📍 Room 101       │ │
│  │ 📅 Mar 15, 2026   │ │
│  │  [Register]       │ │
│  └───────────────────┘ │
│  ┌───────────────────┐ │
│  │ UI/UX Conference  │ │
│  │ Design matters    │ │
│  │ 📍 Hall A         │ │
│  │ 📅 Mar 22, 2026   │ │
│  │  [Register]       │ │
│  └───────────────────┘ │
└─────────────────────────┘
```

---

## 🛠️ Troubleshooting

### Events not loading?
1. Check Laravel is running: `http://localhost:8888/api/events`
2. Check browser console for errors
3. Verify CORS is configured in Laravel

### Login fails?
1. Verify database has test user:
   ```bash
   cd backend
   php artisan tinker
   >>> \App\Models\User::all()
   ```
2. Check API logs: `storage/logs/laravel.log`
3. Verify `.env` has `APP_KEY` set

### Token issues?
1. Clear localStorage in browser DevTools
2. Try logging in again
3. Check interceptor is adding Authorization header

---

## 📝 Next Steps

### To Add Registration:
1. Create register page similar to login
2. Call `AuthService.register()`
3. Auto-login after registration

### To Add Event Registration:
1. Add register button in event card
2. Call `EventService.registerForEvent(eventId)`
3. Show success message

### To Add Profile Page:
1. Create profile page
2. Display `UserService.currentUser`
3. Add edit profile form

---

## 🔒 Security Notes

- Tokens are stored in localStorage (consider HttpOnly cookies for production)
- All protected routes require valid Bearer token
- Laravel Sanctum handles token expiration
- CORS is configured for localhost only (update for production)

---

## 📖 Additional Resources

- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [Ionic Angular Docs](https://ionicframework.com/docs/angular)
- [RxJS Docs](https://rxjs.dev/)

---

**Happy Coding! 🎉**
