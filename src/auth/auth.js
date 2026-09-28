import{render}from"../app.js";
import{card,dash}from"../components/dashboard.js";
import{how,land}from"../components/landing.js";
import{up}from"../components/upcoming.js";
import{need}from"../engine/attendance.js";
import{St,valid}from"../state.js";
import{ld,sv}from"../utils/storage.js";
/* ===== LOGIN (accounts live in this browser only) ===== */
const b64e=u=>btoa(String.fromCharCode(...u)),b64d=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function hashPw(pw,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);return b64e(new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt:b64d(salt),iterations:150000,hash:"SHA-256"},k,256)))}
const who=()=>St.user?`<span class="mut">${St.user}</span><button class="btn alt" onclick="logout()">Log out</button>`:"";
function loadUser(r){St.user=r;const d=ld("aw_d_"+r,{});St.sec=d.sec||"";St.att=d.att||{};St.mode=d.mode||"cnt";if(d.leave)St.leave=d.leave;if(d.chartMode)St.chartMode=d.chartMode;St.chat.messages=[];St.view=St.sec?"dash":"land"}
function logout(){try{sessionStorage.removeItem("aw_session")}catch(e){}St.user=null;St.sec="";St.att={};St.am="in";render()}
function auth(){const up=St.am==="up";return`<section class="hero" style="padding-top:32px"><h1>Know your attendance.<br>Plan before it's too late.</h1><p>Log in with your register number to see exactly how many classes you need to attend.</p></section>
<div class="card" style="max-width:420px"><div class="row" style="margin-bottom:12px"><button class="btn ${up?"alt":""}" onclick="St.am='in';render()">Log in</button><button class="btn ${up?"":"alt"}" onclick="St.am='up';render()">Create account</button></div>
<label class="mut" for="rn">Register number</label><input id="rn" type="text" style="width:100%;margin:4px 0 10px" placeholder="RA2411030050054" maxlength="15" autocomplete="username" autocapitalize="characters" onkeydown="if(event.key==='Enter')doAuth()">
<label class="mut" for="pw">${up?"Choose a password (6+ characters)":"Password"}</label><input id="pw" type="password" style="width:100%;margin:4px 0 10px" autocomplete="${up?"new-password":"current-password"}" onkeydown="if(event.key==='Enter')doAuth()">
${up?`<label class="mut" for="pw2">Confirm password</label><input id="pw2" type="password" style="width:100%;margin:4px 0 10px" autocomplete="new-password" onkeydown="if(event.key==='Enter')doAuth()">`:""}
<div class="err" id="ae" role="alert"></div><button class="btn" style="width:100%;margin-top:8px" onclick="doAuth()">${up?"Create account":"Log in"}</button>
<p class="mut">Accounts and attendance are stored only on this device's browser. Nothing is sent to a server, and passwords can't be recovered if forgotten.</p></div>`}
async function doAuth(){const e=m=>document.getElementById("ae").textContent=m,up=St.am==="up",v=id=>(document.getElementById(id)||{}).value||"";
 const reg=v("rn").trim().toUpperCase(),pw=v("pw");
 if(!/^RA\d{13}$/.test(reg))return e("Enter a valid register number, like RA2411030050054.");
 if(!crypto.subtle)return e("This browser can't secure passwords here. Open the page over https.");
 const users=ld("aw_users",{});
 if(up){if(pw.length<6)return e("Password must be at least 6 characters.");if(pw!==v("pw2"))return e("Passwords do not match.");if(users[reg])return e("This register number already has an account. Log in instead.");
  const salt=b64e(crypto.getRandomValues(new Uint8Array(16)));users[reg]={salt,hash:await hashPw(pw,salt)};sv("aw_users",users);if(!ld("aw_users",{})[reg])return e("Browser storage is blocked, so the account can't be saved.")}
 else{const u=users[reg];if(!u||await hashPw(pw,u.salt)!==u.hash)return e("Register number or password is incorrect.")}
 try{sessionStorage.setItem("aw_session",reg)}catch(x){}loadUser(reg);render()}
export{b64e,b64d,hashPw,who,loadUser,logout,auth,doAuth};
