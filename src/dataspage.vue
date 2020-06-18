<template>
<div>
  <div id="pie1"></div>
</div>
</template>

<script>
import * as d3 from "d3";
import axios from 'axios';
axios.defaults.baseURL = `https://easyhome.applinzi.com/public/index.php/ciwirent`;
export default {
data () {
  return {
   piedatas:[{label:"已出租",data:8},
          {label:"未出租",data:3}],
   drawdata:{},
  }
},
created:function () {
  this.$emit('update:title','首页');
  this.$parent.$refs.drawer.closeDrawer();
  let vm=this;
  axios.get('/dataspage')
  .then(function (response) {
console.log(response.data);
vm.drawdata=response.data;
})
.catch(function (error) {
  console.log(error);
});
},
mounted:function () {
  //this.drawpie();
  let vm=this;
  axios.get('/dataspage')
  .then(function (response) {
console.log(response.data);
vm.drawdata=response.data;
vm.drawdata.rentrate.forEach((item) => {
  vm.drawpie(item,item.htotal,`${item.name} 租盘数 ${item.htotal}`);
});
vm.drawpie(vm.drawdata.income,vm.drawdata.income.total,`收入统计 总收入 ${vm.drawdata.income.total}`);
})
.catch(function (error) {
  console.log(error);
});


},
methods:{
  drawpie(gdata,total,title){
    let pagewidth=window.document.documentElement.clientWidth;
    let msvg=d3.select("#pie1")
    .append("svg")
    .attr("width","100%")
    .attr("height","400");
    let msvgg=msvg.append('g').attr("transform",`translate(${pagewidth / 2}, ${300 / 2+30})`);
    let pie = d3.pie().value(d => d.data);
    let drawData = pie(gdata.datas);
    let colorScale = d3.range(0.4,1,0.7/gdata.datas.length/2);
    let arc = d3.arc().innerRadius(80).outerRadius(140);
    let arc2 = d3.arc().innerRadius(80).outerRadius(150);
    let textlabel = msvg.append('g').attr("transform",`translate(${pagewidth / 2}, ${320})`);
    let addresslabel = msvg.append('g').attr("transform",`translate(${pagewidth / 2}, ${350})`);
    textlabel.selectAll("g")
             .data(drawData)
             .enter()
             .append("g");
    textlabel.selectAll("g")
             .data(drawData)
             .attr("transform",function(d,i){return `translate(0, 0)`;})
             .append("rect")
             .attr("fill",function(d,i){return d3.interpolateBlues(colorScale[i]);})
             .attr("x",0)
             .attr("y",0)
             .attr("width","15")
             .attr("height","15")
             .attr("rx","2")
             .attr("ry","2");
   textlabel.selectAll("g")
            .data(drawData)
            .append("text")
            .text(function(d) {
            return d.data.label;
            })
            .attr("transform",function(d,i){return `translate(0, 0)`;})
            .attr("x", "18")
            .attr("y", "14")
            .attr("fill",'rgb(100,100,100)')
            .attr("dominant-baseline","text-after-edge")
            .attr("font-size", "12px");
            let strgap=0;
   textlabel.selectAll("g")
            .attr("transform",function(d,i){
              if(i==0){
                strgap=textlabel.selectAll("g")._groups[0][i].getBBox().width+10;
                return `translate(0, 0)`;
              }else{
                let tempgap=strgap;
                textlabel.selectAll("g")._groups[0][i];
                strgap+=textlabel.selectAll("g")._groups[0][i].getBBox().width+10;
                return `translate(${tempgap}, 0)`;
              }

            });
            let gwidth = textlabel._groups[0][0].getBBox().width;
            textlabel.attr("transform",`translate(${pagewidth / 2-gwidth/2}, ${340})`);
  addresslabel.append("text")
              .text(function(d) {
              return title;
              })
              .attr("font-size", "12px")
              .attr("fill",'rgb(100,100,100)');
                let roomtitlewidth = addresslabel._groups[0][0].getBBox().width;
                addresslabel.attr("transform",`translate(${pagewidth / 2-roomtitlewidth/2}, ${380})`);

    msvgg.selectAll("path")
     .data(drawData)
     .enter()
     .append("path")
     .on("mouseover",function(d,i){

       d3.select(this).attr("d", arc2(d));
     })
     .on("mouseout",function(d,i){

       d3.select(this).attr("d", arc(d));
     })
      .attr('fill',function(d,i){console.log(i);return d3.interpolateBlues(colorScale[i]);})
     .attr("d", d => arc(d));
     let textg = msvg.append('g').attr("transform",`translate(${pagewidth / 2}, ${300 / 2+30})`);
     textg.selectAll("text")
     .data(drawData)
     .enter()
     .append('text')
     .attr("transform", function(d) {

     return "translate(" + arc.centroid(d) + ")";})
     .attr("text-anchor", "middle")
     .attr("font-size", "0.13rem")
     .attr("fill",'rgb(250,250,250)')
     .text(function(d) {
     return (d.data.data/total*100).toFixed(2)+"%" +"("+d.data.data+")";
     });
  }
}
}
</script>

<style scoped>

</style>
