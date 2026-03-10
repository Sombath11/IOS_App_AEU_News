@echo off
echo ========================================
echo Starting Laravel Backend for Notifications
echo ========================================
echo.

cd "C:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

echo Clearing caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
echo.

echo Starting PHP server on http://localhost:8888
echo Press Ctrl+C to stop
echo.

php -S localhost:8888 -t public
