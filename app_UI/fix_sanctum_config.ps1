# Fix Laravel Sanctum and CORS for Ionic App
# Run this script from the Assignment folder

$backendPath = "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
$envPath = "$backendPath\.env"

# Read current .env content
$content = Get-Content $envPath -Raw

# Add SANCTUM_STATEFUL_DOMAINS if not exists
if ($content -notmatch "SANCTUM_STATEFUL_DOMAINS") {
    $content += "`nSANCTUM_STATEFUL_DOMAINS=localhost,localhost:8100,localhost:8888"
    Write-Host "Added SANCTUM_STATEFUL_DOMAINS to .env"
} else {
    # Update existing SANCTUM_STATEFUL_DOMAINS
    $content = $content -replace "SANCTUM_STATEFUL_DOMAINS=.*", "SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8100,localhost:8888"
    Write-Host "Updated SANCTUM_STATEFUL_DOMAINS in .env"
}

# Save updated .env
Set-Content $envPath -Value $content -NoNewline

Write-Host "Backend .env updated successfully!"
Write-Host "Remember to run: php artisan config:clear"
