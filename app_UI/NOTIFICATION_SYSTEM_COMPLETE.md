# Notification System Implementation Complete ✅

## Summary
A complete notification system has been implemented where:
- **Laravel** creates entries in the `notifications` table (SQLite)
- **Ionic** fetches the list when the "Alerts" tab is clicked
- **UI** renders notification cards with a blue dot if `read_at` is null
- **User clicks** a notification and Ionic navigates them to the relevant page (News Detail, Grades, Events, etc.)

---

## 📁 Backend Changes (Laravel)

### 1. Migration (`database/migrations/2026_03_05_132504_create_notifications_table.php`)
Created notifications table with the following schema:
```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('message');
    $table->string('type'); // news, event, grade, emergency, etc.
    $table->string('icon')->default('notifications-outline');
    $table->string('target_type')->nullable(); // news, event, grade, etc.
    $table->unsignedBigInteger('target_id')->nullable();
    $table->string('target_url')->nullable();
    $table->boolean('is_emergency')->default(false);
    $table->boolean('is_read')->default(false);
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
```

### 2. Notification Model (`app/Models/Notification.php`)
- Fillable fields: `user_id`, `title`, `message`, `type`, `icon`, `target_type`, `target_id`, `target_url`, `is_emergency`, `is_read`, `read_at`
- Helper methods: `markAsRead()`, `markAsUnread()`, `getTimeAgoAttribute()`
- Scopes: `unread()`, `read()`, `emergency()`

### 3. NotificationController (`app/Http/Controllers/NotificationController.php`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `index()` | GET `/api/notifications` | Yes | Get all user notifications (paginated) |
| `show($id)` | GET `/api/notifications/{id}` | Yes | Get single notification (marks as read) |
| `markAsRead($id)` | POST `/api/notifications/{id}/mark-as-read` | Yes | Mark notification as read |
| `markAllAsRead()` | POST `/api/notifications/mark-all-read` | Yes | Mark all as read |
| `markAsUnread($id)` | POST `/api/notifications/{id}/mark-as-unread` | Yes | Mark as unread |
| `destroy($id)` | DELETE `/api/notifications/{id}` | Yes | Delete notification |
| `unreadCount()` | GET `/api/notifications/unread-count` | Yes | Get unread count |

### 4. API Routes (`routes/api.php`)
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{notification}/mark-as-unread', [NotificationController::class, 'markAsUnread']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
});
```

### 5. NotificationSeeder (`database/seeders/NotificationSeeder.php`)
Creates 7 sample notifications per user:
1. Emergency Safety Alert (unread, emergency)
2. Grade Posted: CS101 (unread)
3. Event: Career Fair 2024 (unread)
4. New Campus Policy Update (unread, news)
5. Library Book Overdue (unread)
6. Fee Payment Successful (read)
7. Profile Updated (read)

---

## 📁 Frontend Changes (Ionic/Angular)

### 1. Notification Model (`src/app/models/notification.ts`)
```typescript
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  icon: string;
  target_type: string | null;
  target_id: number | null;
  target_url: string | null;
  is_emergency: boolean;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
```

### 2. NotificationService (`src/app/services/notification.service.ts`)
Methods:
- `getNotifications(params?)` - Fetch notifications with optional filters
- `getNotification(id)` - Fetch single notification
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark as read
- `markAllAsRead()` - Mark all as read
- `markAsUnread(id)` - Mark as unread
- `deleteNotification(id)` - Delete notification
- `getTargetUrl(notification)` - Get navigation URL
- `getIconClass(type, isEmergency)` - Get CSS class for icon
- `isUnread(notification)` - Check if unread (read_at is null)
- `isToday(notification)` - Check if from today
- `timeAgo(dateString)` - Format date for display

### 3. AlertsPage (`src/app/pages/alerts/alerts.page.ts`)
- Implements `OnInit` to load notifications on tab click
- Fetches from API instead of hardcoded data
- Shows loading spinner while fetching
- Marks notification as read when clicked
- Navigates to target URL (News Detail, Grades, Events, etc.)
- Supports "Mark All as Read" functionality
- Shows toast notifications for user feedback

### 4. AlertsPage Template (`src/app/pages/alerts/alerts.page.html`)
- Loading state with spinner
- Today/Earlier sections
- Blue dot indicator for unread notifications (`read_at` is null)
- Emergency notifications highlighted in red
- Empty state when no notifications

---

## 🔗 Data Flow

### 1. User Clicks "Alerts" Tab
```
1. TabsPage navigates to /tabs/alerts
2. AlertsPage.ngOnInit() calls loadNotifications()
3. NotificationService.getNotifications() → GET /api/notifications
4. Laravel returns paginated notifications + unread_count
5. UI renders notification cards
```

### 2. User Clicks a Notification
```
1. viewAlert(alert) is called
2. alert.read = true (immediate UI feedback)
3. NotificationService.markAsRead(id) → POST /api/notifications/{id}/mark-as-read
4. Laravel sets is_read = true, read_at = now()
5. NotificationService.getTargetUrl(alert) determines destination
6. Router navigates to target (e.g., /news/1, /tabs/grades, /tabs/event/1)
```

### 3. User Clicks "Mark All as Read"
```
1. markAllAsRead() is called
2. Loading spinner appears
3. NotificationService.markAllAsRead() → POST /api/notifications/mark-all-read
4. Laravel updates all user notifications: is_read = true, read_at = now()
5. Local state updated: all alerts marked as read, unread_count = 0
6. Toast notification: "All notifications marked as read"
```

---

## 🗄️ Database Fields Mapping

| Backend Field | Frontend Field | Notes |
|---------------|----------------|-------|
| `id` | `id` | Direct mapping |
| `title` | `title` | Direct mapping |
| `message` | `message` | Direct mapping |
| `type` | `type` | Determines icon and navigation |
| `icon` | `icon` | Ionicon name |
| `target_type` | `target_type` | news, event, grade, etc. |
| `target_id` | `target_id` | ID for navigation |
| `target_url` | `target_url` | Fallback URL |
| `is_emergency` | `isEmergency` | Red highlight |
| `is_read` | `read` | Blue dot if false |
| `read_at` | `read_at` | Null = unread (blue dot) |
| `created_at` | `time` | Converted to "time ago" |

---

## 🚀 How to Run

### Step 1: Start Laravel Backend
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php -S localhost:8888 -t public
```

Or double-click `start_laravel.bat` in the Assignment folder.

### Step 2: Seed Notifications (if needed)
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend"
php artisan db:seed --class=NotificationSeeder
```

### Step 3: Start Ionic Frontend
```bash
cd "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\Assignment"
ionic serve
```

---

## ✅ Features Implemented

- [x] Laravel creates notifications in SQLite database
- [x] Ionic fetches notifications when Alerts tab is clicked
- [x] UI renders notification cards with sections (Today/Earlier)
- [x] Blue dot appears when `read_at` is null (unread)
- [x] Emergency notifications highlighted in red
- [x] Click notification → navigate to relevant page
- [x] Mark as read on click (updates `read_at` timestamp)
- [x] Mark all as read functionality
- [x] Delete notifications functionality
- [x] Loading state while fetching
- [x] Empty state when no notifications
- [x] Toast notifications for user feedback
- [x] Unread count tracking

---

## 📝 Notification Types and Navigation

| Type | Icon | Navigation Target |
|------|------|-------------------|
| `news` | newspaper-outline | `/news/{id}` |
| `event` | calendar-outline | `/tabs/event/{id}` |
| `grade` | document-text-outline | `/tabs/grades` |
| `emergency` | warning-outline | `/tabs/alerts` |
| `library` | book-outline | `/tabs/library` |
| `payment` | wallet-outline | `/tabs/finance` |
| `profile` | person-outline | `/tabs/profile` |

---

## 🔒 Security Notes

- All notification endpoints require authentication (Sanctum token)
- Users can only access their own notifications
- Unauthorized access returns 404
- Cascade delete when user is deleted

---

**Implementation Complete! 🎉**
