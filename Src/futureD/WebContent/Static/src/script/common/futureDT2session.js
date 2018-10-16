;(function(){
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
			var iexpires = store.get('futureDT2__session').expires;
			if(iexpires < Date.now()){
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