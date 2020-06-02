import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import UserHome from '../views/UserHome.vue';
import Compose from '../views/Compose.vue';
import SinglePost from '../views/SinglePost.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/Compose',
    name: 'Compose',
    component: Compose,
  },
  {
    path: '/:handle/:postid',
    name: 'SinglePost',
    component: SinglePost,
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:handle',
    name: 'UserHome',
    component: () => import('../views/UserHome.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
