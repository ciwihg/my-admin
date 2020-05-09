<template>
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
     <td>{{Number(item.current).toFixed(2)}}</td>
     <td>{{Number(item.data).toFixed(2)}}</td>
     <td>{{Number(item.current-item.data).toFixed(2)}}</td>
     <td>{{Number(item.uprice).toFixed(2)}}</td>
     <td>{{Number(item.total).toFixed(2)}}</td>
   </tr>
    <tr>
     <th>小计</th>
     <td colspan="5"></td>
     <th>{{Number(efee).toFixed(2)}}</th>
   </tr>
 </table>
 <table class="m-bill-table" v-if="wmeters.length>0">
   <tr>
     <th></th>
     <th>水表</th>
     <th>本次度数</th>
     <th>末次度数</th>
     <th>用水量</th>
     <th>水价</th>
     <th>总价</th>
   </tr>
   <tr v-for="(item,index) in wmeters">
     <th  class="m-bill-rowhead" :rowspan="wmeters.length" v-if="index==0">水费</th>
     <td>{{`水表`+item.number}}</td>
     <td>{{Number(item.current).toFixed(2)}}</td>
     <td>{{Number(item.data).toFixed(2)}}</td>
     <td>{{Number(item.current-item.data).toFixed(2)}}</td>
     <td>{{Number(item.uprice).toFixed(2)}}</td>
     <td>{{Number(item.total).toFixed(2)}}</td>
   </tr>
    <tr>
     <th>小计</th>
     <td colspan="5"></td>
     <th>{{Number(wfee).toFixed(2)}}</th>
   </tr>
 </table>
 <el-table
  :data="tableData"
  style="width: 100%">
  <el-table-column
    prop="name"
    label="收款项目"
    >
  </el-table-column>
  <el-table-column
    prop="uprice"
    label="价格"
    >
  </el-table-column>
</el-table>
  </div>
</template>

<script>
export default {
  props:['billdata'],
  data () {
    return {
     efee:0,
     wfee:0,
     emeters:[],
     wmeters:[],
     tableData:[]
    };
  },
  created:function () {
    console.log(this.billdata);
    let vm = this;
    this.emeters=this.billdata.emeters;
    this.wmeters=this.billdata.wmeters;
    this.tableData=this.billdata.chargeitems;
    this.tableData.push({name:'租金',uprice:Number(this.billdata.house.price).toFixed(2)})
    this.emeters.map((i)=>{
      i.total = (i.current-i.data)*i.uprice;
      vm.efee+=i.total;
    });
    (this.emeters.length>0)&&this.tableData.push({name:'电费',uprice:Number(this.efee).toFixed(2)});
    this.wmeters.map((i)=>{
      i.total = (i.current-i.data)*i.uprice;
      vm.wfee+=i.total;
    });
    (this.wmeters.length>0)&&this.tableData.push({name:'水费',uprice:Number(this.wfee).toFixed(2)});
    let total = 0;
    this.tableData.map((i)=>{
      total += parseFloat(i.uprice);
    });
    this.tableData.push({name:'合计',uprice:Number(total).toFixed(2)});
  }
}
</script>

<style scoped>
.m-bill-table{

  width: 100%;
    border-collapse: separate;
    border-spacing: 0px;
    margin-bottom: .3rem;

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
  margin: .2rem 0rem;
  font-size: .12rem;
  padding: .3rem .1rem;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
</style>
