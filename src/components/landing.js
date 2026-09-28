import{go}from"../app.js";
import{card,dash}from"./dashboard.js";
import{plan}from"./planner.js";
import{need}from"../engine/attendance.js";
function how(){return`<div class="grid">${[["Select your section","Choose your class section and load its timetable."],["Enter your attendance","Enter your current percentage, or attended and conducted classes."],["Get your plan","AttendWise counts every remaining scheduled class by calendar date, then shows what you must attend, what you can miss, and whether detention is already unavoidable."]].map((x,i)=>`<div class="card"><h3 style="margin-top:0">${i+1}. ${x[0]}</h3><p>${x[1]}</p></div>`).join("")}</div>
 <div class="card" style="margin-top:14px"><b>The maths</b><p class="mut">Must attend = ceil(0.75 × (conducted + remaining) − attended). Can miss = remaining − must attend. Maximum possible = (attended + remaining) ÷ (conducted + remaining). If that is under 75%, detention is irreversible. Everything runs in your browser; nothing is sent anywhere.</p></div>`}
function land(){return`<section class="hero"><h1>Know your attendance.<br>Plan before it's too late.</h1><p>AttendWise uses your timetable and current attendance to tell you exactly how many classes you need to attend, and when recovery is no longer possible.</p><div class="row" style="margin-top:22px"><button class="btn" onclick="go('dash')">Check My Attendance</button><button class="btn alt" onclick="go('how')">How It Works</button></div></section>`}
export{how,land};
