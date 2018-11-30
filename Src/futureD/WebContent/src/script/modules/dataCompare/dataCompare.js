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
	curChartContainerNum: 0,
	searchShow: true
};
dataCompareState.chartTypeMap = {
	"good_rate": "spline",
	"histogram": "column",
	"boxlinediagram": "boxplot",
	"CPK": "line",
	"correlationgraph": "scatter",
	// "gaussiandistribution": "gaussiandistribution",
};


//页面数据

function dataCompareRenderData(currentPage){
	var searchVal = $("#search_input").val().trim();
	$.ajax({
	       url: 'DataListAjax', 
	       type: 'GET',
	       data: {
	    	   currentPage : currentPage ,
	    	   keyword : searchVal,
	       },
	       dataType: 'json',
	       async : false ,
	       success: function (data) {
	    	   console.log("data",data);
	    	   var str = "";
	    	   data.waferInfo.map(function(v, i, arr){
		   			var ii = v.wafer_id;
		   			str+='<tr>'+
		   					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
		   					'<td class="product_category" data-itext="'+v.product_category+'">'+v.product_category+'</td>'+
		   					'<td class="device_number" data-itext="'+v.device_number+'">'+v.device_number+'</td>'+
		   					'<td class="lot_number" data-itext="'+v.lot_number+'">'+v.lot_number+'</td>'+
		   					'<td class="wafer_number" data-itext="'+v.wafer_number+'">'+v.wafer_number+'</td>'+
		   					'<td class="qualified_rate" data-itext="'+v.qualified_rate+'">'+v.qualified_rate+'</td>'+
		   					'<td class="test_end_date" data-itext="'+v.test_end_date+'">'+v.test_end_date+'</td>'+
		   					'<td class="test_operator" data-itext="'+v.test_operator+'">'+v.test_operator+'</td>'+
		   					'<td class="description" data-itext="'+v.description+'">'+v.description+'</td>'+
		   					'<td class="data_format" data-itext="'+v.data_format+'" style="display:none;">'+v.data_format+'</td>'+
		   				'</tr>';
		   		});
		   		$(".home_dataCompare_top tbody").empty().append(str);
		   		
		   		dataCompareState.pageObj.pageCount = data.totalPage;
				dataCompareState.pageObj.itemLength = data.totalCount;
				dataCompareState.pageObj.data =data.waferInfo;
				
				//修改为全选当前页
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
	       },
	       error: function (data, status, e) {
	    	   dataCompareSwalMixin({
	    			title: '异常',
	    			text: "服务器繁忙！",
	    			type: 'error',
	    			showConfirmButton: false,
	    			timer: 2000,
	    		})
	       }
	  });  
}

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 165);
	$(".g_bodyin_bodyin_bottom>.tab-content").innerHeight(winHeight - 165);
	$(".home_dataCompare_top .body_div").innerHeight(winHeight / 2 - 83);
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
				/*mapArr = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				}];*/
				mapArr.length = 0;
			}else if(obj.param.other.length == 2){
				mapArr = _.cloneDeep(mapArr2);
			}else if(obj.param.other.length != 2){
				mapArr = _.cloneDeep(mapArr1);
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
			}else if(obj.param.other.length == 2){
				mapArr = _.cloneDeep(mapArr2);
			}else if(obj.param.other.length != 2){
				mapArr = _.cloneDeep(mapArr1);
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

function renderCommonParameter(){
	var waferIdStr = dataCompareState.sellectObj.selectItem.join(",");
	if(waferIdStr !=""){
		$.ajax({
		       url: 'ParameterRange', 
		       type: 'GET',
		       data: {
		    	   waferIdStr : waferIdStr ,
		       },
		       dataType: 'json',
		       success: function (data) {
		    	   console.log("data",data);
		    	   var str = "";
		    	   if(data.paramList.length != 0){
		    		   str = '<li class="list-group-item" data-iparam="TotalYield"><span class="badge">选中</span>Total Yield</li>';
		    		   for(var _i = 0 ; _i < data.paramList.length ; _i++){
		    			  str += '<li class="list-group-item" data-iparam="'+data.paramList[_i]+'"><span class="badge">选中</span>'+data.paramList[_i]+'</li>';
		    		   }
		    	   }
		    	   $("#home_param_ul").empty().append(str); 
		       },
		       error: function (data, status, e) {
		    	   dataCompareSwalMixin({
		    			title: '异常',
		    			text: "服务器繁忙！",
		    			type: 'error',
		    			showConfirmButton: false,
		    			timer: 2000,
		    		})
		       }
		  });
	}
	else{
		$("#home_param_ul").empty(); 
	}
}

/*渲染图表外部面板*/
function renderPanel(TotalYield, other, controls, isAllStatistics, AllStatistics){
	var str = '';
	if(controls == "map_good_rate_distribution" || controls == "map_color_order_distribution"){
		if(TotalYield == 1 && controls == "map_good_rate_distribution"){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Total Yield'+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">';
			var inStr = buildMapContainer({
					    		divi: 3,
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
					    		divi: 3,
					    		controls: controls,
					    		iparam: v,
					    		iclassify: "map"
					    	});
					    	str+='</div>'+
					  	'</div>'+
					'</div>';
		});
	}else if(controls == "good_rate"){
		var idivi = 2;
		if(dataCompareState.sellectObj.selectItem.length > 6 || dataCompareState.stateObj.curParam.other.length == 1) idivi = 1;
		str = buildMapContainer({
				    		divi: idivi,
				    		controls: controls,
				    		iparam: null,
				    		iclassify: "otherSingle"
				    	});
	}else if(["histogram", "boxlinediagram", "CPK"].indexOf(controls) > -1){
		var iidivi = 2;
		if(dataCompareState.sellectObj.selectItem.length > 6 || dataCompareState.stateObj.curParam.other.length == 1) iidivi = 1;
		str = buildMapContainer({
				    		divi: iidivi,
				    		controls: controls,
				    		iparam: null,
				    		iclassify: "otherSingleNotTY"
				    	});
	}else if(controls == "correlationgraph"){
		str = buildMapContainer({
				    		divi: 1,
				    		controls: controls,
				    		iparam: dataCompareState.stateObj.curParam.other.join(" VS "),
				    		iclassify: "correlationgraph"
				    	});
	}
	if(isAllStatistics === true){
		AllStatistics && AllStatistics(str);
	}else{
		$("div[role='tabpanel']#"+controls+">.single_div_in").empty().append(str);
	}
}

/*map图图表容器构建*/
function buildMapContainer(obj){
	var str = '',
	divi = obj.divi,
	controls = obj.controls,
	iparam = obj.iparam,
	iclassify = obj.iclassify;
	if(iclassify == "otherSingle" || iclassify == "otherSingleNotTY"){
		var paramArr = [];
		if(iclassify == "otherSingle"){
			paramArr[dataCompareState.stateObj.curParam.TotalYield] = "TotalYield";
			_.pullAt(paramArr, 0);
		}
		var allParam = _.concat(paramArr, dataCompareState.stateObj.curParam.other);
		var rowss = Math.ceil(allParam.length / divi);
		var selectItemStr = _.join(_.sortBy(dataCompareState.sellectObj.selectItem));
		str+='<div class="container-fluid">';
		_.times(rowss, function(i){
			str+='<div class="row">';
			_.times(divi, function(ii){
				var curI = i*divi+ii;
				if(curI < allParam.length){
					str+='<div class="col-sm-12 col-md-'+12/divi+' col-lg-'+12/divi+'">';
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
					str+='<div class="col-sm-6 col-md-'+12/divi+' col-lg-'+12/divi+'">';
						str+='<div class="chart_map_tit">wafer'+dataCompareState.sellectObj.selectItem[curI]+'</div>';
							str+='<div class="chart_map_body">'+
									'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+dataCompareState.sellectObj.selectItem[curI]+'" data-ichart="'+controls+'" data-iparam="'+iparam+'"></div>'+
								'</div>';
						str+='<div class="chart_map_foot"></div>';
					str+='</div>';
					dataCompareState.stateObj.curChartContainerNum++;
				}
			});
			str+='</div>';
		});
	}else if(iclassify == "correlationgraph"){
		var selectItemStr2 = _.join(_.sortBy(dataCompareState.sellectObj.selectItem));
		str+='<div class="container-fluid">'+
				'<div class="row">'+
					'<div class="col-sm-12 col-md-12 col-lg-12">'+
						'<div class="panel panel-info">'+
						  	'<div class="panel-heading">'+
						    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+iparam+
						  	'</div>'+
						  	'<div class="panel-body">'+
						    	'<div class="chart_otherSingle_tit">头</div>'+
						    	'<div class="chart_otherSingle_body">'+
									'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+selectItemStr2+'" data-ichart="'+controls+'" data-iparam="'+iparam+'"></div>'+
								'</div>'+
								'<div class="chart_otherSingle_foot">脚</div>'+
						  	'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
		dataCompareState.stateObj.curChartContainerNum++;
	}
	return str;
}

/*map良率分布图绘制*/
function draw_map_good_rate_distribution(that, i){
	var inH = that.innerWidth();
	that.innerHeight(inH);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.after("<div class='criterion_"+canvasID+"'></div>");
	buildColorGradation({
		width: inH,
		height: inH,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: futuredGlobal.S_getMockWaferData()[0],
		spacePercent: {
			x: 0.05,
			y: 0.05
		},
		m_DieDataListNew: futuredGlobal.S_getMockWaferData()[0].waferMapDataList[i%5].m_DieDataListNew,
		colorGradation: {
			limitColor: "#FF0000",
			floorColor: "#00FF00",
			nums: 256
		}
	});
}

/*map色阶分布图绘制*/
function draw_map_color_order_distribution(that, i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor){
	var inH = that.innerWidth();
	that.innerHeight(inH);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.after("<div class='criterion_"+canvasID+"'><div class='colorGradient'></div></div>");
	buildColorGradation({
		width: inH,
		height: inH,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: copyData,
		spacePercent: {
			x: 0.05,
			y: 0.05
		},
		m_DieDataListNew: copyData.waferMapDataList[i%5].m_DieDataListNew,
		colorGradation: {
			theMinColor: "#0000FF",
			lowwerColor: "#00FFFF",
			midderColor: "#00FF00",
			upperColor: "#FFFF00",
			theMaxColor: "#FF0000",
			twoDiff: twoDiff,
			threeDiff: threeDiff,
			fourDiff: fourDiff,
			fiveDiff: fiveDiff,
		},
		colorOrder: true,
		theMin: theMin,
		lowwer: lowwer,
		midder: midder,
		upper: upper,
		theMax: theMax,
		otherColor: otherColor
	});
	/*色阶标尺*/
	var colorGradientDom = that.next().find("div.colorGradient");
	colorGradientDom.width(that.next().width() - 60).height(that.next().height() - 30);
	var all = twoDiff+threeDiff+fourDiff+fiveDiff;
	var itemHeight = colorGradientDom.height();
	var itemWidth = colorGradientDom.width() / (all*1.2);
	colorGradientDom.append("<span class='colorGradientSpan oneSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth+"px;'></span>");
	_.times(twoDiff, function(ii){
	    var color = getGradientColor ('#00FFFF', '#0000FF', twoDiff, twoDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan twoSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth+"px;'></span>");
	_.times(threeDiff, function(ii){
	    var color = getGradientColor ('#00FF00', '#00FFFF', threeDiff, threeDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan threeSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth+"px;'></span>");
	_.times(fourDiff, function(ii){
	    var color = getGradientColor ('#FFFF00', '#00FF00', fourDiff, fourDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan fourSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth+"px;'></span>");
	_.times(fiveDiff, function(ii){
	    var color = getGradientColor ('#FF0000', '#FFFF00', fiveDiff, fiveDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan fiveSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth+"px;'></span>");
	colorGradientDom.append("<span class='colorGradientSpan sixSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	
	var countObj = _.countBy(copyData.waferMapDataList[i%5].m_DieDataListNew, function(v, i){
		var retur;
		_.forOwn(v, function(vv, k){
			retur = vv.color.split(":")[0];
		});
		return retur;
	});
	var tableStr = '<table class="table table-striped table-bordered table-condensed"><thead><tr><th></th><th></th><th></th><th></th><th></th><th></th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>';
	$(tableStr).appendTo(that.parent().next());
	console.log(countObj);
	_.forOwn(countObj, function(v, k){
		if(k == -1 || k == 12) return true;
		that.parent().next().find("th").eq(k-1).text(k+"区间");
		that.parent().next().find("td").eq(k-1).text(v+"个");
	});
	that.parent().next().find("th").each(function(i){
		if(_.isEmpty($(this).text())){
			$(this).text((i+1)+"区间");
			that.parent().next().find("td").eq(i).text("0个");
		}
	});
}

/*其他图表绘制*/
function draw_other_chart(that, controls, chartType){
	var container = that.attr("id"),
	title_text,
	subtitle_text = null,
	xAxis,
	yAxis,
	series;
	var iparam = that.data("iparam");
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
					idata.push(_.round(_.random(1, 30, true), 2));
				});
				item.data = idata;
				iiiseries.push(item);
			});
			series = iiiseries;
		break;

		case "correlationgraph":
			title_text = "相关性图-"+iparam;
			xAxis = {
				title: {
					enabled: true,
					text: dataCompareState.stateObj.curParam.other[0],
					/*style:{"fontSize":"16px","fontFamily":"arial","float":"top"}*/
				},
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
				/*labels: {
            	useHTML: true,
                formatter: function () {
                    return '<a href="javascript:alert(\'hello\')">' + this.value + '</a>';
            	}
            },*/
			};
			yAxis = {
				title: {
					text: dataCompareState.stateObj.curParam.other[1]
				}
			};
			var iiiidata = dataCompareState.mock.dataCompare.correlationgraph;
			var iiiiseries = [];
			_.forEach(dataCompareState.sellectObj.selectItem, function(v, i, arr){
				var item = {};
				item.name = "wafer"+v;
				item.data = [];
				_.forOwn(iiiidata.dataMap, function(vv, k){
					var kk = i%3 + 1;
					if(k == "wafer"+kk){
						if(vv.X.length > 0){
		    			  _.forEach(vv.X, function(vvv, iii){
		    			  	item.data.push([vvv, vv.Y[iii]]);
		    			  });
		    		  }
					}
				});
				iiiiseries.push(item);
			});
			series = iiiiseries;
		break;
		/*良品率图*/
		default:
			title_text = "良品率图-"+iparam;
			var item = {};
			item.name = iparam;
			item.data = [];
			var iiiiicategories = [];
			_.forEach(dataCompareState.sellectObj.selectItem, function(v, i, arr){
				item.data.push(_.round(_.random(0, 1, true), 4));
				iiiiicategories.push("wafer"+v);
			});
			xAxis = {
				categories: iiiiicategories
			};
			yAxis = {
				title: {
					text: "比率"
				},
				min:0,
	        max:1,
	        tickInterval: 0.1,
	        labels: {
	            formatter: function () {
	                return this.value;
	            }
	        }
			};
			series = [item];
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
}

/*page preload*/
$(".g_info_m_in").hide();
eleResize();
$(window).on("resize", function(){
	eleResize();
});

/*page onload*/
$(function(){
	$(".breadcrumb li:eq(0) a ").attr("href","./HomeInterface");
	/*判断是否有选中*/
	//var dataArr = getdataCompareData(null);
	//if(dataArr !== false){
		dataCompareRenderData(1);

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
			      	dataCompareRenderData(obj.curr);
			    }
		  	}
		};
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	//}
});

/*event handler*/

$(".g_info_r>.glyphicon-search").click(function(){
	var g_info_m = $(".g_info_m").innerWidth();
	$(this).css("position", "relative").animate({
		left: -(g_info_m/2+20) + "px"
	}, 500, "swing", function(){
		$(this).fadeOut(200, function(){
			$(".g_info_m_in").fadeIn(200).fadeTo(1, 1);
			dataCompareState.stateObj.searchShow = false;
		});
	});
});

$(".g_info_m_in span.input-group-addon").click(function(){
	$(".g_info_m_in").fadeTo(0, 200, function(){
		$(this).fadeOut(200);
		$(".g_info_r>.glyphicon-search").fadeIn(100).animate({
			left: "0px"
		}, 600, "swing", function(){
			$(this).css("position", "static");
			dataCompareState.stateObj.searchShow = true;
		});
	});
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
	renderCommonParameter();
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
		
		var select_tr  = $(".home_dataCompare_top tbody tr");
		if(that.prop("checked")){
			for(var i = 0 ; i < select_tr.length ; i++){
				if(_.indexOf(dataCompareState.sellectObj.selectItem, select_tr.eq(i).find("input[type='checkbox']").data("ivalue").toString()) < 0){
					dataCompareState.sellectObj.selectItem.push(select_tr.eq(i).find("input[type='checkbox']").data("ivalue").toString());
					
					var str = '<tr>'+
						'<td class="not_search"><input type="checkbox" data-ivalue="'+select_tr.eq(i).find("input[type='checkbox']").data("ivalue")+'"></td>'+
						'<td data-itext="'+select_tr.eq(i).find(".product_category").text()+'">'+select_tr.eq(i).find(".product_category").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".device_number").text()+'">'+select_tr.eq(i).find(".device_number").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".lot_number").text()+'">'+select_tr.eq(i).find(".lot_number").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".wafer_number").text()+'">'+select_tr.eq(i).find(".wafer_number").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".qualified_rate").text()+'">'+select_tr.eq(i).find(".qualified_rate").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".test_end_date").text()+'">'+select_tr.eq(i).find(".test_end_date").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".test_operator").text()+'">'+select_tr.eq(i).find(".test_operator").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".description").text()+'">'+select_tr.eq(i).find(".description").text()+'</td>'+
						'<td data-itext="'+select_tr.eq(i).find(".data_format").text()+'" style="display:none;">'+select_tr.eq(i).find(".data_format").text()+'</td>'+
					'</tr>';
					if($(".home_dataCompare_bottom tbody>tr").length){
						$(".home_dataCompare_bottom tbody>tr:first").before(str);
					}else{
						$(".home_dataCompare_bottom tbody").append(str);
					}
				}
			}
		}else{
			console.log("selectItem2",dataCompareState.sellectObj.selectItem);
			for(var i = 0 ; i < select_tr.length ; i++){
				if(_.indexOf(dataCompareState.sellectObj.selectItem, select_tr.eq(i).find("input[type='checkbox']").data("ivalue").toString()) > -1){
					dataCompareState.sellectObj.selectItem.splice(dataCompareState.sellectObj.selectItem.indexOf(select_tr.eq(i).find("input[type='checkbox']").data("ivalue").toString()), 1);
					console.log("selectItem2",dataCompareState.sellectObj.selectItem);
					$(".home_dataCompare_bottom tbody>tr  input[data-ivalue ='"+select_tr.eq(i).find("input[type='checkbox']").data("ivalue")+"']").parent().parent().remove();
				}
			}
		}	
		renderCommonParameter();
		groupJudgeRenderNav("wafer");
	}
});

/*搜索*/
$(".g_info_m_in .form-control-feedback").click(function(){
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

	dataCompareRenderData(1);
	
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
				if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
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
  	$(".g_info_m, .g_info_r .glyphicon-search, .g_info .glyphicon-question-sign").hide();
  	if(controls == "home_dataCompare"){
  		$(".g_info_m, .g_info .glyphicon-question-sign").show();
  		if(dataCompareState.stateObj.searchShow) $(".g_info_r .glyphicon-search").show();
  	}else if(controls == "all_statistics"){
  		dataCompareSwalMixin({
			title: '加载数据',
			text: "正在绘图中......",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false,
			timer: 1000
		}).then(function(){
			dataCompareSwalMixin({
				title: '加载数据',
				text: "正在绘图中......",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false,
			});
	  		$("#all_statistics>div.panel>.panel-body").empty();
	  		$(".g_bodyin_bodyin_top_wrap ul>li[role='presentation']>a:not([aria-controls='home_dataCompare']):not([aria-controls='all_statistics'])").each(function(i, el){
	  			renderPanel(curParam.TotalYield, curParam.other, $(el).attr("aria-controls"), true, function(str){
	  				$("#all_statistics>div.panel.panel_"+$(el).attr("aria-controls")+">.panel-body").append(str);
	  			});
	  		});
	  		$("#all_statistics>div.panel").each(function(inde, el){
	  			var iicontrols = $(el).data("iallstatistics");
	  			if(iicontrols == "map_good_rate_distribution"){
	  				/*Map良率分布*/
	  				$(el).children(".panel-body").find(".chart_map_body>div").each(function(ii, ele){
	  					var that = $(this);
	  					draw_map_good_rate_distribution(that, ii);
	  				});
	  			}else if(iicontrols == "map_color_order_distribution"){
	  				/*Map色阶分布*/
	  				/*1区域，theMin #0000FF，2区域，lowwer #00FFFF，3区域，midder #00FF00，4区域，upper #FFFF00，5区域，theMax #FF0000，6区域*/
	  				var copyData = _.cloneDeep(futuredGlobal.S_getMockWaferData()[_.random(0, 1, false)]);
	  				var otherColor = {};
	  				var theMin = 100;
	  				var lowwer = 200;
	  				var midder = 250;
	  				var upper = 300;
	  				var theMax = 400;
	  				var maxSlide = Math.max(Math.abs(copyData.maxX), Math.abs(copyData.minX));
	  				var maxR = Math.sqrt(2)*maxSlide;
	  				/*暂时性数据*/
	  				var minmin = _.round(theMin*0.8);
	  				var maxmax = _.round(theMax*1.2);
	  				_.forEach(copyData.waferMapDataList, function(v, i, arr){
	  					_.forEach(arr[i].m_DieDataListNew, function(vv, ii, arra){
	  						_.forOwn(arra[ii], function(vvv, k, obj){
	  							/*虚假数据开始*/
	  							var iNo = _.random(minmin, maxmax, false);
	  							// k 1:1
	  							var k1 = Number(k.toString().split(":")[0]);
	  							var k2 = Number(k.toString().split(":")[1]);
								var powR = Math.pow(k1 ,2)+Math.pow(k2 ,2);
								var lowmid_mean = _.round(_.mean([lowwer, midder]));
								var midup_mean = _.round(_.mean([midder, upper]));
								var minlow_mean = _.round(_.mean([theMin, lowwer]));
								var upmax_mean = _.round(_.mean([upper, theMax]));
								if(Math.pow(3.2, 2)*powR < Math.pow(maxR ,2)){
									/*在5/16内，预设3区域中间到4区域中间*/
									iNo = _.random(lowmid_mean, midup_mean, false);
								}else if(4*powR < Math.pow(maxR ,2)){
									/*在二分之一内，预设蓝色至天蓝到黄色*/
									if(Math.pow(2.67, 2)*powR < Math.pow(maxR ,2)){
										/*半径3/8以内*/
										iNo = _.random(lowwer, lowmid_mean, false);
									}else{
										iNo = _.random(midup_mean, upper, false);
									}
								}else if(Math.pow(1.33, 2)*powR < Math.pow(maxR ,2)){
									if(Math.pow(1.6, 2)*powR < Math.pow(maxR ,2)){
										/*半径5/8以内*/
										iNo = _.random(minlow_mean, lowwer, false);
									}else{
										iNo = _.random(upper, upmax_mean, false);
									}
								}else if(powR <= Math.pow(maxR ,2)){
									if((Math.abs(k1)+Math.abs(k2))%2 == 0){
										iNo = _.random(minmin, minlow_mean, false);
									}else{
										iNo = _.random(upmax_mean, maxmax, false);
									}
								}
								/*虚假数据结束*/
								/*构造数据*/
	  							if(iNo<theMin){
	  								iNo = theMin;
	  								obj[k] = {bin: vvv, color: "1:"+iNo};
	  							}else if(theMin<=iNo && iNo<lowwer){
	  								obj[k] = {bin: vvv, color: "2:"+iNo};
	  							}else if(lowwer<=iNo && iNo<midder){
	  								obj[k] = {bin: vvv, color: "3:"+iNo};
	  							}else if(midder<=iNo && iNo<upper){
	  								obj[k] = {bin: vvv, color: "4:"+iNo};
	  							}else if(upper<=iNo && iNo<theMax){
	  								obj[k] = {bin: vvv, color: "5:"+iNo};
	  							}else if(theMax<=iNo){
	  								iNo = theMax;
	  								obj[k] = {bin: vvv, color: "6:"+iNo};
	  							}
	  							if(vvv == 12){
	  								if(!("12:" in otherColor)) otherColor["12:"] = "#fff";
	  								obj[k] = {bin: 12, color: "12:"};
	  							}else if(vvv == -1){
	  								if(!("-1:" in otherColor)) otherColor["-1:"] = "#314067";
	  								obj[k] = {bin: -1, color: "-1:"};
	  							}
	  						});
	  					});
	  				});
	  				var twoDiff = lowwer - theMin;
	  				var threeDiff = midder - lowwer;
	  				var fourDiff = upper - midder;
	  				var fiveDiff = theMax - upper;
	  				/*画图*/
	  				$(el).children(".panel-body").find(".chart_map_body>div").each(function(i, ele){
	  					var that = $(this);
						draw_map_color_order_distribution(that, i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor);
	  				});
	  			}else{
	  				var chartType = _.find(dataCompareState.chartTypeMap, function(o, k){
	  					return k == iicontrols;
	  				});
	  				$(el).children(".panel-body").find(".chart_otherSingle_body>div").each(function(){
	  					var that = $(this);
	  					draw_other_chart(that, iicontrols, chartType);
	  				});
	  			}
	  		});
			swal.clickCancel();
		});
  	}else{
  		if(!_.isNil(curParam) && !_.isEmpty(curParam)){
  			var TotalYield = curParam.TotalYield;
  			var other = curParam.other;
  			renderPanel(TotalYield, other, controls);
  			if(controls == "map_good_rate_distribution"){
  				/*Map良率分布*/
  				$("#map_good_rate_distribution>.single_div_in .chart_map_body>div").each(function(i, el){
  					var that = $(this);
  					draw_map_good_rate_distribution(that, i);
  				});
  				/*Map良率分布end*/
  			}else if(controls == "map_color_order_distribution"){
  				dataCompareSwalMixin({
  					title: '加载数据',
  					text: "正在绘图中......",
  					type: 'info',
  					showConfirmButton: false,
  					showCancelButton: false,
  					timer: 1000
  				}).then(function(){
  						dataCompareSwalMixin({
  							title: '加载数据',
  							text: "正在绘图中......",
  							type: 'info',
  							showConfirmButton: false,
  							showCancelButton: false,
  						});
		  				var copyData = _.cloneDeep(futuredGlobal.S_getMockWaferData()[_.random(0, 1, false)]);
		  				var otherColor = {};
		  				var theMin = 100;
		  				var lowwer = 200;
		  				var midder = 250;
		  				var upper = 300;
		  				var theMax = 400;
		  				var maxSlide = Math.max(Math.abs(copyData.maxX), Math.abs(copyData.minX));
		  				var maxR = Math.sqrt(2)*maxSlide;
		  				/*暂时性数据*/
		  				var minmin = _.round(theMin*0.8);
		  				var maxmax = _.round(theMax*1.2);
		  				_.forEach(copyData.waferMapDataList, function(v, i, arr){
		  					_.forEach(arr[i].m_DieDataListNew, function(vv, ii, arra){
		  						_.forOwn(arra[ii], function(vvv, k, obj){
		  							/*虚假数据开始*/
		  							var iNo = _.random(minmin, maxmax, false);
		  							// k 1:1
		  							var k1 = Number(k.toString().split(":")[0]);
		  							var k2 = Number(k.toString().split(":")[1]);
									var powR = Math.pow(k1 ,2)+Math.pow(k2 ,2);
									var lowmid_mean = _.round(_.mean([lowwer, midder]));
									var midup_mean = _.round(_.mean([midder, upper]));
									var minlow_mean = _.round(_.mean([theMin, lowwer]));
									var upmax_mean = _.round(_.mean([upper, theMax]));
									if(Math.pow(3.2, 2)*powR < Math.pow(maxR ,2)){
										/*在5/16内，预设3区域中间到4区域中间*/
										iNo = _.random(lowmid_mean, midup_mean, false);
									}else if(4*powR < Math.pow(maxR ,2)){
										/*在二分之一内，预设蓝色至天蓝到黄色*/
										if(Math.pow(2.67, 2)*powR < Math.pow(maxR ,2)){
											/*半径3/8以内*/
											iNo = _.random(lowwer, lowmid_mean, false);
										}else{
											iNo = _.random(midup_mean, upper, false);
										}
									}else if(Math.pow(1.33, 2)*powR < Math.pow(maxR ,2)){
										if(Math.pow(1.6, 2)*powR < Math.pow(maxR ,2)){
											/*半径5/8以内*/
											iNo = _.random(minlow_mean, lowwer, false);
										}else{
											iNo = _.random(upper, upmax_mean, false);
										}
									}else if(powR <= Math.pow(maxR ,2)){
										if((Math.abs(k1)+Math.abs(k2))%2 == 0){
											iNo = _.random(minmin, minlow_mean, false);
										}else{
											iNo = _.random(upmax_mean, maxmax, false);
										}
									}
									/*虚假数据结束*/

		  							if(iNo<theMin){
		  								iNo = theMin;
		  								obj[k] = {bin: vvv, color: "1:"+iNo};
		  							}else if(theMin<=iNo && iNo<lowwer){
		  								obj[k] = {bin: vvv, color: "2:"+iNo};
		  							}else if(lowwer<=iNo && iNo<midder){
		  								obj[k] = {bin: vvv, color: "3:"+iNo};
		  							}else if(midder<=iNo && iNo<upper){
		  								obj[k] = {bin: vvv, color: "4:"+iNo};
		  							}else if(upper<=iNo && iNo<theMax){
		  								obj[k] = {bin: vvv, color: "5:"+iNo};
		  							}else if(theMax<=iNo){
		  								iNo = theMax;
		  								obj[k] = {bin: vvv, color: "6:"+iNo};
		  							}
		  							if(vvv == 12){
		  								if(!("12:" in otherColor)) otherColor["12:"] = "#fff";
		  								obj[k] = {bin: 12, color: "12:"};
		  							}else if(vvv == -1){
		  								if(!("-1:" in otherColor)) otherColor["-1:"] = "#314067";
		  								obj[k] = {bin: -1, color: "-1:"};
		  							}
		  						});
		  					});
		  				});
		  				var twoDiff = lowwer - theMin;
		  				var threeDiff = midder - lowwer;
		  				var fourDiff = upper - midder;
		  				var fiveDiff = theMax - upper;
		  				/*画图*/
		  				$("#map_color_order_distribution>.single_div_in .chart_map_body>div").each(function(i, el){
		  					var that = $(this);
		  					draw_map_color_order_distribution(that, i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor);
		  				});
		  				swal.clickCancel();
  				});
  			}else{
  				var chartType = _.find(dataCompareState.chartTypeMap, function(o, k){
  					return k == controls;
  				});
  				$("#"+controls+" .single_div_in .chart_otherSingle_body>div").each(function(){
  					var that = $(this);
  					draw_other_chart(that, controls, chartType);
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