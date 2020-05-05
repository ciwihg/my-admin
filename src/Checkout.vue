<template>
<div class="m-list-wrap">
  <el-table
  size="medium"
    :data="tableData"
    @row-click="handlerowclick"
    style="width: 100%">
    <el-table-column
      class="m-list-style"
      align="center"
      prop="date"
      label="起租日">
    </el-table-column>
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
  </el-table>

</div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
data () {
  return {
    title:"抄表及打印",
    tableData:[{
      date:"05-03",
      number:"201",
      address:"横潭大街32-1号"
    }]
  }
},
created:function(){
  let vm = this;
  this.$emit('update:title',this.title);
  this.$parent.$refs.drawer&&this.$parent.$refs.drawer.closeDrawer();
  axios.get("/checkoutpage").then(function(res){
    vm.tableData = res.data;
  }).catch(function (err) {
    console.log(err);
  });

},
methods:{
  handlerowclick:function (row) {
    console.log(row);
    this.$router.push({name:'Inputprint',params:{hid:row.id}});
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

</style>
