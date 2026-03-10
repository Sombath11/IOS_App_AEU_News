# Fix Laravel CORS and Sanctum Configuration
$backendPath = "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"

# Update .env file
$envPath = "$backendPath\.env"
$content = Get-Content $envPath -Raw

# Update SANCTUM_STATEFUL_DOMAINS
if ($content -match "SANCTUM_STATEFUL_DOMAINS=") {
    $content = $content -replace "SANCTUM_STATEFUL_DOMAINS=.*", "SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8100,localhost:8888"
} else {
    $content += "`nSANCTUM_STATEFUL_DOMAINS=localhost,localhost:8100,localhost:8888"
}

# Update SESSION_DOMAIN
if ($content -match "SESSION_DOMAIN=") {
    $content = $content -replace "SESSION_DOMAIN=.*", "SESSION_DOMAIN=localhost"
} else {
    $content += "`nSESSION_DOMAIN=localhost"
}

# Update SESSION_SECURE_COOKIE
$content = $content -replace "SESSION_SECURE_COOKIE=.*", "SESSION_SECURE_COOKIE=false"
if ($content -notmatch "SESSION_SECURE_COOKIE=") {
    $content += "`nSESSION_SECURE_COOKIE=false"
}

Set-Content $envPath -Value $content -NoNewline
Write-Host "✅ Updated .env file"

# Update cors.php if it exists
$corsPath = "$backendPath\config\cors.php"
if (Test-Path $corsPath) {
    $corsContent = Get-Content $corsPath -Raw
    
    # Update allowed_origins
    $corsContent = $corsContent -replace "'allowed_origins' => \[.*?\]", "'allowed_origins' => ['http://localhost:8100', 'http://localhost:8888']"
    
    # Update supports_credentials
    $corsContent = $corsContent -replace "'supports_credentials' => false", "'supports_credentials' => true"
    $corsContent = $corsContent -replace "'supports_credentials' => false,", "'supports_credentials' => true,"
    
    # Update allowed_headers to include Authorization
    if ($corsContent -match "'allowed_headers' => \[") {
        $corsContent = $corsContent -replace "'allowed_headers' => \[[^\]]*\]", "'allowed_headers' => ['*']"
    }
    
    Set-Content $corsPath -Value $corsContent -NoNewline
    Write-Host "✅ Updated cors.php"
} else {
    Write-Host "⚠️ cors.php not found"
}

Write-Host "`n✅ CORS configuration updated!"
Write-Host "Remember to run: php artisan config:clear"
