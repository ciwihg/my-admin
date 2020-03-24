<template>
  <div >
    <slot v-on:tabclick="handleClick"></slot>
  </div>
</template>

<script>
import stab from './singletab.vue';
export default {
  name: '',
  components:{
    "m-s-tab":stab,
  },
  model:{
    prop:"tabactive",
    event:"updateactive"
  },
  props:['tabactive'],
  data () {
    return {

    };
  },
  methods:{
    handleClick:function () {
      console.log(1);
    //  this.$emit("updateactive",tab);
    }
  }
}
</script>

<style scoped>
</style>
