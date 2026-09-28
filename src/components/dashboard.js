import{go}from"../app.js";
import{health}from"./analytics.js";
import{att,demo}from"./attendance.js";
import{toggleChat}from"./chatbot.js";
import{gate,timeline}from"./common.js";
import{leave}from"./leaveSimulator.js";
import{plan}from"./planner.js";
import{sim}from"./whatIf.js";
import{TT}from"../data/timetable.js";
import{P,ST,msg,pctOf}from"../engine/attendance.js";
import{getRemainingClasses,keysOf}from"../engine/timetable.js";
import{St,entries}from"../state.js";
import{NOW}from"../utils/dates.js";
function card(k,r){const sub=TT[St.sec].s[k],[ic,lb,c]=ST[r.st];
 const w=Math.min(100,r.cur||0);
 return`<div class="card" style="--c:var(${c})"><div class="row" style="justify-content:space-between"><div><b>${sub.n}</b><div class="mut">${sub.c||"Code not listed"}</div></div><span class="tag">${ic} ${lb}</span></div>
 <div class="row" style="align-items:end;margin-top:12px"><div class="pct">${P(r.cur)}</div>${r.est?`<span class="mut">estimated from %</span>`:""}</div>
 <div class="track"><div class="fill" style="width:${w}%;background:var(${c})"></div><span class="tick" style="left:75%"></span><span class="tick" style="left:90%"></span></div><div class="mut">Ticks mark 75% and 90%</div>
 ${r.st==="IRREV"?`<div class="miss"><b>Maximum possible: ${P(r.max)}</b><div>Even if you attend every remaining class, 75% cannot be reached before the semester ends.</div></div>`
 :`<div class="miss"><b>${r.safe75===0?"0":r.safe75??"–"}</b> <span>${r.safe75===0?"You cannot miss any class.":"You can miss ONLY "+r.safe75+" of the "+r.R+" remaining classes."}</span></div>`}
 <div class="kv"><span>Conducted / Attended / Remaining</span><b>${r.C} / ${r.A} / ${r.R}</b></div>
 <div class="kv"><span>75%: must attend</span><b>${r.imp75?"unreachable":r.n75}</b></div>
 <div class="kv"><span>90%: must attend · can miss</span><b>${r.imp90?"unreachable":r.n90+" · "+r.safe90}</b></div>
 <div class="kv"><span>Max possible</span><b>${P(r.max)}</b></div>
 <p style="margin:10px 0 0">${msg(r)}</p></div>`}
function dash(){const g=gate();if(g)return g;const E=entries(),ok=Object.entries(E).filter(([,r])=>!r.err);
 if(!ok.length)return`<div class="card"><h2>Enter your attendance to see your plan</h2><p class="mut">Add attended and conducted classes for each subject, or load the demo data.</p><div class="row"><button class="btn" onclick="go('att')">Enter attendance</button><button class="btn alt" onclick="demo()">Load Demo Attendance</button></div></div>`;
 const tA=ok.reduce((a,[,r])=>a+r.A,0),tC=ok.reduce((a,[,r])=>a+r.C,0),rem=keysOf(St.sec).reduce((a,k)=>a+getRemainingClasses(St.sec,k,NOW),0);
 const irr=ok.filter(([,r])=>r.st==="IRREV"),SS=TT[St.sec].s;
 const below=(t)=>ok.filter(([,r])=>r.C>0&&100*r.A<t*r.C).length;
 const stat=(v,l)=>`<div class="card stat"><b>${v}</b><span>${l}</span></div>`;
 return`${irr.length?`<div class="alert" role="alert"><h3>🚨 IRREVERSIBLE DETENTION</h3>${irr.map(([k,r])=>`<div><b>${SS[k].n}</b>: even with every remaining class attended, your maximum is ${P(r.max)}. 75% cannot be reached before the semester ends.</div>`).join("")}</div>`:""}
 <h2 style="margin:0 0 10px;font-size:22px">${greet()}, ${St.user}</h2><div class="row" style="margin-bottom:12px">${[["SAFE","Safe","--ok"],["CAUTION","Caution","--warn"],["RISK","At risk","--risk"],["IRREV","Irreversible","--bad"]].map(x=>`<span class="tag" style="--c:var(${x[2]})">${ST[x[0]][0]} ${ok.filter(([,r])=>r.st===x[0]).length} ${x[1]}</span>`).join("")}</div><div class="stats">${stat(P(pctOf(tA,tC)),"Overall (attended ÷ conducted)")}${stat(below(75),"Subjects below 75%")}${stat(below(90),"Subjects below 90%")}${stat(irr.length,"Irreversible")}${stat(rem,"Classes remaining (all subjects)")}</div>
 ${health()}<div class="grid">${Object.entries(E).map(([k,r])=>r.err?`<div class="card"><b>${SS[k].n}</b><p class="err">${r.err}</p></div>`:card(k,r)).join("")}</div><div style="margin-top:14px">${timeline()}</div>${qa()}
 <p class="mut">Counts are class periods. Remaining classes include today's. ${ok.some(([,r])=>r.est)?"Subjects entered as a percentage use the timetable's count of classes held so far, so they are estimates.":""}</p>`}
const greet=()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening"};
const qa=()=>`<div class="card" style="margin-top:14px"><b>Quick actions</b><div class="row" style="margin-top:10px"><button class="btn alt" onclick="go('plan')">Plan Ahead</button><button class="btn alt" onclick="go('leave')">Leave Simulator</button><button class="btn alt" onclick="go('sim')">What If?</button><button class="btn" onclick="toggleChat(1)">✨ Ask Advisor</button></div></div>`;
export{card,dash,greet,qa};
