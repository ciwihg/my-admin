import House from './Houses.vue';
import VueRouter from 'vue-router';
import Chargeitems from './Chargeitems.vue';
import Records from './Records.vue';
import Meterrecords from './Meterrecords.vue';
import Inputprint from './Inputandprint.vue';
import Customer from './Customer.vue';
import Checkout from './Checkout.vue';
const routes = [
  { path: '/house', component: House },
  { path: '/chargeitems', component: Chargeitems },
  { path: '/records', component: Records },
  { path: '/customer', component: Customer },
  { path: '/checkout', component: Checkout },
  { path: '/records/meter/:hid',name:'Meterrecords', component: Meterrecords },
  { path: '/checkout/inputandprint/:hid',name:'Inputprint', component: Inputprint }

];
const router = new VueRouter({
  routes
});
export default router;
