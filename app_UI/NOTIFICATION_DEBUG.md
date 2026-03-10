# Notification Debugging Guide

## Steps to Debug

### 1. Check if you're logged in
Open browser console (F12) and run:
```javascript
localStorage.getItem('auth_token')
```
This should return a token string. If it returns `null`, you're not logged in.

### 2. Check Laravel Backend
Make sure Laravel is running:
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
```

### 3. Check if notifications exist in database
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan tinker
```

Then run:
```php
\App\Models\Notification::count()
\App\Models\Notification::all()
```

If count is 0, run the seeder:
```bash
php artisan db:seed --class=NotificationSeeder
```

### 4. Test API directly
After logging in, get your token from console:
```javascript
localStorage.getItem('auth_token')
```

Then test the API in browser console or Postman:
```
GET http://localhost:8888/api/notifications
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Check browser console logs
After clicking Alerts tab, check for these logs:
- `AlertsPage - isLoggedIn: true/false`
- `AlertsPage - Token exists: true/false`
- `Loading notifications from API...`
- `Token before request: ...`
- `API Interceptor - URL: ...`
- `API Interceptor - Token exists: true/false`

## Common Issues

### Issue 1: Token is null
**Solution:** Login again. Make sure you see "Token stored" in console.

### Issue 2: 401 Unauthorized
**Solution:** Token might be expired. Logout and login again.

### Issue 3: No notifications in database
**Solution:** Run the seeder:
```bash
php artisan db:seed --class=NotificationSeeder
```

### Issue 4: CORS error
**Solution:** Make sure Laravel CORS is configured for localhost:8100

### Issue 5: Wrong API URL
**Solution:** Check `environment.ts` - apiUrl should be `http://localhost:8888/api`
