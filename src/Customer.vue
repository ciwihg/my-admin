<template>
<div class="m-list-wrap">
  <div class="m-customer-tab" @click="AddVisible=true">
    <div class="m-customer-body">
      <i class="el-icon-edit-outline"/>
      <div class="m-customer-tab-title">客户登记</div>
    </div>
  </div>
  <el-dialog  class="m-dialog-override" width="95%" :show-close="false" :visible.sync="AddVisible">
    <el-form  :model="renterform" label-position="top">
      <el-form-item label="姓名">
        <el-input v-model="renterform.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="renterform.idnum"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="renterform.callnum"></el-input>
      </el-form-item>
      <el-form-item label="身份证照片">
        <el-upload
        ref="up"
        :file-list="idjpglist"
        :on-remove="handleremovejpg"
        :before-upload="changeidjpgdata"
            action="https://easyhome.applinzi.com/public/index.php/ciwirent/fileupload"
            list-type="picture-card"
            :auto-upload="true"
            :on-success="handleupsuccess">
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select v-model="renterform.roomate" placeholder="请选择">
          <el-option
            v-for="item in roomateops"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入住地址">
        <el-select v-model="renterform.address" placeholder="请选择">
          <el-option
            v-for="item in addressops"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入住房号">
        <el-input v-model="renterform.hnum" placeholder="请输入房号"></el-input>
      </el-form-item>
      <el-form-item label="登记日期">
        <el-date-picker
           value-format="yyyy-MM-dd"
           v-model="renterform.checkin"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="m-dialog-footer">
      <el-button type="primary" @click="handlesubmit">登记</el-button>
      <el-button type="info" @click="requestdeletejpgs">取消</el-button>
    </div>
  </el-dialog>
</div>

</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
  created:function(){
    this.$emit('update:title',this.title);
    this.$parent.$refs.drawer.closeDrawer();
  },
  methods:{
    deljpgs:function(jpgs){
      axios.post('/fileupload/deletejpgs',{jpgs:jpgs},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then(function(response){
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    requestdeletejpgs:function() {
      this.AddVisible=false;
      let alljpgs = this.renterform.idjpg.concat(this.deletejpgs);
      this.deljpgs(alljpgs);
    },
    changeidjpgdata:function(){

    },
    handleupsuccess:function(res,file,filelist){
      this.renterform.idjpg=filelist.map((e)=>{
        if(e.response){
          return e.response;
        }else{
          return e.name;
        }
         });
      console.log(this.renterform.idjpg);

    },
    handlesubmit:function(){
      let vm = this;
      this.deljpgs(this.deletejpgs);
      axios.post('/customerpage/add',{data:this.renterform},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then(function(response){
        if(response.data.success){
          vm.AddVisible=false;
        }else{

        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleremovejpg:function (file,filelist) {
      file.response?this.deletejpgs.push(file.response):this.deletejpgs.push(file.name);
      this.renterform.idjpg=filelist.map((e)=>{
        if(e.response){
          return e.response;
        }else{
          return e.name;
        }
         });
      console.log(this.renterform.idjpg);

    }
  },
data () {
  return {
    idjpglist:[

    ],
    title:"客户管理",
    AddVisible:false,
    deletejpgs:[],
    addressops:[{
      value:"横潭大街32-1号",
      label:"横潭大街32-1号"
    },{
      value:"朝阳巷5号",
      label:"朝阳巷5号"
    }],
    roomateops:[{
      value:"0",
      label:"承租人"
    },{
      value:"1",
      label:"同居人"
    }],
    renterform:{
      name:"",
      idnum:"",
      callnum:"",
      idjpg:[],
      roomate:"",
      checkin:"",
      address:"",
      hnum:""
    }
  }
}
}
</script>

<style scoped>
.m-dialog-footer{
      background-color: rgb(247, 249, 249);
      margin: 0 -20px -30px -20px;
      padding: .1rem .2rem;
      display: flex;
      justify-content: flex-end;
}
.m-list-wrap{
 margin: .2rem .3rem 0 .3rem;
}
.m-customer-tab{
  margin-top: .2rem;
  background-image: linear-gradient(to bottom, #409eff, rgb(160, 207, 255));;
  color: white;
  border-radius: 4px;
  font-size: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.m-customer-tab-title{
  font-size: .2rem;
  font-weight: 400;


}
.m-customer-body{
  padding: .4rem .4rem .4rem .4rem;
}
.m-customer-tab i{
  float:right;
  margin-right: -0.55rem;
  margin-top: -0.55rem;
  color: rgb(160, 207, 255);
  font-size: 1.2rem;
}
</style>
