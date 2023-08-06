<?php

namespace App\Services;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Friend;
use App\Models\Post;
class FriendService
{
    
    public function sendFriendRequest($loggedInUserId, $userId)
{
    $friendRequest = Friend::where([
        ['friend_one', $loggedInUserId],
        ['friend_two', $userId]
    ])->first();

    if (!$friendRequest) {
        Friend::create([
            'friend_one' => $loggedInUserId,
            'friend_two' => $userId,
            'status' => '0'
        ]);
    }


}
public function rejectFriendRequest($userId, $loggedInUserId)
{
    Friend::where([
        ['friend_one', $userId],
        ['friend_two', $loggedInUserId],
        ['status', '0'],
    ])->delete();
}

public function acceptFriendRequest($userId, $loggedInUserId)
{
    $friendRequest = Friend::where([
        ['friend_one', $userId],
        ['friend_two', $loggedInUserId],
        ['status', '0'], 
    ])->first();

    if ($friendRequest) {
        $friendRequest->status = '1';
        $friendRequest->save();
    }
}
public function getAcceptedFriendIds($userId, $loggedInUserId)
    {
        return Friend::where([
            ['friend_one', $userId],
            ['status', '1'] 
        ])->pluck('friend_two')->merge(Friend::where([
            ['friend_two', $loggedInUserId],
            ['status', '1']
        ])->pluck('friend_one'));
    }

    public function getFriendPosts($userId)
    {
        
        $loggedInUserId = Auth::id(); 

        $friendIds = $this->getAcceptedFriendIds($userId, $loggedInUserId);
    
        $posts = Post::whereIn('users_id', $friendIds)
            ->where('users_id', '!=', $userId)
            ->latest()
            ->get();
            foreach ($posts as $post) {
                $user = User::find($post->users_id);
                $post->setAttribute('user', $user);
            }
    
        return $posts;
    }
    public function getFriendRequests($userId)
{
    return Friend::where([
        ['friend_two', $userId],
        ['status', '0']
    ])->with('userOne', 'userTwo')->get();
}

}