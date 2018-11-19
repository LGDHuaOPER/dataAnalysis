;(function(){
	if(store.get("futureDT2__login_mode") == "visit"){
		/*如果是访客模式登录*/
		/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/
		if(window.location.href.indexOf("file:\/\/\/") !== 0 && window.location.href.indexOf("file:///") !== 0){
			/*线上环境*/
			var ip;
			var overdueLength;
			$.get("https://api.ipify.org/?format=json", function(data, status, xhr){
				if(status == "success"){
					ip = data.ip;
					$.get("https://www.easy-mock.com/mock/5be5483eb9983d342035d96d/futureDT2/overdueLength", function(res, statu){
						if(statu == "success"){
							overdueLength = res.data;
							var num = Number(overdueLength.num);
							var refresh = overdueLength.refresh;
							var iHash = eouluGlobal.S_getBrowserType()[0]+eouluGlobal.S_getBrowserType()[1]+"##"+ip+"##"+eouluGlobal.S_getOSInfo();
							var ivisit = store.get("futureDT2__visit__"+encodeURI(iHash));
							var inow = Date.now();
							if(ivisit !== null && ivisit !== undefined){
								if(refresh === true || refresh == "true"){
									/*表示立即刷新，继续可以使用，在当前时间基础上加超期期限*/
									store.set("futureDT2__visit__"+encodeURI(iHash), {
										visit: "visit",
										overdueLength: inow+num,
										start: inow,
										oldNum: num
									});
									visit_login_judge();
								}else{
									/*不是立即刷新*/
									var ioverdueLength = ivisit.overdueLength;
									var oldNum = ivisit.oldNum;
									var start = ivisit.start;
									if(num != oldNum){
										/*num改变了*/
										if(start+num < inow){
											/*超期了*/
											alert("管理员改变了使用时长，访客模式已超期，请联系管理员！");
											window.location.assign("login.html");
										}else{
											/*未超期*/
											console.log("管理员改变了使用时长，但没有立即刷新，访客模式未超期");
											store.set("futureDT2__visit__"+encodeURI(iHash), {
												visit: "visit",
												overdueLength: start+num,
												start: start,
												oldNum: num
											});
											visit_login_judge();
										}
									}else{
										/*num未改变*/
										if(ioverdueLength < inow){
											alert("您的访客模式已超期，请联系管理员！");
											window.location.assign("login.html");
										}else{
											/*未超期*/
											console.log("管理员未改变使用时长，也没有立即刷新，访客模式未超期");
											visit_login_judge();
										}
									}
								}
							}else{
								/*初始化访客模式*/
								store.set("futureDT2__visit__"+encodeURI(iHash), {
									visit: "visit",
									overdueLength: inow+num,
									start: inow,
									oldNum: num
								});
								visit_login_judge();
							}
						}else{
							alert("请求出错，请检查网络连接！");
							window.location.assign("login.html");
						}
					});
				}else{
					alert("请求出错，请检查网络连接！");
					window.location.assign("login.html");
				}
			});
		}
		/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/
		else{
			/*线下环境*/
			var offline_visit = store.get("futureDT2__offline_visit");
			var iinow = Date.now();
			var iinum = 30*60*1000;
			if(_.isNil(offline_visit)){
				/*没有本地存储*/
				store.set("futureDT2__offline_visit", {
					visit: "offline_visit",
					overdueLength: iinow+iinum,
					start: iinow,
					oldNum: iinum
				});
				visit_login_judge();
			}else{
				var iioverdueLength = offline_visit.overdueLength;
				if(iinow > iioverdueLength){
					/*已超期*/
					swal({
					  	position: 'center',
					  	type: 'info',
					  	title: '温馨提示',
		  		 		text: "您的线下访客模式已超期！请联系管理员",
					  	showConfirmButton: false,
					  	timer: 2000
					}).then(function(result){
						if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
							window.location.assign("login.html");
						}
					});
				}else{
					/*未超期*/
					visit_login_judge();
				}
			}
		}
	}else{
		/*不是访客模式*/
		session_login_judge();
	}
	
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

	function visit_login_judge() {
		$(document).on("click", ".g_info_r .glyphicon-off", function(){
			window.location.assign("login.html");
		});
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