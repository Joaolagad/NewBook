<?php

namespace App\Http\Controllers;
use App\Services\FriendService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Friend;
class FriendController extends Controller
{
    //
    protected $friendService;

    public function __construct(FriendService $friendService)
    {
        $this->friendService = $friendService;
    }
    public function getFriendRequests(Request $request)
    {
        $userId = $request->user()->id;
    
        $pendingFriendRequests = $this->friendService->getFriendRequests($userId);
        $acceptedFriends = $this->getAcceptedFriends($request);
    
        $friendRequests = [
            'pending' => $pendingFriendRequests,
            'accepted' => $acceptedFriends,
        ];
    
        return response()->json($friendRequests);
    }
    public function fetchFriendPosts(Request $request)
        {
            $userId = $request->user()->id;
            $friendPosts = $this->friendService->getFriendPosts($userId);
            return response()->json($friendPosts);
        }
    public function sendFriendRequest($userId)
    {
        $loggedInUserId = Auth::id();

        $this->friendService->sendFriendRequest($loggedInUserId, $userId);

        return response()->json(['message' => 'Friend request sent successfully']);

    }

    public function acceptFriendRequest($userId)
    {
        $loggedInUserId = Auth::id();

        $this->friendService->acceptFriendRequest($userId, $loggedInUserId);

        return response()->json(['message' => 'Friend request accepted successfully']);
    }

    
    public function getAcceptedFriends(Request $request)
    {
        $loggedInUserId = $request->user()->id;
        return Friend::where([
            ['friend_two', $loggedInUserId],
            ['status', '1'] 
        ])->with('userOne')->get();
    }

    
    public function rejectFriendRequest(Request $request, $userId)
    {
        $loggedInUserId = Auth::id();
        $this->friendService->rejectFriendRequest($userId, $loggedInUserId);
        return response()->json(['message' => 'Friend request rejected successfully']);
    }
    

            
}