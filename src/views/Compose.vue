<template>
  <div class="user-home-container">
    <section class="post-section">
      <div class="post">
        <div class="user-info">
          <div class="avatar">
            <img :src="auth.user.avatar" alt />
          </div>
          <div class="username">@bluefish</div>
          <div class="input-group-file-upload">
            <div>
              <h5>Media</h5>
              <input type="file" class="file-upload" @change="onMediaFileChange" />
            </div>
          </div>
        </div>
        <img v-if="mediaSrc" :src="mediaSrc" alt="preview" />
      </div>
    </section>
    <section class="add-comment">
      <div class="input-group textarea-group">
        <div>
          <h5>Comment</h5>
          <textarea class="textarea" v-on:focus="onFocus" v-on:blur="onBlur" required />
        </div>
      </div>
      <button class="btn primary">Post</button>
    </section>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Compose",
  components: {},
  data() {
    return {
      mediaFile: null,
      mediaSrc: ""
    };
  },
  created: function() {},
  computed: {
    ...mapGetters(["auth"])
  },
  methods: {
    onFocus,
    onBlur,
    redirectTo,
    onMediaFileChange: function(event) {
      this.mediaFile = event.target.files[0];
      console.log(this.mediaFile);
      let reader = new FileReader();
      reader.onload = e => {
        this.mediaSrc = e.target.result;
        console.log(this.mediaSrc);
      };
      reader.readAsDataURL(this.mediaFile);
    }
  }
};
</script>

<style scoped>
@import "../assets/css/user-home.css";
@import "../assets/css/single-post.css";
</style>