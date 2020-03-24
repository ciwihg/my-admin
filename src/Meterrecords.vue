<template>
  <div class="m-list-wrap">
    <div class="m-meter-header">
      <div class="m-meter-header-body">
          <div class="m-meter-header-number">101房</div>
          <div class="m-meter-header-address">朝阳巷5号</div>
      </div>
    </div>
    <div>
         <m-selecttabs v-model="activetype">
          <m-singetab name="水表">水表</m-singetab>
          <m-singetab name="电表">电表</m-singetab>
        </m-selecttabs>
    </div>
  </div>
</template>

<script>
import Selecttabs from "./component/selecttabs.vue";
import Singetab from "./component/singletab.vue";
export default {
  name: '',
  components:{
    "m-selecttabs":Selecttabs,
    "m-singetab":Singetab
  },
  data () {
    return {
      activetype:"水表"
    };
  },
  methods:{
    handletypeswitch:function(tab, event){
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>
.m-meter-header-body{
  display: inline-block;
  vertical-align: top;
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
