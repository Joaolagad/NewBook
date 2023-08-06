<template>
  <div>
    <div class="Homepublic">
        <font-awesome-icon icon="fa-solid fa-home" class="plublichome"  @click="gotoHomepage" /> 
      </div>
    <div class="user-container">

      <h2 class="subtitle">Search Results</h2>
      <ul class="user-list">
        <li v-for="user in users" :key="user.id" class="user-item">
          <router-link :to="{ name: 'PublicProfile', params: { userId: user.id }}" :key="user.id">
            <div class="user-avatar">
              <img :src="user.profile_picture" alt="Profile Picture" />
            </div>
            <span class="user-name">{{ user.name }}</span>
          </router-link>
          <button @click="sendFriendRequest(user.id)" v-if="!user.requestSent && shouldDisplayAddFriendButton(user.id)">
            Add Friend
          </button>
          <span v-else>Request Sent</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  computed: {
    users() {
      return this.$store.getters.getSearchResults;
    },
    loggedInUser() {
      return this.$store.getters.getLoggedInUser;
    },
  },
  methods: {
    gotoHomepage() {
      this.$router.push({
        name: 'Homepage',
      });
    },
    sendFriendRequest(userId) {
      this.$store
        .dispatch('sendFriendRequest', userId)
        .then(() => {
          const user = this.users.find((user) => user.id === userId);
          if (user) {
            user.requestSent = true;
          }
        })
        .catch((error) => {
          //console.error('Error sending friend request:', error);
        });
    },

    shouldDisplayAddFriendButton(userId) {
      const loggedInUser = this.loggedInUser;
      return loggedInUser && loggedInUser.data && !this.isFriend(userId) && !this.isFriendRequestPending(userId);
    },
    isFriend(userId) {
      const loggedInUser = this.loggedInUser;
      return loggedInUser && loggedInUser.data && loggedInUser.data.friends && loggedInUser.data.friends.some((friend) => friend.id === userId);
    },
    isFriendRequestSent(userId) {
      const loggedInUser = this.loggedInUser;
      return loggedInUser && loggedInUser.data && loggedInUser.data.friend_requests_sent && loggedInUser.data.friend_requests_sent.some((request) => request.friend_id === userId && request.status === 0);
    },
    isFriendRequestReceived(userId) {
      const loggedInUser = this.loggedInUser;
      return loggedInUser && loggedInUser.data && loggedInUser.data.friend_requests_received && loggedInUser.data.friend_requests_received.some((request) => request.user_id === userId && request.status === 0);
    },
    isFriendRequestPending(userId) {
      return this.isFriendRequestSent(userId) || this.isFriendRequestReceived(userId);
    },
  },
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200&display=swap');

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.plublichome {
  cursor: pointer;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  width: 200px;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

.subtitle  {
  font-family: 'Yanone Kaffeesatz', sans-serif;
  
} 

.user-avatar {
  width: 70px;
  height: 70px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  display: block;
  margin-top: 5px;
  text-align: center;
}
</style>
