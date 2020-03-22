  <template>
<div class="m-list-wrap">
  <div class="m-records-tab">
    <div class="m-records-bg"><i class="el-icon-s-home"/></div>
    <div class="m-records-title">选择租盘</div>
  </div>
</div>
</template>

<script>
export default {
  created:function(){
    this.$emit('update:title',this.title);
    this.$parent.$refs.drawer.closeDrawer();
  },
data () {
  return {
     title:"水电表记录"
  }
}
}
</script>

<style scoped>
.m-records-title{
  font-size: .18rem;
  padding: .25rem .3rem;
}
.m-records-bg{
  background-color: #409eff;
  font-size: 0;
  height: 2rem;
  text-align: center;
}
.m-records-bg i{
  margin-top: .7rem;
  font-size: .65rem;
  color: white;
}
.m-records-tab{

}
.m-list-wrap{
 margin: .2rem .3rem 0 .3rem;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
</style>
