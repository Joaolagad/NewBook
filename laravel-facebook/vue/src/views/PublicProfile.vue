<template>
  <div class="centered-profile">
    <div class="profilepublic">
      <div class="profile-picturepublic">
        <img :src="user.profile_picture" alt="Profile Picture" />
      </div>
      <div class="profile-detailspublic">
        <h1 class="black-text">{{ user.description }}</h1>
        <div class="profile-metadatapublic">
          <p class="black-text">{{ user.hobbies }}</p>
          <p class="black-text">{{ user.favorite_things }}</p>
          
        </div>
      </div>
      <div class="Homepublic">
        <font-awesome-icon icon="fa-solid fa-home" class="plublichome"  @click="gotoHomepage" /> 

      </div>
    </div>
  </div>
</template>



<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
  ...mapGetters(['getUserById']),
  user() {
    const userId = this.$route.params.userId;
  //  console.log('UserId:', userId);
    const user = this.getUserById(userId);
//    console.log('Fetched user:', user);
    return user;
  },
},


  created() {
    const userId = this.$route.params.userId;
    this.fetchUserDetails(userId);
  },
  methods: {
    gotoHomepage() {
      this.$router.push({
        name: 'Homepage',
      });
    },
    ...mapActions(['fetchUserDetails']),
    fetchUserDetails(userId) {
      this.$store
        .dispatch('fetchUserDetails', userId)
        .then(() => {
        })
        .catch((error) => {
          //console.error('Error fetching user details:', error);
        });
    },
  },
};
</script>

<style>
.centered-profile {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.publichome {
  cursor: pointer;
}
.profilepublic {
  background-color: #ffffff;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
}

.profile-picturepublic img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
}

.profile-detailspublic {
  margin-top: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.profile-metadatapublic p {
  margin: 5px 0;
  font-size: 16px;
}

.black-text {
  color: #14171a;
}
</style>