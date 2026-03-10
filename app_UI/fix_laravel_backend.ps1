# Laravel Backend Fix Script
# This script fixes the Laravel configuration issues

$backendPath = "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

Write-Host "=== Laravel Backend Fix Script ===" -ForegroundColor Cyan
Write-Host "Backend Path: $backendPath" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if config/app.php exists
Write-Host "Step 1: Checking config/app.php..." -ForegroundColor Cyan
$appConfigPath = Join-Path $backendPath "config\app.php"

if (Test-Path $appConfigPath) {
    Write-Host "  ✓ config/app.php found" -ForegroundColor Green
    
    # Read the file
    $content = Get-Content $appConfigPath -Raw
    
    # Check for and remove Octane provider if it exists
    if ($content -match "Laravel\\Octane\\OctaneServiceProvider") {
        Write-Host "  ⚠ Found Octane provider - removing it..." -ForegroundColor Yellow
        $content = $content -replace ",?\s*Laravel\\Octane\\OctaneServiceProvider::class", ""
        $content = $content -replace "Laravel\\Octane\\OctaneServiceProvider::class,?\s*", ""
        
        # Save the file
        Set-Content $appConfigPath $content -NoNewline
        Write-Host "  ✓ Octane provider removed" -ForegroundColor Green
    } else {
        Write-Host "  ✓ No Octane provider found" -ForegroundColor Green
    }
    
    # Check for 'providers' => [] array and ensure it's properly formatted
    if ($content -match "'providers'\s*=>\s*\[") {
        Write-Host "  ✓ Providers array found" -ForegroundColor Green
    }
} else {
    Write-Host "  ✗ config/app.php not found!" -ForegroundColor Red
    Write-Host "  Please check the backend path." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 2: Clearing Laravel cache..." -ForegroundColor Cyan

# Step 2: Clear all Laravel caches
Set-Location $backendPath

# Clear config cache
Write-Host "  - Clearing config cache..." -ForegroundColor Gray
php artisan config:clear

# Clear application cache
Write-Host "  - Clearing application cache..." -ForegroundColor Gray
php artisan cache:clear

# Clear view cache
Write-Host "  - Clearing view cache..." -ForegroundColor Gray
php artisan view:clear

# Clear route cache
Write-Host "  - Clearing route cache..." -ForegroundColor Gray
php artisan route:clear

# Clear compiled classes
Write-Host "  - Clearing compiled classes..." -ForegroundColor Gray
php artisan clear-compiled

Write-Host ""
Write-Host "Step 3: Verifying configuration..." -ForegroundColor Cyan

# Test if artisan commands work
Write-Host "  - Testing artisan..." -ForegroundColor Gray
$testOutput = php artisan --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ $testOutput" -ForegroundColor Green
} else {
    Write-Host "  ✗ Artisan test failed" -ForegroundColor Red
    Write-Host "  $testOutput" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Fix Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start Laravel server: cd '$backendPath' && php -S localhost:8888 -t public" -ForegroundColor White
Write-Host "2. Test the API: curl http://localhost:8888/api/news" -ForegroundColor White
Write-Host ""
