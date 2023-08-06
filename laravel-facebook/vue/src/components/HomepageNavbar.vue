<template>
  <nav class="container-navbar">
    <div class="navbar">
      <ul class="navbar-content">
        <li>
          <div class="title-search-container">
            <h1>NewBook</h1>
            <div class="search-bar-container">
                <div class="search-bar">
                  <div class="search-input-container">
                    <input type="text" class="searchinput" v-model="searchQuery" placeholder="Search..." />
                  </div>
                  <button @click="searchUsers" class="search-button">
                    <font-awesome-icon icon="search" class="icon-search"/>
                  </button>
                </div>
              </div>
          </div>
        </li>
        <li>
          <div class="profile-container" v-if="user && user.data">
            <img v-if="user.data?.profile_picture" :src="user.data.profile_picture" alt="Profile Picture" />
            <div class="profile-containerprofile" @click="goToUserProfile">
              <h3 v-if="user.data?.name">{{ user.data.name }}</h3>
            </div>
          </div>
        </li>
        <li class="li-friends">
          <div @click="showFriends = !showFriends">
            <font-awesome-icon icon="users" :class="{ 'friends-h3': true, 'clicked-icon': showFriends }"
            @mouseover="hovered = true"
            @mouseleave="hovered = false"/>
          </div>
          <ul>
            <li v-if="acceptedFriends.length > 0" class="friend-requests">
              <div class="friend-accepted-header" @click="showFriends = !showFriends">
                {{ acceptedFriends.length }}
              </div>
              <ul v-show="showFriends" class="friend-requests-container">
                <div class="friend-requests-list">
                  <h3>Friends</h3>
                      <li v-for="friend in acceptedFriends" :key="friend.id" class="friend-request-item">
                        
                        <router-link :to="{ name: 'PublicProfile', params: { userId: friend.user_one.id }}" :key="friend.user_one.id">
                          
                          <div class="friend-request-info">
                            <div class="friend-request-user">
                              <div class="profile-picturefriend">
                                <img v-if="friend.user_one && friend.user_one.profile_picture" :src="friend.user_one.profile_picture" alt="Profile Picture" />
                              </div>
                              <div class="user-infofriend">
                                <h4 v-if="friend.user_one && friend.user_one.name">{{ friend.user_one.name }}</h4>
                                
                              </div>
                              
                            </div>
                          </div>
                        </router-link>
                      </li>
                </div>
              </ul>
            </li>
          </ul>
        </li>
        
        <li v-if="pendingFriendRequests.length > 0" class="friend-requests">
          <div class="friend-requests-header" @click="showFriendRequests = !showFriendRequests">
            Friend Requests ({{ pendingFriendRequests.length }})
          </div>
          <ul v-show="showFriendRequests" class="friend-requests-pending-container">
            <div class="friend-requests-pending-list">

              <li v-for="request in pendingFriendRequests" :key="request.id" class="friend-request-item">
                <div class="friend-request-inforequest">
                  <div class="friend-request-userrequest">
                    <div class="profile-picturerequest">
                      <img v-if="request.user_one && request.user_one.profile_picture" :src="request.user_one.profile_picture" alt="Profile Picture" />
                    </div>
                    <div class="user-inforequest">
                      <h4 v-if="request.user_one && request.user_one.name">{{ request.user_one.name }}</h4>
                    </div>
                  </div>
                  <div class="friend-request-button">
                    <button @click="acceptFriendRequest(request.user_one?.id)">Accept</button>
                    <button @click="rejectFriendRequest(request.user_one.id)">Reject</button>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </li>
        <li class="logout">
          <div class="arrow-down" @click="toggleLogoutOptions">
            <font-awesome-icon icon="chevron-down" class="icon-chevron" />
          </div>
          <ul class="logout-options" v-show="showLogoutOptions">
            <li><a @click="logout()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import { mapGetters, mapActions } from 'vuex';
import axiosClient from '../axios';
import store from '../store';
import { ref, computed } from 'vue';

export default {
  data() {
    return {
      hovered: false,
      showFriends: false,
      showLogoutOptions: false,


    };
  },
  setup() {
    const searchQuery = ref('');
    const router = useRouter();
    const showFriendRequests = ref(false);
    const showFriends = ref(false);

    function logout() {
      store.dispatch('logout').then(() => {
        router.push({
          name: 'Login',
        });
      });
    }

    function searchUsers() {
      const searchUrl = '/users?search=' + encodeURIComponent(searchQuery.value);

      axiosClient
        .get(searchUrl)
        .then(response => {
          store.dispatch('setSearchResults', response.data);
          router.push({
            name: 'SearchResults',
            query: { search: searchQuery.value },
          });
        })
        .catch(error => {
          //console.log('error', error);
        });
    }

                  
    return {
      logout,
      searchQuery,
      searchUsers,
      showFriendRequests,
      showFriends,
    };
  },

      created() {
      this.$store
        .dispatch('fetchUser')
        .then(() => {
          return this.$store.dispatch('fetchFriendRequests');
        })
        .catch(error => {
          //console.log('Error fetching user:', error);
        });
    },


    computed: {
  ...mapGetters(['getLoggedInUser', 'acceptedFriends', 'getFriendRequests']),
  friendRequests() {
    return this.getFriendRequests;
  },
  user() {
    return this.getLoggedInUser;
  },
  acceptedFriends() {
    return this.getFriendRequests.filter(request => request.status === '1');
  },
  pendingFriendRequests() {
    return this.getFriendRequests.filter(request => request.status === '0');
  },
},



  methods: {
    ...mapActions(['fetchUser', 'fetchFriendRequests', 'logout']),

    async acceptFriendRequest(userId) {
      try {
        const loggedInUserId = this.user.data.id;
        await this.$store.dispatch('acceptFriendRequest', { userId, loggedInUserId });
      } catch (error) {
        //console.error('Error accepting friend request:', error);
      }
    },


    async rejectFriendRequest(userId) {
      try {
    await store.dispatch('rejectFriendRequest', userId);
    //console.log('Friend request rejected:', userId);

    store.commit('REJECT_FRIEND_REQUEST', userId);

    //console.log('Updated Friend Requests:', store.getters.getFriendRequests);
  } catch (error) {
    //console.error('Error rejecting friend request:', error);
  }
    },
    toggleLogoutOptions() {
      this.showLogoutOptions = !this.showLogoutOptions;
    },

    goToUserProfile() {
      const userId = this.user.data.id;
      if (userId) {
        this.$router.push({
          name: 'UserProfile',
          params: { userId: userId },
        });
      } else {
      //  console.error('User ID is missing');
      }
    },
    goToFriendProfile() {
      const userId = this.user.data.id;
      if (userId) {
        this.$router.push({
          name: 'PublicProfile',
          params: { userId: userId },
        });
      } else {
        //console.error('User ID is missing');
      }
    },
  },

};
</script>


  
    
    <style>
    body{
      overflow-x: hidden;
    }
   @media (max-width: 768px) {
    body{
      overflow-x:hidden;
    }
    .navbar-content {
      flex-direction: column;
      align-items: center; 
      position: relative;
    }

    .container-navbar {
      padding: 2px 600px 0px 0px;
      margin-left: -13em;
    }

    .title-search-container {
      justify-content: center;
    }

    .search-bar {
      margin-left: 0;
      margin-top: 0px;
    }
    .search-bar input {
      width: 60% !important;
    }
    .friend-accepted-header {
      position: absolute;
      margin-right: 5em;
    }
    .profile-container {
      top: 0;
      margin-left: -40em;
      position: relative; 
    }

    .profile-container img {
      margin-left: 20em;
    }

    .li-friends {
      position: relative;
      left: 0;
      top: 0;
      margin: 10px auto;
    }

    .friend-requests-list {
      position: relative;
      left: 0;
      top: 0;
      margin: 0 auto;
      width: 10%;
    }

    .friends-h3 {
      position: absolute;
      left: -25em;
      margin-top: -3.5em;
      font-size: 20px;
    }

    .friend-requests-list h3 {
      position: absolute;
      right: 0;
      margin: 10px;
      font-size: 18px;
    }

    .friend-request-item {
      padding: 20px;
    }

    .profile-picturerequest,
    .profile-picturefriend {
      padding: 0;
      margin: 0;
    }

    .user-infofriend h4 {
      margin-left: 0;
    }

    .user-inforequest h4 {
      margin-left: 0;
    }

    .logout-options {
      position: relative;
      top: 10px;
      right: 0;
    }

    .logout-options li {
      padding: 8px 12px;
      text-align: center;
    }
    .arrow-down {
      margin-bottom: -16em;
    }
    .icon-chevron {
      margin-top: -4em;
      margin-left: -7em;
    }

    .logout-options {
      right: 10px; 
      top: calc(100% + 10px);
    }
  }
  .arrow-down {
  display: flex;
  cursor: pointer !important;
  margin-left: 46em;
}
.friend-request-button {
  position: relative;
  width: 100%;
  margin-bottom: -2em;
}
.friend-request-button button {
  position: relative;
  top: -2.5em;
  width: 30%;
  
  
}
.icon-chevron {
  cursor: pointer !important;
  color: black;
  z-index: 1; 

}

.logout-options {
  list-style: none;
  padding: 0;
  position: absolute;
  top: 73%;
  right: 0;
  background-color: #ccc;
  border: 2px solid #F0F2F5;
  border-radius: 4px;
  z-index: 2;

}

.logout-options li {
  padding: 8px 12px;
}

.logout-options li a {
  color: #000;
  text-decoration: none;
}

.arrow-down:hover .logout-options {
  display: block;
}
    .friends-h3:hover,
    .clicked-icon, 
    .hovered-icon {
    color: white;
    cursor: pointer;
  }
  .friend-accepted-header {
      margin-left: -20px;
      margin-top: -20px;

  }
  
    .friend-requests {
      position: absolute;
      left: 70em ;
      list-style: none;
      
    }
    .friend-request-item {
    padding: 20px 10px 0px 50px;
    width: 100%;
    margin-top: 0px;
  }

    .friends-h3 {
      position: absolute;
      margin-left: 35em;
      transition: color 0.1s;
      top: 20px;

    }
   
    .search-button {
      border-radius: 10em;
      margin-left: -44px;
        border: none;
          background-color: transparent;



    }
    .icon-search {
      color: #ccc;
      
    }
    .friend-requests-list h3 {
      color: black;
      right: 7em;
      font-family: 'Yanone Kaffeesatz', sans-serif;

    }
    .container-navbar {
      background-color: #f2f2f2;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999; 

    }
    
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
    }
    
    .navbar-content {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .title-search-container {
      display: flex;
      align-items: center;
      
    }

    .title-search-container h1 {
      font-family: 'Pacifico', cursive;
      color: black;
    }
    .logout {
      cursor: pointer !important;
      list-style: none;
      
    }
    .search-bar {
      
    display: flex;
    align-items: center;
    
  }
  .search-bar-container {
    
    display: flex;
    align-items: center;
    margin-left: 10px;
  }    
    .searchinput {
      width: 30em !important;
      padding: 8px !important;
      border: none;
      border-radius: 10px;
      background-color: #F0F2F5;
      color: #1C1E21;
    }
    .search-input-container {
    flex: 1 ;
    
  
  }

  .profile-containerprofile h3 {
    
    color: black;
  }
  .profile-containerprofile {
    position: relative;
    margin-right: 20em;
    
  }

    .profile-container {
      position: absolute;
      left: 60em;
      top: 15px;
      display: flex;
      align-items: center;
        
    }

    .profile-container img {
    position: relative;
    left: 15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;

    }
    .friend-request-userrequest {
  display: flex;
  align-items: center;
  margin-top: 3em;
}
    .friend-request-user {
  display: flex;
  align-items: center;
  margin-top: 3em;
}


.profile-picturerequest {  
  padding: 1px 10em 1px 1px;
  width: 50px;
}
.profile-picturerequest img {
    position: relative;
    bottom: 2em !important;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
.profile-picturefriend {  
  padding: 1px 10em 1px 1px;
  width: 50px;
}
.profile-picturefriend img {
    position: relative;

    width: 100%;
    height: 100%;
    border-radius: 50%;
  }


  .user-inforequest {
    margin-top: -1em;
  }
 
  .user-infofriend {
    margin-top: -2em;
  }
.user-inforequest h4 {
  margin-left: -10em;
  margin-bottom: 3.5em;
  font-size: 15px;
}
.user-infofriend h4 {
  margin-left: -10em;
  margin-bottom: -1em;
  font-size: 15px;
}
a {
    text-decoration: none;
    color: black;
  }
  .friend-requests-list {
    position: absolute;
    top: 50px;
    margin-left: -10em;
    background-color: #fff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    min-width: 100px;
    z-index: 2;
  }
  .friend-requests-pending-list{
    position: absolute;
    top: 50px;
    margin-left: -10em;
    background-color: #fff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    min-width: 100px;
    z-index: 2;
  }
.friend-requests-list h3 {
  position: absolute;
  margin-top: 30px;
}
.friend-request-info {
  padding: 0em 0em 0em 0em;
}

.friend-requests-pending-list {
    position: absolute;
    list-style: none;
}
.friend-requests-container {
  list-style: none;
  overflow-y: scroll;

    }

.friend-request-button {
  margin-left: auto;
}

    h1, h3, h5 {
      color: hsl(0, 0%, 100%);
      margin: 0;
      padding: 5px;
    }
    
    h1 {
      font-size: 20px;
      font-weight: bold;
    }
    
    h3, h5 {
      font-size: 16px;
      margin-left: 1em;
    }
    
    h5 {
      font-size: 14px;
      margin-left: 10px;
    }
    </style>