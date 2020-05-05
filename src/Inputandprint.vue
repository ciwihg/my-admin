<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" @click="tt">
          <div class="m-meter-header-number">201</div>
          <div class="m-meter-header-address">11111</div>
      </div>
    </div>
    <div class="m-input-wrap">
    <div class="m-input-card">
      <div class="m-input-title">电表0</div>
      <div class="m-input-last">末次记录:123 2020-03-05</div>
      <el-input placeholder="请输入内容" v-model="input1">
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
    <div class="m-input-card">
      <div class="m-input-title">电表0</div>
      <div class="m-input-last">末次记录:123 2020-03-05</div>
      <el-input placeholder="请输入内容" v-model="input1">
        <template slot="prepend">本次记录</template>
      </el-input>
    </div>
     <div class="m-input-footer"><el-button type="primary">生成账单</el-button></div>
    </div>
  </div>
</template>

<script>
export default {
data () {
  return {
    title:"抄表及打印1"
  }
},
created:function () {
  let vm = this;
  this.$parent.showbtnback=true;
  this.$emit('update:title',this.title);
  console.log(this.$route.params.hid);
  this.$parent.$refs.drawer&&this.$parent.$refs.drawer.closeDrawer();
  /*axios.get("/checkoutpage").then(function(res){
    vm.tableData = res.data;
  }).catch(function (err) {
    console.log(err);
  });*/
},
destroyed:function(){
  this.$parent.showbtnback=false;
}
}
</script>

<style scoped>
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
