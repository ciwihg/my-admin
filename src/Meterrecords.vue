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
      <div v-if="displaymode=='compare'">
        <div class="m-compare-topbar">
          <el-date-picker

            type="year"
            placeholder="选择年">
          </el-date-picker>
          <i class="el-icon-circle-plus m-plus-btn" @click="handlecompareadd"/>
        </div>
        <el-table :data="comparetable">
          <el-table-column
           fixed
           align="center"
      prop="date"
      label="日期"
      width="80">
    </el-table-column>
          <el-table-column v-for="item in comparetabledata"
      :prop="String(item.id)"
      align="center"
      :label="swtype[item.type]+item.number"
      width="60">
    </el-table-column>
    <el-table-column
      align="center"
      prop="action"
      label="操作">
      <template slot-scope="scope">
        <i @click="handlecEdit(scope.row)" class="el-icon-edit-outline m-house-abtn"/>
        <i @click="handlecDelete(scope.row)" class="el-icon-delete-solid m-house-abtn"/>
      </template>
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
    <el-dialog
    v-if="datascopy.meters"
  title="批量新增记录"
  :visible.sync="cformVisible"
  :show-close="false"
  width="90%">
  <div><span>{{cmetername}}</span></div>
  <el-input  v-model="cmeterdata" placeholder="请输入记录" v-if="cmeternum<datascopy.meters.length"></el-input>
  <el-date-picker
  v-model="cpostdate.date"
    v-if="cmeternum==datascopy.meters.length"
    type="date"
    placeholder="选择年">
  </el-date-picker>
  <el-button @click="handlecomaddnext" type="primary" v-if="cmeternum<datascopy.meters.length">下一项</el-button>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cformVisible = false">取 消</el-button>
    <el-button type="primary" @click="cformVisible = false" v-if="cmeternum==datascopy.meters.length">保 存</el-button>
  </span>
</el-dialog>
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
    let records;
    (this.datascopy.records)&&(records=Object.values(this.datascopy.records));
    console.log(records);
    if(Array.isArray(records)){
      records.forEach((item) => {
        item.forEach((i) => {
          if(result[i.date]){
            result[i.date][i.mid]=i.data;
          }else{
            result[i.date]={date:i.date};
            result[i.date][i.mid]=i.data;
          }
        });

      });

    }
    console.log(result);
    return Object.values(result);
  }
  },
  data () {
    return {
      cpostdate:{
        records:[],
        date:""
      },
      cedit:false,
      ceditdata:{},
      cmeternum:0,
      cmetername:"",
      cmeterdata:"",
      cformVisible:false,
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
    handlecEdit:function (row) {
      this.ceditdata=row;
      this.cedit=true;
      console.log(row);
      this.handlecompareadd();
      this.cmeterdata=this.ceditdata[this.datascopy.meters[this.cmeternum].id];
    },
    handlecDelete:function (row) {
      console.log(row);
    },
    handlecomaddnext:function (){
      let temp={};
      temp.id = this.datascopy.meters[this.cmeternum].id;
      temp.data = this.cmeterdata;
      this.cpostdate.records.push(temp);
      this.cmeternum+=1;
        if(this.cmeternum<this.datascopy.meters.length)
        {this.cmetername=this.swtype[this.datascopy.meters[this.cmeternum].type]+this.datascopy.meters[this.cmeternum].number;
         this.cedit?this.cmeterdata=this.ceditdata[this.datascopy.meters[this.cmeternum].id]:this.cmeterdata="";}
        else{
          this.cmetername="日期";
          (this.cedit)&&(this.cpostdate.date=this.ceditdata.date);
        }
        console.log(this.cpostdate);
    },
    handlecompareadd:function () {
      this.cmeternum=0;
      this.cpostdate.records=[];
      this.cpostdate.date="";
      this.cformVisible=true;
      this.cmetername=this.swtype[this.datascopy.meters[this.cmeternum].type]+this.datascopy.meters[this.cmeternum].number;
    },
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
.m-compare-topbar{
  display: flex;
  font-size: 0;
  align-items: center;
}
.m-plus-btn{
  color:#409eff;
  font-size: .4rem;
}
.m-house-abtn{
  color:#409eff;
  font-size: .2rem;
}
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
