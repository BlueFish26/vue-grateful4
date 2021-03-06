import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { TensorflowSentimentPlugin } from './tensorflow/plugin';
import { HOSTED_URLS } from './tensorflow/prediction_utils';

library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(TensorflowSentimentPlugin, {
  urls: HOSTED_URLS,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
