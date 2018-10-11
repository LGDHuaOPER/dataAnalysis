$(function(){
	var iuser = store.get("futureDT2__session").user;
	if(iuser != null || iuser != undefined){
		$(".index_curUser").text(iuser);
	}
});

$(".g_info_r_in_r").on("click", function(){
	store.remove('futureDT2__session');
	window.location.assign("login.html");
});

$(".section_in .thumbnail").on("click", function(){
	var ipage = $(this).data("ipage");
	if(ipage == "1"){
		alert("功能尚未开发！");
	}else{
		window.location.assign(ipage+".html");
	}
});

$(".index_setting, .index_curUser").click(function(){
	window.location.assign("admin.html");
});