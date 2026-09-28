import{calc}from"./attendance.js";
import{getClassesBetweenDates,schedule}from"./timetable.js";
export function planFor(sec,k,r,now,plan){const u=getClassesBetweenDates(sec,now,plan,k).length,ra=r.R-u,byP=Math.min(u,Math.max(0,r.n75-ra));return{u,ra,byP,all:calc(r.A+u,r.C+u,ra),none:calc(r.A,r.C+u,ra)}}
export function nextClassCounts(sec,now,n,unit){n=Math.max(0,Math.floor(Number(n))||0);let nx=schedule(sec).filter(c=>c.d>=now);if(unit==="days"){const ds=[...new Set(nx.map(c=>c.d))].slice(0,n);nx=nx.filter(c=>ds.includes(c.d))}else nx=nx.slice(0,n);const o={};nx.forEach(c=>o[c.k]=(o[c.k]||0)+1);return o}
