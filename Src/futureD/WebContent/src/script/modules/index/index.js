$(".section_in .thumbnail").on("click", function(){
	window.location.assign($(this).data("ipage"));
});

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});