import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import App from './src/App.vue';
import Routes from './src/routes.js';
import {SetRem} from './utils/utils.js';
SetRem();
Vue.use(VueRouter);
Vue.use(ElementUI,{size:'medium',zIndex:3000});
window.app = new Vue({
  el: '#app',
  router:Routes,
  render: h => h(App)
});
