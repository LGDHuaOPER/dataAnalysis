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
		"DC": ["IL", "BW", "VSWR", "TCF", "CF"],
		"RTP": ["VSWR", "TCF", "CF","IL", "BW", "VSWR"],
		"RF-S2P": ["IL", "BW", "VSWR", "TCF", "CF", "IL", "BW", "VSWR", "TCF", "CF", "IL", "BW", "VSWR", "TCF", "CF", "IL", "BW", "VSWR", "TCF", "CF", "IL", "BW", "IL", "BW", "VSWR", "TCF", "CF", "VSWR", "TCF", "CF"]
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
dataStatisticsState.waferSelected = [];
dataStatisticsState.contextObj = {
	classify: null,
	flag: null,
	flagArr: ["initial", "change"]
};
dataStatisticsState.stateObj = {
	renderSelectCsvSub: false
};

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 200);
	$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 220);
}

function eleResize2(){
	$(".g_bodyin_bodyin_bottom_lsub, .g_bodyin_bodyin_bottom_rsub").height($(".g_bodyin_bodyin_bottom").height());
	$(".g_bodyin_bodyin_bottom_lsub_top, .g_bodyin_bodyin_bottom_lsub_bottom").innerHeight($(".g_bodyin_bodyin_bottom_lsub").innerHeight() / 2 - 1);
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
		str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_item">'+
					'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin">'+
						'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_main">'+fileName+'<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>'+
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

/*page onload*/
$(function(){
	var item = store.get("futureDT2__projectAnalysis__selectedObj");
	if(_.isEmpty(item) || _.isNil(item)){
		RF_SP2SwalMixin({
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
		var str = '';
		var istr = '';
		if(!_.isEmpty(curveTypeArr) && !_.isNil(curveTypeArr)){
			curveTypeArr.map(function(v){
				str+='<li>'+v+'</li>';
				istr+='<p>'+v+'</p>';
			});
		}
		str+='<li data-targetclass="add"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>';
		$(".g_bodyin_bodyin_top_wrap_m_in>ul").empty().append(str);
		$(".g_bodyin_bodyin_bottom_l_inbottom").empty().append(istr);
		$(".g_bodyin_bodyin_top_wrap_m_in>ul>li:first").trigger("click");

		renderSelectCsv(item, '', $(".g_bodyin_bodyin_bottom_l_intop"));
		$(".g_bodyin_bodyin_bottom_l_item:first .g_bodyin_bodyin_bottom_l_itemin_main").trigger("click");

		if($(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() > $(".g_bodyin_bodyin_top_wrap_m").innerWidth()){
			$(".g_bodyin_bodyin_top_wrap_l>span, .g_bodyin_bodyin_top_wrap_r>span").show();
		}
	}

	$(".g_bodyin_bodyin_bottom_2").hide();
	
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

/*左侧切换*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_itemin_subin", function(){
	$(this).toggleClass("selected");
	var item = $(this).parent().data("parentfile") +" "+$(this).text();
	$(this).hasClass("selected") ? dataStatisticsState.waferSelected.push(item) : _.pull(dataStatisticsState.waferSelected, item);
}).on("click", ".g_bodyin_bodyin_bottom_l_itemin_main", function(){
	$(this).toggleClass("active");
});

/*上部分左右移动*/
$(".g_bodyin_bodyin_top_wrap_l>span").click(function(){
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
});

$(document).on("click", ".g_bodyin_bodyin_top_wrap_m_in li", function(){
	var target = $(this).data("targetclass");
	if(target == "add"){
		RF_SP2SwalMixin({
			title: '敬请期待',
			text: "功能尚未开发",
			type: 'info',
			showConfirmButton: false,
			timer: 2000,
		});
	}else{
		$(this).addClass("active").siblings().removeClass("active");
	}
});

/*分析模型左侧*/
$(document).on("click", ".g_bodyin_bodyin_bottom_lsub_itemin_subin", function(){
	$(this).toggleClass("selected");
}).on("click", ".g_bodyin_bodyin_bottom_lsub_itemin_main", function(){
	$(this).toggleClass("active");
});

/*主页面与图表切换*/
$(document).on("click", ".g_bodyin_tit_r>span, .g_bodyin_bodyin_bottom_r .thumbnail", function(){
	var target = $(this).data("ipage");
	$("."+target).siblings().fadeOut(300, function(){
		$(this).siblings().fadeIn(300);
		if(target == "g_bodyin_bodyin_bottom_2"){
			$(".g_bodyin_tit_r>span").show();
			if(!dataStatisticsState.stateObj.renderSelectCsvSub){
				renderSelectCsv(store.get("futureDT2__projectAnalysis__selectedObj"), 'sub', $(".g_bodyin_bodyin_bottom_lsub_top"));
				eleResize2();
				$(".g_bodyin_bodyin_bottom_lsub_item:first .g_bodyin_bodyin_bottom_lsub_itemin_main").trigger("click");

				/*var idata = dataStatisticsState.mock.RF_SP2[0].curveinfos[2].smithAndCurve.S21;
				var idata1 = dataStatisticsState.mock.RF_SP2[2].curveinfos[2].smithAndCurve.S21;
				var ixData = [];
				ixData[0] = [];
				ixData[1] = [];
				var iyData = [];
				iyData[0] = [];
				iyData[1] = [];
				_.forEach(idata, function(v, i){
					ixData[0].push(v[0]);
					iyData[0].push(v[2]);
				});
				_.forEach(idata1, function(v, i){
					ixData[1].push(v[0]);
					iyData[1].push(v[2]);
				});
				renderSpline({
					container: "markerChart",
					title: "marker图",
					data: {
						xData: ixData,
						yData: iyData
					}
				});*/
				dataStatisticsState.stateObj.renderSelectCsvSub = true;
			}
		}else{
			$(".g_bodyin_tit_r>span").hide();
		}
	});
});