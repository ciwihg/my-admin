<template>
<div>
  <div id="pie1"></div>
</div>
</template>

<script>
import * as d3 from "d3";
export default {
data () {
  return {
   piedatas:[{label:"已出租",data:8},
          {label:"未出租",data:3}]
  }
},
created:function () {

},
mounted:function () {
  this.drawpie();
},
methods:{
  drawpie(){
    let color = ["#409eff","rgb(160, 207, 255)"];
    let msvg=d3.select("#pie1")
    .append("svg")
    .attr("width","100%")
    .attr("height","400");
    let msvgg=msvg.append('g').attr("transform",`translate(${411 / 2}, ${300 / 2+30})`);
    let pie = d3.pie().value(d => d.data);
    let drawData = pie(this.piedatas);
    //let colorScale = d3.scaleOrdinal().domain(d3.range(0, this.piedatas.length)).range(d3.schemeCategory20c);
    let arc = d3.arc().innerRadius(80).outerRadius(140);
    let arc2 = d3.arc().innerRadius(80).outerRadius(150);
    let textlabel = msvg.append('g').attr("transform",`translate(${411 / 2}, ${320})`);
    let addresslabel = msvg.append('g').attr("transform",`translate(${411 / 2}, ${350})`);
    textlabel.selectAll("g")
             .data(drawData)
             .enter()
             .append("g");
    textlabel.selectAll("g")
             .data(drawData)
             .attr("transform",function(d,i){return `translate(${i*60}, 0)`;})
             .append("rect")
             .attr("fill",function(d,i){return color[i];})
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
            let gwidth = textlabel._groups[0][0].getBBox().width;
            textlabel.attr("transform",`translate(${411 / 2-gwidth/2}, ${340})`);
  addresslabel.append("text")
              .text(function(d) {
              return "横潭大街32-1号 租盘数:30";
              })
              .attr("font-size", "12px")
              .attr("fill",'rgb(100,100,100)');
                let roomtitlewidth = addresslabel._groups[0][0].getBBox().width;
                addresslabel.attr("transform",`translate(${411 / 2-roomtitlewidth/2}, ${380})`);

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
      .attr('fill',function(d,i){console.log(i);return color[i];})
     .attr("d", d => arc(d));
     let textg = msvg.append('g').attr("transform",`translate(${411 / 2}, ${300 / 2+30})`);
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
     return (d.data.data/11*100).toFixed(2)+"%" +"("+d.data.data+")";
     });
  }
}
}
</script>

<style scoped>

</style>
