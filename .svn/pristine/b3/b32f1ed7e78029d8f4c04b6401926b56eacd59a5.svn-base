var loginSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var futureDT2Mock;
var loginUserPassObj = store.get("futureDT2__userDB");

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

		loginSwalMixin({
		 	title: '是否用安全模式？',
		 	text: "如果是在公用电脑，建议使用安全模式登录！",
		 	type: 'info',
		  	showCancelButton: true,
		  	confirmButtonText: '是，使用！',
		  	cancelButtonText: '否，不使用！',
		  	reverseButtons: false
		}).then(function(result) {
		  if (result.value) {
		  	store.set("futureDT2__session_classify", "sessionStorage");
		  	try{
		  		window.sessionStorage.setItem("futureDT2__sessionStorage", JSON.stringify(futureDT2__session));
		  		store.set('futureDT2__session', futureDT2__session);
		  		window.location.assign("index.html");
		  	}catch{
		  		loginSwalMixin({
		  		 	title: '异常',
		  		 	text: "您的浏览器不支持sessionStorage！",
		  		 	type: 'warning',
		  		 	showConfirmButton: false,
					timer: 2000,
		  		})
		  	}
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		  	store.set("futureDT2__session_classify", "localStorage");
		  	store.set('futureDT2__session', futureDT2__session);
		  	window.location.assign("index.html");
		  }
		});
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