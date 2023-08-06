<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
class CommentController extends Controller
{
    public function index($post)
    {
        
        $comments = Comment::where('post_id', $post)->with('user')->get();

        return response()->json($comments, 200);
    }
    public function store(Request $request, $post)
    {
        $request->validate([
            'body' => 'required',
        ]);

        $input = $request->all();
        $input['user_id'] = auth()->user()->id;
        $input['post_id'] = $post; 

        $comment = Comment::create($input);

        return response()->json($comment, 201); 
    }
}
