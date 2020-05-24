<template>
<div>
  <div class="header">
    <div class="m-header-nav">
        <div class="menu-btn" @click="handleOpendrawer">
            <i class="el-icon-minus menu-btn-el"></i>
            <i class="el-icon-minus menu-btn-el"></i>
            <i class="el-icon-minus menu-btn-el"></i>
       </div>
       <div class="m-usr-wrap">
         <div class="m-usr-img"><img :src="usrimg"></div>
         <i class="el-icon-caret-bottom m-usr-icon"></i>
       </div>
   </div>
</div>
<div class="m-title-bar">
  <span v-if="showbtnback" @click="$router.go(-1)" class="m-navbtn-back"><i class="el-icon-back"/></span><span>{{title}}</span>
</div>
<router-view :title.sync="title"></router-view>
  <el-drawer ref="drawer"
  :visible.sync="opendraw"
  direction="ltr"
  :with-header="false"
  size="60.83%">
  <div class="brand-name">
    <span>RentAdmin</span>
  </div>
<el-menu
default-active="/"  :router="true">
<el-menu-item index="/">
    <i class="el-icon-s-home"></i>
    <span>首页</span>
</el-menu-item>
<el-menu-item index="/house">
    <i class="el-icon-location"></i>
    <span>我的租盘</span>
</el-menu-item>
<el-menu-item index="/chargeitems">
  <i class="el-icon-menu"></i>
  <span slot="title">收费项目</span>
</el-menu-item>
<el-menu-item index="/records">
  <i class="el-icon-document"></i>
  <span slot="title">水电表记录</span>
</el-menu-item>
<el-menu-item index="/customer">
  <i class="el-icon-setting"></i>
  <span slot="title">客户管理</span>
</el-menu-item>
<el-menu-item index="/checkout">
  <i class="el-icon-setting"></i>
  <span slot="title">抄表打印</span>
</el-menu-item>
</el-menu>
</el-drawer>
</div>
</template>

<script>
import uimg from '../assets/img/usr.png';

export default {
  mounted:function(){
    console.log(this.$refs.drawer);
  },
  data () {
    return {
      msg: 'Hello world!',
      opendraw: false,
      usrimg:uimg,
      title:'首页',
      showbtnback:false
    }
  },
  methods:{
    drawpie(){

    },
    handleOpendrawer(){
      this.opendraw=true;
    }
  }
}
</script>

<style scoped>
.m-navbtn-back{
  margin-right: .2rem;
}
.m-navbtn-back i{
  font-size: .2rem;
  color: #409eff;
  font-weight: 700;
}
.m-title-bar{
margin: 0 .3rem 0 .3rem;
background-color: rgb(255,255,255);
padding:.2rem .2rem .2rem .2rem;
font-size: 0;
height: .4559rem;
line-height:  .4559rem;
margin-top: -.4279rem;
border-radius: 3px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
.m-title-bar span{
  font-size: .18rem;
  color: #34395e;
  font-weight: 700;
}
.menu-btn-el{
  font-size: 0.21rem;
  display: inline-block;
  line-height: .3;
  color: white;
}
.menu-btn{
  display: inline-flex;
  flex-direction: column;
}
.header {
  background-color: #409eff;
  height: 1.15rem;
}
.brand-name{
  text-align: center;
  font-size: 0.14rem;
  height: .6rem;
  line-height: .6rem;
  font-weight: 700;
  letter-spacing: 0.015rem;
  color: #000;
}
.m-header-nav{
font-size: 0;
margin-left: 0.32rem;
padding-top: 0.2rem;
margin-right:0.32rem;
display:flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
}
.m-usr-icon{
  font-size: 0.1rem;
  color: white;
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.08rem;
}
.m-usr-wrap{
  display: inline-block;
  font-size: 0;
}
.m-usr-img{
  vertical-align: middle;
  display: inline-block;
}
.m-usr-img img{
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  overflow: hidden;
}
</style>
