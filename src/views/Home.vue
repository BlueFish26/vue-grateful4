<template>
  <div class="home">
    <textarea v-model="text" cols="30" rows="10"></textarea>
    <button v-on:click="evaluateText">Check</button>
    <br />
    <font-awesome-icon :icon="icon" v-if="icon" style="color: green; font-size: 5rem;" />
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
      text: "",
      icon: ""
    };
  },
  async created() {},
  methods: {
    evaluateText() {
      const sentiment = this.$tsSentiment.predict(this.text);
      let icon = "sad-tear";
      if (sentiment.score >= 0.0) icon = "sad-tear";
      if (sentiment.score > 0.2) icon = "frown-open";
      if (sentiment.score > 0.4) icon = "grimace";
      if (sentiment.score > 0.6) icon = "meh-rolling-eyes";
      if (sentiment.score > 0.8) icon = "smile-beam";
      this.icon = icon;
      console.log(sentiment);
    }
  }
};
</script>
