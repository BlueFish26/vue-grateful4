<template>
  <div class="user-home-container">
    <section class="post-section">
      <div class="post">
        <div class="user-info">
          <div class="avatar">
            <img :src="auth.user.avatar" alt />
          </div>
          <div class="username">{{auth.user.handle}}</div>
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
          <textarea
            class="textarea"
            v-model="text"
            v-on:focus="onFocus"
            v-on:blur="onBlur"
            required
          />
        </div>
      </div>
      <button class="btn primary" @click="uploadNewPost">Post</button>
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
      mediaSrc: "",
      text: ""
    };
  },
  created: function() {},
  computed: {
    ...mapGetters(["auth", "post"])
  },
  methods: {
    ...mapActions(["createNewPost", "uploadImageToPost"]),
    onFocus,
    onBlur,
    redirectTo,
    onMediaFileChange: function(event) {
      this.mediaFile = event.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        this.mediaSrc = e.target.result;
      };
      reader.readAsDataURL(this.mediaFile);
    },
    uploadNewPost: async function() {
      console.log("Create a new post, checking comment....");
      await this.createNewPost({
        token: this.auth.token,
        post: { text: this.text }
      });
      console.log("Uploading image...");
      await this.uploadImageToPost({
        token: this.auth.token,
        media: this.mediaFile,
        postid: this.post._id
      });
      this.redirectTo(`/${this.auth.user.handle.replace("@", "")}`);
    }
  }
};
</script>

<style scoped>
@import "../assets/css/user-home.css";
@import "../assets/css/single-post.css";
</style>