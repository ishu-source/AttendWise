import{gate,timeline}from"./common.js";
import{card}from"./dashboard.js";
import{SEM_END}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{P,ST}from"../engine/attendance.js";
import{planFor}from"../engine/planner.js";
import{getClassesBetweenDates}from"../engine/timetable.js";
import{St,entries}from"../state.js";
import{NOW,addD,diffD,fd}from"../utils/dates.js";
function plan(){const g=gate();if(g)return g;const E=entries(),SS=TT[St.sec].s,ok=Object.entries(E).filter(([,r])=>!r.err),max=diffD(NOW,SEM_END);
 return`<div class="card"><h2 style="margin-top:0">Plan ahead</h2><div class="row"><label>Plan until <input type="date" id="pd" min="${NOW}" max="${SEM_END}" value="${St.plan}" onchange="setPlan(this.value)"></label></div>
 <input type="range" id="ps" style="width:100%;margin-top:10px" min="0" max="${Math.max(0,max)}" value="${diffD(NOW,St.plan)}" oninput="setPlan(addD(NOW,+this.value),1)" aria-label="Planning date slider"><div class="err" id="pe"></div></div><div id="pout" style="margin-top:14px"></div>`}
function setPlan(v,sl){let e="";if(!v||v<NOW){e="Planning date can't be before today. Using today.";v=NOW}else if(v>SEM_END){e="Planning date can't be after 29 Nov 2026. Using the semester end.";v=SEM_END}
 St.plan=v;const pe=document.getElementById("pe");if(pe)pe.textContent=e;const pd=document.getElementById("pd"),ps=document.getElementById("ps");if(pd)pd.value=v;if(ps&&!sl)ps.value=diffD(NOW,v);planOut()}
function planOut(){const o=document.getElementById("pout");if(!o)return;const E=entries(),SS=TT[St.sec].s,ok=Object.entries(E).filter(([,r])=>!r.err);
 const U=getClassesBetweenDates(St.sec,NOW,St.plan).length,after=getClassesBetweenDates(St.sec,addD(St.plan,1),SEM_END).length;
 let rows="";for(const[k,r]of ok){const{u,ra,byP,all,none}=planFor(St.sec,k,r,NOW,St.plan);
  rows+=`<tr><td>${SS[k].n}</td><td>${u}</td><td>${r.imp75?"unreachable":byP}</td><td>${r.imp75?"–":u-byP}</td><td>${P(all.cur)}</td><td>${P(none.cur)} ${ST[none.st][0]}</td><td>${ra}</td></tr>`}
 o.innerHTML=`<div class="stats"><div class="card stat"><b>${fd(St.plan,1)}</b><span>Plan until</span></div><div class="card stat"><b>${U}</b><span>Classes scheduled until then</span></div><div class="card stat"><b>${after}</b><span>Classes after that date</span></div></div>
 ${timeline()}<div class="card scroll" style="margin-top:14px">${ok.length?`<table><tr><th>Subject</th><th>Upcoming</th><th>Attend at least</th><th>Can miss</th><th>If you attend all</th><th>If you skip all</th><th>Left after</th></tr>${rows}</table><p class="mut">"Attend at least" is the fewest classes to attend by this date while still reaching 75% if you attend every class afterwards.</p>`:`<p class="mut">Enter attendance to see projections.</p>`}</div>`}
export{plan,setPlan,planOut};
