# Update DatabaseSeeder to include student_id for test user
$filePath = "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\database\seeders\DatabaseSeeder.php"
$content = Get-Content $filePath -Raw

# Replace the test user creation to include student_id
$oldText = "User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );"

$newText = "User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'student_id' => 'AEU000001',
                'password' => Hash::make('password'),
            ]
        );"

$content = $content -replace [regex]::Escape($oldText), $newText

# Write back without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)

Write-Host "DatabaseSeeder.php updated successfully with student_id!"
