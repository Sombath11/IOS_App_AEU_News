<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraphs(2, true),
            'location' => fake()->optional(0.8)->city() . ' Campus',
            'start_date' => fake()->dateTimeBetween('now', '+3 months'),
            'end_date' => fake()->optional(0.7)->dateTimeBetween('+3 months', '+6 months'),
            'image_url' => fake()->imageUrl(800, 600, 'event', true, 'Event'),
        ];
    }
}
