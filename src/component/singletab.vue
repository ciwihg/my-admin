<template>
  <div class="m-singetab-wrap" :class="{isactive:active}" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: '',
  props:['name','nowactive','type'],
  data () {
    return {
      active:false,
      position:''
    };
  },

created:function(){
},
computed:{

},
methods:{
  handleClick:function () {
    this.$parent.handleClick(this);

  }
}
}
</script>

<style scoped>
.m-singetab-wrap{
  display: inline-block;
  font-size: .14rem;
  padding: .05rem .1rem;
}
.isactive{
  color:#409eff;
}
</style>
