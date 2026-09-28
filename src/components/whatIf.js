import{render}from"../app.js";
import{gate}from"./common.js";
import{card}from"./dashboard.js";
import{TT}from"../data/timetable.js";
import{P,ST,calc}from"../engine/attendance.js";
import{nextClassCounts}from"../engine/planner.js";
import{schedule}from"../engine/timetable.js";
import{St,entries}from"../state.js";
import{NOW,fd}from"../utils/dates.js";
function sim(){const g=gate();if(g)return g;const s=St.sim,SS=TT[St.sec].s,E=entries(),ok=Object.entries(E).filter(([,r])=>!r.err);
 let n=Math.floor(Number(s.n));let e="";if(!(n>=0)){e="Enter a number of 0 or more.";n=0}
 let nx=schedule(St.sec).filter(c=>c.d>=NOW);if(s.u==="days"){const ds=[...new Set(nx.map(c=>c.d))].slice(0,n);nx=nx.filter(c=>ds.includes(c.d))}else nx=nx.slice(0,n);
 const cnt={};nx.forEach(c=>cnt[c.k]=(cnt[c.k]||0)+1);
 const rows=ok.map(([k,r])=>{const q=cnt[k]||0,res=calc(s.m==="attend"?r.A+q:r.A,r.C+q,r.R-q);return`<tr><td>${SS[k].n}</td><td>${q}</td><td>${P(r.cur)} → <b>${P(res.cur)}</b></td><td>${ST[res.st][0]} ${ST[res.st][1]}</td></tr>`}).join("");
 return`<div class="card"><h2 style="margin-top:0">What if?</h2><div class="row"><select onchange="St.sim.m=this.value;render()"><option value="miss"${s.m==="miss"?" selected":""}>I miss</option><option value="attend"${s.m==="attend"?" selected":""}>I attend all of</option></select>the next <input type="number" min="0" style="width:80px" value="${s.n}" onchange="St.sim.n=this.value;render()"><select onchange="St.sim.u=this.value;render()"><option value="classes"${s.u==="classes"?" selected":""}>classes</option><option value="days"${s.u==="days"?" selected":""}>class days</option></select></div><div class="err">${e}</div>
 <p class="mut">${nx.length} scheduled classes affected${nx.length?`, from ${fd(nx[0].d)} to ${fd(nx[nx.length-1].d)}`:""}.</p>
 <div class="scroll">${ok.length?`<table><tr><th>Subject</th><th>Classes affected</th><th>Attendance</th><th>Result</th></tr>${rows}</table>`:`<p class="mut">Enter attendance first.</p>`}</div></div>`}
function simCounts(){const s=St.sim;return nextClassCounts(St.sec,NOW,s.n,s.u)}
export{sim,simCounts};
