<template>
  <div class="container">
    <div class="image"></div>
    <div class="login-section">
      <form action="#">
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
            <h5>Username</h5>
            <input type="text" class="input" id="username" v-on:focus="onFocus" v-on:blur="onBlur" />
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
              id="password"
              v-on:focus="onFocus"
              v-on:blur="onBlur"
            />
          </div>
        </div>
        <a href="#">Forgot Password?</a>
        <input type="submit" class="btn primary" value="Login" onclick="redirect('user-home.html')" />
        <input type="submit" class="btn secondary" value="Signup" onclick="redirect('signup.html')" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  methods: {
    onFocus: function(event) {
      let parentElement = event.target.parentNode.parentNode;
      parentElement.classList.add("active");
    },

    onBlur: function(event) {
      let parent = event.target.parentNode.parentNode;
      if (event.target.value === "") {
        parent.classList.remove("active");
      }
    }
  }
};
</script>

<style>
@import "../assets/css/main.css";
@import "../assets/css/index.css";
</style>