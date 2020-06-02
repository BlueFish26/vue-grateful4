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
    <div class="loading-progress" v-if="loading">
      <span>Loading...</span>
      <img class="loading-img" src="../assets/images/loading.gif" alt />
    </div>
    <section class="profile" v-if="!loading">
      <div class="avatar">
        <img :src="requestedUser.avatar" alt />
      </div>
      <div class="follow-button">
        <div class="name">
          <span class="fullname">{{ requestedUser.name }}</span>
          <span class="handle">{{ requestedUser.handle }}</span>
        </div>
        <input
          class="btn primary"
          v-if="
            auth.isAuthenticated &&
              auth.user.handle.replace('@', '').toLowerCase() !==
                requestedUser.handle.replace('@', '').toLowerCase()
          "
          value="Follow"
        />
      </div>
      <div class="user-numbers">
        <div>
          <span class="number">
            {{ requestedUser.numbers ? requestedUser.numbers.friends : 0 }}
          </span>
          <span>friends</span>
        </div>
        <div>
          <span class="number">
            {{ requestedUser.numbers ? requestedUser.numbers.followers : 0 }}
          </span>
          <span>followers</span>
        </div>
        <div>
          <span class="number">
            {{ requestedUser.numbers ? requestedUser.numbers.following : 0 }}
          </span>
          <span>following</span>
        </div>
      </div>
      <div class="user-notes">
        <div class="message">{{ requestedUser.motto }}</div>
      </div>
    </section>
    <section class="post-categories" v-if="!loading">
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
    <section class="post-section" v-if="!loading">
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
  data() {
    return {
      handle: '',
      authenticatedUser: {},
      requestedUser: {},
      loading: false,
    };
  },
  created: async function() {
    console.log('UserHome - Created');
    this.loading = true;
    this.handle = this.$route.params.handle;
    let handle = this.handle;

    const token = localStorage.getItem('token');
    if (token) {
      this.auth.isAuthenticated = true;
      await this.loadAuthenticatedUser(token);
    }
    if (token && this.auth.user) {
      if (this.auth.user.handle !== handle) {
        const user = await this.loadRequestedUser(handle);
        this.requestedUser = user;
        console.log(this.requestedUser);
      }
    }
    console.log(
      'handle',
      this.requestedUser.handle.replace('@', '').toLowerCase()
    );
    console.log(
      'auth.user.handle',
      this.auth.user.handle.replace('@', '').toLowerCase()
    );
    await this.loadPostsForUser({ token, handle });
    this.loading = false;
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
.btn.primary {
  width: 20%;
  text-align: center;
}
</style>
