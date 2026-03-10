@echo off
echo ========================================
echo   Laravel Backend Fix Script
echo ========================================
echo.

cd /d "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

echo Step 1: Removing Octane from composer.json...
powershell -Command "(Get-Content composer.json) -replace '.*\"laravel/octane\":.*`n', '' | Set-Content composer.json"

echo Step 2: Removing Octane from config/app.php...
powershell -Command "(Get-Content config/app.php) -replace '.*Laravel\\\\Octane\\\\OctaneServiceProvider::class,?.*`n', '' | Set-Content config/app.php"

echo Step 3: Clearing all cache files...
del /Q bootstrap\cache\*.php
del /Q storage\framework\cache\*
del /Q storage\framework\views\*
del /Q storage\framework\sessions\*

echo Step 4: Running artisan optimize...
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Step 5: Testing Laravel...
php artisan --version

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Laravel is working!
    echo ========================================
    echo.
    echo To start the server, run:
    echo   php -S localhost:8888 -t public
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR! Please check the messages above
    echo ========================================
)

echo.
pause
