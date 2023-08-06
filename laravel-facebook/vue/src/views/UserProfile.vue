<template>
  
  <div class="container-userprofile">
    <div class="Homevue">
      <font-awesome-icon icon="fa-solid fa-home" class="homefie" @click="gotoHomepage"  /> 

    </div>
  <div class="profileuser">
    <div class="profile-pictureuser">
      <img :src="user.data.profile_picture" alt="Profile Picture" />
    </div>
    <div class="profile-detailsuser">
      <h1 class="black-text">{{ user.data.description }}</h1>
      <div class="profile-metadatauser">
        <p class="black-text">{{ user.data.hobbies }}</p>
      </div>
        <div class="profile-metadatauser2">
          <p class="black-text">{{ user.data.favorite_things }}</p>
        </div>
    </div>
  </div>
  
  <div class="Post-User-section">
    <div class="post-list">
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-container">
            <div class="post-comment">{{ post.comment }}</div>
            <div class="post-image-container">
              <img :src="post.image" alt="Post Image" @load="handleImageLoad" @error="handleImageError(post)"/>
            </div>
          </div>
          <button @click="deletePost(post)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {  
  created() {
    if (this.user.token) {
      this.$store.dispatch('fetchPosts');
    }
  },
  computed: {
    ...mapGetters(['getLoggedInUser', 'getPosts']),
    user() {
      return this.getLoggedInUser;
    },
    
    posts() {
      return this.$store.getters.getPosts;
    }
  },
  methods: {

    gotoHomepage() {
      this.$router.push({
        name: 'Homepage',
      });
    },
  },
};
</script>


<style>
.container-userprofile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10em;
    max-height: 100vh; 
  }
.homefie{
  position: absolute;
  margin-top: 5em;
  margin-left: 2.5em;
  cursor: pointer;
}
.profileuser {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-pictureuser {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.profile-pictureuser img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-detailsuser {
  flex: 1;
}

.black-text {
  color: #000000;
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
}

.profile-metadatauser {
  display: flex;
  gap: 10px;
}

.profile-metadatauser p {
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 1.2;
}
.profile-metadatauser2 {
  display: flex;
  gap: 10px;
}

.profile-metadatauser2 p {
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 1.2;
}
</style>
