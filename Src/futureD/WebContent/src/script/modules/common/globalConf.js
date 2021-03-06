;(function(){
	/*浏览器polyfill*/
	var futureDT2Browser = eouluGlobal.S_getBrowserType(),
	futureDURL,
	ProjectName,
	upperBrowser = _.toUpper(futureDT2Browser[0]);
	eouluGlobal.C_setBrowser(_.cloneDeep(futureDT2Browser));
	if(_.isEqual(upperBrowser, "IE") || _.isEqual(upperBrowser, "IE11")){
		// IE环境
		if(futureDT2Browser[1]<9){
		  	eouluGlobal.S_getSwalMixin()({
			 	title: "IE版本过低",
			 	text: "请下载高版本",
			 	/*html: '',*/
			 	type: "warning",
			 	showCancelButton: false,
			 	timer: 3000
			}).then(function(){
				window.location.href = "https://support.microsoft.com/zh-cn/help/17621";
			});
			return false;
		}
		futureDURL = eouluGlobal.S_URLParser({
			iurl: window.location.href
		});
		/*page preload*/
		var ieCH = document.documentElement.clientHeight < 600 ? 600 : document.documentElement.clientHeight;
		$("body").css({
			"-ms-grid-rows": "40px "+(ieCH-40)+"px"
		});
		eouluGlobal.C_setPageAllConfig({path: "futureDT2.scrollBarWidth",value:17});
	}else{
		futureDURL = new URL(window.location.href);
		if(_.isEqual(_.toUpper(eouluGlobal.S_getBrowser()[0]), "CHROME")){
			eouluGlobal.C_setPageAllConfig({path: "futureDT2.scrollBarWidth",value:7});
		}else{
			eouluGlobal.C_setPageAllConfig({path: "futureDT2.scrollBarWidth",value:17});
		}
	}
	if(/^\//.test(futureDURL.pathname)){
		ProjectName = futureDURL.pathname.split("/")[1];
	}else{
		ProjectName = futureDURL.pathname.split("/")[0];
	}
	var futureDT2LoginPage = eouluGlobal.S_getLoginHref();
	if(_.isNil(ProjectName) || _.isEmpty(ProjectName)){
		window.location.assign(futureDT2LoginPage);
	}else{
		eouluGlobal.C_setProjectName(ProjectName);
	}

	/*全局判断userName不存在*/
	var futureDT2CurrPage = eouluGlobal.S_getCurPageHref(),
	storeCurUserName = store.get("futureDOnline__curUserName");
	if(!_.isEqual(futureDT2CurrPage, futureDT2LoginPage)){
		if(_.isNil($("body").data("curusername")) || _.isEmpty($("body").data("curusername"))){
			eouluGlobal.S_settingURLParam({}, false, false, false, futureDT2LoginPage);
			return false;
		}
		if(!_.isNil(storeCurUserName) && !_.isEmpty(storeCurUserName)){
			eouluGlobal.C_setCurUserName(storeCurUserName);
		}

		/*判断权限*/
		var userAuthorityStr = $("body").data("userauthority");
		if(_.isNil(userAuthorityStr) || _.isEmpty(userAuthorityStr) || _.isEqual(userAuthorityStr, "[]")){
			if(_.indexOf(eouluGlobal.S_getExcludeJudgeAuthorityPage(), futureDT2CurrPage) == -1){
				eouluGlobal.S_settingURLParam({}, false, false, false, futureDT2LoginPage);
				return false;
			}
		}else{
			var userAuthorityStrArr = userAuthorityStr.replace(/^\[/,"").replace(/\]$/,"").split(", ");
			if(userAuthorityStrArr.length == 3){
				var userAuthorityObj = [];
				var userAuthorityArr0 = userAuthorityStrArr[0].split(","),
				userAuthorityArr1 = userAuthorityStrArr[1].split(","),
				userAuthorityArr2 = userAuthorityStrArr[2].split(",");
				_.forEach(userAuthorityArr0, function(v, i){
					var item ={};
					item.name = v;
					item.value = _.toNumber(userAuthorityArr2[i]);
					item.url = userAuthorityArr1[i];
					userAuthorityObj.push(item);
				});
				var page;
				if(_.indexOf(eouluGlobal.S_getAllAuthorityPage(), futureDT2CurrPage) > -1){
					page = "ALL";
				}else{
					page = null;
				}
				eouluGlobal.C_setCurPageJudgedAuthority(eouluGlobal.S_pageReturnAuthorityHandler({
					objec: {
						page: page
					},
					userAuthorityObj: userAuthorityObj
				}));
			}
		}
	}

	/*全局ajax和xhr请求拦截处理*/
	jQuery.ajaxSetup({
		cache: false,
		beforeSend: function(XMLHttpReq){
            // XMLHttpReq.abort();
            console.warn("ajaxSetup, 局部事件beforeSend")
            // return false;
        },
        success: function(){
        	console.warn("ajaxSetup, 局部事件success")
        },
        error: function(){
        	console.warn($("body").data("iglobalerror"))
        	if($("body").data("iglobalerror") != "allow") {
        		eouluGlobal.C_server500Message({
        			callback: null
        		});
        	}
        }
	});
	$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
	  	console.warn("document上的ajaxError");
	}).ajaxSend(function(event, jqXHR, ajaxOptions){
		console.warn("document上的ajaxSend");
	});

	$(document).on("click", ".g_info_r img[data-iicon='glyphicon-off']", function(){
	  	eouluGlobal.S_getSwalMixin()({
		 	title: "确定退出吗？",
		 	text: "此操作为安全退出",
		 	/*html: '',*/
		 	type: "warning",
		 	showCancelButton: true,
		  	confirmButtonText: '确定，退出！',
		  	cancelButtonText: '不，取消！',
		  	reverseButtons: false
		}).then(function(result){
			if (result.value) {
				$.ajax({
					type: "GET",
					url: "Logon",
					dataType: "json"
				}).then(function(data){
					if(data == "OK"){
						eouluGlobal.S_getSwalMixin()({
							title: "提示",
							text: "退出成功",
							type: "info",
							showConfirmButton: false,
							timer: 1000
						}).then(function(){
							store.remove("futureDOnline__curUserName");
							eouluGlobal.S_settingURLParam({}, false, false, false, futureDT2LoginPage);
						});
					}else{
						eouluGlobal.S_getSwalMixin()({
							title: "提示",
							text: "退出失败",
							type: "info",
							showConfirmButton: false,
							timer: 1500
						});
					}
				});
			} else if (result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel) {
				
			}
		});
	});
	$(document).on("click", ".g_info_r .Information", function(){
		eouluGlobal.S_getSwalMixin()({
			title: "提示",
			text: "功能暂未添加，敬请期待！",
			type: "info",
			showConfirmButton: false,
			timer: 2000
		});
	});
	
	$(document).on("click", ".g_info_r .AdminOperat", function(){
		eouluGlobal.S_settingURLParam({}, false, false, false, "UserInstall");
	});
	$(".g_info_r .curusername").text($("body").data("curusername"));

	// 安全
	var loginstatus = $("body").data("loginstatus");
	if(_.eq(loginstatus, true) || _.eq(loginstatus, "true")){
		var loginsafe = window.sessionStorage.getItem("futureDT2Online__login_"+eouluGlobal.S_getCurUserName()+"_safe");
		if(_.isNil(loginsafe)){
			eouluGlobal.S_settingURLParam({}, false, false, false, futureDT2LoginPage);
		}
	}
	
})();