<template>
  <div class="m-singetab-wrap" :class="{isactive:active}" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: '',
  props:['name','nowactive'],
  data () {
    return {
    };
  },

created:function(){
  console.log(12);
  console.log(this.nowactive);
},
computed:{
  active:function(){
    return this.nowactive==this.name;
  }
},
methods:{
  handleClick:function () {
    console.log("click");
    console.log(this.name);
    this.$emit("tabclick",this.name);
  }
}
}
</script>

<style scoped>
.m-singetab-wrap{
  display: inline-block;
  font-size: .14rem;
}
.isactive{
  color:#409eff;
}
</style>
