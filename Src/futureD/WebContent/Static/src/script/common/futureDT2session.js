;(function(){
	/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/
	if(window.location.href.indexOf("file:\/\/\/") !== 0 && window.location.href.indexOf("file:///") !== 0){
		var ip;
		var overdueLength;
		$.get("https://api.ipify.org/?format=json", function(data, status, xhr){
			if(status == "success"){
				ip = data.ip;
				$.get("https://www.easy-mock.com/mock/5be5483eb9983d342035d96d/futureDT2/overdueLength", function(res, statu){
					if(statu == "success"){
						overdueLength = res.data;
						var num = Number(overdueLength.num);
						var iHash = eouluGlobal.S_getBrowserType()[0]+eouluGlobal.S_getBrowserType()[1]+"##"+ip+"##"+eouluGlobal.S_getOSInfo();
						var ivisit = store.get("futureDT2__visit__"+encodeURI(iHash));
						var inow = Date.now();
						if(ivisit !== null && ivisit !== undefined){
							var ioverdueLength = ivisit.overdueLength;
							if(ioverdueLength < inow){
								/*超期了*/
								alert("访客模式已超期，请联系管理员！");
								setTimeout(function(){
									window.location.assign("login.html");
								}, 500);
							}else{
								/*未超期*/
								session_login_judge();
							}
						}else{
							/*初始化访客模式*/
							store.set("futureDT2__visit__"+encodeURI(iHash), {
								visit: "visit",
								overdueLength: inow+num
							});
							session_login_judge();
						}
					}else{
						alert("请求出错，请检查网络连接！");
						setTimeout(function(){
							window.location.assign("login.html");
						}, 500);
					}
				});
			}else{
				alert("请求出错，请检查网络连接！");
				setTimeout(function(){
					window.location.assign("login.html");
				}, 500);
			}
		});
	}
	/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/

	function session_login_judge(){
		/*有权限并且未超期*/
		var iclassify = store.get('futureDT2__session_classify');
		if(!iclassify){
			window.location.assign("login.html");
		}else if(iclassify == "sessionStorage"){
			if(!window.sessionStorage.getItem("futureDT2__sessionStorage")){
				window.location.assign("login.html");
			}else{
				var iexpires = JSON.parse(window.sessionStorage.getItem("futureDT2__sessionStorage")).expires;
				if(iexpires < Date.now()){
					window.location.assign("login.html");
				}
			}
		}else if(iclassify == "localStorage"){
			if(!store.get('futureDT2__session')){
				window.location.assign("login.html");
			}else{
				var iexpires2 = store.get('futureDT2__session').expires;
				if(iexpires2 < Date.now()){
					window.location.assign("login.html");
				}
			}
		}

		$(document).on("click", ".g_info_r .glyphicon-off", function(){
			var curUser = store.get("futureDT2__session").data.user_name.value;
			var futureDT2__userDB = store.get("futureDT2__userDB");
			var iuserObj = _.find(store.get("futureDT2__userDB"), function(v, i) { return i == curUser; });
			iuserObj.current_login.value == null ? (iuserObj.last_login.value = moment().format("YYYY-MM-DD HH:mm:ss")) : (iuserObj.last_login.value = iuserObj.current_login.value);
			iuserObj.current_login.value = null;
			var item = {};
			item[curUser] = iuserObj;
			store.set("futureDT2__userDB", _.assign(futureDT2__userDB, item));
			store.remove('futureDT2__session');
			window.sessionStorage.removeItem("futureDT2__sessionStorage");
			window.location.assign("login.html");
		});
		/*有权限并且未超期end*/
	}

	/*window.onbeforeunload = function (e) {
	  	e = e || window.event;

	  	// 兼容IE8和Firefox 4之前的版本
	  	if (e) {
	    	e.returnValue = '关闭提示';
	  	}

	  	// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
	  	return '关闭提示';
	};*/

	// window.addEventListener('unload', function(event) {
	//     store.remove("futureDT2__session");
	// });
})();