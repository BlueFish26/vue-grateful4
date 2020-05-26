<template>
  <div class="sign-up-container">
    <div class="signup-section">
      <form @submit="registerNewUser">
        <h1>Create Account</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam,
          ab!
        </p>
        <div class="input-group">
          <div>
            <h5>Username</h5>
            <input type="text" class="input" v-on:focus="onFocus" v-on:blur="onBlur" v-model="name" />
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
            />
          </div>
        </div>
        <div class="input-group-file-upload">
          <div>
            <h5>Avatar</h5>
            <input type="file" class="file-upload" />
          </div>
        </div>
        <input type="submit" class="btn secondary" value="Register" />
        <div class="error">
          <p v-if="error.length" class="error">{{error}}</p>
        </div>
      </form>
    </div>
    <div class="image"></div>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Signup",
  components: {},
  created() {
    console.log("Created");
  },
  data() {
    return {
      error: "",
      name: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["auth"])
  },
  methods: {
    ...mapActions(["registerUser", "loadUser"]),
    onFocus,
    onBlur,
    redirectTo,
    async registerNewUser(event) {
      event.preventDefault();
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password,
        app_name: "grateful4"
      };
      try {
        await this.registerUser(newUser);
        await this.loadUser(this.auth.token);
        console.log(this.auth.token, this.auth.user);
      } catch (err) {
        console.log(err);
        if (err.response) {
          this.error = err.response.data.errors[0].msg;
        }
      }
    }
  }
};
</script>

<style scoped>
@import "../assets/css/signup.css";
</style>