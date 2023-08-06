<template>
      <div class="image-container">
        <img src="/sc.webp" alt="social media" class="smedia" />
      </div>
      <form class="form" @submit="login">
        <div class="Title">
          <h1>NewBook</h1>
        </div>
        <div class="subtitle">
          <h2>Log in to NewBook</h2>
        </div>
        <label class="email">
          <span class="regis">Email:</span>
          
          <input type="email" class="email" v-model="user.email" />
        </label>
        <label class="password">
          <span class="regis">Password:</span>
          <input type="password" class="password" v-model="user.password" />
        </label>
        <button type="submit">Log in</button>
        <div class="littlething"></div>
            <h4 class="regis">Do not have an accout ? <router-link to="/register"><span class="register">Register here</span></router-link></h4>
      </form>
  </template>
  <script setup>
  import {useRouter} from 'vue-router';
  import store from "../store";

  const router= useRouter();
  const user = {
    email: '',
    password: ''
  }
  function login(ev) {
    ev.preventDefault();
    store.dispatch('login', user)
      .then(() => {
        router.push({
          name: 'Homepage'
        })
      })
  }
    
 </script>
  <style>
  

  .container-form {
    display: flex;
    justify-content: center;
    align-items: center; 
    height: 100vh;
    overflow: hidden; 
  }
  .image-container {
    width: 50%;
    height: auto;
    object-fit: cover;
    overflow: hidden;
  }
  .smedia {
    width: 100%;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f2f2f2;
    overflow: hidden;
  }
  .Title h1{
    text-align: center;
    margin-bottom: 20px;
    color: black;
  }


  .email, .password {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  .register {
    cursor: pointer;
    color: blue;
    font-weight: 100vh;
  }
  

  input[type="email"],
  input[type="password"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  button[type="submit"] {
    padding: 10px 20px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background-color: #45a049;
  }

  </style>
  