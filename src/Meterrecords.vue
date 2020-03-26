<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" @click="tt">
          <div class="m-meter-header-number">101房</div>
          <div class="m-meter-header-address">朝阳巷5号</div>
      </div>
    </div>
    <div class="m-content-wrap">
      <div class="m-tabs-wrap">
         <m-selecttabs v-model="activetype">
          <m-singetab name="水表">水表</m-singetab>
          <m-singetab name="电表">电表</m-singetab>
        </m-selecttabs>
      </div>
        <div class="m-select-bar">
        <el-select class="m-select-meter" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <el-select class="m-select-year" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
      <el-table
      :data="tableData"
      :stripe="true"
      style="width: 100%">
      <el-table-column
        prop="data"
        label="记录"
        align="center"
        class="m-list-style">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        align="center"
        class="m-list-style">
      </el-table-column>
      <el-table-column
        align="center"
        class="m-list-style"
        label="操作">
        <template slot-scope="scope">
          <i @click="handleEdit(scope.row)" class="el-icon-edit-outline m-meter-btn"/>
          <i @click="handleDelete(scope.row)" class="el-icon-delete-solid m-meter-btn"/>
        </template>
      </el-table-column>
    </el-table>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
import Selecttabs from "./component/selecttabs.vue";
import Singetab from "./component/singletab.vue";
export default {
  name: '',
  components:{
    "m-selecttabs":Selecttabs,
    "m-singetab":Singetab
  },
  created:function(){
    let vm = this;

    axios.post('/recordspage/getrecords',this.$route.params,{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[(data)=>`data=`+JSON.stringify(data)]
    }).then((response)=>{
      console.log(response.data);
      
    }).catch((err)=>{
      console.log(err);
    });
  },
  data () {
    return {
      activetype:"电表",
      value:"0",
      options:[
        {
          label:'水表0',
          value:"0",
        },
        {
          label:'水表1',
          value:"1",
        },

      ],
      tableData: [{
           date: '2016-05-02',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1518 弄'
         }, {
           date: '2016-05-04',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1517 弄'
         }, {
           date: '2016-05-01',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1519 弄'
         }, {
           date: '2016-05-03',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1516 弄'
         }]
    };
  },
  methods:{
    tt:function () {
      console.log(this.activetype);
    },
    handleEdit:function () {

    },
    handleEdit:function () {

    },
    handletypeswitch:function(tab, event){
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>
.m-meter-btn{
  color:#409eff;
  font-size: .2rem;
}
.m-select-meter{
  margin-right: .05rem;
}
.m-select-year{
  margin-left: .05rem;
}
.m-tabs-wrap{
  padding: .1rem .2rem;
}
.m-content-wrap{
  margin-top: .2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  background-color: white;
}
.m-list-style{
  width:33%;
}
.m-select-bar{
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  margin-top: .1rem;
  padding: .05rem .1rem;
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
.m-list-wrap{
  margin: .2rem .3rem 0 .3rem;
}
</style>
