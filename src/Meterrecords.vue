<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" @click="tt">
          <div class="m-meter-header-number">{{hinfo.number}}</div>
          <div class="m-meter-header-address">{{hinfo.address}}</div>
      </div>
    </div>
    <div class="m-content-wrap">
      <div class="m-mode-bar">
        <el-radio v-model="displaymode" label="compare">对比表格</el-radio>
        <el-radio v-model="displaymode" label="independent">单独表格</el-radio>
      </div>
      <div>
        <el-table :data="comparetable">
          <el-table-column v-for="item in comparetabledata"
      :prop="item.type+item.number"
      :label="item.type+item.number"
      width="180">
    </el-table-column>
        </el-table>
      </div>
      <div v-if="displaymode=='independent'">
      <div class="m-tabs-wrap">
         <m-selecttabs v-model="activetype" @updateactive="handletypeswitch">
          <m-singetab name="water">水表</m-singetab>
          <m-singetab name="eletric">电表</m-singetab>
        </m-selecttabs>
      </div>
        <div class="m-select-bar">
        <el-select class="m-select-meter" v-model="postdata.mid" placeholder="请选择" @change="handleSubmit">
            <el-option
              v-for="item in ometers"
              :key="item.id"
              :label="swtype[item.type]+item.number"
              :value="item.id">
            </el-option>
        </el-select>
        <el-select class="m-select-year" v-model="postdata.year" placeholder="请选择" @change="handleSubmit">
            <el-option
              v-for="item in oyears"
              :key="item.YEARS"
              :label="item.YEARS+`年`"
              :value="item.YEARS">
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
    this.hinfo = this.$route.params.info;
    axios.post('/recordspage/getrecords',this.$route.params,{
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest:[(data)=>`data=`+JSON.stringify(data)]
    }).then((response)=>{
      console.log(response.data);
      this.datascopy = response.data;
      this.comparetabledata = response.data.meters;
      this.postdata.mid = this.datascopy.wmeterdefault;
      this.ometers = this.datascopy.water;
      this.tableData = this.datascopy.wrecords;
    }).catch((err)=>{
      console.log(err);
    });
  },
  computed:{
  oyears:function(){
     let result=[];
          if(this.postdata.mid!=''){
            this.postdata.year=this.datascopy.years[this.postdata.mid][0].YEARS;
            result= this.datascopy.years[this.postdata.mid];
          }
    return result;
  },
  comparetable:function(){
    let result={};
    this.comparetabledata.forEach((item) => {
      result[item.type+item.number]=item.data ;
    });
    console.log(result);
    return [result];
  }
  },
  data () {
    return {
      displaymode:"compare",
      activetype:"water",
      cmeter:"0",
      ometers:[],
      hinfo:{
        number:"",
        address:""
      },
      comparetabledata:[],
      datascopy:{},
      postdata:{
        mid:'',
        year:''
      },
      swtype:{
        water:'水表',
        eletric:'电表'
      },
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
    handleSubmit:function(){
      console.log(this.postdata);
      axios.post('/recordspage/getrecordsbymidandyear',this.postdata,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then((response)=>{
        this.tableData = response.data;
      }).catch((err)=>{
        console.log(err);
      })
    },
    tt:function () {
      console.log(this.activetype);
    },
    handleEdit:function (scop) {
      console.log(scop);
    },
    handleDelete:function (scop) {
      console.log(scop);
    },
    switchDefaultdatas:function (type) {
      const stable={
        water:'w',
        eletric:'e'
      };
      this.postdata.mid = this.datascopy[stable[type]+'meterdefault'];
      this.ometers = this.datascopy[type];
      this.tableData = this.datascopy[stable[type]+'records'];
    },
    handletypeswitch:function(tab){
      this.switchDefaultdatas(tab);
    }
  }
}
</script>

<style scoped>
.m-mode-bar{
  font-size: 0;
  padding: .2rem;
}
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
