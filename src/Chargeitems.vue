<template>
<div class="m-list-wrap">
  <div class="m-addbtn-wrap"><el-button  @click="openaddform" class="m-btn-override" type="primary" size="medium">添加收费项目<i class="el-icon-plus"/></el-button></div>
  <el-table
  size="medium"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      class="m-list-style"
      align="center"
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      class="m-list-style"
      align="center"
      prop="uprice"
      label="价格">
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
  <el-dialog  width="90%" :show-close="false" :visible.sync="AddVisible">
    <el-form  :model="postdata" label-position="top">
      <el-form-item label="名称">
        <el-input placeholder="请输入名称" v-model="postdata.name"></el-input>
      </el-form-item>
      <el-form-item label="收费类型">
        <el-select  v-model="postdata.type" placeholder="请选择">
          <el-option
            v-for="item in chargetypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="价格">
        <el-input placeholder="请输入价格" v-model="postdata.uprice"></el-input>
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
import {HandleChItmData,ObjToFormdata,DeepClone} from '../utils/utils.js';
axios.defaults.baseURL = `http://easyhome.applinzi.com/public/index.php/ciwirent`;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export default {
  created:function(){
    let vm = this;
    axios.get('/chargeitemspage')
    .then(function (response) {
    // handle success
    //console.log(vm.drawer);
    vm.$emit('update:title',vm.title);
    vm.$parent.$refs.drawer.closeDrawer();
    vm.tableData=HandleChItmData(response.data);
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
    title:"收费项目",
    edit:false,
    postdata:{
      cid:"",
      name:"",
      uprice:"",
      type:""
    },
    chargetypes:[
      {
        label:'月费',
        value:'month'
      },
      {
        label:'水费',
        value:'water'
      },
      {
        label:'电费',
        value:'eletric'
      },
    ],
    AddVisible:false
  }
},
methods:{
  resetPostdata:function () {
    this.postdata = {
      cid:"",
      name:"",
      uprice:"",
      type:""
    };
  },
  getAlldata:function () {
    let vm = this;
    axios.get('/chargeitemspage')
    .then(function (response) {
    vm.tableData=HandleChItmData(response.data);
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
    console.log(row);
    this.edit = true;
    this.postdata = DeepClone(row);
    this.AddVisible=true;
    this.postdata.uprice = this.postdata.uprice.match(/[\.0-9]+/)[0];
  },
  handleDelete:function (row){
    var vm = this;
    this.$confirm(`确定删除 ${row.name}?`, {
        customClass: 'm-popup-override',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'm-cancelbtn-override',
        showClose:false,
        center:true,
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        axios.post('/chargeitemspage/delete',{cid:row.cid},{
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest:[ObjToFormdata]
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
  openaddform:function(){
    this.resetPostdata();
    this.AddVisible=true;
    this.edit = false;
  },
  handleSubmit:function () {
    let vm = this;
    axios.post(this.edit?'/chargeitemspage/update':'/chargeitemspage/add',this.postdata,{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[ObjToFormdata]
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
  .m-addbtn-wrap{
    font-size: 0;
  }
  .m-btn-override{
    width:100%;
    margin: .05rem 0 0 0;
  }
</style>
