var loginSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var futureDT2Mock;
var loginUserPassObj = store.get("futureDT2__userDB");

function login_session_login_judge(){
	/*有权限并且未超期*/
	store.set("futureDT2__login_mode", "visit");
	setTimeout(function(){
		window.location.assign("index.html");
	}, 100);
	/*有权限并且未超期end*/
}

/*page onload*/
$(function(){
	/*保存mock数据*/
	if(!eouluGlobal.S_getPageAllConfig().futureDT2.canUseAjax){
		if(_.isEmpty(loginUserPassObj) || _.isNil(loginUserPassObj)){
			loginUserPassObj = futuredGlobal.S_getAdmin_staff();
			store.set("futureDT2__userDB", _.cloneDeep(loginUserPassObj));
		}
	}else{
		/*进入页面验证本地存储*/
		// storage.clear(); // 将localStorage的所有内容清除
		// storage.removeItem("a"); // 删除某个键值对
		// storage.key(i); // 使用key()方法，向其中出入索引即可获取对应的键
		if(!window.localStorage){
		    alert("浏览器不支持localstorage");
		}else{
		    // 主逻辑业务
		    var storage = window.localStorage;
		    var inow = Date.now();
		    var futureDT2MockStr = storage.getItem("futureDT2Mock");
		    if(futureDT2MockStr == undefined){
		        // 第一次存
		        getFutureDT2Mock();
		    }else{
		        var iexpires = JSON.parse(futureDT2MockStr).expires;
		        if(iexpires < inow){
		            // 已超期
		            getFutureDT2Mock();
		        }else{
		            // 未超期
		            futureDT2Mock = JSON.parse(futureDT2MockStr).data;
		            loginUserPassObj = futureDT2Mock.login.login;
		        }
		    }
		}

		function getFutureDT2Mock(){
			jQuery.getJSON("../static/futureDT2.json", undefined, function(data, status, xhr){
			    if(status == "success"){
			        var iObj = {};
			        iObj.expires = inow + 60*60*1000;
			        iObj.data = _.cloneDeep(data);
			        futureDT2Mock = _.cloneDeep(data);
			        loginUserPassObj = futureDT2Mock.login.login;
			        // _.cloneDeep(a)
			        var iStr = JSON.stringify(iObj);
			        // storage["InventoryAllCustomerInfo"] = iStr;
			        storage.setItem("futureDT2Mock", iStr);
			    }else{
			        alert("读取mock数据失败");
			    }
			});
		}
	}

	if(window.location.href.indexOf("file:\/\/\/") !== 0 && window.location.href.indexOf("file:///") !== 0){
		$(".button_div2>button").data("env", "online").attr("title", "线上环境访客登录");
	}else{
		$(".button_div2>button").data("env", "offline").attr("title", "线下环境访客登录");
	}

});

/*event handler*/
$("span.glyphicon.form-control-feedback").click(function(){
	var $input = $(this).prev().children("input");
	if($input.val() == "") return false;
	if($input.is("#login_user")){
		$input.val("");
	}else if($input.is("#login_password")){
		if($(this).is(".glyphicon-eye-open")){
			$input.attr("type", "text");
		}else if($(this).is(".glyphicon-eye-close")){
			$input.attr("type", "password");
		}
		$(this).toggleClass("glyphicon-eye-open glyphicon-eye-close");
	}
});

$("#login_user, #login_password").on("input propertychange change", function(){
	if($("#login_user").val().trim() != "" && $("#login_password").val().trim() != ""){
		$(".button_div>button").removeClass("btn-default").addClass("btn-primary").prop("disabled", false);
	}else{
		$(".button_div>button").removeClass("btn-primary").addClass("btn-default").prop("disabled", true);
	}
});

$(".button_div>button").click(function(){
	var iuser = $("#login_user").val().trim();
	var ipassword = $("#login_password").val().trim();
	var imessage, iFlag = false;
	var iuserObj = _.find(loginUserPassObj, function(v, i) { return i == iuser; });
	if(iuserObj == undefined){
		imessage = "用户名不存在！";
		iFlag = true;
	}else if(iuserObj.password.value != ipassword){
		imessage = "密码错误！";
		iFlag = true;
	}
	if(iFlag){
		var ialert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
					  	'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true" class="close_times">&times;</span></button>'+
					  	'<strong>'+imessage+'</strong>'+
					'</div>';
		$(".login_panin .message_div").empty().append(ialert);
	}else{
		var futureDT2__session = {};
		var newiuserObj = _.cloneDeep(iuserObj);
		newiuserObj.current_login.value == null ? null : (newiuserObj.last_login.value = newiuserObj.current_login.value);
		newiuserObj.current_login.value = moment().format("YYYY-MM-DD HH:mm:ss");
		futureDT2__session.expires = Date.now() + 1000*60*60;
		futureDT2__session.data = newiuserObj;
		var item = {};
		item[iuser] = newiuserObj;
		store.set("futureDT2__userDB", _.assign(loginUserPassObj, item));

		if($(".save_login_div [type='checkbox']").prop("checked")){
		  	store.set("futureDT2__session_classify", "sessionStorage");
		  	try{
		  		window.sessionStorage.setItem("futureDT2__sessionStorage", JSON.stringify(futureDT2__session));
		  		store.set('futureDT2__session', futureDT2__session);
		  		store.set("futureDT2__login_mode", "sessionStorage");
		  		window.location.assign("index.html");
		  	}catch(err){
		  		loginSwalMixin({
		  		 	title: '异常',
		  		 	text: "您的浏览器不支持sessionStorage！",
		  		 	type: 'warning',
		  		 	showConfirmButton: false,
					timer: 2000,
		  		});
		  	}
		}else{
		  	store.set("futureDT2__session_classify", "localStorage");
		  	store.set('futureDT2__session', futureDT2__session);
		  	store.set("futureDT2__login_mode", "localStorage");
		  	window.location.assign("index.html");
		}

		/*loginSwalMixin({
		 	title: '是否用安全模式？',
		 	text: "如果是在公用电脑，建议使用安全模式登录！",
		 	type: 'info',
		  	showCancelButton: true,
		  	confirmButtonText: '是，使用！',
		  	cancelButtonText: '否，不使用！',
		  	reverseButtons: false
		}).then(function(result) {
		  if (result.value) {
		  	
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		  	
		  }
		});*/
	}
});

$("#login_user, #login_password").on("keyup", function(e){
	if($("#login_user").val().trim() != "" && $("#login_password").val().trim() != ""){
		var i = e.keyCode || e.which || e.charCode;
		if(i == 13){
			$(".button_div>button").trigger("click");
		}
	}
});

$(".button_div2>button").click(function(){
	var iThat = $(this);
	eouluGlobal.C_btnDisabled(iThat, true, "登陆中...");
	if($(this).data("env") == "offline"){
		/*线下环境*/
		var offline_visit = store.get("futureDT2__offline_visit");
		var iinow = Date.now();
		var iinum = 30*60*1000;
		if(_.isNil(offline_visit)){
			/*没有本地存储*/
			eouluGlobal.C_btnAbled(iThat, true, "线下访客登录成功");
			store.set("futureDT2__offline_visit", {
				visit: "offline_visit",
				overdueLength: iinow+iinum,
				start: iinow,
				oldNum: iinum
			});
			login_session_login_judge();
		}else{
			var iioverdueLength = offline_visit.overdueLength;
			if(iinow > iioverdueLength){
				/*已超期*/
		  		loginSwalMixin({
		  		 	title: '温馨提示',
		  		 	text: "您的线下访客模式已超期！请联系管理员",
		  		 	type: 'info',
		  		 	animation: false,
		  		 	customClass: 'animated zoomIn',
		  		 	showConfirmButton: false,
					timer: 2000,
		  		}).then(function(result){
		  			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
		  				eouluGlobal.C_btnAbled(iThat, true, "访客登录");
		  			}
		  		});
			}else{
				/*未超期*/
				eouluGlobal.C_btnAbled(iThat, true, "正在跳转");
				login_session_login_judge();
			}
		}
	}else if($(this).data("env") == "online"){
		/*线上环境*/
		/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/
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
								eouluGlobal.C_btnAbled(iThat, true, "访客登录成功");
								login_session_login_judge();
							}else{
								/*不是立即刷新*/
								var ioverdueLength = ivisit.overdueLength;
								var oldNum = ivisit.oldNum;
								var start = ivisit.start;
								if(num != oldNum){
									/*num改变了*/
									if(start+num < inow){
										/*超期了*/
								  		loginSwalMixin({
								  		 	title: '温馨提示',
								  		 	text: "管理员改变了使用时长，访客模式已超期，请联系管理员！",
								  		 	type: 'info',
								  		 	animation: false,
								  		 	customClass: 'animated zoomIn',
								  		 	showConfirmButton: false,
											timer: 2500,
								  		}).then(function(result){
								  			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
								  				eouluGlobal.C_btnAbled(iThat, true, "访客登录");
								  			}
								  		});
									}else{
										/*未超期*/
										console.log("管理员改变了使用时长，但没有立即刷新，访客模式未超期");
										store.set("futureDT2__visit__"+encodeURI(iHash), {
											visit: "visit",
											overdueLength: start+num,
											start: start,
											oldNum: num
										});
										eouluGlobal.C_btnAbled(iThat, true, "访客登录成功");
										login_session_login_judge();
									}
								}else{
									/*num未改变*/
									if(ioverdueLength < inow){
								  		loginSwalMixin({
								  		 	title: '温馨提示',
								  		 	text: "您的访客模式已超期，请联系管理员！",
								  		 	type: 'info',
								  		 	animation: false,
								  		 	customClass: 'animated zoomIn',
								  		 	showConfirmButton: false,
											timer: 2500,
								  		}).then(function(result){
								  			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
								  				eouluGlobal.C_btnAbled(iThat, true, "访客登录");
								  			}
								  		});
									}else{
										/*未超期*/
										console.log("管理员未改变使用时长，也没有立即刷新，访客模式未超期");
										eouluGlobal.C_btnAbled(iThat, true, "访客登录成功");
										login_session_login_judge();
									}
								}
							}
						}else{
							eouluGlobal.C_btnAbled(iThat, true, "正在跳转");
							/*初始化访客模式*/
							store.set("futureDT2__visit__"+encodeURI(iHash), {
								visit: "visit",
								overdueLength: inow+num,
								start: inow,
								oldNum: num
							});
							login_session_login_judge();
						}
					}else{
						alert("请求出错，请检查网络连接！");
						eouluGlobal.C_btnAbled(iThat, true, "访客登录");
					}
				});
			}else{
				alert("请求出错，请检查网络连接！");
				eouluGlobal.C_btnAbled(iThat, true, "访客登录");
			}
		});
		/*用当前浏览器类型+浏览版本号+当前IP+操作系统类型+操作系统版本 做下哈希*/
	}
});