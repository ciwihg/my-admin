import House from './Houses.vue';
import VueRouter from 'vue-router';
import Chargeitems from './Chargeitems.vue';
import Records from './Records.vue';
import Meterrecords from './Meterrecords.vue';
import Inputprint from './Inputandprint.vue';
import Customer from './Customer.vue';
import Checkout from './Checkout.vue';
import Dataspage from './dataspage.vue';
import Login from './Login.vue';
import Admin from './index.vue';
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
axios.defaults.withCredentials=true;
const routes = [
  { path: '/', component: Admin,
    children:[
      {path:"/",component: Dataspage},
      {path:"house",component: House},
      {path:"chargeitems",component: Chargeitems},
      {path:"records",component: Records},
      {path:"customer",component: Customer},
      {path: 'checkout', component: Checkout},
      {path:"records/meter/:hid",name:'Meterrecords',component: Meterrecords},
      {path:"checkout/inputandprint/:hid",name:'Inputprint',component: Inputprint}
  ]},
  { path: '/login', component: Login },


];
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  console.log(from);
  console.log(to);
  if(to.path=="/login"){
    next();
  }else{
    axios.get('/Loginauth/auth')
    .then(function (response) {
    if(response.data.status){
      next();
    }else{
      next('/login');
    }
  })
  .catch(function (error) {
    console.log(error);
  });
  }


})
export default router;
