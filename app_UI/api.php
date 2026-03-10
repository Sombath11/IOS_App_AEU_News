<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NewsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Event routes
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Registration routes
    Route::post('/events/{id}/register', [EventController::class, 'register']);
    Route::get('/events/my-registrations', [EventController::class, 'myRegistrations']);
    Route::delete('/events/{id}/register', [EventController::class, 'cancelRegistration']);

    // News routes (admin only)
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);
});

// Public news routes - SPECIFIC routes MUST come BEFORE wildcard routes
Route::get('/news/featured', [NewsController::class, 'featured']);
Route::get('/news/latest', [NewsController::class, 'latest']);
Route::get('/news/category/{category}', [NewsController::class, 'category']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
