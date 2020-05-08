import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { TensorflowSentimentPlugin } from './tensorflow/plugin';
import { HOSTED_URLS } from './tensorflow/prediction_utils';

Vue.use(TensorflowSentimentPlugin, {
  urls: HOSTED_URLS,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
