import{calc}from"./engine/attendance.js";
import{SEM_END}from"./data/semester.js";
import{TT}from"./data/timetable.js";
import{getConductedClasses,getRemainingClasses,keysOf}from"./engine/timetable.js";
import{NOW,addD}from"./utils/dates.js";
import{sv}from"./utils/storage.js";
const St={leave:{type:"medical",start:"",end:"",days:3,treatment:"absent"},chartMode:{scen:"now",to:"end"},chat:{open:false,messages:[]},user:null,am:"in",sec:"",att:{},mode:"cnt",view:"land",plan:null,sim:{m:"miss",n:2,u:"classes"}};
St.plan=addD(NOW,14)>SEM_END?SEM_END:addD(NOW,14);
const save=()=>{if(St.user)sv("aw_d_"+St.user,{sec:St.sec,att:St.att,mode:St.mode,leave:St.leave,chartMode:St.chartMode})};
function entries(){ // validated attendance per subject
 const out={},sec=St.sec;if(!TT[sec]||TT[sec].verify)return out;
 for(const k of keysOf(sec)){const v=(St.att[sec]||{})[k]||{};let A,C,err="",est=false;
  const R=getRemainingClasses(sec,k,NOW),held=getConductedClasses(sec,k,NOW);
  if(St.mode==="cnt"){const a=v.a??"",c=v.c??"";if(a===""&&c==="")continue;
   if(a===""||c==="")err="Enter both attended and conducted.";else{A=Number(a);C=Number(c);
    if(!Number.isInteger(A)||!Number.isInteger(C))err="Use whole numbers only.";else if(A<0||C<0)err="Values cannot be negative.";else if(A>C)err="Attended cannot be more than conducted."}}
  else{const p=v.p??"";if(p==="")continue;const x=Number(p);if(isNaN(x)||x<0||x>100)err="Percentage must be between 0 and 100.";else{C=held;A=Math.round(x*C/100);est=true}}
  out[k]=err?{err}:{...calc(A,C,R),est}}
 return out}
const valid=()=>Object.entries(entries()).filter(([,r])=>!r.err);
export{St,save,entries,valid};
