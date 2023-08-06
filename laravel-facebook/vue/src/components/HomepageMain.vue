<template>
  <div class="container">
    <div class="create-post-box">
      <form @submit.prevent="createPost">
        <div class="input-groupcomment">
          <textarea rows="3" :placeholder="`What's on your mind, ${user.data.name}`" id="comment" v-model="comment" required></textarea>
        </div>
        <div class="input-groupimage">
          <input type="file" id="image" @change="onImageChange" accept="image/*">
          <label class="camera-icon" for="image">
            {{ imageSelected ? 'Image Selected' : 'Image' }}
            <font-awesome-icon icon="fa-solid fa-camera" /> 
          </label>
        </div>

        <div class="input-grouppost">
          <button type="submit" class="createpostbutton">Create Post</button>
        </div>
      </form>
    </div>
    <div class="post-list">
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <div class="user-info">
            <img :src="user.data.profile_picture" class="user-image" alt="Profile Picture" />       
            <span class="user-name">{{user.data.name }}</span>       
         </div>
          <div class="post-container">
            <div class="post-comment">{{ post.comment }}</div>
            <div v-if="post.image" class="post-image-container">
              <img :src="post.image" alt="Post Image" @load="handleImageLoad" @error="handleImageError(post)" />
            </div>
            <div v-if="post.comments && post.comments.length > 0">
              <ul class="comment-list">
                <li v-for="comment in post.comments" :key="comment.id" class="comment-item">
                  <div class="comment-item-container">
                    <img :src="comment.user.profile_picture" class="user-image" alt="Profile Picture" />
                    <span class="user-name">{{ comment.user.name }}</span>
                  </div>
                  <div class="comment-content-container"> 
                      <div class="comment-content">
                        <p class="comment-body">{{ comment.body }}</p>
                      </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else>
              <p class="nocomments">No comments yet.</p>
            </div> 
            <div class="comment-form">
              <form @submit.prevent="createComment(post)">
                <div class="textareas">
                  <textarea rows="2" v-model="commentData[post.id]" placeholder="Add a comment"></textarea>
                </div>
                <button type="submit" class="buttoncommentedx" >
                  <font-awesome-icon icon="paper-plane" class="buttoncommented" />
                </button>     
             </form>
            </div>
            
          </div>
          <button @click="deletePost(post)">Delete</button>
        </li>
        <li v-for="friendPost in friendPosts" :key="friendPost.id" class="post-item">
          <div class="user-info">
            <img v-if="friendPost?.user?.profile_picture" :src="friendPost.user.profile_picture" class="user-image" alt="Profile Picture" />
            <span class="user-name" v-if="friendPost?.user">{{ friendPost.user.name }}</span>
          </div>
            <div class="post-container">
              <span class="post-commentfriend">{{ friendPost.comment }}</span>
              <div v-if="friendPost.image" class="post-image-container">
                <img :src="friendPost.image" alt="Post Image"/>
              </div>
              <div v-if="comments[friendPost.id] && comments[friendPost.id].length > 0">
                <ul class="comment-list">
                  <li v-for="comment in comments[friendPost.id]" :key="comment.id" class="comment-item">
                    <div class="comment-item-container">
                      <img v-if="comment.user.profile_picture" :src="comment.user.profile_picture" class="user-image" alt="Profile Picture" />
                      <span class="user-name" v-if="comment.user">{{ comment.user.name }}</span>
                    </div>
                      <div class="comment-content-container"> 
                         <div class="comment-content">
                            <p class="comment-body">{{ comment.body }}</p>
                        </div>
                      </div>
                  </li>
                </ul>
              </div>
                <div v-else>
                  <p>No comments yet.</p>
                </div> 
            <div class="comment-form">
              <form @submit.prevent="createComment(friendPost, true)">
              <div class="textareasf">
                <textarea rows="2" v-model="commentData[friendPost.id]" placeholder="Add a comment"></textarea>
              </div>
                <button type="button" @click="submitFormWithIcon(friendPost)" class="buttoncommente">
                  <font-awesome-icon icon="paper-plane" class="buttoncomment" />
                </button>

              </form>
            </div>
            
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axiosClient from '../axios';


export default {
  data() {
    return {
      commentData: {},
      comment: '',
      image: null,
      imageSelected: false,

    };
  },

  created() {
  if (this.user.token) {
    this.$store.dispatch('fetchUser').then(() => {
      this.$store.dispatch('fetchPosts').then(() => {
        for (const post of this.posts) {
          const postId = post.id;
          this.$store
            .dispatch('fetchAllComments', postId)
            .then(() => {
              //console.log('Comments fetched for post with ID', postId);
            })
            .catch((error) => {
              //console.error('Error fetching comments for post with ID', postId, ':', error);
            });
        }
        this.$store.dispatch('fetchFriendPosts').then(() => {
          for (const friendPost of this.friendPosts) {
            const postId = friendPost.id;
            this.$store
              .dispatch('fetchAllComments', postId)
              .then(() => {
                //console.log('Comments fetched for friend post with ID', postId);
              })
              .catch((error) => {
                //console.error('Error fetching comments for friend post with ID', postId, ':', error);
              });
          }
        });
      });
    });
  }

},




computed: {
  ...mapGetters(['getLoggedInUser', 'getPosts', 'getUserById', 'getComments', 'getFriendPosts']),
  user() {
    return this.getLoggedInUser;
  },
  friendPosts() {
      return this.$store.state.friendPosts;
    },
    comments() {
      return {
        ...this.getComments,
        ...this.getFriendPosts.reduce((acc, friendPost) => {
          acc[friendPost.id] = friendPost.comments || [];
          return acc;
        }, {}),
      };
    },

    posts() {
    return this.getPosts.map((post) => ({
      ...post,
      user: this.getUserById(post.users_id),
      comments: this.getComments[post.id] || [], 
    }));
  },
},


  methods: {
    submitFormWithIcon(friendPost) {
      this.createComment(friendPost, true);
    },
    createComment(post, isFriendPost = false) {
    const commentText = this.commentData[post.id];

    if (!commentText) {
      console.error('Comment cannot be empty');
      return;
    }

    const comment = { body: commentText }; 

    axiosClient
      .post(`/posts/${post.id}/comments`, comment, {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      .then((response) => {
        this.$store.commit('addComment', { postId: post.id, comment: response.data });
        //console.log('Comment created:', response.data);

        this.commentData[post.id] = '';
        this.$store.dispatch('fetchAllComments', post.id)
          .then(() => {
          //  console.log('Updated comments fetched for post with ID', post.id);
          })
          .catch((error) => {
            //console.error('Error fetching updated comments for post with ID', post.id, ':', error);
          }); 
      })
      .catch((error) => {
        //console.error('Error creating a comment', error);
      });
  },


    
    createPost() {
  console.log('Creating post');
  console.log('Comment:', this.comment);
  console.log('Image:', this.image);

  if (!this.user.token) {
    console.error('User not authenticated. Please log in.');
    return;
  }

  const formData = new FormData();
      formData.append('comment', this.comment);

      if (this.image) {
        formData.append('image', this.image);
      }

  axiosClient
    .post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    .then((response) => {
      this.comment = '';
      this.image = null;

      const createdPost = response.data;

      if (createdPost.image) {
        const imageUrl = URL.createObjectURL(this.image);
        this.$set(createdPost, 'displayImage', imageUrl);
      }
      this.$store.commit('addPost', createdPost);
      //console.log('Post created:', createdPost);     
      this.$store.dispatch('fetchPosts');         


    })
    .catch((error) => {
      //console.error('Error creating post:', error);
    });
},

  handleImageLoad(event) {
    URL.revokeObjectURL(event.target.src);
  },

    onImageChange(event) {
      this.image = event.target.files[0];
      this.imageSelected = true;

    },

    

    deletePost(post) {
      axiosClient
        .delete(`/posts/${post.id}`)
        .then(() => {
        //console.log('Post deleted');
        this.$store.commit('removePost', post.id); 
      })
      .catch(error => {
        //console.error('Error deleting post:', error);
      });
    },
  },
};
</script>

<style>
  @media (max-width: 768px) {
    .container {
      padding-top: 1em;
      left: 10em;
    }

    .input-grouppost {
      margin-left: 0;
      margin-top: 10px;
    }

    .buttoncommented {
      margin-top: -2.5em;
      margin-left: 40%;
    }

    .textareas textarea {
      width: 100%;
      margin-right: 0;
    }

    .buttoncommentedx {
      margin-left: 0 !important;
    }

    .comment-content {
      margin-left: 0;
      margin-top: 10px;
    }

    .comment-item {
      flex-direction: column;
    }

    .user-image {
      margin-left: 0;
    }

    .user-name {
      margin-right: 0;
    }

    .container {
      margin-top: 10px;
    }

    .create-post-box {
      width: 100%;
    }

    .input-groupcomment {
      padding-left: 0;
      padding-top: 20px;
    }

    .post-list {
      width: 100%;
      padding: 10px;
    }

    .post-item {
      align-items: center;
      margin: 10px;
    }

    .post-item::after {
      width: 100%;
    }

    .post-comment {
      margin: 10px;
    }

    .post-image-container img {
      width: 100%;
      max-width: 100%;
      margin-left: 0;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .post-commentfriend {
      margin-left: 0;
    }

    .buttoncommente {
      margin-left: 0;
    }

    .input-groupimage {
      padding-left: 0;
    }

    .input-groupimage input[type="file"] {
      margin-top: 10px;
    }
  }
.container {
  padding-top: 3em;
}
.user-info {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.comment-list {
  list-style: none;
  padding: 0;
}
.input-grouppost {
  margin-left: 30em;
}

.buttoncommented {
  position: absolute;
  color: black;
  margin-top: -3.5em;

}
.textareas {
  margin-left: -1em;
}
.textareas textarea  {
  margin-right: 4em;
}

.buttoncommentedx {
  background-color: transparent !important ;
  margin-left: 42em !important;

}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.buttoncomment {
  position: absolute;
  bottom: 7em;
  color: black;
  margin-left: 45em !important;
}
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-weight: bold;
}

.comment-item-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.comment-content-container {
  flex: 1; 
}
.comment-content {
  margin-left: -36em;
  margin-top: 45px;
}
.comment-body {
  margin-bottom: -4em;
}

.comment-form {
  margin-top: 20px;
}

.comment-form textarea {
  margin-left: 5em;
  width: 40em;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.comment-form button {
  margin-top: 2px;
  margin-left: -20px;
  background-color: transparent;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-form button:hover {
  background-color: transparent ;
}
.comment-content p {
  margin-top: 17px;
}
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 60px;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  margin-right: 33em; 

}
.container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.create-post-box {
  width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-groupcomment {
  padding-left: 55px;
  padding-top: 20px;
}

.input-groupcomment textarea{
  width: 100%;
  border: 0;
  outline: 0;
  border-bottom: 1px solid #ccc;
  background: transparent;
  resize: none;
}
.comments {
  color: black;
}
.post-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 6px;
  margin: 20px 0;
  width: 600px;
  position: relative;
  border-bottom: 1px solid #efefef;

}


.post-list > ul > li:not(:last-child) {
  padding-bottom: 40px;

}
.post-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 

  align-items: center;
  margin: 10px;
  position: relative;
  padding-bottom: 10px;
}

 .post-item::after {
  content: "";
  display: block;
  width: 150%;
  height: 30px;
  background-color: #efefef;
  margin-top: 10px;
} 

.post-comment {
  color: #050505;
 margin: 15px 3em;
 font-size: 16px;
 line-height: 1.5;

 
}

.post-image-container {
  display: flex;
  max-width: 100;
  max-height: 100%;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.post-image-container img {
  width: 400px;
  height: auto;
  max-width: 95%;
  max-height: 100%;
  object-fit: contain;
  margin-left: 6em;
  margin-top: 10px;
  margin-bottom: 10px;
}

.post-commentfriend {
  margin-left: 5em;
}
button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.buttoncommente:hover {
  background-color: transparent;
}
button:hover {
  background-color: #0069d9;
}

button:focus {
  outline: none;
}
.input-groupimage {
  padding-left: 4em;
  margin-top: 10px;
  font-size: 13px;


}
.input-groupimage input[type="file"] {
  position: absolute;
  left: -9999px;
  visibility: hidden;
}

.camera-icon {
  cursor: pointer;
  width: 20px;
  margin-right: 10px;
}

</style>