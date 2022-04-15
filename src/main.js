import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import Qs from 'qs';
import Vuetify from 'vuetify';
import vuetify from './plugins/vuetify';
import lottie from 'vue-lottie'
import router from "@/router.js";

Vue.prototype.$axios = axios

import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$qs = Qs;
Vue.prototype.$vis = require("vis-network/dist/vis-network.min")
require("vis-network/styles/vis-network.min.css")
Vue.use(Vuetify)

Vue.component('lottie', lottie)



new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
