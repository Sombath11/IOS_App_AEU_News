<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        News::create([
            'title' => 'New Digital Library Open 24/7',
            'content' => 'Access over 500,000 journals and e-books today. The new digital library is now available around the clock for all students.',
            'category' => 'FEATURED',
            'image_url' => 'https://www.khmertimeskh.com/wp-content/uploads/2016/03/files+news+23223+1459096883.jpg',
            'published_date' => now()->subHours(2),
            'is_featured' => true,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'AEU Sports Day 2025',
            'content' => 'Join us for the annual sports competition. Various events including football, basketball, and volleyball tournaments.',
            'category' => 'SPORTS',
            'image_url' => 'https://www.khmertimeskh.com/wp-content/uploads/2024/06/IMG_8023.jpg',
            'published_date' => now()->subDay(),
            'is_featured' => true,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'International Conference on AI',
            'content' => 'Leading experts gather at AEU to discuss the latest advancements in artificial intelligence and machine learning.',
            'category' => 'ACADEMIC',
            'image_url' => 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800',
            'published_date' => now()->subDays(2),
            'is_featured' => true,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'Research Grants Applications Now Open for 2024',
            'content' => 'The university is now accepting applications for research grants. Submit your proposals by the end of the month.',
            'category' => 'ACADEMIC',
            'image_url' => 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
            'published_date' => now()->subHours(5),
            'is_featured' => false,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'Sustainability Week: Join the Green Campus Initiative',
            'content' => 'Participate in various activities aimed at making our campus more environmentally friendly.',
            'category' => 'CAMPUS NEWS',
            'image_url' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
            'published_date' => now()->subHours(8),
            'is_featured' => false,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'AI Ethics Seminar Series Starting Next Monday',
            'content' => 'A comprehensive seminar series covering ethical considerations in AI development and deployment.',
            'category' => 'ACADEMIC',
            'image_url' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
            'published_date' => now()->subDay(),
            'is_featured' => false,
            'is_active' => true,
        ]);

        News::create([
            'title' => 'Student Council Elections Results Announced',
            'content' => 'The results of the annual student council elections have been announced. Congratulations to all winners!',
            'category' => 'CAMPUS NEWS',
            'image_url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
            'published_date' => now()->subDays(2),
            'is_featured' => false,
            'is_active' => true,
        ]);
    }
}
