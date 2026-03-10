# Update events migration
$eventsMigration = @"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint `$table) {
            `$table->id();
            `$table->string('title');
            `$table->text('description');
            `$table->string('location')->nullable();
            `$table->dateTime('start_date');
            `$table->dateTime('end_date')->nullable();
            `$table->string('image_url')->nullable();
            `$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\database\migrations\2026_03_03_132012_create_events_table.php" -Value $eventsMigration -Encoding UTF8

# Update event_registrations migration
$eventRegistrationsMigration = @"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint `$table) {
            `$table->id();
            `$table->foreignId('event_id')->constrained()->onDelete('cascade');
            `$table->foreignId('user_id')->constrained()->onDelete('cascade');
            `$table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            `$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\database\migrations\2026_03_03_132027_create_event_registrations_table.php" -Value $eventRegistrationsMigration -Encoding UTF8

# Update Event model
$eventModel = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected \$fillable = [
        'title',
        'description',
        'location',
        'start_date',
        'end_date',
        'image_url',
    ];

    protected \$casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];
}
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\app\Models\Event.php" -Value $eventModel -Encoding UTF8

# Update EventRegistration model
$eventRegistrationModel = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected \$fillable = [
        'event_id',
        'user_id',
        'status',
    ];

    public function event()
    {
        return \$this->belongsTo(Event::class);
    }

    public function user()
    {
        return \$this->belongsTo(User::class);
    }
}
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\app\Models\EventRegistration.php" -Value $eventRegistrationModel -Encoding UTF8

# Update User model
$userModel = @"
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected \$fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected \$hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function eventRegistrations()
    {
        return \$this->hasMany(EventRegistration::class);
    }
}
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\app\Models\User.php" -Value $userModel -Encoding UTF8

# Update AuthController
$authController = @"
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request \$request)
    {
        \$request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt(\$request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        \$user = User::where('email', \$request->email)->firstOrFail();
        \$token = \$user->createToken('auth-token');

        return response()->json([
            'user' => \$user,
            'token' => \$token->plainTextToken,
        ]);
    }

    public function register(Request \$request)
    {
        \$request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        \$user = User::create([
            'name' => \$request->name,
            'email' => \$request->email,
            'password' => Hash::make(\$request->password),
        ]);

        \$token = \$user->createToken('auth-token');

        return response()->json([
            'user' => \$user,
            'token' => \$token->plainTextToken,
        ], 201);
    }

    public function logout(Request \$request)
    {
        \$request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me(Request \$request)
    {
        return response()->json(\$request->user());
    }
}
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\app\Http\Controllers\AuthController.php" -Value $authController -Encoding UTF8

# Update EventController
$eventController = @"
<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Event::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request \$request)
    {
        \$request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_url' => 'nullable|url',
        ]);

        \$event = Event::create(\$request->all());

        return response()->json(\$event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string \$id)
    {
        \$event = Event::findOrFail(\$id);
        return response()->json(\$event);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string \$id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request \$request, string \$id)
    {
        \$event = Event::findOrFail(\$id);

        \$request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_url' => 'nullable|url',
        ]);

        \$event->update(\$request->all());

        return response()->json(\$event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string \$id)
    {
        \$event = Event::findOrFail(\$id);
        \$event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    /**
     * Register for an event.
     */
    public function register(Request \$request, string \$id)
    {
        \$event = Event::findOrFail(\$id);
        \$user = \$request->user();

        \$registration = EventRegistration::create([
            'event_id' => \$event->id,
            'user_id' => \$user->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Successfully registered for event',
            'registration' => \$registration,
        ], 201);
    }

    /**
     * Get user's event registrations.
     */
    public function myRegistrations(Request \$request)
    {
        \$registrations = EventRegistration::where('user_id', \$request->user()->id)
            ->with('event')
            ->get();

        return response()->json(\$registrations);
    }

    /**
     * Cancel event registration.
     */
    public function cancelRegistration(Request \$request, string \$id)
    {
        \$registration = EventRegistration::findOrFail(\$id);

        if (\$registration->user_id !== \$request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        \$registration->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Registration cancelled successfully']);
    }
}
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\app\Http\Controllers\EventController.php" -Value $eventController -Encoding UTF8

# Update API routes
$apiRoutes = @"
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
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
});
"@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\routes\api.php" -Value $apiRoutes -Encoding UTF8

Write-Host "All files updated successfully!"
