<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\CommentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('posts');
    });
    Route::get('/users/{userId}', [UserController::class, 'getUser']);
    Route::get('/users', [UserController::class, 'search']); 
    Route::post('friends/request/{userId}', [FriendController::class, 'sendFriendRequest']);
    Route::post('/friends/accept/{userId}', [FriendController::class, 'acceptFriendRequest']);
    Route::delete('/friends/reject/{userId}', [FriendController::class, 'rejectFriendRequest']);
    Route::get('/friends/accepted', [FriendController::class, 'getAcceptedFriends']);

    Route::get('/friend-requests', [FriendController::class, 'getFriendRequests']);
    
    Route::post('/details', [AuthController::class, 'details']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::post('/', [PostController::class, 'store']);
        Route::get('/friends/posts', [FriendController::class, 'fetchFriendPosts']);
        Route::get('/{post}', [PostController::class, 'show']);
        Route::post('/{post}/comments', [CommentController::class, 'store']);
        Route::get('/{post}/comments', [CommentController::class, 'index']);
        Route::delete('/{post}', [PostController::class, 'destroy']);
        
    });

});