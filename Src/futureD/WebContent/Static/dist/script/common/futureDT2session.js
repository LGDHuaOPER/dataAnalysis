!function(){if("visit"==store.get("futureDT2__login_mode"))if(0!==window.location.href.indexOf("file:///")&&0!==window.location.href.indexOf("file:///")){var g,f;$.get("https://api.ipify.org/?format=json",function(e,o,t){"success"==o?(g=e.ip,$.get("https://www.easy-mock.com/mock/5be5483eb9983d342035d96d/futureDT2/overdueLength",function(e,o){if("success"==o){f=e.data;var t=Number(f.num),s=f.refresh,i=eouluGlobal.S_getBrowserType()[0]+eouluGlobal.S_getBrowserType()[1]+"##"+g+"##"+eouluGlobal.S_getOSInfo(),n=store.get("futureDT2__visit__"+encodeURI(i)),l=Date.now();if(null!=n)if(!0===s||"true"==s)store.set("futureDT2__visit__"+encodeURI(i),{visit:"visit",overdueLength:l+t,start:l,oldNum:t}),c();else{var r=n.overdueLength,u=n.oldNum,a=n.start;t!=u?a+t<l?(alert("管理员改变了使用时长，访客模式已超期，请联系管理员！"),window.location.assign("login.html")):(console.log("管理员改变了使用时长，但没有立即刷新，访客模式未超期"),store.set("futureDT2__visit__"+encodeURI(i),{visit:"visit",overdueLength:a+t,start:a,oldNum:t}),c()):r<l?(alert("您的访客模式已超期，请联系管理员！"),window.location.assign("login.html")):(console.log("管理员未改变使用时长，也没有立即刷新，访客模式未超期"),c())}else store.set("futureDT2__visit__"+encodeURI(i),{visit:"visit",overdueLength:l+t,start:l,oldNum:t}),c()}else alert("请求出错，请检查网络连接！"),window.location.assign("login.html")})):(alert("请求出错，请检查网络连接！"),window.location.assign("login.html"))})}else{var e=store.get("futureDT2__offline_visit"),o=Date.now();if(_.isNil(e))store.set("futureDT2__offline_visit",{visit:"offline_visit",overdueLength:o+18e5,start:o,oldNum:18e5}),c();else e.overdueLength<o?swal({position:"center",type:"info",title:"温馨提示",text:"您的线下访客模式已超期！请联系管理员",showConfirmButton:!1,timer:2e3}).then(function(e){e.dismiss!=swal.DismissReason.backdrop&&e.dismiss!=swal.DismissReason.esc&&e.dismiss!=swal.DismissReason.timer||window.location.assign("login.html")}):c()}else!function(){var e=store.get("futureDT2__session_classify");if(e){if("sessionStorage"==e)if(window.sessionStorage.getItem("futureDT2__sessionStorage")){var o=JSON.parse(window.sessionStorage.getItem("futureDT2__sessionStorage")).expires;o<Date.now()&&window.location.assign("login.html")}else window.location.assign("login.html");else if("localStorage"==e)if(store.get("futureDT2__session")){var t=store.get("futureDT2__session").expires;t<Date.now()&&window.location.assign("login.html")}else window.location.assign("login.html")}else window.location.assign("login.html");$(document).on("click",".g_info_r .glyphicon-off",function(){var t=store.get("futureDT2__session").data.user_name.value,e=store.get("futureDT2__userDB"),o=_.find(store.get("futureDT2__userDB"),function(e,o){return o==t});null==o.current_login.value?o.last_login.value=moment().format("YYYY-MM-DD HH:mm:ss"):o.last_login.value=o.current_login.value,o.current_login.value=null;var s={};s[t]=o,store.set("futureDT2__userDB",_.assign(e,s)),store.remove("futureDT2__session"),window.sessionStorage.removeItem("futureDT2__sessionStorage"),window.location.assign("login.html")})}();function c(){$(document).on("click",".g_info_r .glyphicon-off",function(){window.location.assign("login.html")})}}();