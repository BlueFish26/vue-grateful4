<template>
  <div class="sign-up-container">
    <div class="signup-section">
      <form @submit.prevent="registerNewUser" autocomplete="off" novalidate>
        <h1>Create Account</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam,
          ab!s
        </p>
        <div class="input-group">
          <div>
            <h5>Username</h5>
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
        <div class="input-group-file-upload">
          <div>
            <h5>Avatar</h5>
            <input type="file" class="file-upload" />
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
    registerNewUser: async function(event) {
      event.preventDefault();
      this.checkForm();
      if (!this.isFormValid) {
        return;
      }
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password,
        app_name: "grateful4"
      };
      try {
        await this.registerUser(newUser);
        await this.loadUser(this.auth.token);
        //console.log(this.auth.token, this.auth.user);
        this.redirectTo("/");
      } catch (err) {
        //console.log(err);
        if (err.response) {
          this.errors.push(err.response.data.errors[0].msg);
        } else {
          console.log(err);
        }
      }
    },
    validEmail: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    checkForm: function() {
      this.errors = [];
      let isNameValid = !!this.name;
      let isPasswordValid = !!this.password;
      let isEmailValid = this.validEmail(this.email);
      if (!isNameValid) {
        this.errors.push("Please enter Username");
      }
      if (!isPasswordValid) {
        this.errors.push("Please enter Password");
      }
      if (!isEmailValid) {
        this.errors.push("Please enter valid Email Address");
      }
      this.isFormValid = isEmailValid && isNameValid && isPasswordValid;
    }
  }
};
</script>

<style scoped>
@import "../assets/css/signup.css";
</style>