<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
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
    ];

    protected $casts = [
        'published_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'views' => 'integer',
    ];
}
