$(function(){
	var iuser = store.get("futureDT2__session").data.user_name.value;
	if(iuser != null || iuser != undefined){
		$(".g_bodyin_bodyin_tit").text(iuser+"，您好！欢迎使用futureD数据管理与分析系统");
	}
});

$(".section_in .thumbnail").on("click", function(){
	var ipage = $(this).data("ipage");
	if(ipage == "1"){
		alert("功能尚未开发！");
	}else{
		window.location.assign(ipage+".html");
	}
});

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});