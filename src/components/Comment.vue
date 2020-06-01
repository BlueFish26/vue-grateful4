<template>
  <div class="comment">
    <div class="user-info">
      <div class="avatar">
        <img :src="comment.avatar" alt />
      </div>
      <div class="username">{{ comment.handle }}</div>
    </div>
    <p>
      {{ comment.text }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: ['comment'],
  created: function() {},
  methods: {},
};
</script>

<style></style>
