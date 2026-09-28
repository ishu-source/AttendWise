import{card}from"./dashboard.js";
import{SEM_END,SEM_START}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{schedule}from"../engine/timetable.js";
import{St}from"../state.js";
import{NOW,diffD,fd}from"../utils/dates.js";
function gate(){ // returns html if section not ready
 if(!St.sec)return`<div class="card"><h2>Select your class section</h2><p class="mut">Choose a section from the menu at the top to load its timetable.</p></div>`;
 if(TT[St.sec].verify)return`<div class="card"><h2>Timetable data requires verification</h2><p>The uploaded I Year files are the 2024-25 timetables, split into four groups (ECE-A, ECE-B/EEE, ECE-DS, Biotech-B/Biomedical). They do not match the 2026-27 odd semester, so AttendWise has not guessed a schedule.</p><p class="mut">To enable this section, replace <code>TT["I Year"]</code> in the data block at the top of this file with a subject table and 5 day strings, like the other sections.</p></div>`;return""}
function timeline(){const a=diffD(SEM_START,SEM_END),f=d=>Math.max(0,Math.min(100,100*diffD(SEM_START,d)/a));
 return`<div class="card"><b>Semester timeline</b><div class="tl"><i></i><u style="left:0%">${fd(SEM_START)}<br>Start</u><u class="t" style="left:${f(NOW)}%">${fd(NOW)}<br>Today</u><u style="left:${f(St.plan)}%;top:${St.plan===NOW?38:0}px">${fd(St.plan)}<br>Plan end</u><u class="e" style="left:100%">${fd(SEM_END)}<br>End</u></div></div>`}
export{gate,timeline};
