var indexStore = Object.create(null);
indexStore.authorityJQDomMap = {
	"管理员": [$('.g_info_r .AdminOperat')],
	"数据列表": [$("div.thumbnail[data-ipage='DataList']").parent().parent()],
	"工程分析": [$("div.thumbnail[data-ipage='ProjectAnalysis']").parent().parent()],
	"数据对比": [$("div.thumbnail[data-ipage='DataCompare']").parent().parent()]
};

$(".section_in .thumbnail").on("click", function(){
	var ipage = $(this).data("ipage");
	if(ipage == "ProjectAnalysis"){
		eouluGlobal.S_getSwalMixin()({
		    title: "跳转提示",
		    text: "功能正在开发",
		    /*html: '',*/
		    type: "info",
		    showConfirmButton: false,
		    timer: 2000
		});
		return false;
	}
	window.location.assign($(this).data("ipage"));
});

/*判断权限*/
eouluGlobal.C_pageAuthorityCommonHandler({
	authorityJQDomMap: _.cloneDeep(indexStore.authorityJQDomMap)
});
/*判断权限end*/