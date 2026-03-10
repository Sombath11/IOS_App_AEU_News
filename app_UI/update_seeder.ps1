$content = @'
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user (or update if exists)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Create 5 sample events with realistic data (avoid duplicates)
        $events = [
            [
                'title' => 'iOS App Development Workshop',
                'description' => 'Learn the fundamentals of iOS app development using Swift and SwiftUI. This hands-on workshop covers UI design, data management, and app deployment to the App Store.',
                'location' => 'AEU Main Campus, Building A, Room 301',
                'start_date' => '2026-03-15 09:00:00',
                'end_date' => '2026-03-15 17:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
            ],
            [
                'title' => 'Mobile UI/UX Design Conference',
                'description' => 'Join industry experts to explore the latest trends in mobile user interface and user experience design. Topics include accessibility, dark mode implementation, and responsive layouts.',
                'location' => 'AEU Conference Center, Hall B',
                'start_date' => '2026-03-22 10:00:00',
                'end_date' => '2026-03-22 16:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
            ],
            [
                'title' => 'Swift Programming Bootcamp',
                'description' => 'An intensive 2-day bootcamp covering Swift programming from basics to advanced concepts. Perfect for beginners and developers transitioning from other languages.',
                'location' => 'AEU Computer Lab, Building C, Floor 2',
                'start_date' => '2026-04-05 08:30:00',
                'end_date' => '2026-04-06 18:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
            ],
            [
                'title' => 'App Store Optimization Seminar',
                'description' => 'Discover proven strategies to improve your app visibility and rankings on the App Store. Learn about keywords, screenshots, reviews, and marketing techniques.',
                'location' => 'AEU Business School, Lecture Hall 1',
                'start_date' => '2026-04-12 14:00:00',
                'end_date' => '2026-04-12 18:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1556656793-02715d8dd660?w=800',
            ],
            [
                'title' => 'Student Hackathon 2026',
                'description' => 'A 24-hour coding competition where students form teams to build innovative mobile applications. Prizes for best design, best functionality, and overall winner.',
                'location' => 'AEU Innovation Hub, Ground Floor',
                'start_date' => '2026-04-25 09:00:00',
                'end_date' => '2026-04-26 09:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
            ],
        ];

        foreach ($events as $eventData) {
            Event::firstOrCreate(
                ['title' => $eventData['title']],
                $eventData
            );
        }
    }
}
'@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\database\seeders\DatabaseSeeder.php" -Value $content
Write-Host "DatabaseSeeder updated successfully!"
