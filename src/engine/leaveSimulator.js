import{getClassesBetweenDates}from"./timetable.js";
export function checkLeave(now,semEnd,s,e){if(!s||!e)return"Pick a start and end date.";if(s<now)return"Leave must start today or later. Earlier classes are already counted in your conducted classes.";if(e<s)return"End date can't be before the start date.";if(e>semEnd)return"Leave can't extend past 29 Nov 2026.";return""}
export function leaveCounts(sec,s,e){const cl=getClassesBetweenDates(sec,s,e),cnt={};cl.forEach(c=>cnt[c.k]=(cnt[c.k]||0)+1);return{cnt,total:cl.length}}
