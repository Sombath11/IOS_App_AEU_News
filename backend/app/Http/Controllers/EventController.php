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
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_url' => 'nullable|url',
        ]);

        $event = Event::create($request->all());

        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = Event::findOrFail($id);
        
        // Get related events (excluding current event)
        $relatedEvents = Event::where('id', '!=', $id)
            ->where('start_date', '>=', now())
            ->orderBy('start_date', 'asc')
            ->limit(4)
            ->get();
        
        // Get upcoming events
        $upcomingEvents = Event::where('start_date', '>=', now())
            ->where('id', '!=', $id)
            ->orderBy('start_date', 'asc')
            ->limit(5)
            ->get();
        
        // Get registration count for this event
        $registrationCount = EventRegistration::where('event_id', $id)
            ->where('status', 'pending')
            ->count();
        
        // Check if current user is registered (if authenticated)
        $user = Auth::user();
        $isRegistered = false;
        $userRegistration = null;
        
        if ($user) {
            $userRegistration = EventRegistration::where('event_id', $id)
                ->where('user_id', $user->id)
                ->first();
            $isRegistered = $userRegistration !== null;
        }
        
        return response()->json([
            'event' => $event,
            'related' => $relatedEvents,
            'upcoming' => $upcomingEvents,
            'registration_count' => $registrationCount,
            'is_registered' => $isRegistered,
            'user_registration' => $userRegistration,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_url' => 'nullable|url',
        ]);

        $event->update($request->all());

        return response()->json($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    /**
     * Register for an event.
     */
    public function register(Request $request, string $id)
    {
        $event = Event::findOrFail($id);
        $user = $request->user();

        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Successfully registered for event',
            'registration' => $registration,
        ], 201);
    }

    /**
     * Get user's event registrations.
     */
    public function myRegistrations(Request $request)
    {
        $registrations = EventRegistration::where('user_id', $request->user()->id)
            ->with('event')
            ->get();

        return response()->json($registrations);
    }

    /**
     * Cancel event registration.
     */
    public function cancelRegistration(Request $request, string $id)
    {
        $registration = EventRegistration::findOrFail($id);

        if ($registration->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $registration->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Registration cancelled successfully']);
    }
}
