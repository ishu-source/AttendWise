import{auth,who}from"./auth/auth.js";
import{drawCharts}from"./components/analytics.js";
import{att}from"./components/attendance.js";
import{chatShell}from"./components/chatbot.js";
import{gate}from"./components/common.js";
import{dash}from"./components/dashboard.js";
import{how,land}from"./components/landing.js";
import{leave}from"./components/leaveSimulator.js";
import{plan,planOut}from"./components/planner.js";
import{up}from"./components/upcoming.js";
import{sim}from"./components/whatIf.js";
import{TT}from"./data/timetable.js";
import{St,save}from"./state.js";
const $m=document.getElementById("main"),$h=document.getElementById("hd");
const TABS=[["dash","Dashboard"],["att","My Attendance"],["plan","Plan Ahead"],["up","Upcoming"],["leave","Leave Simulator"],["sim","What If?"],["how","How It Works"]];
function head(){if(St.view==="land"){$h.innerHTML=`<div class="bar"><div class="logo">Attend<b>Wise</b></div><span class="mut" style="flex:1"></span><button class="btn alt" onclick="theme()">Theme</button>${who()}</div>`;return}
 $h.innerHTML=`<div class="bar"><div class="logo">Attend<b>Wise</b></div><select aria-label="Class section" onchange="setSec(this.value)"><option value="">Select your class section</option>${Object.keys(TT).map(x=>`<option${x===St.sec?" selected":""}>${x}</option>`).join("")}</select><button class="btn alt" onclick="theme()">Theme</button>${who()}</div><div class="bar" style="padding-top:0"><nav>${TABS.map(t=>`<button class="${St.view===t[0]?"on":""}" onclick="go('${t[0]}')">${t[1]}</button>`).join("")}</nav></div>`}
function theme(){const r=document.documentElement,dk=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=dk?"light":"dark";render()}
const go=v=>{St.view=v;render();scrollTo(0,0)};
const setSec=v=>{St.sec=v;save();render()};
function render(){if(!St.user){head();$m.innerHTML=auth();drawCharts();chatShell();return}head();$m.innerHTML=({land,dash,att,plan,up,leave,sim,how})[St.view]();if(St.view==="plan"&&!gate())planOut();drawCharts();chatShell()}
export{head,theme,go,setSec,render,TABS};
