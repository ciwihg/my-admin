<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" >
          <div class="m-meter-header-number">{{houseinfo.number}}</div>
          <div class="m-meter-header-address">{{houseinfo.address}}</div>
      </div>
    </div>
    <div class="m-billhistory-btn" @click="billhistoryinit" v-if="!billhistory">历史账单 <i class="el-icon-arrow-right"/></div>
    <div class="m-billhistory-btn" @click="inputrecordinit" v-if="billhistory"><i class="el-icon-arrow-left"/> 抄表</div>
    <div class="m-input-wrap" v-if="!billhistory">
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
    <div><el-checkbox v-model="recordcheckout">离开登记</el-checkbox></div>
     <div class="m-input-footer"><el-button type="primary" :disabled="showbill" @click="handlegeneratebill">生成账单</el-button></div>
    </div>
    <el-select v-model="billnum" placeholder="请选择" v-if="billhistory" @change="handlehisbillgenerate">
      <el-option
       v-for="(item,index) in billhisoptions"
       :key="index"
       :label="item.date"
       :value="index">
      </el-option>
    </el-select>
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
    billhistory:false,
    wfee:0,
    efee:0,
    emeters:[],
    recordcheckout:false,
    billhisoptions:[],
    billhisdata:'',
    billnum:'',
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
  inputrecordinit:function () {
    this.billhistory=false;
    this.showbill=false;
  },
  handlehisbillgenerate:function () {
    console.log(this.billnum);
    let vm =this;
    this.mbill.wmeters=this.billhisdata.wmeters.map((i)=>{
      i.current=vm.billhisdata.records[i.id][vm.billnum].data;i.total=0;i.data=vm.billhisdata.records[i.id][vm.billnum+1].data;
      return i;
    });
    this.mbill.emeters=this.billhisdata.emeters.map((i)=>{
      i.current=vm.billhisdata.records[i.id][vm.billnum].data;i.total=0;i.data=vm.billhisdata.records[i.id][vm.billnum+1].data;
      return i;
    });
    console.log(this.mbill);
    this.showbill=true;
  },
  billhistoryinit:function () {
    this.showbill=false;
    let vm =this;
    axios.post('/billpage/getbillhistory',{id:this.$route.params.hid},{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[(data)=>`data=`+JSON.stringify(data)]
     })
    .then(function (response) {
      console.log(response.data);
       vm.billhistory=true;
       vm.billhisdata=response.data;
       let id=response.data.wmeters[0].id;
       vm.billhisoptions=response.data.records[id].map((i)=>{return i});
       vm.billhisoptions.pop();
    }).catch(function(err){
      console.log(err);
    });

  },
  handlegeneratebill:function () {
    this.mbill.wmeters=this.wmeters;
    this.mbill.emeters=this.emeters;
    this.showbill=true;
    console.log(this.recordcheckout);
    axios.post('/billpage/inputmeterrecord',{meters:this.wmeters.concat(this.emeters),checkout:this.recordcheckout,hid:this.$route.params.hid},{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[(data)=>`data=`+JSON.stringify(data)]
     })
    .then(function (response) {
      console.log(response.data);
    }).catch(function(err){
      console.log(err);
    });

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
