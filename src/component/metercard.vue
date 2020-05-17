  <template>
<div>
  <div class="m-template-wrap"  v-if="!element.del" v-for="(element,index) in meters">
    <div class="m-template-body">
      <div>
    <div class="m-template-up">
       <span>{{meterlabel+element.number}}</span>
       <el-input  v-if="element.new" class="m-input-override" v-model="element.current" :placeholder="`请输入`+meterlabel+`记录`" @change="handInputC">
       </el-input>
    </div>
    <el-select v-model="element.chargeid" placeholder="请选择计费规则" @change="handSelectC">
        <el-option
          v-for="item in rules"
          :key="item.cid"
          :label="item.name"
          :value="item.cid">
        </el-option>
    </el-select>
  </div>
    <i v-if="!element.new" class="el-icon-remove" @click="handledelete(index)"/>
  </div>

  </div>
  <div class="m-template-footer">
    <i @click="add1meter" class="el-icon-circle-plus"/>
    <i v-if="newmeterslength" @click="del1meter" class="el-icon-remove"/>
  </div>
</div>
</template>

<script>
import {HandleChItmData,ObjToFormdata,DeepClone} from '../../utils/utils.js'
export default {
  props:['rules','type','pmeters','setbtn'],
data () {
  return {
    add:true,
    havenewmeter:false,
    newmeternum:1,
    meters:[
      {
        number:0,
        current:0,
        date:Date.now(),
        type:this.type,
        new:true,
        del:false,
        chargeid:''
      }
    ]
  }
},
created:function(){
  console.log(this.type+'更新');
  let vm = this;
  let empty = [];
  console.log(this.pmeters);
  if(this.pmeters.length==0){
    this.add = true;
    //this.$emit("update:meters",empty);
  }else{
  this.pmeters.map((i)=>{
    vm.meters.push(DeepClone(i));
  });
   this.add = false;
    this.meters.shift();
    this.newmeternum = this.getmaxnumber();
    //this.$emit("update:meters",this.meters);
  }
},
mounted:function(){
  let vm = this;
  console.log(this.pmeters);
  this.meters=[
    {
      number:0,
      current:0,
      date:Date.now(),
      type:this.type,
      new:true,
      del:false,
      chargeid:''
    }
  ];
  if(this.pmeters.length==0){
    this.add = true;
    //this.$emit("update:meters",empty);
  }else{
  this.pmeters.map((i)=>{
    console.log(i);
    vm.meters.push(DeepClone(i));

  });
   this.add = false;
    this.meters.shift();
    this.newmeternum = this.getmaxnumber();
    //this.$emit("update:meters",this.meters);
  }
  this.$emit("update:meters",this.meters);
},
updated:function(){
  console.log("u");
  //this.$emit("update:meters",this.meters);
},
computed:{
  newmeterslength:function () {
    let length=0,havemeter=false;
    this.meters.map((i)=>{
      i.new?(length+=1):(havemeter=true);
    });
    if(havemeter){
      return length>0?true:false;
    }else{
      return length>1?true:false;
    }
  },

  meterlabel:function () {
    const table = {
      water:"水表",
      eletric:"电表"
    };
    return table[this.type];
  }
},
methods:{
  handledelete:function (index) {
     let dellength=0;
    this.meters[index].del=true;
    this.meters.splice(index,1,this.meters[index]);
    this.meters.map((i)=>{
      (i.del)&&(dellength+=1);
    });
    this.$emit("update:meters",this.meters);
    (dellength==this.meters.length)&&(this.setbtn(this.type,false));
  },
    getmaxnumber:function () {
      let max=this.meters[0].number;
      this.meters.map((i)=>{
        (i.number>max)&&(max=i.number)
      });
      return max;
    },
    handInputC:function(){
      this.$emit("update:meters",this.meters);
    },
    handSelectC:function(index){
      this.$emit("update:meters",this.meters);
    },
    add1meter:function(){
      this.newmeternum+=1;
      this.meters.push(
        {
          number:this.newmeternum,
          current:0,
          date:Date.now(),
          type:this.type,
          del:false,
          chargeid:'',
          new:true
        }
      );
      this.$emit("update:meters",this.meters);
    },
    del1meter:function(){
      this.meters.pop();
      let newlength=0;
      this.meters.map((i)=>{
        (i.new)&&(newlength+=1)
      });
      (newlength==0)&&this.setbtn(this.type,false);
      this.$emit("update:meters",this.meters);
    },
}
}
</script>

<style scoped>
.m-template-body i{
  font-size: .35rem;
  color:red;
  margin-left: .2rem;
}
.m-template-body{
  padding-bottom: .1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.m-template-footer i{
  float: right;
  font-size: .3rem;
  color:#409EFF;
}
.m-template-footer::after{
  content: "";
  display: block;
  clear: both;
}
.m-template-up{
  padding-bottom: .1rem;
}
.m-template-wrap{
  margin-top: .2rem;
  padding: .2rem .2rem;

}

</style>
