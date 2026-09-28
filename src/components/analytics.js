import{render}from"../app.js";
import{card,dash}from"./dashboard.js";
import{leave,leaveInfo}from"./leaveSimulator.js";
import{plan}from"./planner.js";
import{simCounts}from"./whatIf.js";
import{TT}from"../data/timetable.js";
import{P,ST,applyT,calc,pctOf}from"../engine/attendance.js";
import{getClassesBetweenDates}from"../engine/timetable.js";
import{St,save,valid}from"../state.js";
import{NOW,fd}from"../utils/dates.js";
const cv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let CH=[];
function scenSet(){const m=St.chartMode.scen,li=m==="leave"?leaveInfo():null,sc=m==="whatif"?simCounts():null,o={};
 for(const[k,r]of valid())o[k]=m==="leave"&&!li.err?applyT(r,li.cnt[k]||0,li.t):m==="whatif"?applyT(r,sc[k]||0,St.sim.m==="attend"?"attended":"absent"):r;return o}
function projOf(r,k){const u=St.chartMode.scen==="now"&&St.chartMode.to==="plan"?Math.min(r.R,getClassesBetweenDates(St.sec,NOW,St.plan,k).length):r.R;return calc(r.A+u,r.C+u,r.R-u)}
function health(){if(typeof Chart==="undefined")return`<div class="card" style="margin-bottom:14px"><b>Attendance Health</b><p class="mut">Charts could not load (are you offline?). The subject cards below still show every number.</p></div>`;
 const S0=Object.values(scenSet()).filter(r=>r.C>0),n=S0.length;if(!n)return"";const cm=St.chartMode,so=(v,l)=>`<option value="${v}"${cm.scen===v?" selected":""}>${l}</option>`;
 return`<div class="card" style="margin-bottom:14px"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Attendance Health</h3><div class="row"><select aria-label="Scenario" onchange="St.chartMode.scen=this.value;save();render()">${so("now","Current attendance")}${so("leave","After leave simulation")}${so("whatif","After what-if")}</select>${cm.scen==="now"?`<select aria-label="Projection target" onchange="St.chartMode.to=this.value;save();render()"><option value="end"${cm.to==="end"?" selected":""}>Attend all to semester end</option><option value="plan"${cm.to==="plan"?" selected":""}>Attend all to ${fd(St.plan)}</option></select>`:""}</div></div>
 <p class="mut">${cm.scen==="leave"?"Showing attendance after your Leave Simulator dates.":cm.scen==="whatif"?"Showing attendance after your What If? scenario.":"Dashed lines mark 75% (detention) and 90% (target)."}${cm.scen!=="now"?" Projection assumes you attend every remaining class.":""}</p>
 <div class="row" style="margin-top:8px"><span class="tag" style="--c:var(--info)">Overall ${P(pctOf(S0.reduce((a,r)=>a+r.A,0),S0.reduce((a,r)=>a+r.C,0)))}</span>${[["Below 75%",S0.filter(r=>100*r.A<75*r.C).length,"--risk"],["Below 90%",S0.filter(r=>100*r.A<90*r.C).length,"--warn"],["Irreversible",S0.filter(r=>r.imp75).length,"--bad"]].map(x=>`<span class="tag" style="--c:var(${x[2]})">${x[1]} ${x[0]}</span>`).join("")}</div>
 <div class="grid" style="margin-top:10px"><div class="scroll"><b>Subject attendance</b><div style="height:${38*n+60}px;min-width:300px"><canvas id="c1"></canvas></div></div><div><b>Health overview</b><div style="height:280px"><canvas id="c2"></canvas></div></div></div>
 <div class="scroll" style="margin-top:14px"><b>Current vs projected</b><div style="height:${58*n+70}px;min-width:300px"><canvas id="c3"></canvas></div></div></div>`}
function drawCharts(){CH.forEach(c=>c.destroy());CH=[];const c1=document.getElementById("c1");if(typeof Chart==="undefined"||!c1||St.view!=="dash"||!St.user)return;
 const S=scenSet(),ks=Object.keys(S).filter(k=>S[k].C>0),SS=TT[St.sec].s,nm=k=>SS[k].n.length>22?SS[k].n.slice(0,21)+"…":SS[k].n;
 Chart.defaults.font.family="Sora, system-ui, sans-serif";Chart.defaults.color=cv("--mut");const ln=cv("--line");
 const ref={id:"ref",afterDraw(ch){const{ctx,chartArea:a,scales:{x}}=ch;ctx.save();ctx.lineWidth=2;ctx.setLineDash([5,4]);[[75,"--bad"],[90,"--ok"]].forEach(([v,c])=>{const px=x.getPixelForValue(v);ctx.strokeStyle=cv(c);ctx.beginPath();ctx.moveTo(px,a.top);ctx.lineTo(px,a.bottom);ctx.stroke()});ctx.restore()}};
 const ax={min:0,max:100,grid:{color:ln},ticks:{callback:v=>v+"%"}},base={indexAxis:"y",maintainAspectRatio:false,scales:{x:ax,y:{grid:{display:false}}}};
 CH.push(new Chart(c1,{type:"bar",data:{labels:ks.map(k=>nm(k)+"  "+P(S[k].cur)),datasets:[{data:ks.map(k=>+S[k].cur.toFixed(1)),backgroundColor:ks.map(k=>cv(ST[S[k].st][2])),borderRadius:6}]},options:{...base,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw+"%"}}}},plugins:[ref]}));
 const cnt=[0,0,0,0];ks.forEach(k=>{const r=S[k];r.imp75?cnt[3]++:100*r.A>=90*r.C?cnt[0]++:100*r.A>=75*r.C?cnt[1]++:cnt[2]++});
 CH.push(new Chart(document.getElementById("c2"),{type:"doughnut",data:{labels:["90% or above","75 to 89.9%","Below 75% (recoverable)","Irreversible"],datasets:[{data:cnt,backgroundColor:[cv("--ok"),cv("--warn"),cv("--risk"),cv("--bad")],borderColor:cv("--card")}]},options:{maintainAspectRatio:false,cutout:"60%",plugins:{legend:{position:"bottom"}}}}));
 CH.push(new Chart(document.getElementById("c3"),{type:"bar",data:{labels:ks.map(nm),datasets:[{label:"Current",data:ks.map(k=>+S[k].cur.toFixed(1)),backgroundColor:cv("--info"),borderRadius:5},{label:"Projected",data:ks.map(k=>+projOf(S[k],k).cur.toFixed(1)),backgroundColor:cv("--pri"),borderRadius:5}]},options:{...base,plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:c=>c.dataset.label+": "+c.raw+"%"}}}},plugins:[ref]}))}
export{cv,scenSet,projOf,health,drawCharts};
