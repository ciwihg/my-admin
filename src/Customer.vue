<template>
<div class="m-list-wrap">
  <div class="m-customer-tab" @click="handleAddrenter">
    <div class="m-customer-body">
      <i class="el-icon-edit-outline"/>
      <div class="m-customer-tab-title">客户登记</div>
    </div>

  </div>
  <div class="m-customer-card" v-for="(renter,index) in renters">
    <div class="m-customer-card-name">{{renter.name}}</div>
    <div class="m-customer-card-address">{{renter.number+"-"+renter.address}}</div>
    <div>
      <div class="m-customer-card-checkin m-customer-date">{{"登记日期:"+renter.checkin}}</div><div v-if="renter.checkout!='0000-00-00'" class="m-customer-card-leave m-customer-date">{{"离开日期:"+renter.checkout}}</div>
    </div>
    <div class="m-customer-card-action"><span>查看</span><span @click="handleEdit(index)">编辑</span><span>删除</span></div>
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
        :limit='2'
        :on-exceed="handlefileexceed"
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
      <el-form-item label="离开日期" v-if="this.edit&&(renterform.checkout!='0000-00-00')">
        <el-date-picker
           value-format="yyyy-MM-dd"
           v-model="renterform.checkout"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="m-dialog-footer">
      <el-button type="primary" @click="handlesubmit">保存</el-button>
      <el-button type="info" @click="requestdeletejpgs">取消</el-button>
    </div>
  </el-dialog>
</div>

</template>

<script>
import {DeepClone} from '../utils/utils.js';
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
let storageprex="http://easyhome-rentadmin.stor.sinaapp.com/idcard/";
export default {
  created:function(){
    let vm = this;
    //this.$emit('update:title',this.title);

    //this.$parent.$refs.drawer.closeDrawer();
      axios.get('/customerpage/getallrenters').then(function(response){
        vm.renters = response.data;
      }).catch(
        function (error) {
          console.log(error);
        }
      );
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
    handleAddrenter:function(){
      this.renterform = DeepClone(this.baseform);
      this.deletejpgs=[];
      this.idjpglist=[];
      this.edit=false;
      this.AddVisible=true;
    },
    requestdeletejpgs:function() {
      this.AddVisible=false;
    
    },
    changeidjpgdata:function(){

    },
    handleEdit:function(i){
      console.log(this.renters[i]);
      this.edit=true;
      this.deletejpgs=[];
      let vm = this;
      axios.post('/customerpage/getrenterbyid',{id:this.renters[i].rid},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then(function(response){
        console.log(response.data);
        let tmp = response.data[0];
        vm.renterform.id=tmp.rid;
        vm.renterform.name=tmp.name;
        vm.renterform.idnum=tmp.idnum;
        vm.renterform.callnum=tmp.callnum;
        vm.renterform.roomate=String(tmp.roomate);
        vm.renterform.checkin=tmp.checkin;
        vm.renterform.address=tmp.address;
        vm.renterform.hnum=tmp.number;
        vm.renterform.checkout=tmp.checkout;
        vm.renterform.idjpg=JSON.parse(tmp.idjpg);
        vm.idjpglist = JSON.parse(tmp.idjpg).map(function(i){
          return {name:i.filename,url:storageprex+i.filename}
        });
        vm.AddVisible = true;
      }).catch(function (error) {
        console.log(error);
      });

      /*this.renterform.name=this.renters[i].name;
      this.renterform.idnum=this.renters[i].idnum;
      this.renterform.callnum=this.renters[i].callnum;
      this.renterform.roomate=String(this.renters[i].roomate);
      this.renterform.checkin=this.renters[i].checkin;
      this.renterform.address=this.renters[i].address;
      this.renterform.hnum=this.renters[i].number;
      this.idjpglist = JSON.parse(this.renters[i].idjpg).map(function(i){
        return {name:i.filename,url:storageprex+i.filename}
      });
      this.AddVisible = true;*/
    },
    handleupsuccess:function(res,file,filelist){
      this.renterform.idjpg=filelist.map((e)=>{
        if(e.response){
          return {filename:e.response,savetoidcard:true};
        }else{
          return {filename:e.name,savetoidcard:false};
        }
         });
         this.reqhandlejpg=true;
      console.log(filelist);

    },
    requesthandlejpgs:function () {
      axios.post('/fileupload/handlejpgs',{delete:this.deletejpgs,save:this.renterform.idjpg},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then(function(response){

      }).catch(function (error) {
        console.log(error);
      });
    },
    handlesubmit:function(){
      let vm = this;
      if(this.edit){
        axios.post('/customerpage/edit',{data:this.renterform},{
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest:[(data)=>`data=`+JSON.stringify(data)]
        }).then(function(response){
          if(response.data.success){
            vm.AddVisible=false;
            vm.reqhandlejpg&&vm.requesthandlejpgs();
          }else{
            vm.$confirm('该租盘并不存在', '提示', {
               confirmButtonText: '确定',
               type: 'warning'
             }).then(() => {

             }).catch(() => {

             });

          }
        }).catch(function (error) {
          console.log(error);
        });

      }else{
        axios.post('/customerpage/add',{data:this.renterform},{
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest:[(data)=>`data=`+JSON.stringify(data)]
        }).then(function(response){
          if(response.data.success){
            vm.AddVisible=false;
            vm.requesthandlejpgs();
          }else{

          }
        }).catch(function (error) {
          console.log(error);
        });
      }

    },
    handlefileexceed:function (){
      this.$confirm('不能上传更多身份证照片了', '提示', {
         confirmButtonText: '确定',
         type: 'warning'
       }).then(() => {

       }).catch(() => {

       });
    },
    handleremovejpg:function (file,filelist) {
      file.response?this.deletejpgs.push({filename:file.response,deletefromidcard:false}):this.deletejpgs.push({filename:file.name,deletefromidcard:true});
      this.renterform.idjpg=filelist.map((e)=>{
        if(e.response){
          return {filename:e.response,savetoidcard:true};
        }else{
          return {filename:e.name,savetoidcard:false};
        }
         });
         this.reqhandlejpg=true;
      console.log(filelist);

    }
  },
data () {
  return {
    idjpglist:[

    ],
    edit:false,
    reqhandlejpg:false,
    renters:[],
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
    baseform:{
      id:"",
      name:"",
      idnum:"",
      callnum:"",
      idjpg:[],
      roomate:"",
      checkin:"",
      address:"",
      hnum:"",
      checkout:"",
    },
    renterform:{
      id:"",
      name:"",
      idnum:"",
      callnum:"",
      idjpg:[],
      roomate:"",
      checkin:"",
      address:"",
      hnum:"",
      checkout:"",
    }
  }
}
}
</script>

<style scoped>
.m-customer-card-action{
  display: flex;
  justify-content: flex-end;
  margin-top: .1rem;
}
.m-customer-card-action span{
  margin-left: .1rem;
  color: rgb(102, 177, 255);
}
.m-customer-date{
  color: #909399;
  font-size: .14rem;
  display: inline-block;
  margin-right: .1rem;
}
.m-customer-card-address{
  color: #606266;
  font-size: .14rem;
}
.m-customer-card-name{
  font-size: .15rem;
  font-weight: 600;
  color: #303133;
}
.m-customer-card{
  margin-top: .1rem;
  font-size: .15rem;
  background-color: white;
  padding: .2rem .2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
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
