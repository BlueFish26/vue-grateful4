<template>
  <div class="home">
    <textarea v-model="text" cols="30" rows="10"></textarea>
    <button v-on:click="evaluateText">Check</button>
  </div>
</template>

<script>
import {
  SentimentPredictor,
  HOSTED_URLS
} from "../tensorflow/prediction_utils.js";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      text: ""
    };
  },
  async created() {},
  methods: {
    evaluateText() {
      console.log(this.$tsSentiment.predict(this.text));
    }
  }
};
</script>
