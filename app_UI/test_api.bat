@echo off
echo ============================================
echo Testing Laravel Backend APIs
echo ============================================
echo.

echo 1. Testing News API (Public)...
curl -s http://localhost:8888/api/news/latest | findstr /C:"id" | findstr /C:"title"
echo.
echo.

echo 2. Testing Notifications API (Requires Auth)...
echo You need to provide a valid token to test this.
echo.
echo To get your token:
echo 1. Login to the app at http://localhost:8100
echo 2. Open browser Console (F12)
echo 3. Run: localStorage.getItem('auth_token')
echo 4. Copy the token and paste it below
echo.
set /p TOKEN="Enter your auth token: "
echo.
echo Testing with token: %TOKEN:~0,20%...
curl -i -H "Accept: application/json" -H "Authorization: Bearer %TOKEN%" http://localhost:8888/api/notifications
echo.
echo.

echo 3. Checking Database Notifications Count...
cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan tinker --execute="echo 'Notification count: ' . \App\Models\Notification::count();"
echo.

pause
