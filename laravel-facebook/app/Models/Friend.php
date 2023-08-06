<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Friend extends Model
{
    use HasFactory;


    protected $fillable = [
        'friend_one',
        'friend_two',
        'status',
    ];

    public function userOne()
    {
        return $this->belongsTo(User::class, 'friend_one');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'friend_two');
    }
 
}
