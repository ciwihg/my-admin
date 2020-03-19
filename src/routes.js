import House from './Houses.vue';
import VueRouter from 'vue-router';
import Chargeitems from './Chargeitems.vue';
const routes = [
  { path: '/house', component: House },
  { path: '/chargeitems', component: Chargeitems },
];
const router = new VueRouter({
  routes
});
export default router;
