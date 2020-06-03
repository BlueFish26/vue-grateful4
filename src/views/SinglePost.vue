<template>
  <div class="single-post-container">
    <section class="header">
      <div class="brand">
        <h3>Grateful4</h3>
      </div>
      <div class="nav-buttons">
        <ul>
          <li>
            <span class="nav-button active" @click="redirectTo(`/${handle}`)"
              >Back</span
            >
          </li>
        </ul>
      </div>
    </section>
    <div class="loading-progress" v-if="loading">
      <span>Loading...</span>
      <img class="loading-img" src="../assets/images/loading.gif" alt />
    </div>
    <section class="post-section" v-if="!loading">
      <div class="post">
        <div class="user-info">
          <div class="avatar">
            <img :src="post.avatar" alt />
          </div>
          <div class="username">@{{ handle }}</div>
        </div>

        <img v-if="post" :src="post.media" alt />
        <div class="post-metadata">
          <div class="likes">
            <font-awesome-icon class="i" icon="heart" />{{ likes }}
          </div>
        </div>
        <p class="comment">{{ post.text }}</p>
      </div>
    </section>
    <section class="add-comment" v-if="showCommentBox">
      <div class="user-info">
        <div class="avatar">
          <img :src="auth.user.avatar" alt />
        </div>
        <div class="username">{{ auth.user.handle }}</div>
      </div>
      <div class="input-group">
        <div>
          <h5>Say something nice</h5>
          <input
            type="text"
            class="input"
            v-model="text"
            @focus="onFocus"
            @blur="onBlur"
          />
        </div>
      </div>
      <div class="buttons">
        <button class="btn primary" @click="insertComment">Comment</button>
        <font-awesome-icon class="i" icon="heart" @click="addLike" />
      </div>
    </section>
    <section class="comments-section" v-if="commentsLoaded">
      <Comment
        v-for="comment in comments"
        v-bind:comment="comment"
        :key="comment._id"
      />
    </section>
  </div>
</template>

<script>
import { onFocus, onBlur } from '../ui-utils/inputs';
import { redirectTo } from '../ui-utils/routing';
import { mapActions, mapGetters } from 'vuex';
import Comment from '../components/Comment';

export default {
  name: 'SinglePost',
  components: { Comment },
  data() {
    return {
      loading: false,
      handle: '',
      postid: '',
      showCommentBox: false,
      commentsLoaded: false,
      text: '',
      comments: [],
      likes: 0,
    };
  },
  created: async function() {
    this.loading = true;
    this.handle = this.$route.params.handle;
    this.postid = this.$route.params.postid;
    const token = localStorage.getItem('token');
    await this.loadAuthenticatedUser(token);
    await this.loadPostById(this.postid);
    await this.loadCommentsByPostId(this.postid);
    if (this.post.likes) {
      this.likes = this.post.likes.length;
    }
    this.comments = this.post.comments;
    if (this.post.comments && this.post.comments.length > 0) {
      this.commentsLoaded = true;
    }
    this.showCommentBox =
      `@${this.handle}`.toLowerCase() !== this.auth.user.handle.toLowerCase();
    this.loading = false;
  },
  computed: {
    ...mapGetters(['auth', 'post']),
  },
  methods: {
    ...mapActions([
      'loadAuthenticatedUser',
      'loadPostById',
      'loadCommentsByPostId',
      'addCommentToPost',
      'likePost',
    ]),
    redirectTo,
    onFocus,
    onBlur,
    insertComment: async function() {
      const token = localStorage.getItem('token');
      await this.addCommentToPost({
        token: token,
        postid: this.post._id,
        text: this.text,
      });
      this.comments = this.post.comments;
      console.log(this.comments);
      this.text = '';
    },
    addLike: async function() {
      const token = localStorage.getItem('token');
      await this.likePost({ token: token, postid: this.post._id });
      console.log('updated post', this.post);
      this.likes = this.post.likes.length;
    },
  },
};
</script>

<style scoped>
.add-comment .buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.add-comment .i {
  font-size: 2.5rem;
  color: var(--primary);
  cursor: pointer;
}
</style>
