$(function(){
	var futureDT2__session = store.get("futureDT2__session");
	var login_mode = store.get("futureDT2__login_mode");
	var iuser;
	if(login_mode == "visit"){
		iuser = "访客";
	}else{
		if(_.isNil(futureDT2__session)) {
			swal({
			  position: 'top',
			  type: 'error',
			  title: '异常登录！',
			  showConfirmButton: false,
			  timer: 1500
			}).then(function(result){
				if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
					window.location.assign("login.html");
				}
			});
			return false;
		}
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