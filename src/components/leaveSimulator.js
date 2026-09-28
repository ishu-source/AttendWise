import{go,render}from"../app.js";
import{att}from"./attendance.js";
import{gate}from"./common.js";
import{card}from"./dashboard.js";
import{SEM_END,SEM_START}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{P,applyT}from"../engine/attendance.js";
import{checkLeave,leaveCounts}from"../engine/leaveSimulator.js";
import{St,save,valid}from"../state.js";
import{NOW,TODAY,addD,diffD,fd}from"../utils/dates.js";
function ensureLeave(){const L=St.leave;if(!L.start||L.start<NOW){const t=addD(NOW,TODAY<SEM_START?0:1);L.start=t>SEM_END?SEM_END:t}if(!L.end||L.end<L.start)L.end=addD(L.start,(L.days||3)-1)}
function leaveInfo(rg){ensureLeave();const L=St.leave,s=rg?rg.start:L.start,e=rg?rg.end:L.end,err=checkLeave(NOW,SEM_END,s,e);if(err)return{err};const{cnt,total}=leaveCounts(St.sec,s,e);return{s,e,days:diffD(s,e)+1,total,cnt,t:(rg&&rg.t)||L.treatment}}
const leaveRows=li=>valid().map(([k,r])=>{const q=li.cnt[k]||0;return{k,q,r,a:applyT(r,q,li.t)}});
function setL(f,v){const L=St.leave;L[f]=v;if(f==="type")L.treatment=v==="od"?"attended":"absent";
 if(f==="days"){L.days=Math.max(1,Math.floor(+v)||1);L.end=addD(L.start,L.days-1)}if(f==="start"){L.end=addD(v,(L.days||1)-1)}if(f==="end"&&L.start&&v>=L.start)L.days=diffD(L.start,v)+1;save();render()}
function leave(){const g=gate();if(g)return g;ensureLeave();const L=St.leave,li=leaveInfo(),SS=TT[St.sec].s,o=(v,l,c)=>`<option value="${v}"${c===v?" selected":""}>${l}</option>`;let out="";
 if(li.err)out=`<p class="err">${li.err}</p>`;else{const rows=leaveRows(li),af=rows.filter(x=>x.q>0),irr=af.filter(x=>x.a.imp75),bl=af.filter(x=>!x.a.imp75&&100*x.a.A<75*x.a.C);
  const ban=irr.length?["--bad","🔴 IRREVERSIBLE DETENTION",irr.map(x=>SS[x.k].n).join(", ")+": even if you attend every remaining class after this leave, 75% cannot be reached."]:bl.length?["--risk","🚨 THIS LEAVE CREATES DETENTION RISK",bl.map(x=>SS[x.k].n).join(", ")+" would fall below 75%."]:["--ok","🟢 LEAVE APPEARS SAFE","Based on the timetable and attendance data entered, this simulation does not place any subject below 75%."];
  out=`<div class="stats"><div class="card stat"><b>${li.days} day${li.days>1?"s":""}</b><span>${fd(li.s)} to ${fd(li.e)}</span></div><div class="card stat"><b>${li.total}</b><span>Classes affected</span></div><div class="card stat"><b>${af.length}</b><span>Subjects affected</span></div></div>
  ${valid().length?`<div class="miss" style="--c:var(${ban[0]})"><div style="font-size:19px;font-weight:800;color:var(--c)">${ban[1]}</div><div>${ban[2]}</div></div>
  <div class="card scroll">${af.length?`<table><tr><th>Subject</th><th>Current</th><th>Classes affected</th><th>Projected</th><th>75% status</th><th>90% status</th><th>Required recovery</th></tr>${af.map(x=>{const a=x.a;return`<tr><td>${SS[x.k].n}</td><td>${P(x.r.cur)}</td><td>${x.q}</td><td><b>${P(a.cur)}</b></td><td>${a.imp75?"🔴 IRREVERSIBLE":100*a.A<75*a.C?"🚨 BELOW 75%":"🟢 75% or above"}</td><td>${a.imp90?"Unreachable":100*a.A>=90*a.C?"🟢 90% or above":"Attend "+a.n90+" more"}</td><td>${a.imp75?"Not possible":a.n75?"Attend "+a.n75+" of "+a.R:"None needed"}</td></tr>`}).join("")}</table>`:`<p class="mut">No classes fall in this date range (weekend, or no periods for your section).</p>`}<p class="mut">${rows.length-af.length} entered subject(s) have no class in this range.</p></div>`:`<p class="mut">Enter attendance to see the effect on each subject.</p><button class="btn" onclick="go('att')">Enter attendance</button>`}`}
 return`<div class="card"><h2 style="margin-top:0">Leave simulator</h2><div class="row"><label>Type <select onchange="setL('type',this.value)">${o("medical","Medical Leave",L.type)}${o("od","On-Duty / OD",L.type)}${o("custom","Custom leave",L.type)}</select></label>
 <label>Treatment <select onchange="setL('treatment',this.value)">${o("attended","Counts as attended",L.treatment)}${o("absent","Does not count as attended",L.treatment)}${o("excluded","Excluded from attendance denominator",L.treatment)}</select></label></div>
 <div class="row" style="margin-top:10px"><label>Start <input type="date" min="${NOW}" max="${SEM_END}" value="${L.start}" onchange="setL('start',this.value)"></label><label>Days <input type="number" min="1" style="width:80px" value="${L.days}" onchange="setL('days',this.value)"></label><label>End <input type="date" min="${NOW}" max="${SEM_END}" value="${L.end}" onchange="setL('end',this.value)"></label></div>
 <p class="mut">OD treatment can vary by college policy. Confirm your institution's attendance rules. Medical leave uses the same setting, so nothing is assumed. Results are a mathematical estimate and not an approval of leave.</p>${out}</div>`}
export{ensureLeave,leaveInfo,leaveRows,setL,leave};
