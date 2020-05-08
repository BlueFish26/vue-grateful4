import Vue from 'vue';
import { SentimentPredictor } from './prediction_utils';
let instance;

export const getInstance = () => {
  return instance;
};

export const tensorSentiment = (urls) => {
  if (instance) return instance;
  console.log('inside plugin');
  instance = new Vue({
    data() {
      return {
        loading: true,
        predictor: null,
        error: null,
      };
    },
    methods: {
      predict(text) {
        return this.predictor.predict(text);
      },
    },
    async created() {
      try {
        console.log('created');
        this.predictor = new SentimentPredictor();
        await this.predictor.init(urls);
        this.loading = false;
      } catch (err) {
        this.error = err;
      }
    },
  });

  return instance;
};

export const TensorflowSentimentPlugin = {
  install(Vue, options) {
    console.log(options);
    Vue.prototype.$tsSentiment = tensorSentiment(options.urls);
  },
};
