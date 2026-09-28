const pctOf=(A,C)=>C>0?100*A/C:null;
const need=(A,C,R,t)=>Math.max(0,Math.ceil((t*(C+R)-100*A)/100)); // t = 75 or 90 (integer math)
function calc(A,C,R){
 const T=C+R,n75=need(A,C,R,75),n90=need(A,C,R,90);
 const max=T>0?100*(A+R)/T:null,imp75=n75>R,imp90=n90>R;
 let st;if(T===0)st="NONE";else if(imp75)st="IRREV";else if(C===0)st="START";else if(100*A<75*C)st="RISK";else if(100*A<90*C)st="CAUTION";else st="SAFE";
 return{A,C,R,cur:pctOf(A,C),n75,n90,imp75,imp90,max,safe75:imp75?null:R-n75,safe90:imp90?null:R-n90,st}}
const ST={SAFE:["🟢","SAFE","--ok"],CAUTION:["🟡","CAUTION","--warn"],RISK:["🟠","DETENTION RISK","--risk"],IRREV:["🔴","IRREVERSIBLE DETENTION","--bad"],START:["🔵","NOT STARTED","--info"],NONE:["⚪","NO CLASSES LEFT","--mut"]};
const msg=r=>({SAFE:"Your attendance is above the 90% target.",CAUTION:r.imp90?"You are above the detention line, but 90% can no longer be reached.":`You are above the detention line. Attend ${r.n90} of the remaining ${r.R} classes to reach 90%.`,RISK:`You must attend ${r.n75} of the remaining ${r.R} classes to recover to 75%.`,IRREV:"Even perfect attendance from now cannot bring you back to 75%.",START:"No classes conducted yet.",NONE:"No scheduled classes remain."}[r.st]);
const P=v=>v==null?"–":v.toFixed(1).replace(/\.0$/,"")+"%";
const applyT=(r,q,t)=>calc(t==="attended"?r.A+q:r.A,t==="excluded"?r.C:r.C+q,r.R-q); // leave / what-if outcome via the same engine
export{pctOf,need,calc,ST,msg,P,applyT};
