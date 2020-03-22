import House from './Houses.vue';
import VueRouter from 'vue-router';
import Chargeitems from './Chargeitems.vue';
import Records from './Records.vue';
const routes = [
  { path: '/house', component: House },
  { path: '/chargeitems', component: Chargeitems },
  { path: '/records', component: Records },
];
const router = new VueRouter({
  routes
});
export default router;
