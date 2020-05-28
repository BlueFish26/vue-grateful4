<template>
  <div class="user-home-container">
    <section class="header">
      <div class="brand">
        <h3>Grateful4</h3>
      </div>
      <div class="nav-buttons">
        <ul>
          <li>
            <span
              v-if="!auth.isAuthenticated"
              class="nav-button active"
              @click="redirectTo('/')"
            >Log In</span>
            <span v-if="auth.isAuthenticated" class="nav-button logout" @click="logout">Log out</span>
          </li>
          <li v-if="!auth.isAuthenticated">
            <span class="nav-button">Sign Up</span>
          </li>
        </ul>
      </div>
    </section>
    <section class="profile">
      <div class="avatar">
        <img src="@/assets/images/ac_sousuke_3_lanjut_shadowed.jpg" alt />
      </div>
      <div class="follow-button">
        <div class="name">
          <span class="fullname">{{name}}</span>
          <span class="handle">{{auth.user.handle}}</span>
        </div>
        <button>Follow</button>
      </div>
      <div class="user-numbers">
        <div>
          <span class="number">123</span>
          <span>friends</span>
        </div>
        <div>
          <span class="number">123</span>
          <span>followers</span>
        </div>
        <div>
          <span class="number">123</span>
          <span>following</span>
        </div>
      </div>
      <div class="user-notes">
        <div class="message">{{auth.user.motto}}</div>
      </div>
    </section>
    <section class="post-categories">
      <div class="category">
        <i class="far fa-file-video"></i>
      </div>
      <div class="category active">
        <i class="far fa-images"></i>
      </div>
      <div class="category">
        <i class="far fa-heart"></i>
      </div>
    </section>
    <section class="post-section">
      <div class="post">
        <img src="@/assets/images/2019-06-29 062.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">My girls...&#9829;&#9829;&#9829;</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/2019-06-29 068.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">Love of my life...&#9829;</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/2019-09-28 020.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">Galit cya?...&#9786;</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/2019-09-27 031.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">What a long tounge!!!...&#9786;</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/fruit-2109063_1280.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
          quae itaque molestiae voluptatem, quia veritatis omnis ea est
          accusantium. Sapiente..
        </p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/backboard-1866968_1280.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">Lorem, ipsum dolor.</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/racing-car-4425049_1280.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">Lorem, ipsum dolor.</p>
        <a href="#">View comments</a>
      </div>
      <div class="post">
        <img src="@/assets/images/sparrow-5138163_1920.jpg" alt />
        <div class="post-metadata">
          <div class="likes">
            <i class="far fa-heart"></i>123
          </div>
          <div class="comments">
            <i class="far fa-comment-alt"></i>123
          </div>
          <div class="views">
            <i class="far fa-eye"></i>123
          </div>
        </div>
        <p class="comment">Lorem, ipsum dolor.</p>
        <a href="#">View comments</a>
      </div>
    </section>
  </div>
</template>

<script>
import { redirectTo } from "../ui-utils/routing";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserHome",
  components: {},
  created: async function() {
    console.log("Created");
    let handle = this.$route.params.handle;
    console.log("params", this.$route.params);
    const token = localStorage.getItem("token");
    if (handle) {
      await this.loadRequestedUser(handle);
    } else {
      if (token) {
        await this.loadAuthenticatedUser(token);
      } else {
        this.redirectTo("/");
      }
    }
    if (token) {
      this.loadToken(token);
    }

    if (this.auth.user) {
      this.name = this.auth.user.name;
    } else {
      this.redirectTo("/");
    }
  },
  data() {
    return {
      name: ""
    };
  },
  computed: {
    ...mapGetters(["auth"])
  },
  methods: {
    ...mapActions([
      "loadAuthenticatedUser",
      "loadRequestedUser",
      "loadToken",
      "logoutUser"
    ]),
    redirectTo,
    logout: function() {
      if (this.auth.isAuthenticated) {
        this.logoutUser();
        this.redirectTo("/");
      }
    }
  }
};
</script>

<style scoped>
@import "../assets/css/user-home.css";
</style>