<template>
  <div >
    <div class="m-tabs-wrap" ref="tabs">
      <slot></slot>
    </div>
    <div class="m-selecttabs-indicator">
      <div ref="indicator"></div>
    </div>
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
  created:function(){


  },
  mounted:function(){

    let vm = this,tabslength=this.$refs.tabs.children.length,p,
    htmlfontsize=window.document.documentElement.style.fontSize.match(/[0-9]+/);
    this.hpadding=htmlfontsize[0]*0.2;
     for(let i=0;i<tabslength;i++){
        i == 0?(p=this.hpadding/2):(p+=this.$refs.tabs.children[i-1].offsetWidth);
       this.widths.push({
         element:this.$refs.tabs.children[i],
         width:this.$refs.tabs.children[i].offsetWidth,
         position:p
       });
     }
     console.log(this.widths);
    //this.$refs.tabs.children.map((item)=>{
    //  vm.widths.push(item.offsetWidth);
  //  });
    this.$children.map((item)=>{
      item.name==vm.tabactive?(item.active=true,vm.nactive=item):item.active=false;
      vm.widths.map((sitem)=>{
        (sitem.element === item.$el)&&(item.position=sitem.position);
      })
    });

    this.$refs.indicator.style.width=`${this.nactive.$el.offsetWidth-this.hpadding}px`;
    this.$refs.indicator.style.transform=`translateX(${this.nactive.position}px)`;
  },
  props:['tabactive'],
  data () {
    return {
     nactive:{},
     widths:[],
     htmlfontsize:0,
    };
  },
  methods:{
    handleClick:function (t) {
      //console.log(this.$children[0]);
      this.nactive.active = false;
      t.active = true;
      this.nactive = t;
      console.log(t);
      this.$refs.indicator.style.width=`${t.$el.offsetWidth-this.hpadding}px`;
      this.$refs.indicator.style.transform=`translateX(${t.position}px)`;
     this.$emit("updateactive",t.name);
     this.$emit("tabclick",t);
    }
  }
}
</script>

<style scoped>
.m-tabs-wrap{
  font-size: 0;
}
.m-selecttabs-indicator{
  height: 2px;
  background-color: #e4e7ed;
  font-size: 0;
}
.m-selecttabs-indicator div{
  content: "";
  display: inline-block;
  background-color: #409eff;
  height: 2px;
  transition: all .3s;
}
</style>
