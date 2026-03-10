<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_news_detail_returns_correct_structure(): void
    {
        // Create test news
        $news = News::factory()->create([
            'title' => 'Test News Article',
            'content' => 'Test content',
            'category' => 'Academic',
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/news/{$news->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'news' => [
                    'id',
                    'title',
                    'content',
                    'category',
                    'author',
                    'image_url',
                    'source_url',
                    'published_date',
                    'is_featured',
                    'is_active',
                    'views',
                    'created_at',
                    'updated_at',
                ],
                'related',
                'featured',
            ]);
    }

    public function test_news_detail_increments_views(): void
    {
        $news = News::factory()->create([
            'title' => 'Test News Article',
            'views' => 0,
        ]);

        $this->getJson("/api/news/{$news->id}");

        $news->refresh();
        $this->assertEquals(1, $news->views);
    }

    public function test_event_detail_returns_correct_structure(): void
    {
        $event = Event::factory()->create([
            'title' => 'Test Event',
            'description' => 'Test description',
        ]);

        $user = \App\Models\User::factory()->create();
        
        $response = $this->actingAs($user)->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'event' => [
                    'id',
                    'title',
                    'description',
                    'location',
                    'start_date',
                    'end_date',
                    'image_url',
                    'created_at',
                    'updated_at',
                ],
                'related',
                'upcoming',
                'registration_count',
                'is_registered',
                'user_registration',
            ]);
    }

    public function test_news_detail_returns_related_news(): void
    {
        News::factory()->create([
            'title' => 'Main Article',
            'category' => 'Technology',
            'is_active' => true,
        ]);

        News::factory()->create([
            'title' => 'Related Article 1',
            'category' => 'Technology',
            'is_active' => true,
        ]);

        News::factory()->create([
            'title' => 'Related Article 2',
            'category' => 'Technology',
            'is_active' => true,
        ]);

        $mainNews = News::where('title', 'Main Article')->first();
        $response = $this->getJson("/api/news/{$mainNews->id}");

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('related'));
    }
}
