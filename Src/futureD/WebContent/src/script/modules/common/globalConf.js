;(function(){
	var futureDURL = new URL(window.location.href);
	var ProjectName = futureDURL.pathname.split("/")[1];
	if(_.isNil(ProjectName) || _.isEmpty(ProjectName)){
		window.location.assign(eouluGlobal.S_getLoginHref());
	}else{
		eouluGlobal.C_setProjectName(ProjectName);
	}

	/*全局判断userName不存在*/
	if(!_.isEqual(eouluGlobal.S_getCurPageHref(), eouluGlobal.S_getLoginHref())){
		if(_.isNil($("body").data("curusername")) || _.isEmpty($("body").data("curusername"))){
			eouluGlobal.S_settingURLParam({}, false, false, false, eouluGlobal.S_getLoginHref());
			return false;
		}
	}

	/*全局ajax和xhr请求拦截处理*/
	jQuery.ajaxSetup({
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

	$(document).on("click", ".g_info_r .glyphicon-off", function(){
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
							timer: 1500
						}).then(function(){
							eouluGlobal.S_settingURLParam({}, false, false, false, eouluGlobal.S_getLoginHref());
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
	$(document).on("click", ".g_info_r .glyphicon-user", function(){
		eouluGlobal.S_settingURLParam({}, false, false, false, "UserInstall");
	});

})();