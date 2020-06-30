<template>
  <div class="m-fliter-bar">
    <el-select v-model="Saddr" placeholder="请选择地址">
    <el-option
      v-for="addr in address"
      :key="addr.address"
      :label="addr.address"
      :value="addr.address">
    </el-option>
  </el-select>
  <el-input v-model="hnum" placeholder="请输入房号"></el-input>
  <el-button type="primary" @click="handlefilter">筛选</el-button>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
  name: 'filterbar',
  props:['handler'],
  created:function(){

    let vm = this;
    axios.get('housepage/gethaddrs')
    .then(function (response) {
    vm.address=response.data;
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
     Saddr:'',
     address:[],
     hnum:"",
    };
  },
  methods:{
    handlefilter:function () {
      this.handler({number:this.hnum,address:this.Saddr});
    }
  }
}
</script>

<style scoped>
.m-fliter-bar{
  font-size: 0;
  padding: .2rem 0;
  background-color: white;
  text-align: center;
  margin-bottom: .15rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
.m-fliter-bar div{
  margin-bottom: .1rem;
  width: 90%;
}
.m-fliter-bar button{
  width: 90%;
}
</style>
