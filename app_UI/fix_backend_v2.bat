@echo off
echo ========================================
echo   Laravel Backend - Quick Fix
echo ========================================
echo.
echo This will install the missing Octane package...
echo.

cd /d "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

echo Installing Laravel Octane...
composer require laravel/octane --no-interaction

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Octane installation failed. Removing Octane reference instead...
    echo.
    
    REM Remove Octane from composer.json
    powershell -Command "$content = Get-Content composer.json -Raw; $content = $content -replace ',\s*\"laravel/octane\":\s*\"\*\"', ''; Set-Content composer.json $content -NoNewline"
    
    echo.
    echo Clearing cache...
    del /Q bootstrap\cache\*.php 2>nul
    php artisan config:clear
    php artisan cache:clear
)

echo.
echo Clearing all cache...
del /Q bootstrap\cache\*.php 2>nul
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Testing Laravel...
php artisan --version

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Start the server with:
    echo   cd backend
    echo   php -S localhost:8888 -t public
    echo.
) else (
    echo.
    echo ========================================
    echo   Fix completed with issues
    echo ========================================
)

pause
