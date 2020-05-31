<template>
  <div class="single-post-container">
    <section class="header">
      <div class="brand">
        <h3>Grateful4</h3>
      </div>
      <div class="nav-buttons">
        <ul>
          <li>
            <a class="nav-button active" href="#">Log In</a>
          </li>
          <li>
            <a class="nav-button" href="#">Sign Up</a>
          </li>
        </ul>
      </div>
    </section>

    <section class="post-section">
      <div class="post">
        <div class="user-info">
          <div class="avatar">
            <img :src="auth.user.avatar" alt />
          </div>
          <div class="username">@{{handle}}</div>
        </div>

        <img v-if="post" :src="post.media" alt />
        <div class="post-metadata">
          <div class="likes">
            <font-awesome-icon class="i" icon="heart" />123
          </div>
          <div class="comments">
            <font-awesome-icon class="i" icon="comment-alt" />120
          </div>
        </div>
        <p class="comment">{{post.text}}</p>
      </div>
    </section>
    <section class="add-comment">
      <div class="user-info">
        <div class="avatar">
          <img src="images/ac_sousuke_3_lanjut_shadowed.jpg" alt />
        </div>
        <div class="username">@bluefish</div>
      </div>
      <div class="input-group">
        <div>
          <h5>Comment</h5>
          <input type="text" class="input" />
        </div>
      </div>
      <button class="btn primary">Comment</button>
    </section>
    <section class="comments-section">
      <div class="comment">
        <div class="user-info">
          <div class="avatar">
            <img src="images/ac_sousuke_3_lanjut_shadowed.jpg" alt />
          </div>
          <div class="username">@bluefish</div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          sed alias porro repudiandae deleniti doloribus?
        </p>
      </div>
      <div class="comment">
        <div class="user-info">
          <div class="avatar">
            <img src="images/ac_sousuke_3_lanjut_shadowed.jpg" alt />
          </div>
          <div class="username">@bluefish</div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          sed alias porro repudiandae deleniti doloribus?
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SinglePost",
  components: {},
  data() {
    return {
      loading: false,
      handle: ""
    };
  },
  created: async function() {
    const token = localStorage.getItem("token");
    await this.loadAuthenticatedUser(token);
    console.log(this.$route.params);
    this.handle = this.$route.params.handle;
    let postid = this.$route.params.postid;
    await this.loadPostById(postid);
    console.log(this.post);
  },
  computed: {
    ...mapGetters(["auth", "post"])
  },
  methods: {
    ...mapActions(["loadAuthenticatedUser", "loadPostById"])
  }
};
</script>

<style scoped>
</style>