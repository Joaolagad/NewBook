<template>
  <div class="container-form">
    <div class="image-container">
      <img src="/socialmedia.jpg" alt="social media" class="social-media" />
    </div>
    
    <form class="form" @submit="register">
          <div class="Title">
            <h1>NewBook</h1>
          </div>
          <div class="subtitle">
            <h2>Register in to NewBook</h2>
          </div>
          <label class="email">
            <span class="regis">Email:</span>
            <input type="email" class="email" v-model="user.email" />
          </label>
          <label class="name">
            <span class="regis">Username:</span>
            <input type="text" class="name" v-model="user.name"/>
          </label>
          <label class="password">
            <span class="regis">Password:</span>
            <input type="password" class="password" v-model="user.password" />
          </label>
          <label class="password_confirmation">
            <span class="regis">Confirm Password:</span>
            <input type="password" class="password_confirmation" v-model="user.password_confirmation" />
          </label>
          <button type="register"><router-link to="/details" class="registered">Continue</router-link></button>


          <div class="littlething"></div>
          <h4 class="regis">Already have an account? <router-link to="/login"><span class="log-in">Log in</span></router-link></h4>
        </form>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import store from '../store';
function register(ev) {
    ev.preventDefault();
    store
      .dispatch('register', user)
      .then((res) => {
        router.push({
          name: 'Details'
        })
      })
  }

  const router = useRouter();
const user = {
name: '',
email: '',
password: '',
password_confirmation: ''
};


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Yanone+Kaffeesatz:wght@300&display=swap');
.registered {
  text-decoration: none;
  color: white;
}

.social-media {
  width: 100%;
  height: auto;
  object-fit: cover;

}
.container-form {
background-color: white;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;

}
.regis {
  font-family: 'Yanone Kaffeesatz', sans-serif;
  font-weight: 1000 ;

}
.form {
display: flex;
flex-direction: column;
align-items: center;
padding: 20em 20em 20em 23em !important;
margin-right: -10em;
border: none !important;

}

.subtitle h2 {
  font-family: 'Yanone Kaffeesatz', sans-serif;
  
}
.Title h1 {
text-align: center;
margin-bottom: 40px !important;
font-family: 'Pacifico', cursive;
}

.email,
.form .name input ,
.password,
.password_confirmation {
display: flex;
flex-direction: column;
margin-bottom: 10px;
}

.log-in {
cursor: pointer;
color: blue;
font-weight: bold;
}

input[type="email"],
input[type="password"],
.form .name input {
background-color: #fff;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5em !important;
width: 100%; 
box-sizing: border-box;
}

button[type="register"] {
padding: 10px 20px;
background-color: #4caf50;
border: none;
border-radius: 20px; 
cursor: pointer;
}

button[type="register"]:hover {
background-color: #45a049;
}
</style>