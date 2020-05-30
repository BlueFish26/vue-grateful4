<template>
  <div class="post">
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
export default {
  name: "Post",
  props: ["post"]
};
</script>

<style scoped>
</style>