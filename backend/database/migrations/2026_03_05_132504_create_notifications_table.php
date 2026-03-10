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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->string('type'); // news, event, grade, emergency, etc.
            $table->string('icon')->default('notifications-outline');
            $table->string('target_type')->nullable(); // news, event, grade, etc.
            $table->unsignedBigInteger('target_id')->nullable(); // ID of the target (news_id, event_id, etc.)
            $table->string('target_url')->nullable(); // Fallback URL if needed
            $table->boolean('is_emergency')->default(false);
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
