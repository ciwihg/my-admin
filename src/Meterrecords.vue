<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body" @click="tt">
          <div class="m-meter-header-number">{{hinfo.number}}</div>
          <div class="m-meter-header-address">{{hinfo.address}}</div>
      </div>
    </div>
    <div class="m-meters-wrap">
      <el-table
        :data="datascopy.meters"
        row-class-name="m-meter-style"
        style="width: 100%"
        @row-click="handlemeteredit">
        <el-table-column
          prop="name"
          label="表名"
          align="center"
          min-width>
        </el-table-column>
        <el-table-column
          prop="data"
          label="最后记录"
          align="center"
          min-width>
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          align="center"
          min-width>
        </el-table-column>
      </el-table>
    </div>
    <div class="m-content-wrap">
      <div class="m-mode-bar">
        <el-radio v-model="displaymode" label="compare">对比表格</el-radio>
        <el-radio v-model="displaymode" label="independent">单独表格</el-radio>
      </div>
      <div v-if="displaymode=='compare'">
        <div class="m-compare-topbar">
          <el-date-picker
            value-format="yyyy"
            v-model="compareYear"
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

      <div><el-button type="primary" @click="handleidpadd">新增记录</el-button></div>
        <div class="m-select-bar">
        <el-select class="m-select-meter" v-model="postdata.mid" placeholder="请选择" >
            <el-option
              v-for="item in ometers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
        <el-date-picker
          value-format="yyyy"
          v-model="indepYear"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </div>
      <el-table
      :data="idptabledata"
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
    value-format="yyyy-MM-dd"
    type="date"
    placeholder="选择年">
  </el-date-picker>
  <el-button @click="handlecomaddnext" type="primary" v-if="cmeternum<datascopy.meters.length">下一项</el-button>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cformVisible = false">取 消</el-button>
    <el-button type="primary" v-if="cmeternum==datascopy.meters.length" @click="haddandeditsumbit">保 存</el-button>
  </span>
</el-dialog>
  <el-dialog
  v-if="datascopy.meters"
  @close="handleiformclose"
  title="新增记录"
  :visible.sync="iformVisible"
  :show-close="false"
  width="90%">
  <div><span>{{cmetername}}</span></div>
  <el-input  v-model="cmeterdata" placeholder="请输入记录"></el-input>
  <el-date-picker
    v-model="cpostdate.date"
    value-format="yyyy-MM-dd"
    type="date"
    placeholder="选择日期">
  </el-date-picker>
  <span slot="footer" class="dialog-footer">
    <el-button @click="iformVisible = false">取 消</el-button>
    <el-button type="primary"  @click="hiaddandeditsumbit">保 存</el-button>
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
    this.init();
  },
  computed:{
  oyears:function(){
     let result=[];
          if(this.postdata.mid!=''){
            (this.datascopy.years[this.postdata.mid][0])&&(this.postdata.year=this.datascopy.years[this.postdata.mid][0].YEARS);
            result= this.datascopy.years[this.postdata.mid];
          }
    return result;
  },
  idptabledata:function(){
    let vm = this;
    let result=this.datascopy.records[this.postdata.mid].filter((i)=>{
      if(i.date.substring(0,4)==vm.indepYear){
        return true;
      }else{
        return false;
      }
    });
    return result;
  },
  metersobj:function () {
    let result={};
    this.datascopy.meters.forEach((item) => {
      result[item.id]=item;
    });
    return result;
  },
  comparetable:function(){
    let result={};
    let records;
    let maxyear=0;
    (this.datascopy.records)&&(records=Object.values(this.datascopy.records));
    console.log(records);
    if(Array.isArray(records)){
      records.forEach((item) => {
        item.forEach((i) => {
          if(result[i.date]){
            result[i.date].datas.push(i);
            result[i.date][i.mid]=i.data;
            result[i.date].rids[i.mid]=i.id;
            (parseInt(i.date.substring(0,4))>maxyear)&&(maxyear=parseInt(i.date.substring(0,4)));
          }else{
            result[i.date]={date:i.date,rids:{},datas:[]};
            result[i.date].datas.push(i);
            result[i.date].rids[i.mid]=i.id;
            result[i.date][i.mid]=i.data;
            (parseInt(i.date.substring(0,4))>maxyear)&&(maxyear=parseInt(i.date.substring(0,4)));
          }
        });

      });

    }
  (this.compareYear=="0")&&(this.compareYear=String(maxyear));
    let vm =this;
    let t= Object.values(result).filter((i)=>{
      if(i.date.substring(0,4)==vm.compareYear){
        return true;
      }else{
        return false;
      }
    });
    console.log(t);
    return t;
  }
  },
  data () {
    return {
      compareYear:"0",
      indepYear:"2020",
      filterrecords:[],
      cpostdate:{
        records:[],
        date:""
      },
      medit:false,
      meditid:"",
      iformVisible:false,
      cedit:false,
      iedit:false,
      ieditrid:'',
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
      tableData: []
    };
  },
  methods:{
    init:function() {
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
        this.ometers = response.data.meters;
        let yearl=this.datascopy.years[this.postdata.mid].length;

        this.indepYear = String(this.datascopy.years[this.postdata.mid][yearl-1].YEARS);
        //console.log(this.datascopy.years[this.postdata.mid][yearl-1].YEARS);
      }).catch((err)=>{
        console.log(err);
      });
    },
    handleiformclose:function(){
    },
    handleCyearchange:function(v){


    },
    handlemeteredit:function (row) {
      console.log(row);
      this.iedit=false;
      this.medit=true;
      this.cpostdate.records=[];
      this.iformVisible=true;
      this.cmetername=row.name;
      this.cmeterdata=row.data;
      this.cpostdate.date=row.date;
      this.meditid=row.id;
    },
    handleidpadd:function () {
      console.log(this.ometers);
      this.iedit=false;
      this.medit=false;
      this.cmetername=this.swtype[this.metersobj[this.postdata.mid].type]+this.metersobj[this.postdata.mid].number;
      this.cmeterdata="";
      this.cpostdate.records=[];
      this.cpostdate.date="";
      this.iformVisible=true;
    },
    hiaddandeditsumbit:function () {
      let path;
    /*  if(this.iedit){
        this.cpostdate.records.push({rid:this.ieditrid,data:this.cmeterdata});
        path="editallrecords";
      }else{
        this.cpostdate.records.push({id:this.postdata.mid,data:this.cmeterdata});
        path="addallrecords";
      }*/
      switch(true){
        case this.iedit:this.cpostdate.records.push({rid:this.ieditrid,data:this.cmeterdata}),
                        path="editallrecords"; console.log("133");break;
        case this.medit:this.cpostdate.records.push({mid:this.meditid,data:this.cmeterdata}),
                        path="editmeter",console.log("233"); break;
            default:this.cpostdate.records.push({id:this.postdata.mid,data:this.cmeterdata}),
                        path="addallrecords";console.log("333");
      }

      console.log(this.cpostdate);
      axios.post('/recordspage/'+path,this.cpostdate,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then((response)=>{
        this.iformVisible = false;
        this.init();
      }).catch((err)=>{
        console.log(err);
      });
    },
    haddandeditsumbit:function () {
      let path;
      this.cedit?path='editallrecords':path='addallrecords';
      axios.post('/recordspage/'+path,this.cpostdate,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest:[(data)=>`data=`+JSON.stringify(data)]
      }).then((response)=>{
        this.cformVisible = false;
        this.init();
      }).catch((err)=>{
        console.log(err);
      });
    },
    handlecEdit:function (row) {
      if(row.datas.length!=this.datascopy.meters.length){
        this.$confirm(`${row.date}记录不能进行批量修改`, {
            confirmButtonText: '确定',
            showClose:false,
            center:true,
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
          return;
      }
      this.ceditdata=row;
      this.cedit=true;
      this.cmeternum=0;
      this.cpostdate.records=[];
      this.cpostdate.date="";
      this.cformVisible=true;
      this.cmetername=this.swtype[this.datascopy.meters[this.cmeternum].type]+this.datascopy.meters[this.cmeternum].number;
      this.cmeterdata=this.ceditdata[this.datascopy.meters[this.cmeternum].id];
    },
    handlecDelete:function (row) {
      if(row.datas.length!=this.datascopy.meters.length){
        this.$confirm(`${row.date}记录不能进行批量删除`, {
            confirmButtonText: '确定',
            showClose:false,
            center:true,
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
      }else{
        this.$confirm(`确定要删除${row.date}这条记录?`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showClose:false,
            center:true,
            type: 'warning'
          }).then(() => {
            axios.post('/recordspage/deleteallrecord',row,{
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              transformRequest:[(data)=>`data=`+JSON.stringify(data)]
            }).then((response)=>{
              this.init();
            }).catch((err)=>{
              console.log(err);
            });
          }).catch(() => {

          });
      }

    },
    handlecomaddnext:function (){
      let temp={};
      temp.id = this.datascopy.meters[this.cmeternum].id;
      (this.cedit)&&(temp.rid = this.ceditdata.rids[temp.id]);
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
      this.cedit=false;
      this.cmeternum=0;
      this.cmeterdata="";
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
      this.medit=false;
      this.iedit=true;
      this.ieditrid=scop.id;
      this.cpostdate.records=[];
      this.cpostdate.date=scop.date;
      this.cmetername=this.swtype[this.metersobj[scop.mid].type]+this.metersobj[scop.mid].number;
      this.cmeterdata=scop.data;
      this.iformVisible=true;
    },
    handleDelete:function (scop) {
      console.log(scop);
      this.$confirm(`确定要删除这条记录?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose:false,
          center:true,
          type: 'warning'
        }).then(() => {
          axios.post('/recordspage/deleteallrecord',{datas:[scop]},{
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest:[(data)=>`data=`+JSON.stringify(data)]
          }).then((response)=>{
            this.init();
          }).catch((err)=>{
            console.log(err);
          });
        }).catch(() => {

        });
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
  justify-content: center;
}
.m-compare-topbar i{
  margin-left: .1rem;
}
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
  padding: 0 .1rem;
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
