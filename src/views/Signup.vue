<template>
  <div class="sign-up-container">
    <div class="signup-section">
      <form @submit.prevent="registerNewUser" autocomplete="off" novalidate>
        <h1>Create Account</h1>
        <p>Please enter your details below:</p>
        <div class="input-group">
          <div>
            <h5>Handle</h5>
            <input
              type="text"
              class="input"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              v-model="handle"
              required
            />
          </div>
        </div>
        <div class="input-group">
          <div>
            <h5>Full Name</h5>
            <input
              type="text"
              class="input"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              v-model="name"
              required
            />
          </div>
        </div>
        <div class="input-group">
          <div>
            <h5>Email Address</h5>
            <input
              type="text"
              class="input"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              v-model="email"
              required
            />
          </div>
        </div>
        <div class="input-group">
          <div>
            <h5>Password</h5>
            <input
              type="password"
              class="input"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              v-model="password"
              required
            />
          </div>
        </div>
        <div class="input-group textarea-group">
          <div>
            <h5>Motto</h5>
            <textarea class="textarea" v-on:focus="onFocus" v-model="motto" required />
          </div>
        </div>
        <div class="input-group-file-upload">
          <div>
            <h5>Avatar</h5>
            <input type="file" class="file-upload" @change="onFileChange" />
          </div>
        </div>
        <input type="submit" class="btn secondary" value="Register" />
        <div class="error" v-if="errors.length">
          <ul>
            <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </div>
      </form>
    </div>
    <div class="image"></div>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import { validEmail } from "../ui-utils/validate";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Signup",
  components: {},
  created() {
    console.log("Created");
  },
  data() {
    return {
      errors: [],
      isFormValid: false,
      name: "",
      email: "",
      password: "",
      handle: "",
      motto: "",
      avatarFile: ""
    };
  },
  computed: {
    ...mapGetters(["auth"])
  },
  methods: {
    ...mapActions([
      "registerUser",
      "loadAuthenticatedUser",
      "uploadProfileImage"
    ]),
    onFocus,
    onBlur,
    redirectTo,
    validEmail,
    onFileChange: function(event) {
      this.avatarFile = event.target.files[0];
    },
    registerNewUser: async function(event) {
      //TODO: Add loading progress image....
      event.preventDefault();
      this.checkForm();
      if (!this.isFormValid) {
        return;
      }
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password,
        app_name: "grateful4",
        handle: `@${this.handle}`,
        motto: this.motto
      };
      try {
        await this.registerUser(newUser);
        await this.loadAuthenticatedUser(this.auth.token);
        await this.uploadProfileImage({
          token: this.auth.token,
          avatar: this.avatarFile,
          userid: this.auth.user._id
        });
        this.redirectTo("/");
      } catch (err) {
        //console.log(err);
        if (err.response) {
          console.log(err);
          this.errors.push(err.response.data.errors[0].msg);
        } else {
          console.log(err);
        }
      }
    },
    checkForm: function() {
      this.errors = [];
      let isNameValid = !!this.name;
      let isPasswordValid = !!this.password;
      let isEmailValid = this.validEmail(this.email);
      let isAvatarValid = !!this.avatarFile;
      if (!isNameValid) {
        this.errors.push("Please enter Username");
      }
      if (!isPasswordValid) {
        this.errors.push("Please enter Password");
      }
      if (!isEmailValid) {
        this.errors.push("Please enter valid Email Address");
      }
      if (!isAvatarValid) {
        this.errors.push("Please select an image for your Avatar");
      }
      this.isFormValid =
        isEmailValid && isNameValid && isPasswordValid && isAvatarValid;
    }
  }
};
</script>

<style scoped>
@import "../assets/css/signup.css";
</style>