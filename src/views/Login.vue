<template>
  <div class="container">
    <div class="image"></div>
    <div class="login-section">
      <form @submit.prevent="loginUser" novalidate>
        <div class="brand">
          <h1>Grateful4</h1>
        </div>
        <h2>Login</h2>
        <p>Welcome, please login to start posting happy things.</p>
        <div class="input-group one">
          <div class="icon">
            <i class="fas fa-user"></i>
          </div>
          <div>
            <h5>Email</h5>
            <input
              type="text"
              class="input"
              v-model="email"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              required
            />
          </div>
        </div>
        <div class="input-group two">
          <div class="icon">
            <i class="fas fa-lock"></i>
          </div>
          <div>
            <h5>Password</h5>
            <input
              type="password"
              class="input"
              v-model="password"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
              required
            />
          </div>
        </div>
        <a href="#">Forgot Password?</a>
        <input type="submit" class="btn primary" value="Login" />
        <input
          type="submit"
          class="btn secondary"
          value="Signup"
          v-on:click="redirectTo('/signup')"
        />
        <div class="error" v-if="errors.length">
          <ul>
            <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import { validEmail } from "../ui-utils/validate";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Login",
  components: {},
  created: async function() {
    console.log("Created");
    const token = localStorage.getItem("token");
    if (!this.auth.isAuthenticated && !!token) {
      await this.loadAuthenticatedUser(token);
      let handle = this.auth.user.handle.replace("@", "");
      this.redirectTo(`/${handle}`);
    }
  },
  data() {
    return {
      isFormValid: false,
      errors: [],
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["auth"])
  },
  methods: {
    ...mapActions(["authenticateUser", "loadAuthenticatedUser"]),
    onFocus,
    onBlur,
    redirectTo,
    validEmail,
    loginUser: async function(e) {
      e.preventDefault();
      this.checkForm();
      if (!this.isFormValid) {
        return;
      }
      try {
        await this.authenticateUser({
          email: this.email,
          password: this.password
        });
        let token = this.auth.token;
        console.log(token);
        await this.loadAuthenticatedUser(token);
        console.log(this.auth);
        let handle = this.auth.user.handle.replace("@", "");
        this.redirectTo(`/${handle}`);
      } catch (err) {
        console.log(err);
        this.errors.push(err);
      }
    },
    checkForm: function() {
      this.errors = [];
      let isEmailValid = this.validEmail(this.email);
      let isPasswordValid = !!this.password;
      if (!isEmailValid) {
        this.errors.push("Please enter valid Email");
      }
      if (!isPasswordValid) {
        this.errors.push("Please enter Password");
      }
      this.isFormValid = isEmailValid && isPasswordValid;
    }
  }
};
</script>

<style scoped>
@import "../assets/css/index.css";
</style>