<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6),
            'content' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(['Academic', 'Campus Life', 'Research', 'Announcement', 'Achievement', 'Event']),
            'author' => fake()->name(),
            'image_url' => fake()->imageUrl(800, 600, 'news', true, 'News'),
            'source_url' => fake()->optional(0.3)->url(),
            'published_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'is_featured' => fake()->boolean(20),
            'is_active' => true,
            'views' => fake()->numberBetween(0, 1000),
        ];
    }
}
