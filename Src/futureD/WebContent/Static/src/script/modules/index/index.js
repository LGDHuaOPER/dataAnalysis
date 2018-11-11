$(function(){
	var futureDT2__session = store.get("futureDT2__session");
	var iuser;
	if(futureDT2__session === null || futureDT2__session === undefined){
		iuser = "访客";
	}else{
		iuser = futureDT2__session.data.user_name.value;
	}
	if(iuser != null && iuser != undefined){
		$(".g_bodyin_bodyin_tit").text(iuser+"，您好！欢迎使用futureD数据管理与分析系统");
	}
});

$(".section_in .thumbnail").on("click", function(){
	window.location.assign($(this).data("ipage")+".html");
});

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});