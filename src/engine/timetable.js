import{HOLIDAYS,SEM_END,SEM_START}from"../data/semester.js";
import{TT}from"../data/timetable.js";
import{addD,parse}from"../utils/dates.js";
const cache={};
function schedule(sec){const tt=TT[sec];if(!tt||tt.verify)return[];if(cache[sec])return cache[sec];const out=[];
 for(let t=SEM_START;t<=SEM_END;t=addD(t,1)){const w=parse(t).getDay();if(w<1||w>5||HOLIDAYS.includes(t))continue;
  const row=tt.d[w-1];for(let p=0;p<9;p++)if(row[p]!=="-")out.push({d:t,p,k:row[p]})}
 return cache[sec]=out}
const getClassesForDate=(sec,d)=>schedule(sec).filter(c=>c.d===d);
const getClassesBetweenDates=(sec,a,b,k)=>schedule(sec).filter(c=>c.d>=a&&c.d<=b&&(!k||c.k===k));
const getRemainingClasses=(sec,k,from)=>schedule(sec).filter(c=>c.k===k&&c.d>=from).length;
const getConductedClasses=(sec,k,to)=>schedule(sec).filter(c=>c.k===k&&c.d<to).length;
function getUpcomingClasses(sec,from,n=5){const days={};for(const c of schedule(sec)){if(c.d<from)continue;(days[c.d]=days[c.d]||[]).push(c);if(Object.keys(days).length>n){delete days[c.d];break}}return days}
const keysOf=sec=>{const u=new Set();(TT[sec].d||[]).forEach(r=>[...r].forEach(x=>x!=="-"&&u.add(x)));return[...u].sort()};
export{schedule,getClassesForDate,getClassesBetweenDates,getRemainingClasses,getConductedClasses,getUpcomingClasses,keysOf};
