# Complete Notification System Test Guide

## ✅ Scan Results: ALL CONFIGURED CORRECTLY

Both frontend and backend are properly configured! Now let's test the complete flow.

---

## 🚀 Step-by-Step Test Process

### **Step 1: Start Laravel Backend**

Open Terminal 1:
```bash
cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
```

**Expected output:**
```
PHP 8.4.1 Development Server (http://localhost:8888) started
```

---

### **Step 2: Start Ionic Frontend**

Open Terminal 2:
```bash
cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
ionic serve -- --port 8100
```

**Expected output:**
```
> ionic-app-scripts serve
...
http://localhost:8100
```

---

### **Step 3: Clear Browser & Login**

1. **Open browser** to `http://localhost:8100`
2. **Clear all data** (Ctrl + Shift + Delete)
3. **Login** with your credentials
4. **After login**, open Console (F12) and run:
   ```javascript
   localStorage.getItem('auth_token')
   ```
5. **Expected:** Should return a token like `"1|abc123xyz..."`

---

### **Step 4: Test Notifications API**

#### Option A: Test in Browser Console
```javascript
// Get your token
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Test API
fetch('http://localhost:8888/api/notifications', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
})
.then(r => r.json())
.then(d => console.log('Notifications:', d))
.catch(e => console.error('Error:', e));
```

#### Option B: Test with cURL
```bash
# Replace YOUR_TOKEN with actual token from localStorage
curl -i -H "Accept: application/json" ^
     -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
     http://localhost:8888/api/notifications
```

**Expected Response (200 OK):**
```json
{
  "notifications": {
    "data": [
      {
        "id": 1,
        "title": "Emergency Safety Alert",
        "message": "Security alert issued...",
        "type": "emergency",
        "is_read": false,
        "created_at": "2026-03-06T10:00:00.000000Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 7
  },
  "unread_count": 5
}
```

---

### **Step 5: Click Alerts Tab**

1. Click the **Alerts** tab in the app
2. Open Console (F12)
3. **Expected logs:**
   ```
   === ALERTS PAGE DEBUG ===
   Token from localStorage: 1|abc123...
   isLoggedIn: true
   
   📤 Request: http://localhost:8888/api/notifications
   ✅ Added Authorization header: 1|abc...
   📋 Headers: {Authorization: "Bearer 1|abc..."}
   
   ✅ Response success: 200
   Notifications loaded successfully: {...}
   Mapped alerts: 7
   ```

4. **UI should show:**
   - TODAY section with recent notifications
   - EARLIER section with older notifications
   - Blue dots on unread notifications
   - Emergency notification in red

---

## 🔍 Troubleshooting

### Issue 1: Token is NULL
```javascript
// In console, check:
localStorage.getItem('auth_token')
// Returns: null
```

**Solution:**
1. Logout completely
2. Clear localStorage: `localStorage.clear()`
3. Login again
4. Check token again

---

### Issue 2: Still Getting 401
```bash
# Test with cURL to verify backend
curl -i -H "Accept: application/json" ^
     -H "Authorization: Bearer YOUR_TOKEN" ^
     http://localhost:8888/api/notifications
```

**If cURL works but app doesn't:**
- Browser cache issue - hard refresh (Ctrl + Shift + R)
- Interceptor not running - check console for logs

**If cURL also fails:**
- Token is expired - login again
- Backend issue - check Laravel logs

---

### Issue 3: No Console Logs Showing
**Solution:**
1. Stop ionic serve (Ctrl + C)
2. Clear build cache:
   ```bash
   cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
   rm -rf www
   ionic serve -- --port 8100
   ```
3. Hard refresh browser (Ctrl + Shift + R)

---

## 📊 Expected Database State

Run this to verify notifications exist:
```bash
cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan tinker
```

Then:
```php
// Check notification count
\App\Models\Notification::count()
// Expected: 14 (2 users × 7 notifications)

// Check first notification
\App\Models\Notification::first()
// Expected: Emergency Safety Alert notification
```

---

## ✅ Success Checklist

- [ ] Laravel running on `http://localhost:8888`
- [ ] Ionic running on `http://localhost:8100`
- [ ] Login successful
- [ ] Token exists in localStorage
- [ ] Console shows "✅ Added Authorization header"
- [ ] API returns 200 OK (not 401)
- [ ] Alerts page shows notifications
- [ ] Blue dots appear on unread items
- [ ] Click notification navigates to target page

---

## 🎯 Quick Diagnostic Commands

```bash
# 1. Check Laravel is running
curl http://localhost:8888/api/news/latest
# Expected: JSON response with news

# 2. Check notifications table exists
cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan tinker --execute="echo \App\Models\Notification::count();"
# Expected: 14

# 3. Check CORS config
php artisan config:show cors
# Expected: allowed_origins includes http://localhost:8100

# 4. Check Sanctum config
php artisan config:show sanctum
# Expected: stateful includes localhost:8100
```

---

**If everything is configured correctly but still not working, share:**
1. Console logs after clicking Alerts tab
2. Result of `localStorage.getItem('auth_token')`
3. cURL test result
