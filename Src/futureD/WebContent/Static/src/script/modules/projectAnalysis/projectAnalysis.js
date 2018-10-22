/*variable defined*/
var projectAnalysisSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var projectAnalysisState = new Object();
projectAnalysisState.paginationObj = {
	normal: null,
	search: null
};
projectAnalysisState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
projectAnalysisState.pageSearchObj = {
	selector: '#pagelist',
	pageOption: {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: 0,
	  // 当前页码（选填，默认为1）
	  curr: 0,
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
	    projectAnalysisState.pageSearchObj.currentPage = obj.curr;
	    $(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
	    	if(_.indexOf(projectAnalysisState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
	    		$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
	    	}
	    });
	    if(projectAnalysisState.searchObj.hasSearch){
	    	$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
	    		var iText = $(this).text();
	    		var ireplace = "<b style='color:red'>"+projectAnalysisState.searchObj.searchVal+"</b>";
	    		var iHtml = iText.replace(new RegExp(projectAnalysisState.searchObj.searchVal, 'g'), ireplace);
	    		$(this).empty().html(iHtml);
	    	});
	    }
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	var dataArr = getProjectAnalysisData(projectAnalysisState.searchObj.searchVal);
	      	projectAnalysisRenderData({
				chunkArr: dataArr,
				currentPage: projectAnalysisState.pageSearchObj.currentPage
			});
	    }
	  }
	},
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
projectAnalysisState.searchObj = {
	hasSearch: false,
	searchVal: null
};
projectAnalysisState.sellectObj = {
	selectAll: false,
	selectItem: []
};

function redirectLogin(obj){
	projectAnalysisSwalMixin({
		title: 'mock数据异常',
		text: obj.text,
		type: 'error',
		showConfirmButton: false,
		timer: 2500,
	}).then(function(result){
		if(result.dismiss == "timer"){
			window.location.assign(obj.url);
		}
	});
}

function getProjectAnalysisData(searchVal){
	var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
	if(_.isEmpty(futureDT2__datalist__pageDataObj) || _.isNil(futureDT2__datalist__pageDataObj)){
		redirectLogin({
			text: "意外被删除，请重新登录！",
			url: "login.html"
		});
		return false;
	}else{
		var projectAnalysisData = JSON.parse(futureDT2__datalist__pageDataObj).data;
		store.set('futureDT2__datalist__selectedItem', []);
		var futureDT2__datalist__selectedItem = store.get('futureDT2__datalist__selectedItem');
		if(_.isEmpty(futureDT2__datalist__selectedItem) || _.isNil(futureDT2__datalist__selectedItem)){
			var returnprojectAnalysisData = [];
			if(searchVal == null || searchVal == ""){
				returnprojectAnalysisData = projectAnalysisData;
			}else{
				_.forEach(projectAnalysisData, function(v){
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(searchVal)>-1){
							returnprojectAnalysisData.push(v);
							return false;
						}
					});
				});
			}
			var filterArray = _.filter(returnprojectAnalysisData, function(o) { return o.delete_status.value == "0"; });
			var chunkArray = _.chunk(_.reverse(_.sortBy(filterArray, function(o) { return o.test_start_date.value; })), 10);
			if(projectAnalysisState.searchObj.hasSearch){
				projectAnalysisState.pageSearchObj.pageCount = chunkArray.length;
				projectAnalysisState.pageSearchObj.itemLength = filterArray.length;
				projectAnalysisState.pageSearchObj.data = _.cloneDeep(chunkArray);
			}else{
				projectAnalysisState.pageObj.pageCount = chunkArray.length;
				projectAnalysisState.pageObj.itemLength = filterArray.length;
				projectAnalysisState.pageObj.data = _.cloneDeep(chunkArray);
			}
			return chunkArray;
		}else{
			var projectAnalysisDataArr = [];
			_.forEach(futureDT2__datalist__selectedItem, function(v, i){
				if(searchVal == null || searchVal == ""){
					projectAnalysisDataArr.push(_.find(projectAnalysisData, function(o){
						return o.wafer_id.value == v;
					}));
				}else{
					var item = _.find(projectAnalysisData, function(o){
						return o.wafer_id.value == v;
					});
					_.forOwn(item, function(va, ke){
						if(String(va.value).indexOf(searchVal) > -1){
							projectAnalysisDataArr.push(item);
							return false;
						}
					});
				}
			});
			var filterArray2 = _.filter(projectAnalysisDataArr, function(o) { return o.delete_status.value == "0"; });
			var chunkArray2 = _.chunk(_.reverse(_.sortBy(filterArray2, function(o) { return o.test_start_date.value; })), 10);
			if(projectAnalysisState.searchObj.hasSearch){
				projectAnalysisState.pageSearchObj.pageCount = chunkArray2.length;
				projectAnalysisState.pageSearchObj.itemLength = filterArray2.length;
				projectAnalysisState.pageSearchObj.data = _.cloneDeep(chunkArray2);
			}else{
				projectAnalysisState.pageObj.pageCount = chunkArray2.length;
				projectAnalysisState.pageObj.itemLength = filterArray2.length;
				projectAnalysisState.pageObj.data = _.cloneDeep(chunkArray2);
			}
			return chunkArray2;
		}
	}
}

function projectAnalysisRenderData(obj){
	if(obj.chunkArr!=undefined){
		var str = '';
		obj.chunkArr[obj.currentPage - 1].map(function(v, i, arr){
			var ii = v.wafer_id.value;
			var iii = (obj.currentPage - 1)*10+(i+1);
			str+='<tr>'+
					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
					'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
					'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
					'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
					'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
					'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
					'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
					'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
				'</tr>';
		});
		$(".g_bodyin_bodyin_body tbody").empty().append(str);
	}
}

function analyzeBtn(){
	if($(".g_body_rr_body_item.active").length){
		$(".g_body_rr_body_btn>input").prop("disabled", false);
	}else{
		$(".g_body_rr_body_btn>input").prop("disabled", true);
	}
}

/*page onload*/
$(function(){
	$(".g_bodyin_body_top").height(($(".g_bodyin_body").height())/2);
	$(".g_bodyin_body_bottom").height(($(".g_bodyin_body").height())/2 - 30);

	$(window).on("resize", function(){
		$(".g_bodyin_body_top").height(($(".g_bodyin_body").height())/2);
		$(".g_bodyin_body_bottom").height(($(".g_bodyin_body").height())/2 - 30);
	});

	/*判断是否有选中*/
	var dataArr = getProjectAnalysisData(null);
	if(dataArr !== false){
		projectAnalysisRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});

		// 分页元素ID（必填）
		projectAnalysisState.pageObj.selector = '#pagelist';
		// 分页配置
		projectAnalysisState.pageObj.pageOption = {
		  // 每页显示数据条数（必填）
		  limit: 10,
		  // 数据总数（一般通过后端获取，必填）
		  count: projectAnalysisState.pageObj.itemLength,
		  // 当前页码（选填，默认为1）
		  curr: 1,
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
		    projectAnalysisState.pageObj.currentPage = obj.curr;
		    $(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
		    	if(_.indexOf(projectAnalysisState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
		    		$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
		    	}
		    });
		    if(projectAnalysisState.searchObj.hasSearch){
		    	$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
		    		var iText = $(this).text();
		    		var ireplace = "<b style='color:red'>"+projectAnalysisState.searchObj.searchVal+"</b>";
		    		var iHtml = iText.replace(new RegExp(projectAnalysisState.searchObj.searchVal, 'g'), ireplace);
		    		$(this).empty().html(iHtml);
		    	});
		    }
		    // 首次不执行
		    if (!obj.isFirst) {
		      // do something
		      	var dataArr = getProjectAnalysisData(projectAnalysisState.searchObj.searchVal);
		      	projectAnalysisRenderData({
					chunkArr: dataArr,
					currentPage: projectAnalysisState.pageObj.currentPage
				});
		    }
		  }
		};
		// 初始化分页器
		projectAnalysisState.paginationObj.normal = new Pagination(projectAnalysisState.pageObj.selector, projectAnalysisState.pageObj.pageOption);
	}
});

/*event handler*/
$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});

$("#search_input").on("input propertychange change", function(){
	if($(this).val().trim() != ""){
		$(this).parent().parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled", false);
	}else{
		$(this).val("");
		$(this).parent().parent().next().removeClass("btn-primary").addClass("btn-default").prop("disabled", true);
	}
}).on("keyup", function(e){
	var i = e.keyCode || e.which || e.charCode;
	if(i == 13 && $(this).val().trim() != ""){
		$(this).parent().parent().next().trigger("click");
	}
});

$(document).on("mouseover", ".g_bodyin_bodyin_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
});

$(document).on("mouseout", ".g_bodyin_bodyin_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
}).on("click", ".g_bodyin_bodyin_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(){
	var ID = $(this).data("ivalue").toString();
	if($(this).prop("checked")){
		projectAnalysisState.sellectObj.selectItem.push(ID);
		$(".g_bodyin_body_bottom tbody>tr [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		$(".g_bodyin_body_bottom tbody").append($(this).parent().parent().clone());
		$(".g_bodyin_body_bottom tbody tr, .g_bodyin_body_bottom tbody td").removeClass("info warning");
	}else{
		_.pull(projectAnalysisState.sellectObj.selectItem, ID);
		$(".g_bodyin_body_bottom tbody [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
	}
	projectAnalysisState.sellectObj.selectItem = _.uniq(projectAnalysisState.sellectObj.selectItem);
	$("#checkAll").prop("checked", projectAnalysisState.pageObj.itemLength == projectAnalysisState.sellectObj.selectItem.length);
	projectAnalysisState.sellectObj.selectAll = $("#checkAll").prop("checked");
	if(projectAnalysisState.sellectObj.selectItem.length == 0){
		$(".g_bodyin_body_bottom tbody").css("border-bottom", "0px solid #fff");
		$(".g_body_rr_body_btn>input").prop("disabled", true);
	}else{
		analyzeBtn();
	}
});

$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		projectAnalysisState.sellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			projectAnalysisSwalMixin({
				title: '加载全部数据',
				text: "正在加载中......",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false
			});
			projectAnalysisState.sellectObj.selectItem = [];
			var str = '';
			JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data.map(function(v, i, arr){
				if(v.delete_status.value == "0"){
					projectAnalysisState.sellectObj.selectItem.push(v.wafer_id.value);
				}else{
					return true;
				}
				if(projectAnalysisState.searchObj.hasSearch){
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(projectAnalysisState.searchObj.searchVal)>-1){
							var ii = v.wafer_id.value;
							var iii = arr.length - i;
							str = '<tr>'+
									'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
									'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
									'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
									'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
									'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
									'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
									'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
									'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
								'</tr>' + str;
							return false;
						}
					});
				}else{
					var ii = v.wafer_id.value;
					var iii = arr.length - i;
					str = '<tr>'+
							'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
							'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
							'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
							'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
							'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
							'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
							'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
							'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
						'</tr>' + str;
				}
			});
			$(".g_bodyin_body_bottom tbody").empty().append(str);
			analyzeBtn();
			setTimeout(function(){
				swal.clickCancel();
			}, 2000);
		}else{
			projectAnalysisState.sellectObj.selectItem = [];
			$(".g_bodyin_body_bottom tbody").empty();
			$(".g_body_rr_body_btn>input").prop("disabled", true);
		}
	}
});

/*$("#search_button").on("click", function(){
	var isearch = $("#search_input").val().trim();
	if(isearch == ""){
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iiText = _.isNil($(this).data("itext")) ? "" : $(this).data("itext");
			$(this).empty().text(iiText);
		});
		dataListState.hasSearch = false;
		return false;
	}else{
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
		dataListState.hasSearch = true;
		return false;
	}
});*/

$("#search_button").on("click", function(){
	var isearch = $("#search_input").val().trim();
	projectAnalysisState.searchObj.hasSearch = isearch == "" ? false : true;
	projectAnalysisState.searchObj.searchVal = projectAnalysisState.searchObj.hasSearch == true ? isearch : null;
	var dataArr = getProjectAnalysisData(isearch);
	if(dataArr !== false){
		projectAnalysisRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});
	}
	if(projectAnalysisState.searchObj.hasSearch){
		projectAnalysisState.pageSearchObj.currentPage = 1;
		projectAnalysisState.pageSearchObj.pageOption.curr = 1;
		projectAnalysisState.pageSearchObj.pageOption.count = projectAnalysisState.pageSearchObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		projectAnalysisState.paginationObj.search = new Pagination(projectAnalysisState.pageSearchObj.selector, projectAnalysisState.pageSearchObj.pageOption);
	}else{
		projectAnalysisState.pageObj.pageOption.curr = 1;
		projectAnalysisState.pageObj.pageOption.count = projectAnalysisState.pageObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		projectAnalysisState.paginationObj.normal = new Pagination(projectAnalysisState.pageObj.selector, projectAnalysisState.pageObj.pageOption);
	}
	return false;
});

/*翻页跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});

$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = Number(projectAnalysisState.pageObj.currentPage);
	var pageCounts = Number(projectAnalysisState.pageObj.pageCount);
	if(projectAnalysisState.searchObj.hasSearch){
		currentPage = Number(projectAnalysisState.pageSearchObj.currentPage);
		pageCounts = Number(projectAnalysisState.pageSearchObj.pageCount);
	}
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		var dataArr = getProjectAnalysisData(projectAnalysisState.searchObj.searchVal);
		if(dataArr !== false){
			if(projectAnalysisState.searchObj.hasSearch){
				projectAnalysisState.pageSearchObj.pageOption.curr = iText;
				projectAnalysisState.paginationObj.search.goPage(iText);
				projectAnalysisState.paginationObj.search.renderPages();
				projectAnalysisState.paginationObj.search.options.curr = iText;
				console.log(projectAnalysisState.paginationObj.search);
	          	projectAnalysisState.paginationObj.search.options.callback && projectAnalysisState.paginationObj.search.options.callback({
	            	curr: projectAnalysisState.paginationObj.search.pageNumber,
	            	/*limit: projectAnalysisState.paginationObj.search.options.limit,*/
	            	isFirst: false
	          	});
			}else{
				projectAnalysisState.pageObj.pageOption.curr = iText;
				projectAnalysisState.paginationObj.normal.goPage(iText);
				projectAnalysisState.paginationObj.normal.renderPages();
				projectAnalysisState.paginationObj.normal.options.curr = iText;
				console.log(projectAnalysisState.paginationObj.normal);
	          	projectAnalysisState.paginationObj.normal.options.callback && projectAnalysisState.paginationObj.normal.options.callback({
	            	curr: projectAnalysisState.paginationObj.normal.pageNumber,
	            	/*limit: projectAnalysisState.paginationObj.normal.options.limit,*/
	            	isFirst: false
	          	});
			}
		}else{
			projectAnalysisSwalMixin({
				title: '出错！',
				text: "页面将在2秒后刷新",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			}).then(function(result){
				/*console.log(result.dismiss) // timer*/
				/*console.log(swal.DismissReason.cancel) // cancel*/
				/*console.log(result.dismiss == "timer") // true*/
				if(result.dismiss == "timer" || result.dismiss === swal.DismissReason.timer){
					window.location.reload();
				}
			});
		}
	}
});
/*翻页跳页end*/

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

$(".g_body_rr_body_item").click(function(){
	if(projectAnalysisState.sellectObj.selectItem.length == 0){
		$(".g_body_rr_body_btn>input").prop("disabled", true);
		return false;
	}
	$(this).toggleClass("active").siblings(".g_body_rr_body_item").removeClass("active");
	$(this).children("span").toggleClass("glyphicon-menu-right glyphicon-menu-down");
	$(this).siblings(".g_body_rr_body_item").children("span").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-right");
	var aa = $(this).hasClass("active") ? $(this).children(".g_body_rr_body_itemin").innerHeight() : 0;
	$(this).innerHeight(50 + aa);
	$(this).siblings(".g_body_rr_body_item").innerHeight(50);
	analyzeBtn();
});

$(".g_body_rr_body_itemin").click(function(e){
	e.stopPropagation();
});

$(".g_body_rr_body_btn>input").click(function(){
	var iArr = [];
	$(".g_bodyin_body_bottom tbody tr").each(function(){
		iArr.push($(this).find(".not_search [type='checkbox']").data("ivalue").toString());
	});
	var item = {};
	item.selectedItem = iArr;
	item.curveType = $(".g_body_rr_body_item.active").data("icurvetype").toString();
	store.set("futureDT2__projectAnalysis__selectedObj", item);
	window.location.assign("RF_SP2.html");
});