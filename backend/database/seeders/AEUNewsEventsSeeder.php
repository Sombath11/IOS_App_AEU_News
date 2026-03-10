<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\Event;
use Illuminate\Database\Seeder;

class AEUNewsEventsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Asia Euro University News Articles
        $newsArticles = [
            [
                'title' => 'AEU Launches New iOS App Development Program for 2026',
                'content' => 'Asia Euro University is proud to announce the launch of our comprehensive iOS App Development program starting in Semester 2, 2026. This cutting-edge curriculum covers Swift programming, SwiftUI, UIKit, Core Data, and App Store deployment. Students will work on real-world projects and have opportunities for internships with leading tech companies. The program is designed to meet the growing demand for skilled iOS developers in Cambodia and the ASEAN region.',
                'category' => 'Academic',
                'author' => 'AEU Communications Office',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                'published_date' => '2026-03-01',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'AEU Hosts International Conference on Digital Innovation',
                'content' => 'Asia Euro University will host the International Conference on Digital Innovation from March 20-22, 2026. The conference brings together academics, industry leaders, and researchers from across Asia and Europe to discuss emerging technologies, AI integration, mobile computing, and digital transformation. Keynote speakers include tech executives from leading companies and renowned professors from partner universities. Registration is now open for students and faculty members.',
                'category' => 'Event',
                'author' => 'Dr. Sok Vannak, Conference Chair',
                'image_url' => 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800',
                'published_date' => '2026-03-02',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'AEU Students Win Gold at National Hackathon 2026',
                'content' => 'Congratulations to Team AEU CodeMasters for winning the Gold Award at the National University Hackathon 2026! Their innovative mobile application "StudyBuddy" connects students for peer-to-peer learning and study group formation. The team consisted of fourth-year Computer Science students who developed the app over 48 hours during the competition. They will represent Cambodia at the ASEAN Hackathon in Singapore next month.',
                'category' => 'Achievement',
                'author' => 'AEU Student Affairs',
                'image_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
                'published_date' => '2026-03-03',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'New Library Digital Resources Now Available',
                'content' => 'AEU Library is excited to announce access to new digital resources including IEEE Xplore, ACM Digital Library, and O\'Reilly Learning Platform. Students and faculty can now access thousands of academic papers, e-books, video tutorials, and interactive coding exercises. These resources are available 24/7 through the library portal with your AEU student credentials. Training sessions will be held weekly to help users maximize these valuable resources.',
                'category' => 'Announcement',
                'author' => 'AEU Library Services',
                'image_url' => 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
                'published_date' => '2026-03-04',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'AEU Partners with Leading Tech Companies for Internship Program',
                'content' => 'Asia Euro University has signed MOUs with five leading technology companies to provide internship opportunities for our students. Partners include regional offices of international tech giants and successful Cambodian startups. Students in Computer Science, Software Engineering, and related fields will have priority access to these positions. The internships offer hands-on experience, mentorship from industry professionals, and potential job offers upon graduation.',
                'category' => 'Partnership',
                'author' => 'AEU Career Services',
                'image_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
                'published_date' => '2026-03-04',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Campus Infrastructure Upgrade Completed',
                'content' => 'AEU has completed major infrastructure upgrades across campus. Building A now features state-of-the-art computer labs with the latest Mac computers for iOS development students. The campus-wide WiFi has been upgraded to support high-bandwidth applications. New collaborative study spaces with video conferencing facilities are now open on the third floor. These improvements reflect our commitment to providing world-class learning environments.',
                'category' => 'Campus Life',
                'author' => 'AEU Facilities Management',
                'image_url' => 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
                'published_date' => '2026-03-05',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'AEU Research Grant Applications Open for 2026',
                'content' => 'The AEU Research Office is now accepting grant applications for the 2026 academic year. Priority areas include mobile computing, artificial intelligence, educational technology, and sustainable development. Grants range from $5,000 to $50,000 depending on project scope. Faculty members are encouraged to collaborate with industry partners and international institutions. The deadline for submissions is April 30, 2026. Information sessions will be held on March 15 and March 22.',
                'category' => 'Research',
                'author' => 'AEU Research Office',
                'image_url' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                'published_date' => '2026-03-05',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Welcome New Students - Semester 2, 2026 Orientation',
                'content' => 'Asia Euro University welcomes all new students joining us for Semester 2, 2026! Orientation week runs from March 10-14. Activities include campus tours, meet-and-greet with faculty, academic advising sessions, and student club fairs. Don\'t miss the welcome reception on March 12 at 6 PM in the Main Hall. Your student ID cards and course materials will be distributed during orientation. We look forward to an exciting semester together!',
                'category' => 'Announcement',
                'author' => 'AEU Admissions Office',
                'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'published_date' => '2026-03-05',
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($newsArticles as $article) {
            News::firstOrCreate(
                ['title' => $article['title']],
                $article
            );
        }

        // Additional AEU Events (expanding on existing ones)
        $events = [
            [
                'title' => 'AEU Open House 2026',
                'description' => 'Join us for AEU\'s annual Open House! Explore our campus, meet faculty and current students, attend sample lectures, and learn about our programs. Special focus on our new iOS App Development and Computer Science programs. Campus tours every hour, free refreshments, and on-the-spot application processing with fee waivers.',
                'location' => 'AEU Main Campus, All Buildings',
                'start_date' => '2026-03-28 08:00:00',
                'end_date' => '2026-03-28 17:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
            ],
            [
                'title' => 'Guest Lecture: Mobile App Monetization Strategies',
                'description' => 'Industry expert Mr. Chen Wei, Head of App Store Marketing at SeaTech Solutions, will share insights on mobile app monetization. Topics include in-app purchases, subscription models, advertising strategies, and balancing user experience with revenue generation. Q&A session and networking opportunity following the lecture.',
                'location' => 'AEU Business School, Lecture Hall 3',
                'start_date' => '2026-04-08 15:00:00',
                'end_date' => '2026-04-08 17:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800',
            ],
            [
                'title' => 'AEU Sports Day 2026',
                'description' => 'Annual AEU Sports Day featuring football, basketball, volleyball, badminton, and e-sports competitions. Form your teams and register at the Student Affairs office. Medals and trophies for winners. Food stalls and entertainment throughout the day. Show your school spirit and compete for faculty bragging rights!',
                'location' => 'AEU Sports Complex and Main Field',
                'start_date' => '2026-04-15 07:00:00',
                'end_date' => '2026-04-15 18:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1461896836934- voices6902e9e?w=800',
            ],
            [
                'title' => 'Career Fair 2026 - Tech Edition',
                'description' => 'Connect with 50+ technology companies recruiting for internships and full-time positions. Bring your resumes, dress professionally, and prepare for on-spot interviews. Companies include software development firms, digital agencies, startups, and multinational corporations. Free professional headshot service and resume review booths available.',
                'location' => 'AEU Conference Center, Halls A & B',
                'start_date' => '2026-04-20 09:00:00',
                'end_date' => '2026-04-20 16:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
            ],
            [
                'title' => 'Graduation Ceremony - Class of 2026',
                'description' => 'Celebrate the achievements of AEU\'s graduating class of 2026. The ceremony will be attended by faculty, distinguished guests, industry partners, and families. Graduates please arrive by 7:00 AM for procession briefing. Each graduate receives two guest tickets. Live streaming available for extended family. Congratulations to all graduates!',
                'location' => 'AEU Main Auditorium',
                'start_date' => '2026-05-10 09:00:00',
                'end_date' => '2026-05-10 12:00:00',
                'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
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
