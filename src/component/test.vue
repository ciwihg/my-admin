  <template>
<div>
  <div v-for="(item,index) in tables">
    <div>{{index}}</div>
    <el-input v-model="item.current" placeholder="请输入水表记录" @change="hinputc(index)">
    </el-input>
    <el-select v-model="item.chargeid" placeholder="请选择计费规则" @change="hselec(index)">
        <el-option
          v-for="item in rules"
          :key="item.cid"
          :label="item.name"
          :value="item.cid">
        </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-plus" circle @click="hadd1"></el-button>
    <el-button type="primary" icon="el-icon-remove" circle @click="hdel1"></el-button>
  </div>
</div>
</template>

<script>
export default {
  model: {
   prop: 'meters',
   event: 'mchange'
 },
 props:['meters','type'],
data () {
  return {
    rules:[
      {cid:1,
      name:'1'},
      {cid:2,
      name:'2'}
    ],
    tables:[
      {
        number:0,
        current:0,
        date:Date.now(),
        type:this.type,
        chargeid:''
      },
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
computed:{

},
methods:{
  hadd1:function () {
    this.tables.push({
      number:this.tables.length,
      current:0,
      date:Date.now(),
      type:this.type,
      chargeid:''
    });
    this.$emit('mchange',this.tables);
  },
  hdel1:function () {
    this.tables.pop();
    this.$emit('mchange',this.tables);
  },
  hinputc:function (i) {

    console.log(i);
    this.$emit('mchange',this.tables);
  },
  hselec:function (i) {
    console.log("s:"+i);
    this.$emit('mchange',this.tables);
  }
}
}
</script>

<style scoped>

</style>
