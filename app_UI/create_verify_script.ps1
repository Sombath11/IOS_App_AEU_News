$content = @'
<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Database Seeding Verification ===" . PHP_EOL . PHP_EOL;

echo "Users:" . PHP_EOL;
foreach (App\Models\User::all() as $user) {
    echo "  - {$user->name} ({$user->email})" . PHP_EOL;
}

echo PHP_EOL . "Events:" . PHP_EOL;
foreach (App\Models\Event::all() as $event) {
    echo "  - {$event->title} ({$event->start_date->format('Y-m-d')})" . PHP_EOL;
}

echo PHP_EOL . "Summary:" . PHP_EOL;
echo "  Total Users: " . App\Models\User::count() . PHP_EOL;
echo "  Total Events: " . App\Models\Event::count() . PHP_EOL;
'@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\verify_seed.php" -Value $content
Write-Host "Verification script created!"
