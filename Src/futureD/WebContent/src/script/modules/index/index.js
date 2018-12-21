var indexStore = Object.create(null);
indexStore.authorityJQDomMap = {
	"管理员": [$('.g_info_r .AdminOperat')],
	"数据列表": [$("div.thumbnail[data-ipage='DataList']").parent().parent()],
	"工程分析": [$("div.thumbnail[data-ipage='ProjectAnalysis']").parent().parent()],
	"数据对比": [$("div.thumbnail[data-ipage='DataCompare']").parent().parent()]
};

$(".section_in .thumbnail").on("click", function(){
//	if($(this).data("ipage") == "ProjectAnalysis"){
//		eouluGlobal.S_getSwalMixin()({
//			title: '温馨提示',
//			text: "工程分析正在开发...",
//			type: 'info',
//			showConfirmButton: false,
//			showCancelButton: false,
//			timer: 1900
//		});
//	}else{
		window.location.assign($(this).data("ipage"));
//	}
	// window.location.assign($(this).data("ipage"));
});

/*判断权限*/
eouluGlobal.C_pageAuthorityCommonHandler({
	authorityJQDomMap: _.cloneDeep(indexStore.authorityJQDomMap)
});
/*判断权限end*/