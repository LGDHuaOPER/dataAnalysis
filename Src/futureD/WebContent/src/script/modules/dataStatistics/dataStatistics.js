/*variable defined*/
var dataStatisticsSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataStatisticsState = new Object();
dataStatisticsState.csvANDparamSelected = {
	csv: [],
	param: []
};
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
dataStatisticsState.chooseParam = {};


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
	
	//$(".g_bodyin_bodyin_bottom_r .thumbnail img").css("margin-top",Math.abs($(".g_bodyin_bodyin_bottom_r .thumbnail").height() - $(".g_bodyin_bodyin_bottom_r .thumbnail .caption").height() - $(".g_bodyin_bodyin_bottom_r .thumbnail img").height() ) /2 +"px" )
}

function renderSelectCsv(item, flag, insertDOM,waferid){
	var str2 = '';
	for(var i = 0 ; i < item.length ; i++){
		str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_item">'+
		'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin">'+
		'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_main " data-icsv="'+item[i]+'"  data-iwaferid="'+waferid[i]+'">'+item[i]+'</div>'+
		'</div></div>';
	}
	
	insertDOM.empty().append(str2);
}


function renderChartCsvANDParam(obj){
	//console.log("objP",obj);
	var str = '';
	var total_param_dom = $(".g_bodyin_bodyin_bottom_1 .g_bodyin_bodyin_bottom_l_inbottom .list-group .list-group-item");
	if(obj.classify == "csv"){
		obj.csv.map(function(v, i){
			var iwaferid = $(".g_bodyin_bodyin_bottom_l_intop .g_bodyin_bodyin_bottom_l_itemin_main[data-icsv='"+v+"'] ").data("iwaferid");
			str+='<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_item">'+
						'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin">'+
							'<div class="g_bodyin_bodyin_bottom_l'+obj.flag+'_itemin_main" data-iwaferid="'+iwaferid+'">'+v+'</div>'+
						'</div>'+
					'</div>';
		});
	}else if(obj.classify == "table"){
		var showorhide = (obj.ishowchart == "gaussiandistribution" ||obj.ishowchart == "wafermap" ? "display:none" : "");
		str+='<table class="table table-striped table-bordered table-hover table-condensed"><thead><tr><th>参数名称</th><th>下限</th><th>上限</th><th style="'+showorhide+'">等分数</th></tr></thead><tbody>';
		for(var v= 0 ; v < total_param_dom.length ; v++){
			var cur_class = (_.indexOf(obj.param, total_param_dom.eq(v).data("iparam")) > -1 ? "info" : "");//判断选中参数
			var id = obj.ishowchart + String(dataStatisticsState.stateObj.chartRenderCurID++);
			str+='<tr class="'+cur_class+'" data-chartcurid="'+id+'" data-ishowchartparam="'+total_param_dom.eq(v).data("iparam")+'">'+
				'<td  class="g_bodyin_bodyin_bottom_lsub_mid_iparam" title="'+total_param_dom.eq(v).data("iparam")+'">'+total_param_dom.eq(v).data("iparam")+'</td>'+
				'<td class="g_bodyin_bodyin_bottom_lsub_mid_min" title="'+total_param_dom.eq(v).data("min")+'"><input type="text" value="'+total_param_dom.eq(v).data("min")+'" ></td>'+
				'<td class="g_bodyin_bodyin_bottom_lsub_mid_max" title="'+total_param_dom.eq(v).data("max")+'"><input type="text" value="'+total_param_dom.eq(v).data("max")+'" ></td>'+
				'<td class="g_bodyin_bodyin_bottom_lsub_mid_equal"  title="8"  style="'+showorhide+'"><input type="text" value="8"></td>'+
			'</tr>';
		}
		str+='</tbody></table>';
	}else if(obj.classify == "ul"){
		str+='<ul class="list-group">';
		for(var v= 0 ; v < total_param_dom.length ; v++){
			var cur_class = (_.indexOf(obj.param, total_param_dom.eq(v).data("iparam")) > -1 ? "list-group-item-info info" : "");//判断选中参数
			var id2 = obj.ishowchart + String(dataStatisticsState.stateObj.chartRenderCurID++);
			str+='<li class="list-group-item '+cur_class+'" data-chartcurid="'+id2+'" data-min="'+total_param_dom.eq(v).data("min")+'" data-max="'+total_param_dom.eq(v).data("max")+'" data-ishowchartparam="'+total_param_dom.eq(v).data("iparam")+'"><span class="badge">参数</span>'+total_param_dom.eq(v).data("iparam")+'</li>';
		}
		str+='</ul>';
	}
	obj.insertDOM.empty().append(str);
}

function renderParam(waferIdStr){
	if(waferIdStr == ""){
		$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty();
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
			if(data.paramList.length == 0){
				$(".g_bodyin_bodyin_bottom_r .thumbnail").addClass("cannotclick");
				$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty();
				return;
			}
			else if(data.paramList.length <2){
				$(".g_bodyin_bodyin_bottom_r .thumbnail[data-ichart='correlationgraph']").addClass("cannotclick");
			}
			_.forOwn(data.paramList, function(value,i) {
				istr+='<a href="javascript:;" class="list-group-item" data-iparam="'+value+'" data-iparam="'+value+'" data-min="'+data.rangeList[value][0]+'" data-max="'+data.rangeList[value][1]+'">'+value+'</a>';
			});
			$(".g_bodyin_bodyin_bottom_l_inbottom>.list-group").empty().append(istr);
			$(".g_bodyin_bodyin_bottom_r .thumbnail").removeClass("cannotclick");
			
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

/*preload*/
$(".g_bodyin_bodyin_bottom_2, .g_bodyin_bodyin_bottom_rsubin").hide().css("opacity", 1);

/*page onload*/
$(function(){
	var selectwaferId = $("body").data("wafer").waferId;
	var selectwaferNO = $("body").data("wafer").waferNO;
	/*主页面csv文件渲染*/
	renderSelectCsv(selectwaferNO, '', $(".g_bodyin_bodyin_bottom_l_intop"),selectwaferId);
	renderParam(selectwaferId[0]); //加载参数
	$(".g_bodyin_bodyin_bottom_l_item .g_bodyin_bodyin_bottom_l_itemin_main").eq(0).trigger("click");

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
	if($(this).hasClass("active")) return ;
	$(this).addClass("active").parent().parent().siblings().find(".g_bodyin_bodyin_bottom_l_itemin_main").removeClass("active");
	var csv = $(this).data("icsv").toString();
	dataStatisticsState.csvANDparamSelected.csv = [];
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

/*主页面与图表切换*/
$(document).on("click", ".g_bodyin_tit_r>span, .g_bodyin_bodyin_bottom_r .thumbnail", function(){
	if($(this).hasClass("cannotclick")) return false;
	dataStatisticsState.chooseParam = {};
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
			$(".g_bodyin_bodyin_bottom_lsub_item .g_bodyin_bodyin_bottom_lsub_itemin_main").addClass("active");
			if(!dataStatisticsState.stateObj.renderSelectCsvSub){
				eleResize2();
				dataStatisticsState.stateObj.renderSelectCsvSub = true;
			}
			/*分发chart*/
			$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+ichart+"']").delay(50).fadeIn(200, function(){
				
				var curWaferID = [],curParam=[],curWaferName = {},leftrange=[],rightrange=[],equal=[];;
				for(var _i = 0 ; _i < $(".g_bodyin_bodyin_bottom_l_intop .active").length ; _i++){
					curWaferID.push( $(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("iwaferid"));
					curWaferName[$(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("iwaferid")] =$(".g_bodyin_bodyin_bottom_l_intop .active").eq(_i).data("icsv") ;
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
					});
	  			}, 50);
				
			});
		}else{
			$(".g_bodyin_tit_r>span").hide();
		}
	});
});

$(document).on("click", ".g_bodyin_bodyin_bottom_lsub_bottom>input", function(){
	var ichart = $(".g_bodyin_bodyin_bottom_rsub>div:visible").data("ishowchart");
	var curWaferID = [],curParam=[],curWaferName = {},leftrange=[],rightrange=[],equal=[];
	for(var _i = 0 ; _i < $(".g_bodyin_bodyin_bottom_lsub_top .active").length ; _i++){
		curWaferID.push( $(".g_bodyin_bodyin_bottom_lsub_top .active").eq(_i).data("iwaferid"));
		curWaferName[$(".g_bodyin_bodyin_bottom_lsub_top .active").eq(_i).data("iwaferid")] =$(".g_bodyin_bodyin_bottom_lsub_top .active").eq(_i).text() ;
	}
	//console.log("delete dataStatisticsState.chooseParam",dataStatisticsState.chooseParam);
	
	_.forOwn(dataStatisticsState.chooseParam, function(value, key) {
		curParam.push(key);
		leftrange.push(dataStatisticsState.chooseParam[key].leftRange);
		rightrange.push(dataStatisticsState.chooseParam[key].rightRange);
		equal.push(dataStatisticsState.chooseParam[key].equal);
	});
	
	/*for(var _i = 0 ; _i < $(".g_bodyin_bodyin_bottom_lsub_mid .info").length ; _i++){
		if(ichart == "correlationgraph"||ichart =="boxlinediagram"||ichart =="CPK"){
			curParam.push($(".g_bodyin_bodyin_bottom_lsub_mid .list-group .info").eq(_i).data("ishowchartparam"));
			leftrange.push($(".g_bodyin_bodyin_bottom_lsub_mid .list-group .info").eq(_i).data("min"));
			rightrange.push($(".g_bodyin_bodyin_bottom_lsub_mid .list-group .info").eq(_i).data("max"));
			equal.push(8);
		}
		else{
			curParam.push($(".g_bodyin_bodyin_bottom_lsub_mid table .info").eq(_i).data("ishowchartparam"));
			leftrange.push($(".g_bodyin_bodyin_bottom_lsub_mid table .info").eq(_i).find(".g_bodyin_bodyin_bottom_lsub_mid_min").attr("title"));
			rightrange.push($(".g_bodyin_bodyin_bottom_lsub_mid table .info").eq(_i).find(".g_bodyin_bodyin_bottom_lsub_mid_max").attr("title"));
			equal.push($(".g_bodyin_bodyin_bottom_lsub_mid table .info").eq(_i).find(".g_bodyin_bodyin_bottom_lsub_mid_equal").attr("title"));
		}
	}*/
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
			leftrange : leftrange,
			rightrange : rightrange,
			equal : equal,
		});
		}, 50);
});

$(".g_bodyin_tit_r .RF_SP2").click(function(){
	 eouluGlobal.S_settingURLParam({
		  wafer: $("body").data("wafer").waferId,
	}, false, false, false, "Analysis");
})

/*参数切换*/
$(document).on("blur", ".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid tbody tr td:not(.g_bodyin_bodyin_bottom_lsub_mid_iparam) input", function(){
	var val = $(this).parent().attr("title");
	if($(this).val() == ""){
		$(this).val(val);
	};
	$(this).parent().attr("title",$(this).val());
});
$(document).on("click", ".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid .list-group .list-group-item", function(){
	var ichart = $(".g_bodyin_bodyin_bottom_rsub>div:visible").data("ishowchart");
	var chooseParamObj = {}
	if($(this).hasClass("list-group-item-info info")){
		$(this).removeClass("list-group-item-info info");
		delete dataStatisticsState.chooseParam[$(this).data("ishowchartparam")];
	}
	else{
		$(this).addClass("list-group-item-info info");
		chooseParamObj.leftRange = $(this).data("min");
		chooseParamObj.rightRange = $(this).data("max");
		chooseParamObj.equal = $(this).data("equal");
		dataStatisticsState.chooseParam[$(this).data("ishowchartparam")] = chooseParamObj;
	}
	
	if(ichart == "correlationgraph"){   //相关性 只能选中两个
		if($(".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid .list-group .list-group-item-info").length != 2 && $(".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid .list-group .list-group-item-info").length != 0){
			$(".g_bodyin_bodyin_bottom_lsub_bottom>input").attr("disabled",true);
		}
		else{
			$(".g_bodyin_bodyin_bottom_lsub_bottom>input").attr("disabled",false);
		}
	}
});

$(document).on("click", ".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid tbody tr .g_bodyin_bodyin_bottom_lsub_mid_iparam", function(){
	//$(this).parent().toggleClass("info");
	$(this).parent().find("input").toggleClass("mid_newbg");
	var chooseParamObj = {}
	if($(this).parent().hasClass("info")){
		$(this).parent().removeClass("info");
		delete dataStatisticsState.chooseParam[$(this).parent().data("ishowchartparam")];
	}
	else{
		$(this).parent().addClass("info");
		chooseParamObj.leftRange = $(this).parent().find(".g_bodyin_bodyin_bottom_lsub_mid_min").attr("title");
		chooseParamObj.rightRange = $(this).parent().find(".g_bodyin_bodyin_bottom_lsub_mid_max").attr("title");
		chooseParamObj.equal = $(this).parent().find(".g_bodyin_bodyin_bottom_lsub_mid_equal").attr("title");
		dataStatisticsState.chooseParam[$(this).parent().data("ishowchartparam")] = chooseParamObj;
	}
});

$(document).on("focus", ".g_bodyin_bodyin_bottom_2 .g_bodyin_bodyin_bottom_lsub_mid tbody tr input", function(){
	$(this).parent().parent().addClass("info");
	$(this).parent().parent().find("input").addClass("mid_newbg");
});
