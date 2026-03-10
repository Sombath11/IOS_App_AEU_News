@echo off
echo ========================================
echo   Starting Laravel Backend Server
echo ========================================
echo.
echo Server will start at: http://localhost:8888
echo API Endpoint: http://localhost:8888/api
echo.
echo Test User: test@example.com / password
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
pause
