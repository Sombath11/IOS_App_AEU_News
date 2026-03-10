# 🎓 AEU News App - Complete Authentication Guide

## ✅ What's Implemented

### 1. **User Registration** (`/auth/registration`)
- Create new account with name, email, password
- Password confirmation (must match)
- Minimum 8 characters password
- Email must be unique in database
- Auto-login after successful registration
- Laravel API validation

### 2. **User Login** (`/auth/login`)
- Email + Password authentication
- Laravel Sanctum token-based auth
- Shows error for invalid credentials
- "Register here" link for new users
- "Forgot Password?" link (placeholder)
- Loading state during login

### 3. **Events Page** (Tab 1)
- Shows login prompt when not authenticated
- Displays real events from Laravel database when logged in
- Event details: title, description, location, date
- Logout button in header
- Auto-refresh on login/logout

### 4. **Laravel Backend** (`localhost:8888`)
- SQLite database with sample data
- User registration API
- User login API with JWT tokens
- Events CRUD API
- Event registration API
- CORS configured for Ionic app

---

## 🚀 How to Run

### Step 1: Start Laravel Backend
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
```

**Verify it's running:**
- Open browser: `http://localhost:8888/api/events`
- Should show JSON array of events

### Step 2: Start Ionic App
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
ionic serve
```

**App opens at:** `http://localhost:8100`

---

## 🧪 Testing Guide

### Test 1: Login with Existing Account
```
1. Open app → Go to Tab 1 (Events)
2. See "Please Login" screen
3. Click "Login" button
4. Enter:
   - Email: test@example.com
   - Password: password
5. Click "Login to Portal"
6. ✅ Should see list of events from database
```

### Test 2: Login with Wrong Credentials
```
1. Click "Login"
2. Enter:
   - Email: wrong@email.com
   - Password: wrongpass
3. Click "Login to Portal"
4. ✅ Should show error: "Invalid credentials. Please try again."
```

### Test 3: Register New Account
```
1. Click "Login"
2. Click "Register here" link
3. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Create Account"
5. ✅ Should show success alert
6. ✅ Auto-logged in → See events!
```

### Test 4: Register with Validation Errors
```
1. Click "Register here"
2. Try with:
   - Name: Test
   - Email: invalid-email
   - Password: 123
   - Confirm: 456
3. Click "Create Account"
4. ✅ Should show validation errors:
   - "The email field must be a valid email"
   - "The password field must be at least 8 characters"
   - Password confirmation mismatch
```

### Test 5: Logout
```
1. After logging in
2. Click logout button (🚪 icon) in header
3. Confirm logout
4. ✅ Events hidden, login prompt shown
```

---

## 📊 Database Content

### Pre-loaded Test User
```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "created_at": "2026-03-04T00:00:00.000000Z"
}
```

### Pre-loaded Events (5 total)
1. **iOS App Development Workshop** - Mar 15, 2026
2. **Mobile UI/UX Design Conference** - Mar 22, 2026
3. **Swift Programming Bootcamp** - Apr 5-6, 2026
4. **App Store Optimization Seminar** - Apr 12, 2026
5. **Student Hackathon 2026** - Apr 25-26, 2026

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/user` | Yes | Get current user |

### Events
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/events` | No | Get all events |
| GET | `/api/events/{id}` | Yes | Get single event |
| POST | `/api/events` | Yes | Create event |
| PUT | `/api/events/{id}` | Yes | Update event |
| DELETE | `/api/events/{id}` | Yes | Delete event |
| POST | `/api/events/{id}/register` | Yes | Register for event |
| GET | `/api/events/my-registrations` | Yes | Get user's registrations |

---

## 📁 Project Structure

```
c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\
│
├── Assignment/                          ← Ionic App
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/          ← Login page (with API)
│   │   │   │   │   └── registration/   ← Registration page
│   │   │   │   └── login/              ← Simple login page
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts     ← Auth API calls
│   │   │   │   ├── user.service.ts     ← User state
│   │   │   │   └── event.service.ts    ← Events API
│   │   │   └── tab1/
│   │   │       └── tab1.page.ts        ← Events display
│   │   └── environments/
│   │       └── environment.ts          ← API URL config
│   └── start_laravel.bat               ← Quick start script
│
└── backend/                             ← Laravel API
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── AuthController.php      ← Login/Register
    │   │   └── EventController.php     ← Events CRUD
    │   └── Models/
    │       ├── User.php                ← User model
    │       └── Event.php               ← Event model
    ├── routes/
    │   └── api.php                     ← API routes
    └── database/
        └── database.sqlite             ← SQLite database
```

---

## 🛠️ Troubleshooting

### Login doesn't validate credentials?
**Check:**
1. Laravel is running: `http://localhost:8888/api/user` (should return 401)
2. Browser console for API errors
3. Network tab shows POST to `/api/auth/login`

### Registration fails?
**Check:**
1. Email is unique (not already in database)
2. Password is at least 8 characters
3. Password and confirm password match
4. Laravel logs: `backend/storage/logs/laravel.log`

### Events not showing after login?
**Check:**
1. Token is stored: Open DevTools → Application → Local Storage → `auth_token`
2. Laravel CORS allows `localhost:8100`
3. API returns events: `http://localhost:8888/api/events`

### Database errors?
**Reset database:**
```bash
cd backend
del database\database.sqlite
php artisan migrate --seed
```

---

## 📝 Next Features to Add

### 1. Event Registration
```typescript
// In tab1.page.ts
registerForEvent(eventId: number) {
  this.eventService.registerForEvent(eventId).subscribe({
    next: () => {
      this.showAlert('Success', 'Registered for event!');
    }
  });
}
```

### 2. User Profile Page
```typescript
// Display current user info
this.userService.currentUser$.subscribe(user => {
  this.userName = user?.name;
  this.userEmail = user?.email;
});
```

### 3. My Registrations Tab
```typescript
// Fetch user's event registrations
this.eventService.getMyRegistrations().subscribe(registrations => {
  this.myEvents = registrations;
});
```

### 4. Password Reset
```typescript
// Forgot password flow
this.authService.forgotPassword({ email }).subscribe({
  next: () => {
    this.showAlert('Success', 'Reset link sent to email');
  }
});
```

---

## 🔒 Security Notes

### Current Implementation:
- ✅ Passwords hashed with bcrypt in Laravel
- ✅ JWT tokens stored in localStorage
- ✅ Token sent with every API request via Authorization header
- ✅ CORS configured for localhost only
- ✅ Input validation on both frontend and backend

### For Production:
- ⚠️ Use HttpOnly cookies instead of localStorage
- ⚠️ Enable HTTPS
- ⚠️ Add rate limiting on login endpoint
- ⚠️ Add email verification
- ⚠️ Add 2FA (Two-Factor Authentication)
- ⚠️ Update CORS to production domain

---

## 📖 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Ionic Angular Documentation](https://ionicframework.com/docs/angular)
- [RxJS Documentation](https://rxjs.dev/)

---

## 🎉 Success!

Your AEU News app now has:
- ✅ Full user authentication
- ✅ Registration with validation
- ✅ Login with Laravel database
- ✅ Protected routes
- ✅ Real-time data from backend
- ✅ Token-based security

**Test it now and enjoy your working app!** 🚀
