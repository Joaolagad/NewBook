import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faCamera, faHome, faPaperPlane, faSearch, faUsers, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import axiosClient from './axios'
library.add(faCamera, faHome, faPaperPlane, faSearch, faUsers, faChevronDown);
axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(store)
    .mount('#app')
//first@gmail.com
//firstuser