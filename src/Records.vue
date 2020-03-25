  <template>
<div class="m-list-wrap">
  <div class="m-records-tab" @click="dialogVisible=true">
    <div class="m-records-bg"><i class="el-icon-s-home"/></div>
    <div class="m-records-title">按租盘查询</div>
  </div>
  <el-dialog
  :visible.sync="dialogVisible"
  width="90%">
  <div  class="m-dialog-title">选择租盘</div>
  <el-form label-position="top">
    <el-form-item label="房号">
      <el-input v-model="postdata.number" placeholder="请输入房号"></el-input>
    </el-form-item>
    <el-form-item label="地址">
      <el-select v-model="postdata.address" placeholder="请选择地址">
        <el-option
          v-for="item in address"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div class="m-dialog-footer" slot="footer">
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
  </div>
</el-dialog>
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
     title:"水电表记录",
     dialogVisible:false,
     postdata:{
       number:"",
       address:""
     },
     address:[
       'hengtan',
       'chaoyang'
     ]
  }
},
methods:{
  handleSubmit:function () {
    console.log(this.postdata);
    //this.$router.push({path:'/records/meter/1'});
  }
}
}
</script>

<style scoped>
.m-dialog-title{
  font-size: .20rem;
  line-height: .27rem;
  font-weight: 700;
  color: rgb(108, 117, 125);
  margin-bottom: .2rem;
}
.m-dialog-footer{
  text-align: right;
  background-color: rgb(247, 249, 249);
  margin: 0 -20px -20px -20px;
  font-size: 0;
  padding: .15rem .2rem;
}
.m-records-title{
  font-size: .18rem;
  padding: .25rem .3rem;
  background-color: white;
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
 border-radius: 3px;
}
.m-list-wrap{
 margin: .2rem .3rem 0 .3rem;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
</style>
