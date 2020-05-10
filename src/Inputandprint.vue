<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" >
          <div class="m-meter-header-number">{{houseinfo.number}}</div>
          <div class="m-meter-header-address">{{houseinfo.address}}</div>
      </div>
    </div>
    <div class="m-billhistory-btn">历史账单 <i class="el-icon-arrow-right"/></div>
    <div class="m-input-wrap">
    <div class="m-input-card" v-if="emeters.length>0" v-for="item in emeters">
      <div class="m-input-title">{{"电表"+item.number}}</div>
      <div class="m-input-last">{{`末次记录:${item.data}  ${item.date}`}}</div>
      <el-input placeholder="请输入内容" :disabled="showbill" v-model="item.current">
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
    <div class="m-input-card" v-if="wmeters.length>0" v-for="item in wmeters">
      <div class="m-input-title">{{"水表"+item.number}}</div>
      <div class="m-input-last">{{`末次记录:${item.data}  ${item.date}`}}</div>
      <el-input placeholder="请输入内容" :disabled="showbill" v-model="item.current" >
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
     <div class="m-input-footer"><el-button type="primary" :disabled="showbill" @click="handlegeneratebill">生成账单</el-button></div>
    </div>
    <m-bill :billdata="mbill" v-if="showbill"></m-bill>
  </div>
</template>

<script>
import bill from './component/bill.vue';
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
  components:{
    'm-bill':bill,
  },
data () {
  return {
    title:"抄表及打印1",
    tableData:[],
    wmeters:[],
    wfee:0,
    efee:0,
    emeters:[],
    mbill:{
      house:{},
      wmeters:[],
      emeters:[],
      chargeitems:[]
    },
    showbill:false,
    houseinfo:{
      id: "",
      number: "",
      address: "",
      price: 0
    }
  }
},
created:function () {
  let vm = this;
  this.$parent.showbtnback=true;
  this.$emit('update:title',this.title);
  console.log(this.$route.params.hid);
  this.$parent.$refs.drawer&&this.$parent.$refs.drawer.closeDrawer();
  axios.post('/billpage/getbillneeded',{id:this.$route.params.hid},{
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest:[(data)=>`data=`+JSON.stringify(data)]
   })
  .then(function (response) {
    console.log(response.data);
    vm.houseinfo=response.data.house;
    vm.mbill.house=response.data.house;
    vm.mbill.chargeitems=response.data.chargeitems.map((i)=>{
      i.uprice=Number(i.uprice).toFixed(2);
     return i;
    });
    vm.wmeters=response.data.wmeters.map((i)=>{
      i.current="";i.total=0;
      return i;
    });
    vm.emeters=response.data.emeters.map((i)=>{
      i.current="";i.total=0;
      return i;
    });
    vm.tableData=response.data.chargeitems.map((i)=>{
      i.uprice=Number(i.uprice).toFixed(2);
      return i;
    });
    vm.tableData.push({name:'租金',uprice:Number(vm.houseinfo.price).toFixed(2)});
    console.log(response.data);
  }).catch(function(err){
    console.log(err);
  });

  /*axios.get("/checkoutpage").then(function(res){
    vm.tableData = res.data;
  }).catch(function (err) {
    console.log(err);
  });*/
},
methods:{
  handlegeneratebill:function () {
    this.mbill.wmeters=this.wmeters;
    this.mbill.emeters=this.emeters;
    this.showbill=true;
    console.log(this.wmeters);
    axios.post('/billpage/inputmeterrecord',{meters:this.wmeters.concat(this.emeters)},{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[(data)=>`data=`+JSON.stringify(data)]
     })
    .then(function (response) {
      console.log(response.data);
    }).catch(function(err){
      console.log(err);
    })
    /*let vm = this;
    vm.wfee=0,vm.efee=0;
    this.wmeters.map((i)=>{
      i.total=(i.current-i.data)*i.uprice;
      vm.wfee+=i.total;
    });
    (this.wmeters.length>0)&&this.tableData.push({name:'水费',uprice:Number(this.wfee).toFixed(2)});
    this.emeters.map((i)=>{
      i.total=(i.current-i.data)*i.uprice;
      vm.efee+=i.total;
    });
    (this.emeters.length>0)&&this.tableData.push({name:'电费',uprice:Number(this.efee).toFixed(2)});
    let total =0;
    this.tableData.map((i)=>{
      total+=parseFloat(i.uprice);
    });
    this.tableData.push({name:'合计',uprice:Number(total).toFixed(2)});*/
  }
},
destroyed:function(){
  this.$parent.showbtnback=false;
}
}
</script>

<style scoped>
.m-billhistory-btn{
  font-size: .15rem;
  padding: .15rem .2rem .15rem .3rem;
  font-weight: 700;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: .2rem;
  color: rgb(180,180,180);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.m-billhistory-btn i{
  font-size: .2rem;
  font-weight: 900;
  color: #409eff;
}
.m-bill-table{

  width: 100%;
    border-collapse: separate;
    border-spacing: 0px;

}
.m-bill-table th,td{
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,.1);

}
.m-bill-table td{
  color: #909399;

}
.m-bill-rowhead{
  border-right: 1px solid rgba(0,0,0,.1);
  margin-right: 2px;


}
.m-bill-wrap{
  margin-top: .2rem;
  font-size: .12rem;
  padding: .3rem .1rem;
  background-color: white;
}
.m-input-footer{
  text-align: center;
  font-size: 0;
}
.m-input-title{
  font-size: .15rem;
  font-weight: bold;
  padding: .05rem .2rem;
}
.m-input-wrap{
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  padding: .2rem;
  background-color: white;
}
.m-input-last{
  font-size: .15rem;
  color: #909399;
  padding: .05rem .2rem .1rem .2rem;
}
.m-input-card{
  font-size: 0;
  padding: .2rem 0 .3rem 0;
  border-bottom: 1px solid rgba(0,0,0,.1);
}
.m-input-card:first-child{
  padding-top: 0 !important;
}
.m-input-card:nth-last-child(2){
  border-bottom:none;
}
.m-list-wrap{
 margin: .2rem .3rem 0 .3rem;
 /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);*/
}
.m-meter-header-body{
  display: inline-block;
  vertical-align: top;

}
.m-meter-header{
  font-size: 0;
}
.m-meter-header::before{
  content: "";
  display: inline-block;
  width: .3rem;
  height: .08rem;
  border-radius: .04rem;
  background-color: #409eff;
  vertical-align: top;
  margin-top: .06rem;
  margin-right: .15rem;
}
.m-meter-header-address{
  line-height: .28rem;
  font-size: .14rem;
  color: rgb(108, 117, 125);
}
.m-meter-header-number{
  line-height: .19rem;
  font-size: .15rem;
  font-weight: 400;
  margin-bottom: .05rem;
}

</style>
