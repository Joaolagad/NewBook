<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
            ]
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email|string',
        'password' => 'required',
    ]);

    if (!Auth::guard('web')->attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $user = Auth::guard('web')->user();
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'user' => $user->load('posts'),
        'token' => $token
    ]);
}
public function details(Request $request)
{
    $data = $request->validate([
        'description' => 'required|string',
        'hobbies' => 'required|string',
        'favorite_things' => 'required|string',
        'profile_picture' => 'image|mimes:jpeg,png|max:2048', 
    ]);

    $user = $request->user();
    $user->description = $data['description'];
    $user->hobbies = $data['hobbies'];
    $user->favorite_things = $data['favorite_things'];

    if ($request->hasFile('profile_picture')) {
        $imagePath = $request->file('profile_picture')->store('images', 'public');
        $user->profile_picture = asset('storage/'.$imagePath);
    }

    $user->save();

    return response([
        'user' => $user,
        'token' => $request->bearerToken()
    ]);
}




    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response([
            'success' => true
        ]);
    }
}

