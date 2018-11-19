/*variable defined*/
var dataStatisticsSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataStatisticsState = new Object();
dataStatisticsState.mock = {
	curveType: {
		"DC": ["IL", "BW", "VSWR", "CF"],
		"RTP": ["IL", "BW", "VSWR", "CF"],
		"RF-S2P": ["IL", "BW", "VSWR", "CF"]
	},
	selectedItem: [
		{
			"WaferID01.csv": ["1-0-RF.S2P"],
			"from": 1,
			"times": 5
		},
		{
			"WaferID02.csv": ["2-0-RF.S2P"],
			"from": 2,
			"times": 3
		},
		{
			"WaferID03.csv": ["3-0-RF.S2P"],
			"from": 3,
			"times": 4
		},
		{
			"WaferID04.csv": ["4-0-RF.S2P"],
			"from": 4,
			"times": 5
		}
	],
	RF_SP2: futuredGlobal.S_getRF_SP2(),
	RF_SP2_MagnitudeDB: futuredGlobal.S_getRF_SP2_MagnitudeDB(),
	RF_SP2_render: []
};
dataStatisticsState.csvANDparamSelected = {
	csv: [],
	param: []
};
/*dataStatisticsState.contextObj = {
	classify: null,
	flag: null,
	flagArr: ["initial", "change"]
};*/
dataStatisticsState.stateObj = {
	renderSelectCsvSub: false,
	chartValidate: {
		"histogram": {
			csvLen: "+",
			paramLen: 1
		},
		"boxlinediagram": {
			csvLen: "+",
			paramLen: 1
		},
		"CPK": {
			csvLen: 1,
			paramLen: 1
		},
		/*"correlationgraph": {
			csvLen: 0,
			paramLen: 0
		},*/
		"wafermap": {
			csvLen: "+",
			paramLen: 1
		},
		"gaussiandistribution": {
			csvLen: "+",
			paramLen: 1
		}
	},
	chartRenderCurID: 0,
};
dataStatisticsState.chartMap = {
	"histogram": "column",
	"boxlinediagram": "boxplot",
	"CPK": "line",
	"correlationgraph": "scatter",
	"gaussiandistribution": "gaussiandistribution",
	"wafermap": "wafermap",
};

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 150);
	$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 150);
}

function eleResize2(){
	$(".g_bodyin_bodyin_bottom_lsub, .g_bodyin_bodyin_bottom_rsub").height($(".g_bodyin_bodyin_bottom").height());
	$(".g_bodyin_bodyin_bottom_lsub_top, .g_bodyin_bodyin_bottom_lsub_mid").innerHeight(($(".g_bodyin_bodyin_bottom_lsub").innerHeight() - 46) / 2);
}

function renderSelectCsv(item, flag, insertDOM){
	var str2 = '';
	item.selectedItem.map(function(v, i){
		var newItem = dataStatisticsState.mock.selectedItem[i%dataStatisticsState.mock.selectedItem.length];
		var fileName, fileItem;
		var from = newItem.from;
		var times = newItem.times;
		_.forOwn(newItem, function(vv, kk){
			if(!_.isNumber(vv)){
				fileName = kk.substring(0,7);
				fileItem = vv[0];
				return false;
			}
		});
		var ii = i+1;
		ii = "00"+ii;
		fileName = fileName+eouluGlobal.S_getLastStr(ii, 3)+'.csv';
		dataStatisticsState.mock.RF_SP2_render.push(fileName);
		dataStatisticsState.mock.RF_SP2_render = _.uniq(dataStatisticsState.mock.RF_SP2_render);
		str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_item">'+
					'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin">'+
						'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_main" data-icsv="'+fileName+'">'+fileName+'<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>'+
						'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_sub" data-parentfile="'+fileName.replace(".csv", "")+'">';
		_.times(times, function(index){
			var num = from+index;
			var newfileItem = num+fileItem.substring(1);
			str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_subin">'+newfileItem+'</div>';
		});
		str2+='</div></div></div>';
	});
	insertDOM.empty().append(str2);
}

/*function renderChartValidate(){
	$(".g_bodyin_bodyin_bottom_r .thumbnail:not([data-ichart='correlationgraph'])").addClass("cannotclick");
	var csvLen = $(".g_bodyin_bodyin_bottom_l_itemin_main.active").length;
	var paramLen = $(".g_bodyin_bodyin_bottom_l_inbottom a.list-group-item-info").length;
	var item = {};
	item.csvLen = csvLen;
	item.paramLen = paramLen;
	var findChart = [];
	var notFindChart = {};
	_.forOwn(dataStatisticsState.stateObj.chartValidate, function(v, k){
		if(k == "CPK"){
			if(csvLen == 1){
				item.csvLen = 1;
			}
		}else{
			if(csvLen >= 1){
				item.csvLen = "+";
			}
		}
		if(_.isEqual(v, item)){
			findChart.push(k);
		}else{
			notFindChart[k] = eouluGlobal.S_getObjDifference(item, v);
		}
	});
	return {
		findChart: findChart,
		notFindChart: notFindChart
	};
}

function changeChartCanClick(item){
	item.findChart.map(function(v, i){
		$(".g_bodyin_bodyin_bottom_r .thumbnail[data-ichart='"+v+"']").removeClass("cannotclick");
	});
}*/

function renderChartCsvANDParam(obj){
	var str = '';
	if(obj.classify == "csv"){
		obj.csv.map(function(v, i){
			str+='<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_item">'+
						'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin">'+
							'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin_main">'+v+'<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>'+
						'</div>'+
					'</div>';
		});
	}else if(obj.classify == "table"){
		str+='<table class="table table-striped table-bordered table-hover table-condensed"><thead><tr><th>参数名称</th><th>下限</th><th>上限</th><th>等分数</th></tr></thead><tbody>';
		obj.param.map(function(v, i){
			var id = obj.ishowchart + String(dataStatisticsState.stateObj.chartRenderCurID++);
			str+='<tr data-chartcurid="'+id+'" data-ishowchartparam="'+v+'"><td>'+v+'</td><td>0.32</td><td>1.4</td><td>6</td></tr>';
		});
		str+='</tbody></table>';
	}else if(obj.classify == "ul"){
		str+='<ul class="list-group">';
		obj.param.map(function(v, i){
			var id2 = obj.ishowchart + String(dataStatisticsState.stateObj.chartRenderCurID++);
			str+='<li class="list-group-item" data-chartcurid="'+id2+'" data-ishowchartparam="'+v+'"><span class="badge">参数</span>'+v+'</li>';
		});
		str+='</ul>';
	}
	obj.insertDOM.empty().append(str);
}

/*map色阶分布图绘制*/
function draw_map_color_order_distribution(that, i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor){
	var inW = that.innerWidth();
	var inH = that.innerHeight();
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.next().children(".colorOrder_g").append("<div class='colorGradient'></div>");
	buildColorGradation({
		width: inW,
		height: inH,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: copyData,
		spacePercent: {
			x: 0.2,
			y: 0
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
	var colorGradientDom = that.next().children(".colorOrder_g").find("div.colorGradient");
	colorGradientDom.width(30).height(inH - 45);
	var all = twoDiff+threeDiff+fourDiff+fiveDiff;
	var itemWidth = colorGradientDom.width();
	var itemHeight = colorGradientDom.height() / (all*1.2);
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
	var tableStr = '<table class="table table-striped table-bordered table-condensed"><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>';
	$(tableStr).appendTo(that.next().children(".colorOrder_table"));
	console.log(countObj);
	_.forOwn(countObj, function(v, k){
		if(k == -1 || k == 12) return true;
		var curTr = that.next().children(".colorOrder_table").find("tr").eq(k-1);
		curTr.children("td").eq(0).text(k+"区间");
		curTr.children("td").eq(1).text(v+"个");
	});
	that.next().children(".colorOrder_table").find("tr").each(function(i){
		if(_.isEmpty($(this).children("td").eq(0).text())){
			$(this).children("td").eq(0).text((i+1)+"区间");
			$(this).children("td").eq(1).text("0个");
		}
	});
}

/*preload*/
$(".g_bodyin_bodyin_bottom_2, .g_bodyin_bodyin_bottom_rsubin").hide().css("opacity", 1);

/*page onload*/
$(function(){
	var item = store.get("futureDT2__projectAnalysis__selectedObj");
	if(_.isEmpty(item) || _.isNil(item)){
		dataStatisticsSwalMixin({
			title: '未选中晶圆',
			text: "请重新选择！",
			type: 'info',
			showConfirmButton: false,
			timer: 2000,
		}).then(function(result){
			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
				window.location.assign("projectAnalysis.html");
			}
		});
	}else{
		/*item.selectedItem;
		item.curveType;*/
		var curveTypeArr = _.find(dataStatisticsState.mock.curveType, function(o, k){
			return k == item.curveType;
		});
		if(item.curveType == "RF-S2P"){
			item.curveType = "S2P";
		}
		// var str = '';
		var istr = '';
		if(!_.isEmpty(curveTypeArr) && !_.isNil(curveTypeArr)){
			curveTypeArr.map(function(v){
				// str+='<li>'+v+'</li>';
				istr+='<a href="javascript:;" class="list-group-item" data-iparam="'+v+'"><span class="badge">选中</span>'+v+'</a>';
			});
		}
		var futureD__RF_SP2__paramCalc_tableStr = store.get("futureD__RF_SP2__paramCalc_tableStr");
		if(!_.isNil(futureD__RF_SP2__paramCalc_tableStr)){
			$(futureD__RF_SP2__paramCalc_tableStr).each(function(){
				var v = $(this).children("td:eq(0)").text();
				istr+='<a href="javascript:;" class="list-group-item" data-iparam="'+v+'"><span class="badge">选中</span>'+v+'</a>';
			});
		}
		// str+='<li data-targetclass="add"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>';
		// $(".g_bodyin_bodyin_top_wrap_m_in>ul").empty().append(str);
		// $(".g_bodyin_bodyin_top_wrap_m_in>ul>li:first").trigger("click");
		$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty().append(istr);
		$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group>a").trigger("click");

		/*主页面csv文件渲染*/
		renderSelectCsv(item, '', $(".g_bodyin_bodyin_bottom_l_intop"));
		$(".g_bodyin_bodyin_bottom_l_item .g_bodyin_bodyin_bottom_l_itemin_main").trigger("click");

		/*if($(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() > $(".g_bodyin_bodyin_top_wrap_m").innerWidth()){
			$(".g_bodyin_bodyin_top_wrap_l>span, .g_bodyin_bodyin_top_wrap_r>span").show();
		}*/
	}

	eleResize();
	$(window).on("resize", function(){
		eleResize();
		eleResize2();
	});
});

/*event handler*/
$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

/*数据统计左侧切换*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_itemin_subin", function(){
	$(this).toggleClass("selected");
}).on("click", ".g_bodyin_bodyin_bottom_l_itemin_main", function(){
	$(this).toggleClass("active");
	var csv = $(this).data("icsv").toString();
	$(this).hasClass("active") ? dataStatisticsState.csvANDparamSelected.csv.push(csv) : _.pull(dataStatisticsState.csvANDparamSelected.csv, csv);
	/*var item = renderChartValidate();
	changeChartCanClick(item);*/
});

/*上部分左右移动*/
/*$(".g_bodyin_bodyin_top_wrap_l>span").click(function(){
	var oldLeft = parseFloat($(".g_bodyin_bodyin_top_wrap_m_in").css("left"));
	var width = $(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() - $(".g_bodyin_bodyin_top_wrap_m").innerWidth();
	var newLeft = oldLeft + 60;
	if(oldLeft>=0){
		newLeft = 0;
	}
	$(".g_bodyin_bodyin_top_wrap_m_in").animate({
		"left": newLeft+"px"
	}, {
		speed: "slow",
		easing: "swing",
		queue: false
	});
});

$(".g_bodyin_bodyin_top_wrap_r>span").click(function(){
	var oldLeft = parseFloat($(".g_bodyin_bodyin_top_wrap_m_in").css("left"));
	var width = $(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() - $(".g_bodyin_bodyin_top_wrap_m").innerWidth();
	var newLeft = oldLeft - 60;
	if(Math.abs(oldLeft)>=width){
		newLeft = -width;
	}
	$(".g_bodyin_bodyin_top_wrap_m_in").animate({
		"left": newLeft+"px"
	}, {
		speed: "slow",
		easing: "swing",
		queue: false
	});
});*/

/*$(document).on("click", ".g_bodyin_bodyin_top_wrap_m_in li", function(){
	var target = $(this).data("targetclass");
	if(target == "add"){
		dataStatisticsSwalMixin({
			title: '敬请期待',
			text: "功能尚未开发",
			type: 'info',
			showConfirmButton: false,
			timer: 2000,
		});
	}else{
		$(this).addClass("active").siblings().removeClass("active");
	}
});*/

/*chart左侧*/
$(document).on("click", ".g_bodyin_bodyin_bottom_lsub_itemin_main", function(){
	$(this).toggleClass("active");
});

/*主页面与图表切换*/
$(document).on("click", ".g_bodyin_tit_r>span, .g_bodyin_bodyin_bottom_r .thumbnail", function(){
	if($(this).hasClass("cannotclick")) return false;
	var target = $(this).data("ipage");
	var ichart = $(this).data("ichart");
	$("."+target).siblings().fadeOut(200);
	$(".g_bodyin_bodyin_bottom_rsubin:not([data-ishowchart='"+ichart+"'])").fadeOut(200);
	$("."+target).delay(200).fadeIn(200,function(){
		if(target == "g_bodyin_bodyin_bottom_2"){
			$(".g_bodyin_tit_r>span").show();
			renderChartCsvANDParam({
				classify: "csv",
				csv: _.cloneDeep(dataStatisticsState.csvANDparamSelected.csv),
				flag: "sub",
				insertDOM: $(".g_bodyin_bodyin_bottom_lsub_top"),
				ishowchart: ichart
			});
			var classify;
			if(ichart == "histogram" || ichart == "wafermap" || ichart == "gaussiandistribution"){
				classify = "table";
			}else if(ichart == "boxlinediagram" || ichart == "CPK" || ichart == "correlationgraph"){
				classify = "ul";
			}
			renderChartCsvANDParam({
				classify: classify,
				param: _.cloneDeep(dataStatisticsState.csvANDparamSelected.param),
				insertDOM: $(".g_bodyin_bodyin_bottom_lsub_mid"),
				ishowchart: ichart
			});
			$(".g_bodyin_bodyin_bottom_lsub_item .g_bodyin_bodyin_bottom_lsub_itemin_main").trigger("click");
			if(!dataStatisticsState.stateObj.renderSelectCsvSub){
				eleResize2();
				dataStatisticsState.stateObj.renderSelectCsvSub = true;
			}
			/*分发chart*/
			$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+ichart+"']").delay(50).fadeIn(200, function(){
				/*画图*/
				buildChartContainer({
					ishowchart: ichart
				});
				$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+ichart+"']>.chartBody>.container-fluid [data-initrenderchart]").each(function(i, el){
					var container = $(this).attr("id");
					var curLine = $(".g_bodyin_bodyin_bottom_lsub_mid [data-chartcurid='"+container+"']");
					var subtitle;
					if(classify == "table"){
						subtitle = "等分数"+curLine.children("td:eq(3)").text();
					}else if(classify == "ul"){
						subtitle = "";
					}
					/*分流逻辑*/
					var type = _.find(dataStatisticsState.chartMap, function(o, k){
						return k == ichart;
					});
					var yAxis = {};
					var xAxis = {};
					var chart = {};
					if(type == "wafermap"){
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
		  				_.forEach(copyData.waferMapDataList, function(v, oi, arr){
		  					_.forEach(arr[oi].m_DieDataListNew, function(vv, ii, arra){
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
		  				draw_map_color_order_distribution($(el), i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor);
					}else{
						var series = null;
						if(type == 'column'){
							var icategories = [["-∞", 0.00000423], [0.00000423, 0.00000448], [0.00000448, 0.0000047300000000000005], [0.0000047300000000000005, 0.00000498], [0.00000498, 0.00000523], [0.00000523, 0.00000548], [0.00000548, 0.000005729999999999999], [0.000005729999999999999, 0.0000059799999999999995], [0.0000059799999999999995, 0.00000623], [0.00000623, "+∞"]];
							/*var histogram_limits_min = 0.00000423;
							var histogram_limits_max = 0.00000623;*/
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
							_.forEach(["93"], function(v, i){
								var item = {};
								item.name = "wafer"+v;
								item.type = "column";
								item.data = [
									2, 8, 10, 5, 15, 20, 3, 7, 10, 20
								];
								iserise.push(item);
							});
							iserise.push({
								name: "累加",
								type: "line",
								data: [2, 10, 20, 25, 40, 60, 63, 70, 80, 100]
							});
							series = _.cloneDeep(iserise);
						}else if(type == 'boxplot'){
							xAxis = {
										categories: ['1', '2', '3', '4', '5'],
										title: {
											text: ''
										}
									};
							yAxis = {
								title: {
									text: '观测值'
								},
								plotLines: [{
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
								}]
							};
						}else if(type == 'line'){
							xAxis = {
								categories: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
							};
							yAxis = {
								title: {
									text: 'values'
								}
							};
						}else if(type == 'scatter'){
							xAxis = {
								title: {
									enabled: true,
									text: '身高 (cm)'
								},
								startOnTick: true,
								endOnTick: true,
								showLastLabel: true
							};
							yAxis = {
								title: {
									text: '体重 (kg)'
								}
							};
						}else if(type == 'gaussiandistribution'){
							xAxis = [{
								categories: _.range(1, 13, 1),
								crosshair: true,
								type: 'linear',
							}];
							yAxis = [{ // Primary yAxis
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								title: {
									text: '频率',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								}
							}, { // Secondary yAxis
								title: {
									text: '正太分布',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								opposite: true
							}];
						}
						initRenderChart({
							chart: {
								type: type
							},
							container: container,
							title: curLine.data("ishowchartparam"),
							subtitle: subtitle,
							yAxis: yAxis,
							xAxis: xAxis,
							series: series
						});
					}
				});
			});
		}else{
			$(".g_bodyin_tit_r>span").hide();
		}
	});
});

/*参数选中*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_inbottom>.list-group>a", function(){
	$(this).toggleClass("list-group-item-info");
	var that = $(this);
	var param = that.data("iparam").toString();
	that.hasClass("list-group-item-info") ? dataStatisticsState.csvANDparamSelected.param.push(param) : _.pull(dataStatisticsState.csvANDparamSelected.param, param);
	var a = ["选中", "取消选中"];
	$(this).children("span").text(a[Number(that.hasClass("list-group-item-info"))]);
	/*var item = renderChartValidate();
	changeChartCanClick(item);*/
});