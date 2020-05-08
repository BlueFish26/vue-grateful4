<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
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
  async created() {
    const predictor = new SentimentPredictor();
    await predictor.init(HOSTED_URLS);
    const text = "this is a great movie";
    const result = predictor.predict(text);
    console.log(result);
  }
};
</script>
