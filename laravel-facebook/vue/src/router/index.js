import {createRouter, createWebHistory} from 'vue-router';
import Join from '../views/Join.vue';
import Register from '../components/Register.vue';
import Homepage from '../views/Homepage.vue';
import store from '../store';
import UserProfile from '../views/UserProfile.vue';
import Details from '../components/Details.vue';
import AuthLayout from '../components/AuthLayout.vue';
import SearchResults from '../components/SearchResults.vue';
import PublicProfile from '../views/PublicProfile.vue';
const routes = [
{
    path: '/',
    name: 'Homepage',
    component: Homepage,
    meta: {requiresAuth: true},
},
{
    path: '/details',
    name: 'Details',
    component: Details,
    meta: {requiresAuth: true},

},
{
  path: '/user',
  name: 'UserProfile',
  component: UserProfile,
  meta: {requiresAuth: true},
},

{
  path: '/users/:userId',
  name: 'PublicProfile',
  component: PublicProfile,
  meta: { requiresAuth: true },
},


{
    path: '/search-results',
    name: 'SearchResults',
    component: SearchResults,
    meta: { requiresAuth: true }
},
{
    path: '/auth',
    redirect: '/login',
    name: 'Auth',
    component: AuthLayout,
    meta: {isGuest: true},
    children: [
        {
          path: '/register',
          name: 'Register',
          component: Register
            
        },
        {
          path: '/login',
          name: 'Login',
          component: Join
        },
    ]
}


];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth && !store.state.user.token) {
    next({name: 'Login'})
  } else if (store.state.user.token && (to.meta.isGuest)) {
    next({name: 'Homepage'});
  } else {
    next();
  }
})

export default router;