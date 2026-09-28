import{go}from"../app.js";
import{how}from"./landing.js";
import{ensureLeave,leave,leaveInfo,leaveRows}from"./leaveSimulator.js";
import{simCounts}from"./whatIf.js";
import{PT,SEM_END,SEM_START}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{P,ST,applyT,calc,need,pctOf}from"../engine/attendance.js";
import{getClassesBetweenDates,getClassesForDate,getConductedClasses,getRemainingClasses,getUpcomingClasses,schedule}from"../engine/timetable.js";
import{St,valid}from"../state.js";
import{NOW,TODAY,addD,fd,iso,parse}from"../utils/dates.js";
export const ADVISOR_ENDPOINT=(typeof import.meta!=="undefined"&&import.meta.env&&import.meta.env.VITE_ADVISOR_ENDPOINT)||""; // set VITE_ADVISOR_ENDPOINT to your secure backend URL (the API key stays on the server)
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const dot=r=>r.imp75||100*r.A<75*r.C?"🔴":100*r.A<90*r.C?"🟡":"🟢";
const QQ=["Can I skip tomorrow?","How many can I miss?","Am I safe?","Can I reach 90%?","What if I take leave?","Show my risky subjects"];
function chatShell(){const c=document.getElementById("chat");if(!St.user){c.innerHTML="";return}if(c.firstChild){document.getElementById("cp").hidden=!St.chat.open;return}
 c.innerHTML=`<button id="cfab" title="Ask Attendance Advisor" aria-label="Ask Attendance Advisor" onclick="toggleChat()">✨</button><div id="cp" class="cp" hidden role="dialog" aria-label="Attendance Advisor"><div class="hd"><div class="row" style="justify-content:space-between"><b>Attendance Advisor</b><button class="btn alt" style="padding:2px 10px" onclick="toggleChat()" aria-label="Close">×</button></div><span class="mut">Your personal attendance planner</span></div><div id="cm"></div><div id="cq">${QQ.map((q,i)=>`<button onclick="ask(QQ[${i}])">${q}</button>`).join("")}</div><div class="ci"><input id="ci" type="text" placeholder="Ask about your attendance" onkeydown="if(event.key==='Enter')ask()"><button class="btn" onclick="ask()">Send</button></div></div>`;fillMsgs();document.getElementById("cp").hidden=!St.chat.open}
function toggleChat(o){St.chat.open=o===1?true:!St.chat.open;chatShell();if(St.chat.open)setTimeout(()=>{const i=document.getElementById("ci");i&&i.focus()},50)}
function fillMsgs(){const m=document.getElementById("cm");if(!m)return;m.innerHTML=`<div class="b bot">Hi ${St.user}, I'm your Attendance Advisor. I calculate from your timetable and the attendance you've entered. Tap a quick question or type your own.</div>`+St.chat.messages.map(x=>`<div class="b ${x.r==="u"?"me":"bot"}">${esc(x.t)}</div>`).join("");m.scrollTop=m.scrollHeight}
function buildContext(){const SS=(TT[St.sec]||{}).s||{},li=leaveInfo();return{section:St.sec,today:TODAY,semesterStart:SEM_START,semesterEnd:SEM_END,planningDate:St.plan,
 subjects:valid().map(([k,r])=>({name:SS[k].n,code:SS[k].c,attended:r.A,conducted:r.C,remaining:r.R,currentPercentage:r.cur,required75:r.n75,required90:r.n90,safeMisses75:r.safe75,maximumPossible:r.max,irreversible:r.imp75,status:r.st})),
 upcomingClasses:Object.entries(getUpcomingClasses(St.sec,NOW,3)).map(([d,a])=>({date:d,classes:a.map(c=>({time:PT[c.p],subject:SS[c.k].n}))})),whatIf:{...St.sim,affected:simCounts()},leaveSimulation:li.err?St.leave:{...St.leave,affectedClasses:li.cnt}}}
async function ask(q){const i=document.getElementById("ci");q=(q||i.value).trim();if(!q)return;i.value="";St.chat.messages.push({r:"u",t:q});fillMsgs();let a;
 if(ADVISOR_ENDPOINT){try{const x=await fetch(ADVISOR_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,context:buildContext()})});if(x.ok)a=(await x.json()).reply}catch(e){}}
 St.chat.messages.push({r:"b",t:a||advisor(q)});fillMsgs()}
function advisor(q){const L=q.toLowerCase(),sec=St.sec,has=re=>re.test(L);
 if(!sec||TT[sec].verify)return"Select a class section with verified timetable data first.";
 const V=valid();if(!V.length)return"I need your attendance first. Open My Attendance, or tap Load Demo Attendance on the dashboard.";
 const SS=TT[sec].s,nm=k=>SS[k].n,DISC="\n\nThis is a mathematical estimate from your timetable and the numbers you entered. Your college's actual OD, medical-leave and attendance rules may differ.";
 const STOP=/^(and|of|for|its|the|design|systems|technology|engineering|with|lab|laboratory|medical|your|class)$/;
 const subj=V.filter(([k])=>{const n=SS[k].n.toLowerCase(),ini=n.split(/[^a-z]+/).filter(w=>w&&!/^(and|of|for|its|the|in|to)$/.test(w)).map(w=>w[0]).join("");
  return n.split(/[^a-z0-9]+/).some(w=>w.length>3&&!STOP.test(w)&&L.includes(w))||(SS[k].c&&L.includes(SS[k].c.toLowerCase()))||(ini.length>1&&new RegExp("\\b"+ini+"\\b").test(L))});
 const pick=x=>!subj.length||subj.some(s=>s[0]===x.k),ls=subj.length?subj:V;
 const MO="jan feb mar apr may jun jul aug sep oct nov dec".split(" "),ds=[];
 for(const m of L.matchAll(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?!\d)|(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g))ds.push(iso(new Date(2026,MO.indexOf(m[1]||m[4]),+(m[2]||m[3]))));
 const tom=has(/tomorrow/),tod=has(/\btoday\b/),nd=+((L.match(/(\d+)[- ]?days?/)||[])[1]||0);let rng=null;
 if(ds.length>=2)rng={start:ds[0]<ds[1]?ds[0]:ds[1],end:ds[0]<ds[1]?ds[1]:ds[0]};
 else if(ds.length===1||tom||tod){const s0=ds[0]||(tom?addD(TODAY,1):TODAY);rng={start:s0,end:addD(s0,Math.max(1,nd)-1)}}
 else if(nd&&has(/leave|sick|medical|\bod\b/))rng={start:addD(TODAY,1),end:addD(TODAY,nd)};
 const t=has(/\bod\b|on.?duty/)?"attended":"absent";
 const rep=(rows,hd)=>{rows=rows.filter(pick);if(!rows.length)return hd+"\nNone of the subjects you asked about have classes in that window.";
  const irr=rows.filter(x=>x.a.imp75),bl=rows.filter(x=>!x.a.imp75&&100*x.a.A<75*x.a.C);
  return hd+"\n"+rows.map(x=>`• ${nm(x.k)} (${x.q}): ${P(x.r.cur)} → ${P(x.a.cur)} ${dot(x.a)}`).join("\n")+"\n\n"+(irr.length?`${irr.map(x=>nm(x.k)).join(", ")}: even perfect attendance afterwards could not reach 75%, so this means irreversible detention.`:bl.length?`${bl.map(x=>nm(x.k)).join(", ")} would fall below 75%, so this creates detention risk. To recover: ${bl.map(x=>`${nm(x.k)} needs ${x.a.n75} of the remaining ${x.a.R}`).join("; ")}.`:"No subject falls below 75%.")+DISC};
 const runR=rg=>{const li=leaveInfo({...rg,t});if(li.err)return li.err;const span=li.s===li.e?fd(li.s):fd(li.s)+" to "+fd(li.e);if(!li.total)return`You have no scheduled classes ${span}.`;
  return rep(leaveRows(li).filter(x=>x.q>0),`${span}: ${li.total} scheduled class${li.total>1?"es":""}, ${t==="attended"?"counted as attended (OD)":"counted as absent"}.`)};
 const mN=L.match(/next (\d+) (class|classes|days?|periods?)/);
 if(mN&&has(/miss|skip|bunk|absent|what if|attend/)){const n=+mN[1];let nx=schedule(sec).filter(c=>c.d>=NOW);if(/day/.test(mN[2])){const dl=[...new Set(nx.map(c=>c.d))].slice(0,n);nx=nx.filter(c=>dl.includes(c.d))}else nx=nx.slice(0,n);
  const at=has(/attend/)&&!has(/miss|skip/),cnt={};nx.forEach(c=>cnt[c.k]=(cnt[c.k]||0)+1);
  return rep(V.filter(([k])=>cnt[k]).map(([k,r])=>({k,q:cnt[k],r,a:applyT(r,cnt[k],at?"attended":"absent")})),`Your next ${nx.length} classes, ${at?"all attended":"all missed"}:`)}
 if(has(/leave|sick|medical|\bod\b|on.?duty/)){if(rng)return runR(rng);ensureLeave();return"Using the dates in your Leave Simulator.\n"+runR({start:St.leave.start,end:St.leave.end})}
 if(has(/next class|upcoming|schedule|classes? (do i have )?tomorrow|what.*(class|have)/)&&!has(/skip|miss|bunk|absent/)){const d=rng?rng.start:Object.keys(getUpcomingClasses(sec,NOW,1))[0],c=d?getClassesForDate(sec,d):[];
  return c.length?`${fd(d)}:\n`+c.map(x=>`• ${PT[x.p]} ${nm(x.k)}`).join("\n"):"No classes are scheduled then."}
 if(rng&&!has(/how many|before|until|till/)&&has(/skip|bunk|miss|absent|take|off|attend|go/))return runR(rng);
 if(has(/skip|bunk/)&&!has(/how many|next \d/)){const d=Object.keys(getUpcomingClasses(sec,NOW,1))[0];return d?runR({start:d,end:d}):"No scheduled classes remain."}
 if(has(/closest|nearest|careful|risky|dangerous|worst|am i safe|am i (ok|okay)|which subject/)){
  const key=([,r])=>r.imp75?-1e9:r.safe75,rows=[...V].sort((a,b)=>key(a)-key(b)).filter(([,r])=>!has(/risky|careful|show/)||(r.st!=="SAFE"&&r.st!=="START")).slice(0,4);
  const tA=V.reduce((a,[,r])=>a+r.A,0),tC=V.reduce((a,[,r])=>a+r.C,0);
  return`Overall ${P(pctOf(tA,tC))}.\n`+(rows.length?rows.map(([k,r])=>`${ST[r.st][0]} ${nm(k)}: ${P(r.cur)}, ${r.imp75?"maximum possible "+P(r.max):"can miss "+r.safe75+" of "+r.R}`).join("\n"):"All your subjects are at 90% or above.")}

 const pm=L.match(/(\d{1,3}(?:\.\d+)?)\s?%/);
 if(pm&&+pm[1]<=100&&![75,90].includes(+pm[1])&&has(/recover|from|if i (am|have)/)){const p=+pm[1];return`If you were at ${p}% (estimated from the timetable's classes held so far):\n`+ls.map(([k])=>{const C=getConductedClasses(sec,k,NOW),r=calc(Math.round(p*C/100),C,getRemainingClasses(sec,k,NOW));return`• ${nm(k)}: ${r.imp75?"75% can no longer be reached (max "+P(r.max)+")":r.n75?"attend "+r.n75+" of the remaining "+r.R+" to reach 75%":"already at or above 75%"}`}).join("\n")+DISC}
 if(has(/this week/)&&has(/attend|should|need/)&&!has(/how many/)){const we=addD(NOW,(7-parse(NOW).getDay())%7);return"What to attend this week to stay on course for 75%:\n"+ls.map(([k,r])=>{const w=getClassesBetweenDates(sec,NOW,we,k).length,m=Math.min(w,Math.max(0,r.n75-(r.R-w)));return`• ${nm(k)}: ${r.imp75?"75% can no longer be reached, attend all "+w:w?"attend at least "+m+" of "+w:"no classes this week"}`}).join("\n")+DISC}
 if(has(/how many.*(miss|skip|bunk)|can i (still )?(miss|skip)|safe(ly)? (miss|skip)|afford/)){const wk=has(/this week/),we=addD(NOW,(7-parse(NOW).getDay())%7);
  return(wk?"Classes you can miss this week (staying able to finish at 75%):\n":"Classes you can miss and still finish at 75% (if you attend the rest):\n")+ls.map(([k,r])=>{const w=getClassesBetweenDates(sec,NOW,we,k).length;return`• ${nm(k)}: ${r.imp75?"none, 75% can no longer be reached (max "+P(r.max)+")":wk?Math.min(r.safe75,w)+" of "+w+" this week":r.safe75+" of the "+r.R+" remaining"}`}).join("\n")+DISC}
 if(has(/90/))return"Reaching 90%:\n"+ls.map(([k,r])=>`• ${nm(k)}: ${100*r.A>=90*r.C?"already at "+P(r.cur):r.imp90?"no longer reachable (max "+P(r.max)+")":"attend "+r.n90+" of the remaining "+r.R+" (can then miss "+r.safe90+")"}`).join("\n");
 if(has(/75|recover|back to/))return"Recovering to 75%:\n"+ls.map(([k,r])=>`• ${nm(k)}: ${r.imp75?"not possible, max is "+P(r.max):r.n75?"attend "+r.n75+" of the remaining "+r.R:"you're already on track (can miss "+r.safe75+")"}`).join("\n");
 if(has(/every|all|perfect|final|end of/)&&has(/attend|final/))return"If you attend every remaining class:\n"+ls.map(([k,r])=>`• ${nm(k)}: ${P(r.cur)} → ${P(r.max)} ${r.imp75?"🔴 still below 75%":r.max>=90?"🟢":"🟡"}`).join("\n");
 if(has(/irrevers|doomed|impossible|detain|detention/)){const b=V.filter(([,r])=>r.imp75);return b.length?b.map(([k,r])=>`🔴 ${nm(k)}: ${r.A}/${r.C} attended, ${r.R} classes left. Even attending all of them gives ${P(r.max)}, below 75%.`).join("\n"):"None of your subjects is past the point of no return. Ask \"Show my risky subjects\" to see the closest ones."}
 return"I can help with attendance, upcoming classes, leave simulations, 75% recovery, 90% recovery, and what-if scenarios. Try asking me one of those."}
export{esc,dot,QQ,chatShell,toggleChat,fillMsgs,buildContext,ask,advisor};
