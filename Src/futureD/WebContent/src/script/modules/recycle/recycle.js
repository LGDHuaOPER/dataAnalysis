/*var and function defined*/
var recycleStore = Object.create(null);
recycleStore.state = Object.create(null);
recycleStore.state.userName = null;
recycleStore.state.pageObj = {
	pageOption: null,
	currentPage: null,
	pageCount: null,
	searchFlag: false,
	searchVal: ""
};
recycleStore.state.authorityJQDomMap = {
	"管理员": [$(".g_info_r .glyphicon-user")],
	"恢复": [$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-share-alt']"), $(".operate_othertd [data-iicon='glyphicon-share-alt']")],
	"删除": [$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove']"), $(".operate_othertd [data-iicon='glyphicon-remove']")]
};

function tableEllipsis(){
	// 表格自适应出现省略号
	var $table = $("div.g_bodyin_bodyin_body>table");
	var len = $table.find("th:visible").length;
	var itemWid = _.floor(($table.innerWidth() - 50)/(len - 1));
	eouluGlobal.C_tableEllipsis({
		container: $("div.g_bodyin_bodyin_body>table"),
		widthArr: _.fill(_.fill(Array(len), itemWid), 50, 0, 1)
	});
}

// 搜索值标红
function searchValShowRed(){
	$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
		var iText = $(this).text();
		var ireplace = "<b style='color:red'>"+recycleStore.state.pageObj.searchVal+"</b>";
		var iHtml = iText.replace(new RegExp(recycleStore.state.pageObj.searchVal, 'g'), ireplace);
		$(this).empty().html(iHtml);
	});
}

/*删除selectItem内item*/
function delStoreSelectItem(obj){
	var value = obj.value,
	delAll = obj.delAll;

	var selectedItem = store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem") || [],
	URLParam,
	icurPage;
	if(delAll === true){
		if(selectedItem.length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length){
			/*如果是都在本页删除*/
			if($(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length){
				/*如果全部删除了*/
				icurPage = $("body").data("currentpage") - 1 == 0 ? 1 : ($("body").data("currentpage") - 1);
			}else{
				icurPage = $("body").data("currentpage");
			}
			if(recycleStore.state.pageObj.searchFlag){
				URLParam = {
					currentPage: icurPage,
					keyword: recycleStore.state.pageObj.searchVal
				};
			}else{
				URLParam = {
					currentPage: icurPage,
				};
			}
		}else{
			if(recycleStore.state.pageObj.searchFlag){
				URLParam = {
					currentPage: 1,
					keyword: recycleStore.state.pageObj.searchVal
				};
			}else{
				URLParam = {
					currentPage: 1,
				};
			}
		}
		store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem", []);
	}else{
		_.pull(selectedItem, value);
		if($(".g_bodyin_bodyin_body tbody>tr").length == 1){
			icurPage = $("body").data("currentpage") - 1 == 0 ? 1 : ($("body").data("currentpage") - 1);
			if(recycleStore.state.pageObj.searchFlag){
				URLParam = {
					currentPage: icurPage,
					keyword: recycleStore.state.pageObj.searchVal
				};
			}else{
				URLParam = {
					currentPage: icurPage,
				};
			}
		}else{
			// window.location.reload();
			if(recycleStore.state.pageObj.searchFlag){
				URLParam = {
					currentPage: $("body").data("currentpage"),
					keyword: recycleStore.state.pageObj.searchVal
				};
			}else{
				URLParam = {
					currentPage: $("body").data("currentpage"),
				};
			}
		}
		store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem", _.cloneDeep(selectedItem));
	}
	eouluGlobal.S_settingURLParam(URLParam, false, false, false);
}
/*preload*/

/*page onload*/
$(function(){
	/*判断权限*/
	eouluGlobal.C_pageAuthorityCommonHandler({
		authorityJQDomMap: _.cloneDeep(recycleStore.state.authorityJQDomMap)
	});
	/*判断权限end*/

	tableEllipsis();

	/*初始化分页组件*/
	recycleStore.state.pageObj.currentPage = _.toNumber($("body").data("currentpage"));
	recycleStore.state.pageObj.pageCount = _.toNumber($("body").data("totalcount"));
	recycleStore.state.pageObj.searchVal = _.trim($("#search_input").val());
	recycleStore.state.pageObj.searchFlag = recycleStore.state.pageObj.searchVal !== "";

	// 分页元素ID（必填）
	// 分页配置
	recycleStore.state.pageObj.pageOption = {
		// 每页显示数据条数（必填）
		limit: 10,
		// 数据总数（一般通过后端获取，必填）
		count: recycleStore.state.pageObj.pageCount,
		// 当前页码（选填，默认为1）
		curr: recycleStore.state.pageObj.currentPage,
		// 是否显示省略号（选填，默认显示）
		ellipsis: true,
		// 当前页前后两边可显示的页码个数（选填，默认为2）
		pageShow: 2,
		// 开启location.hash，并自定义hash值 （默认关闭）
		// 如果开启，在触发分页时，会自动对url追加：#!hash值={curr} 利用这个，可以在页面载入时就定位到指定页
		hash: false,
		// 页面加载后默认执行一次，然后当分页被切换时再次触发
		callback: function(obj) {
			// obj.curr：获取当前页码
			// obj.limit：获取每页显示数据条数
			// obj.isFirst：是否首次加载页面，一般用于初始加载的判断
			recycleStore.state.pageObj.searchFlag && searchValShowRed();
			// 首次不执行
			if (!obj.isFirst) {
				// do something
				/*dataListState.hasSearch && searchMark($("#search_input").val().trim());
				$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
					if(_.indexOf(dataListState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
						$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
					}
				});*/
				var URLParam;
				if (recycleStore.state.pageObj.searchFlag) {
					URLParam = {
						currentPage: obj.curr,
						keyword: recycleStore.state.pageObj.searchVal
					};
				} else {
					URLParam = {
						currentPage: obj.curr,
					};
				}
				eouluGlobal.S_settingURLParam(URLParam, false, false, false);
			}
		}
	};
	// 初始化分页器
	new Pagination('#pagelist', recycleStore.state.pageObj.pageOption);

	recycleStore.state.userName = $("body").data("curusername");
	/*回显选中*/
	var selectedItem = store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");
	if(_.isNil(selectedItem)) selectedItem = [];
	_.forEach(selectedItem, function(v, i){
		$(".g_bodyin_bodyin_body tbody input[type='checkbox'][data-iid='"+_.toNumber(v)+"']").prop("checked", true).parent().parent().addClass("warning");
	});
	$("#checkAll").prop("checked", $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length);
});

/*event handler*/
$(window).on("resize", function(){
	tableEllipsis();
});

/*选择Item并存储*/
$(document).on("mouseover", ".g_bodyin_bodyin_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
}).on("mouseout", ".g_bodyin_bodyin_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
}).on("click", ".g_bodyin_bodyin_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(){
	var ID = $(this).data("iid").toString();
	var selectedItem = store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");
	if(_.isNil(selectedItem)) selectedItem = [];
	$(this).prop("checked") ? selectedItem.push(ID) : _.pull(selectedItem, ID);
	selectedItem = _.uniq(selectedItem);
	store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem", selectedItem);
	$("#checkAll").prop("checked", $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length);
});
$("#checkAll").on({
	click: function(){
		var that = $(this);
		var selectedItem = store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");
		if(_.isNil(selectedItem)) selectedItem = [];
		$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			var ID = $(this).data("iid").toString();
			if(that.prop("checked")){
				$(this).parent().parent().removeClass("info").addClass("warning");
				selectedItem.push(ID);
			}else{
				$(this).parent().parent().removeClass("warning info");
				_.pull(selectedItem, ID);
			}
		});
		selectedItem = _.uniq(selectedItem);
		store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem", selectedItem);
	}
});

/*跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});
$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = recycleStore.state.pageObj.currentPage;
	var pageCounts = recycleStore.state.pageObj.pageCount;
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		var URLParam;
		if(recycleStore.state.pageObj.searchFlag){
			URLParam = {
				currentPage: iText,
				keyword: recycleStore.state.pageObj.searchVal
			};
		}else{
			URLParam = {
				currentPage: iText,
			};
		}
		eouluGlobal.S_settingURLParam(URLParam, false, false, false);
	}
});

/*搜索全部*/
$("#search_input").on("input propertychange change", function(){
	$(this).val(_.trim($(this).val()));
}).on("keyup", function(e){
	var i = e.keyCode || e.which || e.charCode;
	if(i == 13){
		$(this).parent().parent().next().trigger("click");
	}
});
/*搜索*/
$("#search_button").on("click", function(){
	/*e.preventDefault();
	e.stopPropagation();*/
	var isearch = _.trim($("#search_input").val());
	var URLParam;
	if(_.isEmpty(isearch)){
		URLParam = {
			currentPage: 1,
		};
	}else{
		URLParam = {
			currentPage: 1,
			keyword: isearch
		};
	}
	eouluGlobal.S_settingURLParam(URLParam, false, false, false);
	return false;
});
$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});

/*永久删除*/
$(document).on("click", ".operate_othertd [data-iicon='glyphicon-remove']", function(e){
	e.stopPropagation();
	var iThat = $(this);
  	eouluGlobal.S_getSwalMixin()({
	 	title: "确定永久删除吗？",
	 	text: "删除后将无法恢复",
	 	type: "warning",
	 	showCancelButton: true,
	  	confirmButtonText: '确定，删除！',
	  	cancelButtonText: '不，取消！',
	  	reverseButtons: false
	}).then(function(result){
		if(result.value){
			$.ajax({
				type: "GET",
				url: "RecycleBinRemove",
				data: {
					waferId: iThat.data("iid")
				},
				dataType: "json"
			}).then(function(data){
				if(data == true){
					eouluGlobal.S_getSwalMixin()({
						title: "删除提示",
						text: "永久删除成功",
						type: "success",
						showConfirmButton: false,
						timer: 1800
					}).then(function(){
						delStoreSelectItem({
							value: iThat.data("iid").toString()
						});
					});
				}else if(data == false){
					eouluGlobal.S_getSwalMixin()({
						title: "删除提示",
						text: "永久删除失败",
						type: "error",
						showConfirmButton: false,
						timer: 1700
					});
				}else{
					eouluGlobal.S_getSwalMixin()({
						title: "删除提示",
						text: data,
						type: "info",
						showConfirmButton: false,
						timer: 1700
					});
				}
			});
		}else if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel){
		}
	});
}).on("click", ".operate_othertd [data-iicon='glyphicon-share-alt']", function(e){
	e.stopPropagation();
	var iThat = $(this);
  	eouluGlobal.S_getSwalMixin()({
	 	title: "确定恢复吗？",
	 	text: "将恢复至数据列表页面",
	 	type: "info",
	 	showCancelButton: true,
	  	confirmButtonText: '确定，恢复！',
	  	cancelButtonText: '不，取消！',
	  	reverseButtons: false
	}).then(function(result){
		if(result.value){
			$.ajax({
				type: "GET",
				url: "RecycleBinRecovery",
				data: {
					waferId: iThat.data("iid")
				},
				dataType: "json"
			}).then(function(data){
				if(data == true){
					eouluGlobal.S_getSwalMixin()({
						title: "恢复提示",
						text: "恢复成功",
						type: "success",
						showConfirmButton: false,
						timer: 1800
					}).then(function(){
						delStoreSelectItem({
							value: iThat.data("iid").toString()
						});
					});
				}else if(data == false){
					eouluGlobal.S_getSwalMixin()({
						title: "恢复提示",
						text: "恢复失败",
						type: "error",
						showConfirmButton: false,
						timer: 1700
					});
				}else{
					eouluGlobal.S_getSwalMixin()({
						title: "恢复提示",
						text: data,
						type: "info",
						showConfirmButton: false,
						timer: 1700
					});
				}
			});
		}else if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel){
		}
	});
});

$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove'], .g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-share-alt']").click(function(){
	var selectedItem = store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");
	if(_.isNil(selectedItem) || _.isEmpty(selectedItem)) return false;
	var messa1,
	messa2,
	iurl;
	if($(this).is("[data-iicon='glyphicon-remove']")){
		messa1 = "永久删除";
		messa2 = "删除后无法恢复";
		iurl = "RecycleBinRemove";
	}else if($(this).is("[data-iicon='glyphicon-share-alt']")){
		messa1 = "恢复";
		messa2 = "恢复后可在数据列表找到";
		iurl = "RecycleBinRecovery";
	}

  	eouluGlobal.S_getSwalMixin()({
	 	title: "确定"+messa1+"吗？",
	 	text: "将"+messa1+"选中的"+selectedItem.length+"条数据，"+messa2,
	 	/*html: '',*/
	 	type: "warning",
	 	showCancelButton: true,
	  	confirmButtonText: "是，"+messa1+"！",
	  	cancelButtonText: '否，取消！',
	  	reverseButtons: false
	}).then(function(result){
		if (result.value) {
			// {value: true}
			$.ajax({
				type: "GET",
				url: iurl,
				data: {
					waferId: _.join(selectedItem, ",")
				},
				dataType: "json"
			}).then(function(data){
				if(data == true){
					eouluGlobal.S_getSwalMixin()({
						title: messa1+"提示",
						text: messa1+"成功",
						type: "success",
						showConfirmButton: false,
						timer: 1800
					}).then(function(){
						delStoreSelectItem({
							delAll: true
						});
					});
				}else if(data == false){
					eouluGlobal.S_getSwalMixin()({
						title: messa1+"提示",
						text: messa1+"失败",
						type: "error",
						showConfirmButton: false,
						timer: 1700
					});
				}else{
					eouluGlobal.S_getSwalMixin()({
						title: messa1+"提示",
						text: data,
						type: "info",
						showConfirmButton: false,
						timer: 1700
					});
				}
			});
		} else if (result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel) {
		}
	});
});