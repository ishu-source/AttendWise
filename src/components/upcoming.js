import{gate}from"./common.js";
import{card}from"./dashboard.js";
import{PT,SEM_START}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{getUpcomingClasses}from"../engine/timetable.js";
import{St}from"../state.js";
import{NOW,TODAY,addD,fd}from"../utils/dates.js";
function up(){const g=gate();if(g)return g;const d=getUpcomingClasses(St.sec,NOW,6),SS=TT[St.sec].s,ks=Object.keys(d);
 if(!ks.length)return`<div class="card">No scheduled classes remain in the semester.</div>`;
 return`<div class="card"><h2 style="margin-top:0">Upcoming classes</h2>${ks.map(t=>`<div class="day"><h4>${t===TODAY?"Today · ":t===addD(TODAY,1)?"Tomorrow · ":""}${fd(t)}</h4>${d[t].map(c=>`<div class="cl"><span>${PT[c.p]}</span><div>${SS[c.k].n}</div></div>`).join("")}</div>`).join("")}<p class="mut">Each row is one class period. No holidays are listed in the timetable PDFs.${TODAY<SEM_START?" The semester starts on 29 Aug 2026.":""}</p></div>`}
export{up};
