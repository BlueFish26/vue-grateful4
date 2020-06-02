<template>
  <div class="user-home-container">
    <section class="header">
      <div class="brand">
        <h3>Grateful4</h3>
      </div>
      <div class="nav-buttons">
        <ul>
          <li v-if="auth.isAuthenticated">
            <span class="nav-button active post" @click="redirectTo('/compose')"
              >Compose</span
            >
          </li>
          <li>
            <span
              v-if="!auth.isAuthenticated"
              class="nav-button active"
              @click="redirectTo('/')"
              >Log In</span
            >
            <span
              v-if="auth.isAuthenticated"
              class="nav-button active logout"
              @click="logout"
              >Log out</span
            >
          </li>
          <li v-if="!auth.isAuthenticated">
            <span class="nav-button active">Sign Up</span>
          </li>
        </ul>
      </div>
    </section>
    <section class="profile">
      <div class="avatar">
        <img :src="auth.user.avatar" alt />
      </div>
      <div class="follow-button">
        <div class="name">
          <span class="fullname">{{ auth.user.name }}</span>
          <span class="handle">{{ auth.user.handle }}</span>
        </div>
        <button v-if="auth.isAuthenticated">Follow</button>
      </div>
      <div class="user-numbers">
        <div>
          <span class="number">{{
            auth.user.numbers ? auth.user.numbers.friends : 0
          }}</span>
          <span>friends</span>
        </div>
        <div>
          <span class="number">{{
            auth.user.numbers ? auth.user.numbers.followers : 0
          }}</span>
          <span>followers</span>
        </div>
        <div>
          <span class="number">{{
            auth.user.numbers ? auth.user.numbers.following : 0
          }}</span>
          <span>following</span>
        </div>
      </div>
      <div class="user-notes">
        <div class="message">{{ auth.user.motto }}</div>
      </div>
    </section>
    <section class="post-categories">
      <div class="category">
        <font-awesome-icon class="i" icon="file-video" />
      </div>
      <div class="category active">
        <font-awesome-icon class="i" icon="images" />
      </div>
      <div class="category">
        <font-awesome-icon class="i" icon="heart" />
      </div>
    </section>
    <section class="post-section">
      <Post
        v-for="post in posts"
        :key="post._id"
        v-bind:post="post"
        v-bind:handle="handle"
      />
    </section>
  </div>
</template>

<script>
import { redirectTo } from '../ui-utils/routing';
import { mapActions, mapGetters } from 'vuex';
import Post from '../components/Post';

export default {
  name: 'UserHome',
  components: { Post },
  created: async function() {
    console.log('UserHome - Created');
    this.handle = this.$route.params.handle;
    let handle = this.handle;
    console.log('handle', handle);
    const token = localStorage.getItem('token');
    if (token) {
      this.auth.isAuthenticated = true;
      await this.loadAuthenticatedUser(token);
      this.authenticatedUser = this.auth.user;
    }
    if (token && this.auth.user) {
      if (this.auth.user.handle == handle) {
        await this.loadPostsForUser({ token, handle });
      } else {
        await this.loadRequestedUser(handle);
        this.requestedUser = this.auth.user;
      }
    }
    await this.loadPostsForUser({ token, handle });
  },
  data() {
    return {
      handle: '',
      authenticatedUser: {},
      requestedUser: {},
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['auth', 'posts']),
  },
  methods: {
    ...mapActions([
      'loadAuthenticatedUser',
      'loadRequestedUser',
      'loadToken',
      'logoutUser',
      'loadPostsForUser',
    ]),
    redirectTo,
    logout: function() {
      if (this.auth.isAuthenticated) {
        this.logoutUser();
        this.redirectTo('/');
      }
    },
  },
};
</script>

<style scoped>
@import '../assets/css/user-home.css';
</style>
