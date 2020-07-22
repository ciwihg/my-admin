<template>
<div class="m-list-wrap">
  <div class="m-mode-bar" @change="handlemodeswitch">
    <el-radio v-model="displaymode" label="recommand">自动推荐</el-radio>
    <el-radio v-model="displaymode" label="search">搜索</el-radio>
  </div>
    <Filterbar :handler="filterdata" v-if="displaymode=='search'"></Filterbar>
  <el-table
  size="medium"
    :data="tableData"
    @row-click="handlerowclick"
    style="width: 100%">
    <el-table-column
      class="m-list-style"
      align="center"
      prop="date"
      label="起租日">
    </el-table-column>
    <el-table-column
      class="m-list-style"
      align="center"
      prop="number"
      label="房号">
    </el-table-column>
    <el-table-column
      class="m-list-style"
      align="center"
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>

</div>
</template>

<script>
import axios from 'axios';
import Filterbar from './component/filterbar.vue';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
  components:{
    'Filterbar':Filterbar,
  },
data () {
  return {
    title:"结算",
    tableData:[],
    displaymode:'recommand',
    Alldatas:[],
  }
},
created:function(){
  let vm = this;
  this.$emit('update:title',this.title);
  this.$parent.$refs.drawer&&this.$parent.$refs.drawer.closeDrawer();
  axios.get("/checkoutpage").then(function(res){
    vm.Alldatas=res.data;
    /*let today=new Date(Date.now());
    var day1=24*60*60*1000;
    let odate=[];
    odate.push(today.getDate());
    for(let i=1;i<=3;i++){
      let today=Date.now();
      let dateobj=new Date(today-i*day1);
      odate.push(dateobj.getDate());
      dateobj=new Date(today+i*day1);
      odate.push(dateobj.getDate());
    }
    vm.tableData = res.data.filter(i=>
      odate.includes(new Date(i.date).getDate())
);*/
vm.autorecommand();
  }).catch(function (err) {
    console.log(err);
  });

},
methods:{
  handlerowclick:function (row) {
    this.$router.push({name:'Inputprint',params:{hid:row.id}});
  },
  autorecommand:function () {
    let today=new Date(Date.now());
    var day1=24*60*60*1000;
    let odate=[];
    odate.push(today.getDate());
    for(let i=1;i<=3;i++){
      let today=Date.now();
      let dateobj=new Date(today-i*day1);
      odate.push(dateobj.getDate());
      dateobj=new Date(today+i*day1);
      odate.push(dateobj.getDate());
    }
    this.tableData = this.Alldatas.filter(i=>
      odate.includes(new Date(i.date).getDate())
);
  },
  filterdata:function (conditions) {
   this.tableData=this.Alldatas.filter((i)=>{
     if(i.number==conditions.number&&i.address==conditions.address){
       return true;
     }else{
       return false;
     }
   })
 },
 handlemodeswitch:function () {

   if(this.displaymode=="recommand"){
     this.autorecommand();
   }else{
     this.tableData=[];
   }
 }
}
}
</script>

<style scoped>
.m-mode-bar{
  font-size: 0;
  padding: .2rem .25rem;
  background-color:white;
}
.m-table-style{
  width: 1.18rem;
}
.m-list-wrap{
 margin: .2rem .3rem 0 .3rem;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}

</style>
