<template>
  <div class="container-forme">
       
    <form class="forms" @submit="saveDetails">
        <div class="Titles">
            <h1>TELL US MORE ABOUT YOU:</h1>
          </div>
          <label class="description">
            <span class="baca">Who are you ?:</span>
            <input type="text" class="description" v-model="details.description" />
          </label>
          <label class="hobbies">
            <span class="baca">What are your hobbies?:</span>
            <input type="text" class="hobbies" v-model="details.hobbies" />
          </label>
          <label class="Favorite-things">
            <span class="baca">What are your favorite things in the world?</span>
            <input type="text" class="Favorite-thing" v-model="details.favoriteThings" />
          </label>
          <label class="Profile-picture">
          <span class="baca">Choose a profile picture, so others can see your beauty:</span>
          <input type="file" class="Profile-picture" @change="onFileChange" />
          <img v-if="previewImage" :src="previewImage" alt="Profile Picture" />
        </label>
        
          <button type="submit">Continue</button>
        </form>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import store from '../store';
  
  function saveDetails(ev) {
    ev.preventDefault();
    store
    .dispatch('saveDetails', details)
    .then((res) => {
      router.push({ name: 'Homepage' });
    });
  }
  
  const details = {
      description: '',
      hobbies: '',
      favoriteThings: ''
    };
    
  const router = useRouter();
  let previewImage = '';

  function onFileChange(event) {
    const file = event.target.files[0];
    details.profile_picture = file;
    previewImage = URL.createObjectURL(file);
  }
 </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Bacasime+Antique&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,100&display=swap');

  .container-forme {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  
  }

 
  .baca {
    font-family: 'Bacasime Antique', serif;
  }
 

  .forms {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100em 100em 100em 100em;
    border-radius: 5px;
    background-color: #f2f2f2;

  }
  
  .Titles h1 {
    text-align: center;
    margin-bottom: 20px;
    color: black;
    font-family: 'Raleway', sans-serif;
  }
  
  .hobbies,
  .Favorite-things,
  .Profile-picture {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  input[type="text"] {
    background-color: #fff;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5em;
    width: 100%;
    box-sizing: border-box;
  }
  
  button[type="submit"] {
    padding: 10px 20px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 5em;
    cursor: pointer;
  }
  
  button[type="submit"]:hover {
    background-color: #45a049;
  }
  </style>
  