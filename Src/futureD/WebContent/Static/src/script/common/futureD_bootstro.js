var futureD_bootstro_ipage = $("body").data("curpage");
$(function(){
	if(_.isNil(futureD_bootstro_ipage)) return false;
	var flag = store.get("futureD_bootstro_"+futureD_bootstro_ipage);
	if(flag == "finish") return false;
	futureD_bootstro_start();
});

$(".g_info .glyphicon-question-sign").click(function(){
	$("div.bootstro-backdrop").remove();
	futureD_bootstro_start();
});

/*$(window).on("unload", function(){
	store.set("futureD_bootstro_"+futureD_bootstro_ipage+"_flag", "end");
});*/

function futureD_bootstro_start() {
	bootstro.start(".bootstro", {
		nextButton: '<button type="button" class="btn btn-primary btn-xs bootstro-next-btn">下一步 <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button>',
		prevButton: '<button type="button" class="btn btn-primary btn-xs bootstro-prev-btn"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> 上一步</button>',
		finishButton: '<button type="button" class="btn btn-success btn-xs bootstro-finish-btn"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> 完成</button>',
		onComplete: function(params) {
			setTimeout(function(){
				alert("您完成了总计" + (params.idx + 1) + "个页面引导步骤，现在开始使用页面吧！");
				store.set("futureD_bootstro_"+futureD_bootstro_ipage, "finish");
			}, 500);
		},
		onExit: function(params) {
			if(params.idx+1 == params.count ) return false;
			alert("您在第" + (params.idx + 1) +"步退出了页面引导，可以点击帮助再次查看！");
		},
        onStep: function(params) {
        	// console.log(params);
        }
    });
}