/*
* 2018-11-19
* By LGD.HuaFEEng
* 
 */
/*var and function defined*/
function login_prompt(obj){
	var title = obj.title;
	var text = obj.text;
	var type = obj.type;
  	eouluGlobal.S_getSwalMixin()({
	 	title: title,
	 	text: text,
	 	/*html: '',*/
	 	type: type,
	 	showConfirmButton: false,
		timer: 1000,
	}).then(function(result){
		if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
			_.isFunction(obj.callback) && obj.callback();
		}
	});
}

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
}).on("keyup", function(e){
	if($("#login_user").val().trim() != "" && $("#login_password").val().trim() != ""){
		var i = e.keyCode || e.which || e.charCode;
		if(i == 13){
			$(".button_div>button").trigger("click");
		}
	}
});


$(".button_div>button").click(function(){
	var userName = $("#login_user").val().trim();
	var password = $("#login_password").val().trim();
	if(_.isEmpty(userName) || _.isEmpty(password)) return false;
	var iThat = $(this);
	eouluGlobal.C_btnDisabled(iThat, true, "登陆中...");
	$.ajax({
		type: "POST",
		url: "Login",
		data: {
			userName: userName,
			password: password
		},
		dataType: "json"
	}).then(function(data){
		if(_.isEqual(data, "success")){
			login_prompt({
				title: "温馨提示",
				text: "登录成功！正在跳转",
				type: "success",
				callback: function(){
				  	try{
				  		if($(".save_login_div>input").is(":checked")){
				  			window.sessionStorage.setItem("futureDT2__login_"+userName+"_safe", "safe");
				  		}else{
				  			window.sessionStorage.setItem("futureDT2__login_"+userName+"_safe", "none");
				  		}
				  	}catch(err){
				  		login_prompt({
				  			title: "温馨提示",
				  			text: "您的浏览器不支持sessionStorage，无法启用安全模式",
				  			type: "info"
				  		});
				  	}
				  	store.set("futureDOnline__curUserName", userName);
				  	eouluGlobal.C_btnDisabled(iThat, true, "正在跳转...");
					window.location.assign("HomeInterface");
				}
			});
		}else if(_.isEqual(data, "fail")){
			login_prompt({
				title: "温馨提示",
				text: "登录失败！用户名或密码错误",
				type: "warning",
				callback: function(){
					eouluGlobal.C_btnAbled(iThat, true, "登录");
				}
			});
		}else{
			login_prompt({
				title: "温馨提示",
				text: "网络繁忙，请稍后操作！",
				type: "warning",
				callback: function(){
					eouluGlobal.C_btnAbled(iThat, true, "登录");
				}
			});
		}
	}, function(){
  		login_prompt({
  			title: "温馨提示",
  			text: "网络繁忙，请稍后操作！",
  			type: "warning",
  			callback: function(){
  				eouluGlobal.C_btnAbled(iThat, true, "登录");
  			}
  		});
	});
});

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});