/*variable defined*/
var dataCompareSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataCompareState = new Object();
dataCompareState.paginationObj = {
	normal: null,
	search: null
};
dataCompareState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
dataCompareState.pageSearchObj = {
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
	    dataCompareState.pageSearchObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
	      	dataCompareRenderData({
				chunkArr: dataArr,
				currentPage: dataCompareState.pageSearchObj.currentPage
			});
	    }
	  }
	},
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
dataCompareState.searchObj = {
	hasSearch: false,
	searchVal: null
};
dataCompareState.sellectObj = {
	selectAll: false,
	selectItem: [],
	selectSearchItem: []
};
dataCompareState.stateObj = {
	canClickParam: false,
	curParam: null,
	curChartContainerNum: 0
};
dataCompareState.chartTypeMap = {
	"good_rate": "line",
	"histogram": "column",
	"boxlinediagram": "boxplot",
	"CPK": "line",
	"correlationgraph": "scatter",
	// "gaussiandistribution": "gaussiandistribution",
};
dataCompareState.mock = {
	dataCompare: futuredGlobal.S_getDataCompare(),
	boxlinediagram_data: futuredGlobal.S_getDataCompare().boxlinediagram.data["5"]
};

function redirectLogin(obj){
	dataCompareSwalMixin({
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

function getdataCompareData(searchVal, isGetFilterAllData, isGetAllData){
	var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
	if(_.isEmpty(futureDT2__datalist__pageDataObj) || _.isNil(futureDT2__datalist__pageDataObj)){
		redirectLogin({
			text: "意外被删除，请重新进入下数据列表！",
			url: "dataList.html"
		});
		return false;
	}else{
		var dataCompareData = JSON.parse(futureDT2__datalist__pageDataObj).data;
		store.set('futureDT2__datalist__selectedItem', []);
		var futureDT2__datalist__selectedItem = store.get('futureDT2__datalist__selectedItem');
		if(_.isEmpty(futureDT2__datalist__selectedItem) || _.isNil(futureDT2__datalist__selectedItem)){
			var returndataCompareData = [];
			if(searchVal == null || searchVal == ""){
				returndataCompareData = _.cloneDeep(dataCompareData);
			}else{
				_.forEach(dataCompareData, function(v){
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(searchVal)>-1){
							if(_.indexOf(dataCompareState.sellectObj.selectItem, v.wafer_id.value)>-1){
								dataCompareState.sellectObj.selectSearchItem.push(v.wafer_id.value);
							}
							returndataCompareData.push(v);
							return false;
						}
					});
				});
			}
			if(isGetAllData) return returndataCompareData;
			var filterArray = _.filter(returndataCompareData, function(o) { return o.delete_status.value == "0"; });
			if(isGetFilterAllData) return filterArray;
			var chunkArray = _.chunk(_.reverse(_.sortBy(filterArray, function(o) { return o.test_start_date.value; })), 10);
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageCount = chunkArray.length;
				dataCompareState.pageSearchObj.itemLength = filterArray.length;
				dataCompareState.pageSearchObj.data = _.cloneDeep(chunkArray);
			}else{
				dataCompareState.pageObj.pageCount = chunkArray.length;
				dataCompareState.pageObj.itemLength = filterArray.length;
				dataCompareState.pageObj.data = _.cloneDeep(chunkArray);
			}
			return chunkArray;
		}else{
			var dataCompareDataArr = [];
			_.forEach(futureDT2__datalist__selectedItem, function(v, i){
				if(searchVal == null || searchVal == ""){
					dataCompareDataArr.push(_.find(dataCompareData, function(o){
						return o.wafer_id.value == v;
					}));
				}else{
					var item = _.find(dataCompareData, function(o){
						return o.wafer_id.value == v;
					});
					_.forOwn(item, function(va, ke){
						if(String(va.value).indexOf(searchVal) > -1){
							if(_.indexOf(dataCompareState.sellectObj.selectItem, v.wafer_id.value)>-1){
								dataCompareState.sellectObj.selectSearchItem.push(v.wafer_id.value);
							}
							dataCompareDataArr.push(item);
							return false;
						}
					});
				}
			});
			if(isGetAllData) return dataCompareDataArr;
			var filterArray2 = _.filter(dataCompareDataArr, function(o) { return o.delete_status.value == "0"; });
			if(isGetFilterAllData) return filterArray2;
			var chunkArray2 = _.chunk(_.reverse(_.sortBy(filterArray2, function(o) { return o.test_start_date.value; })), 10);
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageCount = chunkArray2.length;
				dataCompareState.pageSearchObj.itemLength = filterArray2.length;
				dataCompareState.pageSearchObj.data = _.cloneDeep(chunkArray2);
			}else{
				dataCompareState.pageObj.pageCount = chunkArray2.length;
				dataCompareState.pageObj.itemLength = filterArray2.length;
				dataCompareState.pageObj.data = _.cloneDeep(chunkArray2);
			}
			return chunkArray2;
		}
	}
}

function dataCompareRenderData(obj){
	if(obj.chunkArr!=undefined){
		var str = '';
		obj.chunkArr[obj.currentPage - 1].map(function(v, i, arr){
			var ii = v.wafer_id.value;
			var iii = (obj.currentPage - 1)*10+(i+1);
			str+='<tr>'+
					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
					'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
					'<td data-itext="'+v.device_number.value+'">'+v.device_number.value+'</td>'+
					'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
					'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
					'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
					'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
					'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
					'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
				'</tr>';
		});
		$(".home_dataCompare_top tbody").empty().append(str);

		if(dataCompareState.searchObj.hasSearch){
			$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
				if(_.indexOf(dataCompareState.sellectObj.selectSearchItem, $(this).data("ivalue").toString()) > -1){
					$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
				}
			});

			$(".home_dataCompare_top tbody td:not(.not_search)").each(function(){
				var iText = $(this).text();
				var ireplace = "<b style='color:red'>"+dataCompareState.searchObj.searchVal+"</b>";
				var iHtml = iText.replace(new RegExp(dataCompareState.searchObj.searchVal, 'g'), ireplace);
				$(this).empty().html(iHtml);
			});
			$("#checkAll").prop("checked", dataCompareState.pageSearchObj.itemLength == dataCompareState.sellectObj.selectSearchItem.length);
		}else{
			$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
				if(_.indexOf(dataCompareState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
					$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
				}
			});
			$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
		}
	}
}

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 165);
	$(".g_bodyin_bodyin_bottom>.tab-content").innerHeight(winHeight - 165);
	$(".home_dataCompare_top .body_div").innerHeight(winHeight / 2 - 123);
	$(".home_dataCompare_bottom .left_div, .home_dataCompare_bottom .right_div").innerHeight(winHeight / 2 - 92);
	$(".home_dataCompare_bottom .right_div .panel-body").innerHeight(winHeight / 2 - 175);
}

function judgeNav(obj){
	if(obj.classify == "wafer"){
		if(dataCompareState.sellectObj.selectItem.length == 0){
			$(".g_bodyin_bodyin_top_wrap>ul").empty().append('<li role="presentation" class="active"><a href="#home_dataCompare" aria-controls="home_dataCompare" role="tab" data-toggle="tab">主页面</a></li>');
			dataCompareState.stateObj.canClickParam = false;
			dataCompareState.stateObj.curParam = null;
			return false;
		}else{
			dataCompareState.stateObj.canClickParam = true;
			var iArr = judgeNav({
				classify: "param",
				param: {
					TotalYield: obj.param.TotalYield,
					other: _.cloneDeep(obj.param.other)
				}
			});
			return iArr;
		}
	}else if(obj.classify == "param"){
		var mapArr = [];
		var mapArr1 = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				},{
					href: "map_color_order_distribution",
					text: "Map色阶分布"
				},{
					href: "good_rate",
					text: "良品率图"
				},{
					href: "histogram",
					text: "直方图"
				},{
					href: "boxlinediagram",
					text: "箱线图"
				},{
					href: "CPK",
					text: "CPK图"
				}];
		var mapArr2 = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				},{
					href: "map_color_order_distribution",
					text: "Map色阶分布"
				},{
					href: "good_rate",
					text: "良品率图"
				},{
					href: "histogram",
					text: "直方图"
				},{
					href: "boxlinediagram",
					text: "箱线图"
				},{
					href: "CPK",
					text: "CPK图"
				},{
					href: "correlationgraph",
					text: "相关性图"
				}];
		dataCompareState.stateObj.curParam = _.cloneDeep(obj.param);
		if(obj.param.TotalYield == 0){
			if(obj.param.other.length == 0){
				mapArr = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				}];
			}else if(obj.param.other.length == 1){
				mapArr = _.cloneDeep(mapArr1);
			}else{
				mapArr = _.cloneDeep(mapArr2);
			}
		}else{
			if(obj.param.other.length == 0){
				mapArr = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				},{
					href: "good_rate",
					text: "良品率图"
				}];
			}else if(obj.param.other.length == 1){
				mapArr = _.cloneDeep(mapArr1);
			}else{
				mapArr = _.cloneDeep(mapArr2);
			}
		}
		return mapArr;
	}
}

function renderNav(mapArr){
	if(mapArr !== false){
		var str = '<li role="presentation" class="active"><a href="#home_dataCompare" aria-controls="home_dataCompare" role="tab" data-toggle="tab">主页面</a></li>';
		mapArr.map(function(v, i, arr){
			str+='<li role="presentation"><a href="#'+v.href+'" aria-controls="'+v.href+'" role="tab" data-toggle="tab">'+v.text+'</a></li>';
		});
		if(!_.isEmpty(mapArr)){
			str+='<li role="presentation"><a href="#all_statistics" aria-controls="all_statistics" role="tab" data-toggle="tab">所有统计</a></li>';
		}
		$(".g_bodyin_bodyin_top_wrap>ul").empty().append(str);
	}
}

function groupJudgeRenderNav(classify){
	var iAr = [];
	$("#home_param_ul>li.list-group-item-info:not([data-iparam='TotalYield'])").each(function(){
		iAr.push($(this).data("iparam"));
	});
	var mapArr = judgeNav({
		classify: classify,
		param: {
			TotalYield: $("#home_param_ul>li.list-group-item-info[data-iparam='TotalYield']").length,
			other: _.cloneDeep(iAr)
		}
	});
	renderNav(mapArr);
}

/*渲染图表外部面板*/
function renderPanel(TotalYield, other, controls){
	var str = '';
	if(controls == "map_good_rate_distribution" || controls == "map_color_order_distribution"){
		if(TotalYield == 1){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Total Yield'+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">';
			var inStr = buildMapContainer({
					    		divi: 4,
					    		controls: controls,
					    		iparam: "TotalYield",
					    		iclassify: "map"
					    	});
					    	str+=inStr;
					    	str+='</div>'+
					  	'</div>'+
					'</div>';
		}
		other.map(function(v, i){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+v+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">';
					    	str+=buildMapContainer({
					    		divi: 4,
					    		controls: controls,
					    		iparam: v,
					    		iclassify: "map"
					    	});
					    	str+='</div>'+
					  	'</div>'+
					'</div>';
		});
	}else if(["histogram", "boxlinediagram", "good_rate", "CPK", "correlationgraph"].indexOf(controls) > -1){
		str = buildMapContainer({
				    		divi: 2,
				    		controls: controls,
				    		iparam: null,
				    		iclassify: "otherSingle"
				    	});
	}
	$("div[role='tabpanel']#"+controls).empty().append(str);
}

/*map图图表容器构建*/
function buildMapContainer(obj){
	var str = '',
	divi = obj.divi,
	controls = obj.controls,
	iparam = obj.iparam,
	iclassify = obj.iclassify;
	if(iclassify == "otherSingle"){
		var paramArr = [];
		paramArr[dataCompareState.stateObj.curParam.TotalYield] = "TotalYield";
		_.pullAt(paramArr, 0);
		var allParam = _.concat(paramArr, dataCompareState.stateObj.curParam.other);
		var rowss = Math.ceil(allParam.length / divi);
		var selectItemStr = _.join(_.sortBy(dataCompareState.sellectObj.selectItem));
		str+='<div class="container-fluid">';
		_.times(rowss, function(i){
			str+='<div class="row">';
			_.times(divi, function(ii){
				var curI = i*divi+ii;
				if(curI < allParam.length){
					str+='<div class="col-sm-12 col-md-6 col-lg-6">';
						str += '<div class="panel panel-info">'+
								  	'<div class="panel-heading">'+
								    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+allParam[curI]+
								  	'</div>'+
								  	'<div class="panel-body">'+
								    	'<div class="chart_otherSingle_tit">头</div>'+
								    	'<div class="chart_otherSingle_body">'+
											'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+selectItemStr+'" data-ichart="'+controls+'" data-iparam="'+allParam[curI]+'"></div>'+
										'</div>'+
										'<div class="chart_otherSingle_foot">脚</div>'+
								  	'</div>'+
								'</div>';
					str+='</div>';
					dataCompareState.stateObj.curChartContainerNum++;
				}
			});
			str+='</div>';
		});
		str+='</div>';
	}else if(iclassify == "map"){
		var len = dataCompareState.sellectObj.selectItem.length;
		var rows = Math.ceil(len / divi);
		_.times(rows, function(i){
			str+='<div class="row">';
			_.times(divi, function(ii){
				var curI = i*divi+ii;
				if(curI < len){
					str+='<div class="col-sm-6 col-md-3 col-lg-3">';
						str+='<div class="chart_map_tit"></div>';
							str+='<div class="chart_map_body">'+
									'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+dataCompareState.sellectObj.selectItem[curI]+'" data-ichart="'+controls+'" data-iparam="'+iparam+'">'+dataCompareState.sellectObj.selectItem[curI]+'</div>'+
								'</div>';
						str+='<div class="chart_map_foot"></div>';
					str+='</div>';
					dataCompareState.stateObj.curChartContainerNum++;
				}
			});
			str+='</div>';
		});
	}
	return str;
}

/*page preload*/
eleResize();
$(window).on("resize", function(){
	eleResize();
});

/*page onload*/
$(function(){
	/*判断是否有选中*/
	var dataArr = getdataCompareData(null);
	if(dataArr !== false){
		dataCompareRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});

		// 分页元素ID（必填）
		dataCompareState.pageObj.selector = '#pagelist';
		// 分页配置
		dataCompareState.pageObj.pageOption = {
		  // 每页显示数据条数（必填）
		  limit: 10,
		  // 数据总数（一般通过后端获取，必填）
		  count: dataCompareState.pageObj.itemLength,
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
		    	dataCompareState.pageObj.currentPage = obj.curr;
		    	// 首次不执行
			    if (!obj.isFirst) {
			      // do something
			      	var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
			      	dataCompareRenderData({
						chunkArr: dataArr,
						currentPage: dataCompareState.pageObj.currentPage
					});
			    }
		  	}
		};
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	}
});

/*event handler*/
$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

/* @@主页面 */
/*表格行点击事件*/
$(document).on("mouseover", ".home_dataCompare_top td", function(){
	$(this).addClass("warning").parent().addClass("info");
}).on("mouseout", ".home_dataCompare_top td", function(){
	$(this).removeClass("warning").parent().removeClass("info");
}).on("click", ".home_dataCompare_top td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".home_dataCompare_top tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".home_dataCompare_top tbody [type='checkbox']", function(){
	var ID = $(this).data("ivalue").toString();
	if($(this).prop("checked")){
		dataCompareState.sellectObj.selectItem.push(ID);
		if(dataCompareState.searchObj.hasSearch) dataCompareState.sellectObj.selectSearchItem.push(ID);
		$(".home_dataCompare_bottom tbody>tr [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		$(".home_dataCompare_bottom tbody").append($(this).parent().parent().clone());
		$(".home_dataCompare_bottom tbody tr, .home_dataCompare_bottom tbody td").removeClass("info warning");
	}else{
		_.pull(dataCompareState.sellectObj.selectItem, ID);
		if(dataCompareState.searchObj.hasSearch) _.pull(dataCompareState.sellectObj.selectSearchItem, ID);
		$(".home_dataCompare_bottom tbody [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
	}
	dataCompareState.sellectObj.selectItem = _.uniq(dataCompareState.sellectObj.selectItem);
	dataCompareState.sellectObj.selectSearchItem = _.uniq(dataCompareState.sellectObj.selectSearchItem);
	if(dataCompareState.searchObj.hasSearch){
		$("#checkAll").prop("checked", dataCompareState.pageSearchObj.itemLength == dataCompareState.sellectObj.selectItem.length);
	}else{
		$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
	}
	dataCompareState.sellectObj.selectAll = $("#checkAll").prop("checked");

	groupJudgeRenderNav("wafer");
});

/*点击选中所有*/
$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		dataCompareState.sellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			dataCompareSwalMixin({
				title: '加载全部数据',
				text: "正在加载中......",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false
			});
			/*判断有没有搜索过*/
			var idata = JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data;
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.sellectObj.selectSearchItem = [];
				idata.map(function(v, i){
					if(v.delete_status.value != "0") return true;
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(dataCompareState.searchObj.searchVal)>-1){
							dataCompareState.sellectObj.selectSearchItem.push(v.wafer_id.value);
							if(_.indexOf(dataCompareState.sellectObj.selectItem, v.wafer_id.value) == -1){
								dataCompareState.sellectObj.selectItem.push(v.wafer_id.value);
								var ii = v.wafer_id.value;
								var str = '<tr>'+
										'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
										'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
										'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
										'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
										'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
										'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
										'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
										'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
									'</tr>';
								if($(".home_dataCompare_bottom tbody>tr").length){
									$(".home_dataCompare_bottom tbody>tr:first").before(str);
								}else{
									$(".home_dataCompare_bottom tbody").append(str);
								}
							}
							return false;
						}
					});
				});
				dataCompareState.sellectObj.selectItem = _.uniq(dataCompareState.sellectObj.selectItem);
			}else{
				var str2 = '';
				dataCompareState.sellectObj.selectItem = [];
				idata.map(function(v, i){
					if(v.delete_status.value != "0") return true;
					dataCompareState.sellectObj.selectItem.push(v.wafer_id.value);
					var ii = v.wafer_id.value;
					str2 = '<tr>'+
							'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
							'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
							'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
							'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
							'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
							'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
							'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
							'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
						'</tr>' + str2;
				});
				$(".home_dataCompare_bottom tbody").empty().append(str2);
			}
			
			setTimeout(function(){
				swal.clickCancel();
			}, 2000);
		}else{
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.sellectObj.selectSearchItem.map(function(v){
					_.pull(dataCompareState.sellectObj.selectItem, v);
					$(".home_dataCompare_bottom tbody [type='checkbox'][data-ivalue='"+Number(v)+"']").parent().parent().remove();
				});
				dataCompareState.sellectObj.selectSearchItem = [];
			}else{
				dataCompareState.sellectObj.selectItem = [];
				$(".home_dataCompare_bottom tbody").empty();
			}
		}

		groupJudgeRenderNav("wafer");
	}
});

/*搜索*/
$(".home_dataCompare_top .form-control-feedback").click(function(){
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
$("#search_button").on("click", function(){
	/*预处理*/
	$("#checkAll").prop("checked", false);
	dataCompareState.sellectObj.selectSearchItem = [];

	var isearch = $("#search_input").val().trim();
	dataCompareState.searchObj.hasSearch = isearch == "" ? false : true;
	dataCompareState.searchObj.searchVal = dataCompareState.searchObj.hasSearch == true ? isearch : null;
	var dataArr = getdataCompareData(isearch);
	if(dataArr !== false){
		dataCompareRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});
	}
	if(dataCompareState.searchObj.hasSearch){
		dataCompareState.pageSearchObj.currentPage = 1;
		dataCompareState.pageSearchObj.pageOption.curr = 1;
		dataCompareState.pageSearchObj.pageOption.count = dataCompareState.pageSearchObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		dataCompareState.paginationObj.search = new Pagination(dataCompareState.pageSearchObj.selector, dataCompareState.pageSearchObj.pageOption);
	}else{
		dataCompareState.pageObj.pageOption.curr = 1;
		dataCompareState.pageObj.pageOption.count = dataCompareState.pageObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	}
	return false;
});

/*翻页跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});

$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = Number(dataCompareState.pageObj.currentPage);
	var pageCounts = Number(dataCompareState.pageObj.pageCount);
	if(dataCompareState.searchObj.hasSearch){
		currentPage = Number(dataCompareState.pageSearchObj.currentPage);
		pageCounts = Number(dataCompareState.pageSearchObj.pageCount);
	}
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
		if(dataArr !== false){
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageOption.curr = iText;
				dataCompareState.paginationObj.search.goPage(iText);
				dataCompareState.paginationObj.search.renderPages();
				dataCompareState.paginationObj.search.options.curr = iText;
				console.log(dataCompareState.paginationObj.search);
	          	dataCompareState.paginationObj.search.options.callback && dataCompareState.paginationObj.search.options.callback({
	            	curr: dataCompareState.paginationObj.search.pageNumber,
	            	/*limit: dataCompareState.paginationObj.search.options.limit,*/
	            	isFirst: false
	          	});
			}else{
				dataCompareState.pageObj.pageOption.curr = iText;
				dataCompareState.paginationObj.normal.goPage(iText);
				dataCompareState.paginationObj.normal.renderPages();
				dataCompareState.paginationObj.normal.options.curr = iText;
				console.log(dataCompareState.paginationObj.normal);
	          	dataCompareState.paginationObj.normal.options.callback && dataCompareState.paginationObj.normal.options.callback({
	            	curr: dataCompareState.paginationObj.normal.pageNumber,
	            	/*limit: dataCompareState.paginationObj.normal.options.limit,*/
	            	isFirst: false
	          	});
			}
		}else{
			dataCompareSwalMixin({
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

/*共有参数选择*/
$(document).on("click", ".home_dataCompare_bottom .panel-body li", function(){
	if(!dataCompareState.stateObj.canClickParam) return false;
	$(this).toggleClass("list-group-item-info").children("span").text(["选中", "取消选中"][Number($(this).hasClass("list-group-item-info"))]);
	groupJudgeRenderNav("param");
});

$(document).on('shown.bs.tab', 'div.g_bodyin_bodyin_top_wrap a[data-toggle="tab"]', function (e) {
  /*e.target // newly activated tab
  e.relatedTarget // previous active tab*/
  	var curParam = dataCompareState.stateObj.curParam;
  	var controls = $(e.target).attr("aria-controls");
  	if(controls == "home_dataCompare"){

  	}else if(controls == "all_statistics"){

  	}else{
  		if(!_.isNil(curParam) && !_.isEmpty(curParam)){
  			var TotalYield = curParam.TotalYield;
  			var other = curParam.other;
  			renderPanel(TotalYield, other, controls);
  			if(controls == "map_good_rate_distribution"){

  			}else if(controls == "map_color_order_distribution"){

  			}else{
  				var chartType = _.find(dataCompareState.chartTypeMap, function(o, k){
  					return k == controls;
  				});
  				$("#"+controls+" .chart_otherSingle_body>div").each(function(){
  					var container = $(this).attr("id"),
  					title_text,
  					subtitle_text = null,
  					xAxis,
  					yAxis,
  					series;
  					var iparam = $(this).data("iparam");
  					switch(controls){
  						case "histogram":
	  						title_text = "直方图-"+iparam;
	  						var icategories = [["-∞", 0.00000423], [0.00000423, 0.00000448], [0.00000448, 0.0000047300000000000005], [0.0000047300000000000005, 0.00000498], [0.00000498, 0.00000523], [0.00000523, 0.00000548], [0.00000548, 0.000005729999999999999], [0.000005729999999999999, 0.0000059799999999999995], [0.0000059799999999999995, 0.00000623], [0.00000623, "+∞"]];
	  						var histogram_limits_min = 0.00000423;
	  						var histogram_limits_max = 0.00000623;
	  						xAxis = {
	  							categories: icategories,
	  							type: 'linear',
	  							labels: {
	  								rotation: -45  // 设置轴标签旋转角度
	  							},
	  							plotLines: [{
									color: '#FF0000',
									width: 2,
									value: 0.5
								},{
									color: '#FF0000',
									width: 2,
									value: 8.5
								}]
	  						};
	  						yAxis = {
	  							title: {
	  								text: '百分数'
	  							}
	  						};
  							var iserise = [];
  							_.forEach(dataCompareState.sellectObj.selectItem, function(v, i){
  								var item = {};
  								item.name = "wafer"+v;
  								item.type = "column";
  								item.data = [
  									2, 8, 10, 5, 15, 20, 3, 7, 10, 20
  								];
  								iserise.push(item);
  							});
  							series = iserise;
  						break;

  						case "boxlinediagram":
	  						title_text = "箱线图-"+iparam;
	  						xAxis = {
	  									categories: _.forEach(_.cloneDeep(dataCompareState.sellectObj.selectItem), function(v, i, arr){
	  										arr[i] = "wafer"+v;
	  									}),
	  									title: {
	  										text: "晶圆"
	  									}
	  								};
	  						yAxis = {
			  							title: {
			  								text: '值'
			  							},
			  							/*plotLines: [{
			  								value: 932,
			  								color: 'red',
			  								width: 1,
			  								label: {
			  									text: '理论模型: 932',
			  									align: 'center',
			  									style: {
			  										color: 'gray'
			  									}
			  								}
			  							}]*/
			  						};
			  				var iidata = dataCompareState.mock.boxlinediagram_data;
			  				var iidata1 = [];
			  				var iidata2 = [];
			  				_.forEach(dataCompareState.sellectObj.selectItem, function(v, i, arr){
								var item = [];
								var ii = i % 3 + 1;
								item.push(iidata["param"+ii].lowerOfInner);
								item.push(iidata["param"+ii].Q1);
								item.push(iidata["param"+ii].Median);
								item.push(iidata["param"+ii].Q3);
								item.push(iidata["param"+ii].UpperOfInner);
								iidata1.push(item);
								var item2 = [];
								item2.push("wafer"+v);
								i % 2 == 0 ? item2.push(iidata["param"+ii].lowerOfInner - 0.000001) : item2.push(iidata["param"+ii].UpperOfInner + 0.000002);
								iidata2.push(item2);
							});
	  						series = [{
										name: '观测值',
										data: iidata1,
										tooltip: {
											headerFormat: '<em>晶圆： {point.key}</em><br/>'
										}
									}, {
										name: '异常值',
										color: Highcharts.getOptions().colors[0],
										type: 'scatter',
										data: iidata2,
										marker: {
											fillColor: 'white',
											lineWidth: 1,
											lineColor: Highcharts.getOptions().colors[0]
										},
										tooltip: {
											pointFormat: 'Observation: {point.y}'
										}
									}];
	  					break;
	  					case "CPK":
		  					title_text = "CPK-"+iparam;
		  					var dataLength = 12;
		  					var iiicategories = _.range(1, dataLength + 1);
		  					_.forEach(iiicategories, function(v, i, arr){
		  						arr[i] = eouluGlobal.S_numToChineseSm(v);
		  					});
	  						xAxis = {
	  							categories: iiicategories
	  						};
	  						yAxis = {
	  							title: {
	  								text: 'values'
	  							}
	  						};
	  						var iiiseries = [];
	  						_.forEach(dataCompareState.sellectObj.selectItem, function(v, i){
	  							var item = {};
	  							item.name = "wafer"+v;
	  							var idata = [];
	  							_.times(12, function(){
	  								idata.push(_.random(1, 30, true))
	  							});
	  							item.data = idata;
	  							iiiseries.push(item);
	  						});
	  						series = iiiseries;
	  					break;
  						default:
  						null;
  					}
  					/*画图*/
  					dataCompareRenderChart({
  						container: container,
  						chart: {
  							type: chartType
  						},
  						title: {
  							text: title_text
  						},
  						subtitle: {
  							text: subtitle_text
  						},
  						xAxis: xAxis,
  						yAxis: yAxis,
  						series: _.cloneDeep(series),
  						chartClassify: controls
  					});
  				});
  			}
  		}
  	}
});

/*点击收起*/
$(document).on("click", ".g_bodyin_bodyin_bottom div.panel-heading>span.glyphicon", function(){
	$(this).toggleClass("glyphicon-menu-down glyphicon-menu-right").parent().parent().toggleClass("panel-info panel-success");
	if($(this).hasClass("glyphicon-menu-right")){
		$(this).parent().next().slideUp(200);
	}else{
		$(this).parent().next().slideDown(200);
	}
});