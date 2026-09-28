import{SEM_START}from"../data/semester.js";
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const parse=t=>{const[a,b,c]=t.split("-").map(Number);return new Date(a,b-1,c)};
const addD=(t,n)=>{const d=parse(t);d.setDate(d.getDate()+n);return iso(d)};
const diffD=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const fd=(t,y)=>parse(t).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",...(y?{year:"numeric"}:{})});
const TODAY=iso(new Date());
const NOW=TODAY<SEM_START?SEM_START:TODAY; // classes from NOW onward are "upcoming" (today included)
export{iso,parse,addD,diffD,fd,TODAY,NOW};
