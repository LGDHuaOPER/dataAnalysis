;(function(){
	if(!store.get('futureDT2__session')){
		window.location.assign("login.html");
	}else{
		var iexpires = store.get('futureDT2__session').expires;
		if(iexpires < Date.now()){
			window.location.assign("login.html");
		}
	}
})();