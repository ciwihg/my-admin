  <template>
<div>
  <div class="m-template-wrap"  v-for="(element,index) in meters">
    <div class="m-template-body">
    <div class="m-template-up">
       <span>{{meterlabel+index}}</span>
       <el-input  v-if="add" class="m-input-override" v-model="element.current" :placeholder="`请输入`+meterlabel+`记录`" @change="handInputC">
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
    <div class="m-template-footer">
      <i v-if="add&&index==meters.length-1" @click="add1meter" class="el-icon-circle-plus"/>
      <i v-if="add&&index>0&&index==meters.length-1" @click="del1meter" class="el-icon-remove"/>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props:['rules','type','pmeters'],
data () {
  return {
    add:true,
    meters:[
      {
        number:0,
        current:0,
        date:Date.now(),
        type:this.type,
        chargeid:''
      }
    ]
  }
},
created:function(){
  console.log(this.type+'更新');
  let vm = this;
  let empty = [];
  if(this.pmeters.length==0){
    this.add = true;
    //this.$emit("update:meters",empty);
  }else{
  this.pmeters.map((i)=>{
    vm.meters.push(i);
  });
   this.add = false;
    this.meters.shift();
    //this.$emit("update:meters",this.meters);
  }
},
mounted:function(){
    //this.$emit("update:meters",this.meters);
},
updated:function(){
  //this.$emit("update:meters",this.meters);
},
computed:{

  meterlabel:function () {
    const table = {
      water:"水表",
      eletric:"电表"
    };
    return table[this.type];
  }
},
methods:{
    handInputC:function(){
      this.$emit("update:meters",this.meters);
    },
    handSelectC:function(index){
      this.$emit("update:meters",this.meters);
    },
    add1meter:function(){
      this.meters.push(
        {
          number:this.meters.length,
          current:0,
          date:Date.now(),
          type:this.type,
          chargeid:''
        }
      );
      this.$emit("update:meters",this.meters);
    },
    del1meter:function(){
      this.meters.pop();
      this.$emit("update:meters",this.meters);
    },
}
}
</script>

<style scoped>
.m-template-body{
  padding-bottom: .1rem;
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
