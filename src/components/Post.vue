<template>
  <div class="post" @click="redirectTo(`/${handle}/${post._id}`)">
    <img :src="post.media" :alt="post.text" />
    <div class="post-metadata">
      <div class="likes">
        <font-awesome-icon class="i" icon="heart" />123
      </div>
      <div class="comments">
        <font-awesome-icon class="i" icon="comment-alt" />120
      </div>
    </div>
    <p class="comment">{{post.text}}</p>
    <a href="#">View comments</a>
  </div>
</template>

<script>
import { redirectTo } from "../ui-utils/routing";
export default {
  name: "Post",
  props: ["post", "handle"],
  created: function() {
    console.log(this.handle);
  },
  methods: {
    redirectTo
  }
};
</script>

<style>
</style>