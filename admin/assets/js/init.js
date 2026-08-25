/* OMENT CRM - API BOOT + ADMIN LOGIN */
var _bootStarted=false;
function _bootOverlay(){var el=document.getElementById('boot-overlay');if(el)return el;el=document.createElement('div');el.id='boot-overlay';el.style.cssText='position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:var(--bg,#F4F3EF);padding:24px';document.body.appendChild(el);return el;}
function _hideBoot(){var el=document.getElementById('boot-overlay');if(el&&el.parentNode)el.parentNode.removeChild(el);}
function showBootLoading(){_bootOverlay().innerHTML='<div class="boot-loader"><div class="boot-spinner"></div><div class="boot-label">Connecting to Oment API…</div></div>';}
function showLogin(){
  var el=_bootOverlay();
  el.innerHTML=
    '<form id="oment-admin-login" class="oment-login-card">'+
      '<div class="oment-login-brand">'+
        '<img src="assets/images/oment-logo.jpg" alt="Oment" class="oment-login-logo">'+
      '</div>'+
      '<div class="oment-login-title">Welcome back</div>'+
      '<div class="oment-login-subtitle">Sign in to your Oment admin workspace</div>'+
      '<div class="oment-login-fields">'+
        '<label class="form-label" for="oment-admin-email">Email</label>'+
        '<input id="oment-admin-email" class="form-input" type="email" autocomplete="username" placeholder="Enter your email" required>'+
        '<label class="form-label" for="oment-admin-password">Password</label>'+
        '<input id="oment-admin-password" class="form-input" type="password" autocomplete="current-password" placeholder="Enter your password" required>'+
      '</div>'+
      '<div id="oment-admin-login-error" class="oment-login-error"></div>'+
      '<button class="btn btn-primary oment-login-submit" type="submit">Sign in</button>'+
    '</form>';
var f=document.getElementById('oment-admin-login');f.addEventListener('submit',function(e){e.preventDefault();var b=e.target.querySelector('button');var er=document.getElementById('oment-admin-login-error');b.disabled=true;b.textContent='Signing in…';er.style.display='none';DataAPI.login(document.getElementById('oment-admin-email').value.trim(),document.getElementById('oment-admin-password').value).then(boot).catch(function(x){er.textContent=x.message||'Unable to sign in';er.style.display='block';b.disabled=false;b.textContent='Sign in';});});}
function showBootError(msg){_bootOverlay().innerHTML='<div style="max-width:430px;background:var(--surface,#fff);border:1px solid var(--border,#ddd);border-radius:18px;padding:26px;text-align:center"><div style="font-size:16px;font-weight:800;margin-bottom:8px">Workspace could not load</div><div style="font-size:13px;color:var(--t3,#777);margin-bottom:18px">'+esc(msg)+'</div><button class="btn btn-primary btn-sm" onclick="location.reload()">Try again</button></div>';}
function _step(label,fn){try{fn();}catch(err){console.error('Boot step failed: '+label,err);}}
function boot(){showBootLoading();DataAPI.init().then(function(){
 _step('HRM',function(){if(typeof HRM!=='undefined')HRM.init();});_step('Profit',function(){if(typeof Profit!=='undefined')Profit.init();});_step('Settings',function(){if(typeof eenApplySettings==='function')eenApplySettings();});
 syncState();
 _step('Invoice counter',function(){if(typeof _refreshInvNum==='function')_refreshInvNum();});
 _step('Identity',function(){var admin=STATE.adminUser||{};var initials=admin.avatarInitials||'AD';['sidebar-avatar','topbar-avatar'].forEach(function(id){var n=document.getElementById(id);if(n)n.textContent=initials;});var sn=document.getElementById('sidebar-name');if(sn)sn.textContent=admin.name||'Admin';});
 _step('Dashboard',function(){if(typeof mountView==='function')mountView('dashboard');gotoModule('dashboard',true);});_step('Notifications',renderNotifications);STATE.moduleHistory=[];_step('Back',updateBackButton);_step('Icons',function(){Icons.hydrate(document);});_hideBoot();
}).catch(function(err){if(err&&err.code==='AUTH_REQUIRED'){showLogin();}else{console.error('Boot failed:',err);showBootError(err.message||'Something went wrong while loading your data.');}});}
function init(){if(_bootStarted)return;_bootStarted=true;if(DataAPI.isAuthenticated())boot();else showLogin();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('storage',function(e){if(e.key==='oment_access_token'){if(DataAPI.isAuthenticated())location.reload();else location.reload();}});
