<?php

namespace App\Http\Controllers;
use Storage;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Services\FriendService;
class PostController extends Controller
{
    protected $friendService;

public function __construct(FriendService $friendService)
{
    $this->friendService = $friendService;
}
    public function index()
    {
        
        $this->middleware('auth');

        $posts = Post::latest()->get();
        return response()->json($posts);
    }


    public function create()
    {

    }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'comment' => 'required',
        'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('images', 'public');
        $validatedData['image'] = asset('storage/'.$imagePath);
    }

    
    $validatedData['users_id'] = auth()->user()->id;

    $post = Post::create($validatedData);
    
    return response()->json($post, 204);
}


    public function show(Post $post)
    {

        return response()->json($post);
    }

    public function destroy (Post $post)
    {
        if (auth()->user()->id !== $post->users_id) {
            return response()->json(['message' => 'unauthorized'], 401);
        }

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        return response()->json(['message' => 'Post deleted'], 200);
    }
}