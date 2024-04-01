import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from "axios";
import VueParticles from 'vue-particles'
import VueRouter from 'vue-router';
import router from './router';
import store from './components/store'

//全局变量
Vue.prototype.$axios = axios;
Vue.prototype.$httpUrl = 'http://127.0.0.1:8090'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueParticles);
Vue.use(VueRouter);
// Vue.use(ElementUI,{size:"small"});全局变小

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
