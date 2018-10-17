/*variable defined*/
var projectAnalysisSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var projectAnalysisState = new Object();
projectAnalysisState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null
};
projectAnalysisState.hasSearch = false;
projectAnalysisState.sellectObj = {
	selectAll: false,
	selectItem: []
};

function getProjectAnalysisData(searchVal){
	var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
	if(_.isEmpty(futureDT2__datalist__pageDataObj) || _.isNil(futureDT2__datalist__pageDataObj)){
		projectAnalysisSwalMixin({
			title: 'mock数据异常',
			text: "意外被删除，请重新登录！",
			type: 'error',
			showConfirmButton: false,
			timer: 2500,
		}).then(function(result){
			if(result.dismiss == "timer"){
				window.location.assign("login.html");
			}
		});
		return false;
	}else{
		var projectAnalysisData = JSON.parse(futureDT2__datalist__pageDataObj).data;
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
			return _.reverse(_.sortBy(returnprojectAnalysisData, function(o) { return o.test_start_date.value; }));
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
			return _.reverse(_.sortBy(projectAnalysisDataArr, function(o) { return o.test_start_date.value; }));
		}
	}
}

function projectAnalysisRenderData(data){
	if(data!=undefined){
		projectAnalysisState.pageObj.data = data;
		projectAnalysisState.pageObj.itemLength = data.length;
		var str = '';
		data.map(function(v, i, arr){
			var ii = v.wafer_id.value;
			var iii = i+1;
			str+='<tr>'+
					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
					'<td data-itext="第'+iii+'条'+v.product_category.value+'">第'+iii+'条'+v.product_category.value+'</td>'+
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
		projectAnalysisRenderData(dataArr);
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
		// var trObj = _.find(projectAnalysisState.pageObj.data, function(o){
		// 	return o.wafer_id.value == ID;
		// });
		// var str = '';
		// str+='<tr data-ivalue="'+ID+'">'+
		// 		'<td data-itext="第'+iii+'条'+trObj.product_category.value+'">第'+iii+'条'+trObj.product_category.value+'</td>'+
		// 		'<td data-itext="'+trObj.lot_number.value+'">'+trObj.lot_number.value+'</td>'+
		// 		'<td data-itext="'+trObj.wafer_number.value+'">'+trObj.wafer_number.value+'</td>'+
		// 		'<td data-itext="'+trObj.qualified_rate.value+'">'+trObj.qualified_rate.value+'</td>'+
		// 		'<td data-itext="'+trObj.test_start_date.value+'">'+trObj.test_start_date.value+'</td>'+
		// 		'<td data-itext="'+trObj.archive_user.value+'">'+trObj.archive_user.value+'</td>'+
		// 		'<td data-itext="'+trObj.description.value+'">'+trObj.description.value+'</td>'+
		// 	'</tr>';
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
			projectAnalysisState.sellectObj.selectItem = store.get('futureDT2__datalist__selectedItem');
			$(".g_bodyin_body_bottom tbody").empty().append($(".g_bodyin_bodyin_body tbody>tr").clone());
			$(".g_bodyin_body_bottom tbody tr").removeClass("info warning");
			analyzeBtn();
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
	var dataArr = getProjectAnalysisData(isearch);
	if(dataArr !== false){
		projectAnalysisRenderData(dataArr);
	}
	if(isearch != ""){
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
	}
	projectAnalysisState.hasSearch = isearch == "" ? false : true;
	return false;
});

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