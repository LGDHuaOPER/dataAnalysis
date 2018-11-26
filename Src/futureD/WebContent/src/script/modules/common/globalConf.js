;(function(){
	var futureDURL = new URL(window.location.href);
	var ProjectName = futureDURL.pathname.split("/")[1];
	if(_.isNil(ProjectName) || _.isEmpty(ProjectName)){
		window.location.assign(eouluGlobal.S_getLoginHref());
	}else{
		eouluGlobal.C_setProjectName(ProjectName);
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
})();