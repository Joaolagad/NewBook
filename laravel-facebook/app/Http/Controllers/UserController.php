<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    
    public function search(Request $request)
    {
        $searchQuery = $request->query('search');
    
        $users = User::where('name', 'LIKE', "%{$searchQuery}%")
            ->orWhere('email', 'LIKE', "%{$searchQuery}%")
            ->get();
    
        return response()->json($users);
    }
    
    public function getUser($userId)
    {
        try {
            $user = User::findOrFail($userId);
            return response()->json($user);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
    
    
}