/*variable defined*/
var dataStatisticsSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataStatisticsState = new Object();
/*dataStatisticsState.mock = {
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
};*/
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
	curChartContainerNum :0
};
dataStatisticsState.chartMap = {
	"histogram": "column",
	"boxlinediagram": "boxplot",
	"CPK": "line",
	"correlationgraph": "scatter",
	"gaussiandistribution": "gaussiandistribution",
	"wafermap": "wafermap",
};
dataStatisticsState.ajaxurl = {
	"histogram": "Histogram",
	"boxlinediagram": "Boxplot",
	"CPK": "CPKServlet",
	"correlationgraph": "Correlation",
	"gaussiandistribution": "GaussianDistribution",
	"wafermap": "ColorMap",
};
dataStatisticsState.chartCNNameMap = {
	"histogram": "直方图",
	"boxlinediagram": "箱线图",
	"CPK": "CPK图",
	"correlationgraph": "相关性图",
	"gaussiandistribution": "高斯分布",
	"wafermap": "晶圆图",
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

function renderSelectCsv(item, flag, insertDOM,waferid){
	var str2 = '';
	for(var i = 0 ; i < item.length ; i++){
		str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_item">'+
		'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin">'+
		'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_main" data-icsv="'+item[i]+'"  data-iwaferid="'+waferid[i]+'">'+item[i]+'</div>'+
		'</div></div>';
	}
	
	insertDOM.empty().append(str2);
}


function renderChartCsvANDParam(obj){
	var str = '';
	if(obj.classify == "csv"){
		obj.csv.map(function(v, i){
			str+='<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_item">'+
						'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin">'+
							'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin_main">'+v+'</div>'+
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


function changeChartCanClick(){
	var len = $(".g_bodyin_bodyin_bottom_l_inbottom .list-group .list-group-item.list-group-item-info").length;
	$(".g_bodyin_bodyin_bottom_r .thumbnail").removeClass("cannotclick");
	if(!len || len == 0){
		$(".g_bodyin_bodyin_bottom_r .thumbnail").addClass("cannotclick");
	}
	else if(len == 1){
		$(".g_bodyin_bodyin_bottom_r .thumbnail[data-ichart='correlationgraph']").addClass("cannotclick");
	}
	else if(len == 2){
		$(".g_bodyin_bodyin_bottom_r .thumbnail").addClass("cannotclick");
		$(".g_bodyin_bodyin_bottom_r .thumbnail[data-ichart='correlationgraph']").removeClass("cannotclick");
	}
	else{
		$(".g_bodyin_bodyin_bottom_r .thumbnail").addClass("cannotclick");
	}
}

function renderParam(waferIdStr){
	if(waferIdStr == ""){
		$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty();
		changeChartCanClick()
		return;
	}
	var istr = '';
	$.ajax({
		type: "GET",
		url: "WaferParameter",
		data: {
			waferIdStr:waferIdStr 
		},
		dataType: "json",
		success: function(data){
			_.forOwn(data.paramList, function(value,i) {
				istr+='<a href="javascript:;" class="list-group-item" data-iparam="'+value+'" data-iparam="'+value+'" data-min="'+data.rangeList[value][0]+'" data-max="'+data.rangeList[value][1]+'"><span class="badge">选中</span>'+value+'</a>';
			});
			$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty().append(istr);
			changeChartCanClick()
		},
		error : function(){
			dataStatisticsSwalMixin({
				title: '异常',
    			text: "服务器繁忙！",
    			type: 'error',
    			showConfirmButton: false,
    			timer: 2000,
			});
		},
	})
}



/*map色阶分布图绘制*/


/*preload*/
$(".g_bodyin_bodyin_bottom_2, .g_bodyin_bodyin_bottom_rsubin").hide().css("opacity", 1);

/*page onload*/
$(function(){
	var selectwaferId = $("body").data("wafer").waferId;
	var selectwaferNO = $("body").data("wafer").waferNO;
	/*主页面csv文件渲染*/
	renderSelectCsv(selectwaferNO, '', $(".g_bodyin_bodyin_bottom_l_intop"),selectwaferId);
	$(".g_bodyin_bodyin_bottom_l_item .g_bodyin_bodyin_bottom_l_itemin_main").trigger("click");
	
		
	//renderParam(selectwaferId.join(",")); //加载参数
	changeChartCanClick(); 
	eleResize();
	$(window).on("resize", function(){
		eleResize();
		eleResize2();
	});
});


/*数据统计左侧切换*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_itemin_subin", function(){
	$(this).toggleClass("selected");
}).on("click", ".g_bodyin_bodyin_bottom_l_itemin_main", function(){
	$(this).toggleClass("active");
	var csv = $(this).data("icsv").toString();
	$(this).hasClass("active") ? dataStatisticsState.csvANDparamSelected.csv.push(csv) : _.pull(dataStatisticsState.csvANDparamSelected.csv, csv);
	var waferIdStr = [];
	if($(".g_bodyin_bodyin_bottom_l_intop .active").length == 0){
		$(".g_bodyin_bodyin_bottom_l_inbottom .list-group").empty();
	}
	else{
		for(var ii = 0 ; ii < $(".g_bodyin_bodyin_bottom_l_intop .active").length ; ii++){
			waferIdStr.push($(".g_bodyin_bodyin_bottom_l_intop .active").eq(ii).data("iwaferid"));
		}
	}
	dataStatisticsState.csvANDparamSelected.param = [] ;
	renderParam(waferIdStr.join(",")); //加载参数
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
				
				var curWaferID = [],curParam=[],curWaferName = {};
				for(var _i = 0 ; _i < $(".g_bodyin_bodyin_bottom_l_intop .active").length ; _i++){
					curWaferID.push( $(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("iwaferid"));
					curWaferName[$(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("iwaferid")] =$(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("icsv") ;
				}
				for(var _i = 0 ; _i < $(".g_bodyin_bodyin_bottom_l_inbottom .list-group  .list-group-item-info").length ; _i++){
					curParam.push($(".g_bodyin_bodyin_bottom_l_inbottom .list-group  .list-group-item-info").eq(_i).data("iparam"));
				}
				
				eouluGlobal.S_getSwalMixin()({
	  				title: '加载数据',
	  				text: "数据加载绘制图形中...",
	  				type: 'info',
	  				showConfirmButton: false,
	  				showCancelButton: false,
	  			});
				
				setTimeout(function(){
		  			var chartType = dataStatisticsState.chartMap[ichart];
					var chartAjaxUrl = dataStatisticsState.ajaxurl[ichart];
					var chartCNName = dataStatisticsState.chartCNNameMap[ichart];
					var whenArr = [];
					whenArr.push({
						chartType: chartType,
						chartAjaxUrl: chartAjaxUrl,
						chartCNName: chartCNName,
						classify: ichart
					});
					ajax_all_chart({
						whenArr: _.cloneDeep(whenArr),
						curWaferName : curWaferName,
						curWaferID : curWaferID,
						curParam : curParam,
					});
	  			}, 50);
				
				
				
				/*画图*/
//				buildChartContainer({
//					ishowchart: ichart
//				});
//				$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+ichart+"']>.chartBody>.container-fluid [data-initrenderchart]").each(function(i, el){
//					var container = $(this).attr("id");
//					var curLine = $(".g_bodyin_bodyin_bottom_lsub_mid [data-chartcurid='"+container+"']");
//					var subtitle;
//					if(classify == "table"){
//						subtitle = "等分数"+curLine.children("td:eq(3)").text();
//					}else if(classify == "ul"){
//						subtitle = "";
//					}
//					/*分流逻辑*/
//					var type = _.find(dataStatisticsState.chartMap, function(o, k){
//						return k == ichart;
//					});
//					var yAxis = {};
//					var xAxis = {};
//					var chart = {};
//					if(type == "wafermap"){
//						/*Map色阶分布*/
//		  				/*1区域，theMin #0000FF，2区域，lowwer #00FFFF，3区域，midder #00FF00，4区域，upper #FFFF00，5区域，theMax #FF0000，6区域*/
//					}else{
//						var series = null;
//					}
//				});
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
	changeChartCanClick();
	/*var item = renderChartValidate();
	changeChartCanClick(item);*/
});


