<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = News::where('is_active', true);

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter featured news
        if ($request->has('featured') && $request->featured === 'true') {
            $query->where('is_featured', true);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $news = $query->orderBy('published_date', 'desc')
            ->orderBy('is_featured', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($news);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'image_url' => 'nullable|url|max:500',
            'source_url' => 'nullable|url|max:500',
            'published_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $news = News::create($validated);

        return response()->json($news, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $news = News::findOrFail($id);

        // Increment view count
        $news->increment('views');

        // Get related news (same category, excluding current news)
        $relatedNews = News::where('is_active', true)
            ->where('id', '!=', $id)
            ->where('category', $news->category)
            ->orderBy('published_date', 'desc')
            ->limit(4)
            ->get();

        // Get featured news for sidebar (excluding current news)
        $featuredNews = News::where('is_active', true)
            ->where('is_featured', true)
            ->where('id', '!=', $id)
            ->orderBy('published_date', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'news' => $news,
            'related' => $relatedNews,
            'featured' => $featuredNews,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'image_url' => 'nullable|url|max:500',
            'source_url' => 'nullable|url|max:500',
            'published_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $news->update($validated);

        return response()->json($news);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }

    /**
     * Get featured news
     */
    public function featured(): JsonResponse
    {
        $news = News::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('published_date', 'desc')
            ->limit(3)
            ->get();

        return response()->json($news);
    }

    /**
     * Get latest news
     */
    public function latest(): JsonResponse
    {
        $news = News::where('is_active', true)
            ->orderBy('published_date', 'desc')
            ->limit(10)
            ->get();

        return response()->json($news);
    }

    /**
     * Get news by category
     */
    public function category(string $category): JsonResponse
    {
        $news = News::where('is_active', true)
            ->where('category', $category)
            ->orderBy('published_date', 'desc')
            ->get();

        return response()->json($news);
    }
}
