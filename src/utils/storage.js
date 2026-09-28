const ld=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
export{ld,sv};
