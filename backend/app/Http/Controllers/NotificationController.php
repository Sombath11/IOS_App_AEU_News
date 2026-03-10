<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of user's notifications
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $query = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');
        
        // Optional filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('unread') && $request->boolean('unread')) {
            $query->where('is_read', false);
        }
        
        if ($request->has('emergency') && $request->boolean('emergency')) {
            $query->where('is_emergency', true);
        }
        
        $notifications = $query->paginate($request->get('per_page', 20));
        
        return response()->json([
            'notifications' => $notifications,
            'unread_count' => Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    /**
     * Display the specified notification
     */
    public function show(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        
        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        // Mark as read when viewing
        $notification->markAsRead();
        
        return response()->json([
            'notification' => $notification,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        
        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        $notification->markAsRead();
        
        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = Auth::user();
        
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        
        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        
        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        $notification->markAsUnread();
        
        return response()->json([
            'message' => 'Notification marked as unread',
            'notification' => $notification,
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        
        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        $notification->delete();
        
        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(): JsonResponse
    {
        $user = Auth::user();
        
        $count = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
        
        return response()->json([
            'unread_count' => $count,
        ]);
    }
}
