<template lang="html">
  <div class="m-login-wrap">
    <div class="m-login-bg" ref="background" ></div>
    <div class="m-login-body">
      <div class="m-login-body-wrap">
        <h1>RENT ADMIN</h1>
        <h2>欢迎使用Rent Admin管理系统</h2>
    <el-form label-position="top" label-width="80px" class="m-form-wrap" >
  <el-form-item label="用户名">
    <el-input v-model="username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="pw"></el-input>
  </el-form-item>
  <el-button type="primary" class="m-login-btn">登录</el-button>
</el-form>
</div>
</div>
  </div>
</template>

<script>
import Particle from '../utils/background.js';
export default {
name:'login',
data:function(){
  return {
    username:"",
    pw:"",
  }
},
mounted:function(){
  console.log(this.$refs.background);
  new Particle(this.$refs.background,{dotColor:'rgb(140, 197, 255)',lineColor:"rgb(198, 226, 255)"});
}
}
</script>

<style lang="css" scoped>
.m-login-body{
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;

}
.m-login-body-wrap{
  padding:  .4rem;
}
.m-login-body-wrap h1{
  margin-top: 1.2rem;
  font-size: .3rem;
}
.m-login-body-wrap h2{
  font-size: .15rem;
  color: rgb(150,150,150);
  margin-bottom: .8rem;
}
.m-login-wrap{
  position: relative;
  font-size: 0;

  height: 100%;
}
.m-login-bg{
  background-color: white;
  height: 100%;
}
.m-login-btn{
  float: right;
  margin-top: .3rem;
}
</style>
