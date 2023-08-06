import { createStore } from 'vuex';
import axiosClient from '../axios';

const storedToken = sessionStorage.getItem('TOKEN');

const store = createStore({
  state: {
    user: {
      data: {},
      token: storedToken || null,
    },
    posts: [],
    comments: [],
    searchResults: [],
    friendPosts: [],

    users: [],  
    friendRequests: {
      pending: [],
      accepted: [],
    },

  },
  getters: {
    getFriendRequests(state) {
      return Object.values(state.friendRequests).flat();
    },
    getLoggedInUser: state => state.user,
    getPosts: (state) => {
      return state.posts.map(post => {
        const user = state.users.find(user => user.id === post.users_id);
        return {
          ...post,
          user: user || null, 
        };
      });
    },
    getComments: state => state.comments,

    getSearchResults(state) {
      return state.searchResults;
    },  
    getUserById: (state) => (userId) => {
      return state.users.find((user) => String(user.id) === String(userId));
    },
    getFriendPosts: (state) => {
      return state.friendPosts.map((post) => ({
        ...post,
        user: state.users.find(user => user.id === post.users_id) || null,
        comments: state.comments[post.id] || [],
      }));
    },
    
    
  },
  actions: {
    
    async fetchFriendPosts({ commit, state }) {
      try {
        //console.log('Fetching friend posts...');
        const response = await axiosClient.get('posts/friends/posts');
        //console.log('Response from server:', response.data);

        const friendPosts = response.data;
  
        commit('SET_FRIEND_POSTS', friendPosts);
        //console.log('sucess', friendPosts) 
        return friendPosts;
      } catch (error) {
        //console.error('Error fetching friend posts:', error);
        throw error;
      }
    },
    
    async fetchFriendRequests({ commit }) {
      try {
        //console.log('Fetching friend requests...');
        const response = await axiosClient.get('/friend-requests');
        const friendRequests = response.data;
        //console.log('Friend Requests:', friendRequests);
  
        commit('SET_FRIEND_REQUESTS', friendRequests);
        return friendRequests; 
      } catch (error) {
        //console.error('Error fetching friend requests:', error);
        throw error;
      }
    },
  
    async acceptFriendRequest({ commit }, { userId, loggedInUserId }) {
      try {
        const response = await axiosClient.post(`/friends/accept/${userId}`);
        //console.log('Response:', response.data.message);

        commit('ACCEPT_FRIEND_REQUEST', userId);
      } catch (error) {
        //console.error('Error accepting friend request:', error);
      }
    },
    rejectFriendRequest({ commit }, userId) {
      return axiosClient
        .delete(`/friends/reject/${userId}`)
        .then((response) => {
          //console.log('Friend request rejected:', response);
          commit('REJECT_FRIEND_REQUEST', userId);
          commit('SAVE_FRIEND_REQUESTS'); 

        })
        .catch((error) => {
          //console.error('Error rejecting friend request:', error);
          throw error;
        });
    },
    
    sendFriendRequest({commit}, userId) {
      return axiosClient.post(`/friends/request/${userId}`)
        .then((response) => {
          //console.log('friend request sent:', response);
          
        })
        .catch((error) => {
          //console.error('error sending friend request', error);
          throw error
        });
    },
    fetchUserDetails({ commit }, userId) {
      return axiosClient.get(`/users/${userId}`)
        .then((response) => {
          const userDetails = response.data;
          commit('SET_USERS', [userDetails]); 
          //console.log(userDetails);
          return userDetails;
        })
        .catch((error) => {
          //console.error('Error fetching user details:', error);
          throw error;
        });

    },
    
    
    
         
      register({ commit }, user) {
        return axiosClient.post('/register', user)
          .then((response) => {
            commit('setUser', response.data);
      
            return axiosClient.get('/user')
              .then(({ data }) => {
                commit('setUser', {
                  ...data,
                  token: response.data.token
                });
                return data;
              });
          });
      },
      
          
      saveDetails({ commit, state }, user) {
        const formData = new FormData();
        formData.append('description', user.description);
        formData.append('hobbies', user.hobbies);
        formData.append('favorite_things', user.favoriteThings);
        formData.append('profile_picture', user.profile_picture);
    
        return axiosClient
            .post('/details', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${state.user.token}`,
                },
            })
            .then(({ data }) => {
                commit('setUser', data);
                return data;
            })
            .catch((error) => {
            //    console.error('An error occurred while saving details:', error);
                throw error;
            });
    },
    
    
      
      login({ commit }, user) {
        return axiosClient.post('/login', user)
          .then(({ data }) => {
            commit('setUser', data);
            return data;
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              //console.error('Invalid credentials. Please check your email and password.');
           } else {
              //console.error('An error occurred during login:', error);
            }
            throw error;
          });
      },
      
        logout({commit}) {
            return axiosClient.post('/logout')
                .then(response => {
                    commit('logout')
                    return response;
                })
        },
        async fetchAllComments({ commit }, postId) {
          try {
            if (!this.state.user.token) {
              //console.log('User not authenticated');
              return Promise.reject('User not authenticated');
            }
            //console.log('Fetching comments for post with ID:', postId); // Add this line

            const response = await axiosClient.get(`/posts/${postId}/comments`);
            const comments = response.data;
      
            commit('SET_COMMENTS_FOR_POST', { postId, comments });
      
            //console.log('Fetched comments for post with ID', postId, ':', comments);

            return comments;
          } catch (error) {
            //console.error('Error fetching comments:', error);
            throw error;
          }
        },
      
       async createComment({ commit, state }, { postId, commentText }) {
          if (!commentText) {
            //console.error('Comment cannot be empty');
            return;
          }

          const comment = { body: commentText }; 

          try {
            const response = await axiosClient.post(`/posts/${postId}/comments`, comment, {
              headers: {
                Authorization: `Bearer ${state.user.token}`,
              },
            });

            commit('addComment', { postId, comment: response.data });
            //console.log('Comment created:', response.data);
          } catch (error) {
            //console.error('Error creating a comment', error);
          }
        },
        
        createPost() {
          //console.log('Creating post');
          //console.log('Comment:', this.comment);
          //console.log('Image:', this.image);
        
          if (!this.user.token) {
            //console.error('User not authenticated. Please log in.');
            return;
          }
        
          const formData = new FormData();
          formData.append('comment', this.comment);
          formData.append('image', this.image);
        
          axiosClient
            .post('/posts', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              this.comment = '';
              this.image = null;
        
              const createdPost = response.data;
              if (createdPost.image) {
                this.$set(createdPost, 'displayImage', URL.createObjectURL(this.image));
              }
              this.$store.commit('addPost', createdPost);
              //console.log('Post created:', createdPost);
            })
            .catch((error) => {
              //console.error('Error creating post:', error);
            });
        },
        

        fetchUser({ commit, state }) {
          if (!state.user.token) {
            //console.error('User not authenticated. Please log in.');
            return Promise.reject('User not authenticated. Please log in.'); 
          }
    
          return axiosClient
            .get('/user')
            .then(({ data }) => {
              commit('setUser', { user: data, token: state.user.token });
              return data;
            })
            .catch((error) => {
              console.error('Error fetching user:', error);
              throw error;
            });
        },
        setSearchResults({ commit }, results) {
          commit('SET_SEARCH_RESULTS', results);
        },  
        
          deletePost({commit}, postId) {
            return axiosClient.delete(`posts/${postId}`)
              .then(response => {
                commit('removePost', postId);
                return response;
              })

              .catch(error => {
              //  console.error('error', error);
                throw error;
              });
          },
          
          
          async fetchPosts({ commit, state }) {
            if (!state.user.token || !state.user.data.id) {
              //console.log('User not authenticated or user data not available');
              return Promise.reject('User not authenticated or user data not available');
            }
            return axiosClient
              .get('/posts')
              .then(({ data }) => {
                const loggedInUserId = state.user.data.id; 
                const filteredPosts = data.filter((post) => post.users_id === loggedInUserId);
                  
                
                commit('setPosts', filteredPosts);
                return filteredPosts;
              })
              .catch((error) => {
                //console.error('Error fetching posts:', error);
                throw error;
              });
          },
    },
    mutations: {

      addComment(state, { postId, comment }) {
        const postIndex = state.posts.findIndex(post => post.id === postId);
    
        if (postIndex !== -1) {
          if (!state.posts[postIndex].comments) {
            state.posts[postIndex].comments = [];
          }
    
          state.posts[postIndex].comments.push(comment);
        }
      },
      ACCEPT_FRIEND_REQUEST(state, userId) {
        const acceptedFriendRequestIndex = state.friendRequests.pending.findIndex(
          request => request.user_one.id === userId
        );
    
        if (acceptedFriendRequestIndex !== -1) {
          const acceptedFriendRequest = state.friendRequests.pending.splice(
            acceptedFriendRequestIndex,
            1
          )[0];
          acceptedFriendRequest.status = '1';
          state.friendRequests.accepted.push(acceptedFriendRequest);
          sessionStorage.setItem(
            'FRIEND_REQUESTS',
            JSON.stringify(state.friendRequests)
          );
        }
      },
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
       setUser: (state, userData) => {
        state.user.token = userData.token;
        state.user.data = userData.user;
        sessionStorage.setItem('TOKEN', userData.token);
        //console.log('User data:', state.user.data);
    },
  
    SET_USERS(state, users) {
      //console.log('Received users:', users);
      state.users = users;
    },
    SET_FRIEND_REQUESTS(state, friendRequests) {
      state.friendRequests = friendRequests;
      sessionStorage.setItem('FRIEND_REQUESTS', JSON.stringify(friendRequests));
    },
  
    SET_FRIEND_POSTS(state, friendPosts) {
      //console.log('Friend posts from mutation:', friendPosts); 

      state.friendPosts = friendPosts;
  
    
    },    
    
    REJECT_FRIEND_REQUEST(state, userId) {
      state.friendRequests = state.friendRequests.filter(request => request.user_one.id !== userId);
      sessionStorage.setItem('FRIEND_REQUESTS', JSON.stringify(state.friendRequests));
    },

    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    SET_COMMENTS_FOR_POST(state, { postId, comments }) {
      state.comments = {
        ...state.comments,
        [postId]: comments,
      };
        },
        
        setPosts: (state, postsData) => {
            state.posts = postsData;
        },
        addPost: (state, post) => {
          if (post.image) {
            post.image = post.image.data;
          }
          state.posts.unshift(post);
        },  
        
        removePost: (state, postId) => {
          state.posts = state.posts.filter(post => post.id !== postId);
        },
        SAVE_FRIEND_REQUESTS(state) {
          sessionStorage.setItem('FRIEND_REQUESTS', JSON.stringify(state.friendRequests));
        },
    },
        modules: {}
    });
    
    if (storedToken) {
      store.dispatch('fetchUser')
        .then(() => {
          store.dispatch('fetchFriendRequests')
            .catch((error) => {
        //      console.error('Error fetching friend requests:', error);
            });
        })
        .catch((error) => {
          //console.error('Error fetching user:', error);
          store.commit('logout');
        });
    }
    



export default store