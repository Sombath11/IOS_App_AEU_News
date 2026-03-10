@echo off
echo === Laravel Backend Fix Script ===
echo.

cd /d "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

echo Step 1: Clearing Laravel cache...
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan clear-compiled

echo.
echo Step 2: Verifying configuration...
php artisan --version

echo.
echo === Fix Complete! ===
echo.
echo Next steps:
echo 1. Start Laravel: php -S localhost:8888 -t public
echo 2. Test API: curl http://localhost:8888/api/news
echo.
pause
