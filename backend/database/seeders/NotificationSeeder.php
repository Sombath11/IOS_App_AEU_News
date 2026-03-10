<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (or create notifications for all users)
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Please seed users first.');
            return;
        }

        $notifications = [];
        $now = Carbon::now();

        foreach ($users as $user) {
            // Emergency notification
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Emergency Safety Alert',
                'message' => 'Security alert issued for North Campus. High activity near Science Block. Please stay indoors and await further instructions.',
                'type' => 'emergency',
                'icon' => 'warning-outline',
                'target_type' => null,
                'target_id' => null,
                'target_url' => '/tabs/alerts',
                'is_emergency' => true,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now->copy()->subMinutes(30),
                'updated_at' => $now->copy()->subMinutes(30),
            ];

            // Grade notification
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Grade Posted: CS101',
                'message' => 'Your final grade for Computer Science 101 has been published to the student portal.',
                'type' => 'grade',
                'icon' => 'document-text-outline',
                'target_type' => 'grade',
                'target_id' => null,
                'target_url' => '/tabs/grades',
                'is_emergency' => false,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now->copy()->subHours(2),
                'updated_at' => $now->copy()->subHours(2),
            ];

            // Event notification
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Event: Career Fair 2024',
                'message' => "Don't forget the annual Career Fair starts at 1:00 PM today in the Great Hall.",
                'type' => 'event',
                'icon' => 'calendar-outline',
                'target_type' => 'event',
                'target_id' => 1,
                'target_url' => '/tabs/event/1',
                'is_emergency' => false,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now->copy()->subHours(4),
                'updated_at' => $now->copy()->subHours(4),
            ];

            // News notification
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'New Campus Policy Update',
                'message' => 'Important changes to campus parking regulations effective next Monday. Read more about the updates.',
                'type' => 'news',
                'icon' => 'newspaper-outline',
                'target_type' => 'news',
                'target_id' => 1,
                'target_url' => '/news/1',
                'is_emergency' => false,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(1),
                'updated_at' => $now->copy()->subDays(1),
            ];

            // Library notification
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Library Book Overdue',
                'message' => '"Intro to Algorithms" is 2 days overdue. Please return to the central library.',
                'type' => 'library',
                'icon' => 'book-outline',
                'target_type' => 'library',
                'target_id' => null,
                'target_url' => '/tabs/library',
                'is_emergency' => false,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(1),
                'updated_at' => $now->copy()->subDays(1),
            ];

            // Payment notification (read)
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Fee Payment Successful',
                'message' => 'Receipt #88291 for Semester 3 fees has been sent to your student email.',
                'type' => 'payment',
                'icon' => 'wallet-outline',
                'target_type' => 'payment',
                'target_id' => null,
                'target_url' => '/tabs/finance',
                'is_emergency' => false,
                'is_read' => true,
                'read_at' => $now->copy()->subDays(5),
                'created_at' => $now->copy()->subDays(5),
                'updated_at' => $now->copy()->subDays(5),
            ];

            // Profile notification (read)
            $notifications[] = [
                'user_id' => $user->id,
                'title' => 'Profile Updated',
                'message' => 'Your contact information has been successfully updated.',
                'type' => 'profile',
                'icon' => 'person-outline',
                'target_type' => 'profile',
                'target_id' => null,
                'target_url' => '/tabs/profile',
                'is_emergency' => false,
                'is_read' => true,
                'read_at' => $now->copy()->subDays(7),
                'created_at' => $now->copy()->subDays(7),
                'updated_at' => $now->copy()->subDays(7),
            ];
        }

        // Insert all notifications
        Notification::insert($notifications);
        
        $this->command->info('Notification seeding completed! ' . count($notifications) . ' notifications created.');
    }
}
