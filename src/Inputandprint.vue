<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" >
          <div class="m-meter-header-number">{{houseinfo.number}}</div>
          <div class="m-meter-header-address">{{houseinfo.address}}</div>
      </div>
    </div>
    <div class="m-input-wrap">
    <div class="m-input-card" v-if="emeters.length>0" v-for="item in emeters">
      <div class="m-input-title">{{"电表"+item.number}}</div>
      <div class="m-input-last">{{`末次记录:${item.data}  ${item.date}`}}</div>
      <el-input placeholder="请输入内容" v-model="item.current">
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
    <div class="m-input-card" v-if="wmeters.length>0" v-for="item in wmeters">
      <div class="m-input-title">{{"水表"+item.number}}</div>
      <div class="m-input-last">{{`末次记录:${item.data}  ${item.date}`}}</div>
      <el-input placeholder="请输入内容" v-model="item.current" >
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
     <div class="m-input-footer"><el-button type="primary" @click="handlegeneratebill">生成账单</el-button></div>
    </div>
    <div class="m-bill-wrap">
   <table class="m-bill-table" v-if="emeters.length>0">
     <tr>
       <th></th>
       <th>电表</th>
       <th>本次度数</th>
       <th>末次度数</th>
       <th>用电量</th>
       <th>电价</th>
       <th>总价</th>
     </tr>
     <tr v-for="(item,index) in emeters">
       <th  class="m-bill-rowhead" rowspan="2" v-if="index==0">电费</th>
       <td>{{'电表'+item.number}}</td>
       <td>10</td>
       <td>{{item.data}}</td>
       <td>2</td>
       <td>{{item.uprice}}</td>
       <td>2</td>
     </tr>
      <tr>
       <th>小计</th>
       <td colspan="5"></td>
       <th>10</th>
     </tr>
   </table>
   <table class="m-bill-table">
     <tr>
       <th></th>
       <th>水表</th>
       <th>本次度数</th>
       <th>末次度数</th>
       <th>用水量</th>
       <th>水价</th>
       <th>总价</th>
     </tr>
     <tr>
       <th  class="m-bill-rowhead" rowspan="2">水费</th>
       <td>水表0</td>
       <td>10</td>
       <td>8</td>
       <td>2</td>
       <td>1</td>
       <td>2</td>
     </tr>
     <tr>
       <td>水表1</td>
       <td>13</td>
       <td>5</td>
       <td>8</td>
       <td>1</td>
       <td>8</td>
     </tr>
      <tr>
       <th>小计</th>
       <td colspan="5"></td>
       <th>10</th>
     </tr>
   </table>
   <el-table
    :data="tableData"
    show-summary
    style="width: 100%">
    <el-table-column
      prop="chargeitem"
      label="收款项目"
      >
    </el-table-column>
    <el-table-column
      prop="price"
      label="价格"
      >
    </el-table-column>
  </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
data () {
  return {
    title:"抄表及打印1",
    tableData:[{
      chargeitem:"电费",
      price:2,
    },
    {
      chargeitem:"水费",
      price:2,
    }],
    wmeters:[],
    emeters:[],
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
    vm.houseinfo=response.data.house;
    vm.wmeters=response.data.wmeters.map((i)=>{
      i.current="";i.total=0;
      return i;
    });
    vm.emeters=response.data.emeters.map((i)=>{
      i.current="";i.total=0;
      return i;
    });
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
    console.log(this.wmeters);
    this.wmeters.map((i)=>{
      
    })
    console.log(this.emeters);
  }
},
destroyed:function(){
  this.$parent.showbtnback=false;
}
}
</script>

<style scoped>
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
col{
  width:5%;
}
</style>
