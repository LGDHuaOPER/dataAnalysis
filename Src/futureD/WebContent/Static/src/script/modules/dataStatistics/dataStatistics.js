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
	renderColorGradient: false
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
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 170);
	$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 170);
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
			str+='<tr data-chartcurid="'+id+'" data-ishowchartparam="'+v+'"><td>'+v+'</td><td>0.32</td><td>1.4</td><td>8</td></tr>';
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
			if(result.dismiss == "timer"){
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
					var canvasID = "canvas_"+container;
					$(this).append("<canvas id='"+canvasID+"'></canvas>")
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
						buildColorGradation({
							width: $(this).width(),
							height: $(this).height(),
							container: canvasID,
							bgFillColor: "#eee",
							waferData: futuredGlobal.S_getMockWaferData()[0],
							spacePercent: {
								x: 0.31,
								y: 0.05
							},
							m_DieDataListNew: futuredGlobal.S_getMockWaferData()[0].waferMapDataList[i%3].m_DieDataListNew,
							colorGradation: {
								limitColor: "#FF0000",
								floorColor: "#0000FF",
								nums: 256
							}
						});
						$(".colorGradient").width($(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='wafermap']>.chartTit").width() - 200).height($(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='wafermap']>.chartTit").height());
						if(!dataStatisticsState.stateObj.renderColorGradient){
							_.times(256, function(ii){
								var color = getGradientColor ('#FF0000', '#0000FF', 256, ii);
								var height = $(".colorGradient").height();
								var width = $(".colorGradient").width() / 300;
								$(".colorGradient").append("<span class='colorGradientSpan' style='background: "+color+"; height: "+height+"px; width: "+width+"px'></span>");
							});
							dataStatisticsState.stateObj.renderColorGradient = true;
						}
					}else{
						if(type == 'column'){
							/*chart = {
								type: type,
								plotBorderWidth: 0,
								zoomType: 'xy'
							};*/
							/*xAxis = {
								type: 'linear',
								tickLength: 0
								// tickmarkPlacement: 'between'
							};
							yAxis = {
								min: 0,
								title: {
									text: '降雨量 (mm)'
								}
							};*/
							/*直方图
							xAxis = [{
								title: { text: 'Data' }
							}, {
								title: { text: 'Histogram' },
								opposite: true
							}];
							yAxis = [{
								title: { text: 'Data' }
							}, {
								title: { text: 'Histogram' },
								opposite: true
							}];*/
							yAxis = {
								title: {
									text: '百分数'
								}
							};
							xAxis = {
								min: Number(curLine.children("td:eq(1)").text()),
								max: Number(curLine.children("td:eq(2)").text()),
								tickAmount: Number(curLine.children("td:eq(3)").text()) + 1,
								type: 'linear',
								labels: {
									rotation: -45  // 设置轴标签旋转角度
								}
							};
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
								/*categories: [30, 60, 90, 120, 150, 180,
											 210, 240, 270, 300, 330, 360],*/
								crosshair: true,
								type: 'linear',
							}];
							yAxis = [{ // Primary yAxis
								labels: {
									format: '{value}一一',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								title: {
									text: '参数一',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								}
							}, { // Secondary yAxis
								title: {
									text: '参数二',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								labels: {
									format: '{value}二二',
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
							xAxis: xAxis
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