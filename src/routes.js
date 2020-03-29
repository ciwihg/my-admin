import House from './Houses.vue';
import VueRouter from 'vue-router';
import Chargeitems from './Chargeitems.vue';
import Records from './Records.vue';
import Meterrecords from './Meterrecords.vue';
const routes = [
  { path: '/house', component: House },
  { path: '/chargeitems', component: Chargeitems },
  { path: '/records', component: Records },
  { path: '/records/meter/:hid',name:'Meterrecords', component: Meterrecords }

];
const router = new VueRouter({
  routes
});
export default router;
