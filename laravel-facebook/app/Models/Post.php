<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['users_id', 'comment', 'image'];

    protected $dates = ['created_at', 'updated_at'];
    
    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }
}
