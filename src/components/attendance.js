import{go,render}from"../app.js";
import{gate}from"./common.js";
import{card,dash}from"./dashboard.js";
import{plan}from"./planner.js";
import{TT}from"../data/timetable.js";
import{getConductedClasses,getRemainingClasses,keysOf}from"../engine/timetable.js";
import{St,entries,save}from"../state.js";
import{NOW}from"../utils/dates.js";
function att(){const g=gate();if(g)return g;const E=entries(),SS=TT[St.sec].s,A=St.att[St.sec]||{};
 return`<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Your attendance</h2><div class="row"><select onchange="St.mode=this.value;save();render()"><option value="cnt"${St.mode==="cnt"?" selected":""}>Attended / conducted</option><option value="pct"${St.mode==="pct"?" selected":""}>Percentage only</option></select><button class="btn" onclick="demo()">Load Demo Attendance</button><button class="btn alt" onclick="clr()">Clear</button></div></div>
 <p class="mut">For the most accurate prediction, enter classes attended and classes conducted. Percentage-only entries are converted using the timetable's count of classes held so far (an estimate).</p>
 ${keysOf(St.sec).map(k=>{const v=A[k]||{},held=getConductedClasses(St.sec,k,NOW),e=E[k];
  return`<div class="ar ${St.mode==="pct"?"p":""}"><div><b>${SS[k].n}</b><div class="mut">${SS[k].c||"Code not listed"} · timetable: ${held} held so far</div><div class="err">${e&&e.err?e.err:""}</div></div>
  ${St.mode==="cnt"?`<input type="number" min="0" step="1" placeholder="Attended" value="${v.a??""}" onchange="setIn('${k}','a',this.value)" aria-label="Attended"><input type="number" min="0" step="1" placeholder="Conducted" value="${v.c??""}" onchange="setIn('${k}','c',this.value)" aria-label="Conducted">`
  :`<input type="number" min="0" max="100" step="0.1" placeholder="Percent %" value="${v.p??""}" onchange="setIn('${k}','p',this.value)" aria-label="Percentage">`}</div>`}).join("")}
 <div class="row" style="margin-top:14px"><button class="btn" onclick="go('dash')">See my plan</button></div></div>`}
function setIn(k,f,v){(St.att[St.sec]=St.att[St.sec]||{})[k]={...(St.att[St.sec][k]||{}),[f]:v};save();render()}
function clr(){St.att[St.sec]={};save();render()}
function demo(){if(!St.sec||TT[St.sec].verify)return;const a={};keysOf(St.sec).forEach((k,i)=>{const R=getRemainingClasses(St.sec,k,NOW),C=Math.max(getConductedClasses(St.sec,k,NOW),20),m=i%4;
 let A=m===0?Math.ceil(.95*C):m===1?Math.floor(.8*C):m===2?Math.floor(.6*C):Math.max(0,Math.ceil(.75*(C+R)-R)-1);
 a[k]={a:String(Math.min(A,C)),c:String(C)}});St.att[St.sec]=a;St.mode="cnt";save();go("dash")}
export{att,setIn,clr,demo};
