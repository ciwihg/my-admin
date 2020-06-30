<template>
<div class="m-list-wrap">
  <Filterbar :handler="filterdata"></Filterbar>
  <div class="m-addbtn-wrap"><el-button  @click="openaddform" class="m-btn-override" type="primary" size="medium">添加租盘<i class="el-icon-plus"/></el-button></div>
  <el-table
  size="medium"
    :data="tableData"
    style="width: 100%">
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
    <el-table-column
      class="m-list-style"
      align="center"
      prop="action"
      label="操作">
      <template slot-scope="scope">
        <i @click="handleEdit(scope.row)" class="el-icon-edit-outline m-house-abtn"/>
        <i @click="handleDelete(scope.row)" class="el-icon-delete-solid m-house-abtn"/>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog  class="m-dialog-override" width="90%" :show-close="false" :visible.sync="AddVisible">
    <el-form  :model="postdata" label-position="top">
      <el-form-item label="房号">
        <el-input placeholder="请输入房号" v-model="postdata.number"></el-input>
      </el-form-item>
      <el-form-item label="户型">
        <el-input placeholder="请输入户型" v-model="postdata.htype"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input placeholder="请输入地址" v-model="postdata.address"></el-input>
      </el-form-item>
      <el-form-item label="租金">
        <el-input placeholder="请输入租金" v-model="postdata.price"></el-input>
      </el-form-item>
      <el-form-item label="押金">
        <el-input placeholder="请输入租金" v-model="postdata.subprice"></el-input>
      </el-form-item>
      <el-form-item label="收费项目">
        <div>
        <el-checkbox v-model="isbtns.iswater">水费</el-checkbox>
        <m-meter-card v-if="isbtns.iswater" :rules="waterrule" type="water" :meters.sync="postdata.wmeters" :pmeters="hwmeters" :setbtn="setistbtns"></m-meter-card>
        <el-checkbox v-model="isbtns.iseletric">电费</el-checkbox>
        <m-meter-card v-if="isbtns.iseletric" :rules="eletricrule" type="eletric" :meters.sync="postdata.emeters" :pmeters="hemeters" :setbtn="setistbtns"></m-meter-card>
      </div>
      <div><span>其他收费</span></div>
        <el-select v-model="postdata.chargeitems" multiple placeholder="请选择需要收费的项目">
            <el-option
              v-for="item in othercharge"
              :key="item.cid"
              :label="item.name"
              :value="item.cid">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
    <el-button type="primary" class="m-btn-override" @click="handleSubmit">保存</el-button>
    <el-button type="info" class="m-btn-override" @click="closeForm">取消</el-button>
  </el-form-item>
    </el-form>
</el-dialog>
</div>
</template>

<script>
import axios from 'axios';
import Metercard from './component/metercard.vue';
import Filterbar from './component/filterbar.vue';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
import {ObjToFormdata,DeepClone,SortChargeitems,HandleMeters} from '../utils/utils.js';
export default {
  components:{
    'm-meter-card':Metercard,
    'Filterbar':Filterbar,
  },
  created:function(){
    let vm = this;
    axios.get('/housepage')
    .then(function (response) {
    // handle success
    //console.log(vm.drawer);
    vm.$emit('update:title',vm.title);
    vm.$parent.$refs.drawer.closeDrawer();
    vm.Allhouses=response.data;
    vm.tableData=response.data;
    console.log(vm.Allhouses===vm.tableData);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  },
data () {
  return {
    tableData:[],
    Allhouses:[],
    title:'我的租盘',
    AddVisible:false,
    chargeitems:"",
    edit:false,
    wmeters:1,
    emeters:1,
    isbtns:{
      iswater:false,
      iseletric:false,
    },
    test:[],
    hwmeters:[],
    hemeters:[],
    postdata:{
      id:"",
      number:"",
      address:"",
      price:"",
      subprice:"",
      htype:"",
      wmeters:[],
      emeters:[],
      chargeitems:[],
    },
  }
},
computed:{
  waterrule:function () {
    return SortChargeitems(this.chargeitems).water;
  },
  eletricrule:function (){
    return SortChargeitems(this.chargeitems).eletric;
  },
  othercharge:function(){
    return SortChargeitems(this.chargeitems).other;
  },

},
methods:{
  filterdata:function (conditions) {
   this.tableData=this.Allhouses.filter((i)=>{
     if(i.number==conditions.number&&i.address==conditions.address){
       return true;
     }else{
       return false;
     }
   })
  },
  setistbtns:function(index,bl){
    this.isbtns['is'+index]=bl;
  },
  getMetersById:function (row) {
    let vm = this;
    var promise = new Promise((resolve,reject)=>{
      axios.post('/housepage/getmeters',{id:row.id},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
       })
      .then(function (response) {
      let result = HandleMeters(response.data);
       vm.hwmeters = result.wmeters;
       vm.isbtns.iswater = result.wmeters.length!=0;
       vm.hemeters = result.emeters;
       vm.isbtns.iseletric = result.emeters.length!=0;
        resolve();
    })
    .catch(function (error) {
      console.log(error);
    })

    });
    return promise;
  },
  getChargeById:function (row) {
    let vm = this;
    var promise = new Promise((resolve,reject)=>{
      axios.post('/housepage/getcharge',{id:row.id},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
       })
      .then(function (response) {
        var tempobj = DeepClone(row);
        tempobj.chargeitems = response.data;
        vm.postdata = tempobj;
        resolve();
    })
    .catch(function (error) {
      console.log(error);
    })

    });
    return promise;

  },
  resetPostdata:function(){
    this.hwmeters=[];
    this.hemeters=[];
    this.isbtns.iswater = false;
    this.isbtns.iseletric = false;
    this.postdata = {
      id:"",
      number:"",
      address:"",
      price:"",
      subprice:"",
      htype:"",
      chargeitems:[],
      wmeters:[],
      emeters:[]
    };
  },
  getAlldata:function () {
    let vm = this;
    axios.get('/housepage')
    .then(function (response) {
    vm.tableData=response.data;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  },
  handleEdit:function (row){
     console.log(this.postdata);
    this.isbtns = {
      iswater:false,
      iseletric:false
    };
    let vm = this;
    vm.edit = true;
    Promise.all([this.getChargeById(row),this.getMetersById(row),this.getChargeitems()]).then(()=>{
         vm.postdata.emeters = vm.hemeters;
         vm.postdata.wmeters = vm.hwmeters;
      vm.AddVisible = true;
    }).catch((err)=>{
      console.log(err);
    });

  },
  handleDelete:function (row){
    console.log(row);
    let vm = this;
    this.$confirm(`确定删除 ${row.number+'-'+row.address} ?`, {
        customClass: 'm-popup-override',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'm-cancelbtn-override',
        showClose:false,
        center:true,
        type: 'warning'
      }).then(() => {
        axios.post('/housepage/delete',{id:row.id},{
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest:[(data)=>`data=`+JSON.stringify(data)]
        }).then(
          function (response) {
            vm.getAlldata();
          }
        ).catch(function (error) {
          console.log(error);
        }).finally(

        );
      }).catch(() => {

      });
  },
  openaddform:function () {
    let vm = this;
    this.edit = false;
    this.resetPostdata();
     this.getChargeitems().then(function () {
      vm.AddVisible = true;
  })
  .catch(function (error) {
    console.log(error);
  });
  },
  getChargeitems:function () {
    let vm = this;
    return new Promise((resolve,reject)=>{
      axios.get('/chargeitemspage')
      .then(function (response) {
      vm.chargeitems = response.data;
      resolve();
    })
    .catch(function (error) {
      console.log(error);
    });
    });
  },
  handleSubmit:function(){

   let vm = this;
  if(!this.isbtns.iswater){
    this.postdata.wmeters = [];
  }
    if(!this.isbtns.iseletric){
      this.postdata.emeters = [];
    }

   console.log(this.postdata);
   axios.post(this.edit?'/housepage/update':'/housepage/add',this.postdata,{
     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
     transformRequest:[(data)=>`data=`+JSON.stringify(data)]
    }).then(
     function (response) {
       vm.closeForm();
       vm.getAlldata();
     }
   ).catch(function (error) {
     console.log(error);
   }).finally(

   );
  },
  closeForm:function () {
      this.AddVisible = false;
  }
}
}
</script>

<style scoped>
.m-template-body{
  padding-bottom: .1rem;
}
.m-template-footer i{
  float: right;
  font-size: .3rem;
  color:#409EFF;
}
.m-template-footer::after{
  content: "";
  display: block;
  clear: both;
}
.m-template-up{
  padding-bottom: .1rem;
}
.m-template-wrap{
  margin-top: .2rem;
  padding: .2rem .2rem;

}
.m-addbtn-wrap{
  font-size: 0;
}
.m-btn-override{
  width:100%;
  margin: .05rem 0 0 0;
}
.m-table-style{
  width: 1.18rem;
}
  .m-list-wrap{
   margin: .2rem .3rem 0 .3rem;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  }
  .m-house-abtn{
    color:#409eff;
    font-size: .2rem;

  }
  .m-house-abtn:last-child{
    margin-left: .05rem;
  }
</style>
