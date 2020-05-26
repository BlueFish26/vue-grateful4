<template>
  <div class="container">
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
      </form>
    </div>
    <div class="image"></div>
  </div>
</template>

<script>
import { onFocus, onBlur } from "../ui-utils/inputs";
import { redirectTo } from "../ui-utils/routing";
import axios from "axios";
export default {
  name: "Signup",
  components: {},
  created() {
    console.log("Created");
  },
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  methods: {
    onFocus,
    onBlur,
    redirectTo,
    registerNewUser(event) {
      event.preventDefault();
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      console.log(newUser);
    }
  }
};
</script>

<style scoped>
@import "../assets/css/signup.css";
</style>