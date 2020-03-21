function SetRem(basefont = 100) {
  window.document.documentElement.style.fontSize=window.document.documentElement.clientWidth/411*basefont+'px';
}
function FormatPrice(p){
  var num= new String(p);
  var reg=/[0-9]*\.([0-9]{0,2})/;
  var result = num.match(reg);
  if(result){
    switch(result[1].length){
      case 0:return num+"00";break;
      case 1:return num+"0";break;
      case 2:return result[0];break;
    }
  }else{
    return num+".00";
  }
}
function HandleChItmData(arr){
 return arr.map((item)=>{
   switch(item.type){
     case 'month':item.uprice = FormatPrice(item.uprice)+"元/月";break;
     case 'water':item.uprice = FormatPrice(item.uprice)+"元/m³";break;
     case 'eletric':item.uprice = FormatPrice(item.uprice)+"元/Kwh";break;
   }
   return item;
 });
}
function ObjToFormdata(data,headers) {
  var postdata = '',k;
  for(k in data){
    var temp = k+"="+data[k]+"&";
    postdata+=temp;
  }
  return postdata.slice(0,postdata.length-1);
}
function DeepClone(obj) {
  var nobj = {},tempk;
  for(tempk in obj){
    nobj[tempk] = obj[tempk]
  }
  return nobj;
}
function ArrayClone(arr){
  return arr.map((i)=>{
    return DeepClone(i);
  });
}
function SortChargeitems(items){
  var obj,waters=[],eletrics=[],others=[];
  if(Array.isArray(items)){
        items.map((i)=>{
        i.type=="month"?others.push(i):i.type=="water"?waters.push(i):eletrics.push(i);
      });
    }
  obj={
    water:waters,
    eletric:eletrics,
    other:others
  };
  return obj;
}
function HandleMeters(data){
  let w=[],e=[];
  if(data.length==0){
    return {
      wmeters:w,
      emeters:e
    };
  }else{
    data.forEach((item) => {
      item.type=="water"?w.push(item):e.push(item);
    });
    return {
      wmeters:w,
      emeters:e
    };
  }

}
export {SetRem,FormatPrice,HandleChItmData,ObjToFormdata,DeepClone,SortChargeitems,HandleMeters,ArrayClone}
