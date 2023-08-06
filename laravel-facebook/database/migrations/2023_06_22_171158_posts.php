<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id(); // Add this line to create the 'id' column

            $table->unsignedBigInteger('users_id')->default(0);
            $table->text('comment');
            $table->text('reply_author')->default(0);
            $table->text('reply_id')->default(0);
            $table->string('image')->nullable();

            $table->timestamps();

            // Add a foreign key constraint
            $table->foreign('users_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
}

