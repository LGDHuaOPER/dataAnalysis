;(function(){
	if(!store.get('futureDT2__session')){
		window.location.assign("login.html");
	}else{
		var iexpires = store.get('futureDT2__session').expires;
		if(iexpires < Date.now()){
			window.location.assign("login.html");
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
		window.location.assign("login.html");
	});
})();