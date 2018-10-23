/*variable defined*/
var RF_SP2SwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var RF_SP2State = new Object();
RF_SP2State.mock = {
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
RF_SP2State.waferSelected = [];
RF_SP2State.waferTCFSelected = [];
RF_SP2State.contextObj = {
	classify: null,
	flag: null,
	flagArr: ["initial", "change"]
};
RF_SP2State.stateObj = {
	renderSelectCsvSub: false,
	calcTableIndex: -1,
	splineSelectedArr: [],
	comfirm_key: 'x'
};
RF_SP2State.MathMap = {
	"sin": "Math.sin",
	"cos": "Math.cos",
	"tan": "Math.tan",
	"ln": "Math.log()",
	"log": "Math.log()/Math.log()",
	"!": "Math.log()/Math.log()",
	"π": "Math.PI",
	"e": "Math.E",
	"^": "Math.pow()",
	"√": "Math.sqrt()"
};
RF_SP2State.allowKeyCode = [8, 46, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
RF_SP2State.search_markerObj = {
	awesomplete: null,
	list: null
};

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 200);
	$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 220);
	$("div.picturetop").each(function(){
		$(this).innerHeight($(this).parent().height() - 50);
	});

	$(".picturebottom_in_m ul>li").innerWidth($(".picturebottom_in_m").innerWidth());
}

function eleResize2(){
	$(".g_bodyin_bodyin_bottom_lsub, .g_bodyin_bodyin_bottom_rsub").height($(".g_bodyin_bodyin_bottom").height());
	$(".g_bodyin_bodyin_bottom_lsub_top, .g_bodyin_bodyin_bottom_lsub_bottom").innerHeight($(".g_bodyin_bodyin_bottom_lsub").innerHeight() / 2 - 1);
}

function renderSelectCsv(item, flag, insertDOM){
	var str2 = '';
	item.selectedItem.map(function(v, i){
		var newItem = RF_SP2State.mock.selectedItem[i%RF_SP2State.mock.selectedItem.length];
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
		RF_SP2State.mock.RF_SP2_render.push(fileName);
		RF_SP2State.mock.RF_SP2_render = _.uniq(RF_SP2State.mock.RF_SP2_render);
		str2+='<div class="g_bodyin_bodyin_bottom_l'+flag+'_item">'+
					'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin">'+
						'<div class="g_bodyin_bodyin_bottom_l'+flag+'_itemin_main">'+fileName+'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>'+
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
		var curveTypeArr = _.find(RF_SP2State.mock.curveType, function(o, k){
			return k == item.curveType;
		});
		if(item.curveType == "RF-S2P"){
			item.curveType = "S2P";
		}
		var str = '<li class="active" data-targetclass="g_bodyin_bodyin_bottom_1">'+item.curveType+'</li>';
		if(!_.isEmpty(curveTypeArr) && !_.isNil(curveTypeArr)){
			curveTypeArr.map(function(v){
				str+='<li data-targetclass="g_bodyin_bodyin_bottom_2">'+v+'</li>';
			});
		}
		str+='<li data-targetclass="add"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>';
		$(".g_bodyin_bodyin_top_wrap_m_in>ul").empty().append(str);

		renderSelectCsv(item, '', $(".g_bodyin_bodyin_bottom_l_intop"));
		$(".g_bodyin_bodyin_bottom_l_item:first .g_bodyin_bodyin_bottom_l_itemin_main").trigger("click");
		$(".g_bodyin_bodyin_bottom_l_item:first .g_bodyin_bodyin_bottom_l_itemin_sub>.g_bodyin_bodyin_bottom_l_itemin_subin:first").trigger("click");

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

	$(".reRenderBtnDiv").hide();

	/*回显marker*/
	RF_SP2State.stateObj.splineSelectedArr = store.get("futureD__RF_SP2__splineSelectedArr");
	if(_.isNil(RF_SP2State.stateObj.splineSelectedArr)){
		RF_SP2State.stateObj.splineSelectedArr = [];
	}else{
		var str2 = '';
		var iArra = [];
		_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
			str2+='<tr data-iflag="'+(v.name+v.x)+'"><td contenteditable="true" title="点击修改">'+v.markerName+'</td><td>'+v.x+'</td><td>'+v.y+'</td><td>'+v.key+'</td></tr>';
			iArra.push({
				label: v.markerName+".X: "+v.x,
				value: v.markerName+".X"
			});
			iArra.push({
				label: v.markerName+".Y: "+v.y,
				value: v.markerName+".Y"
			});
		});
		$(".buildMarker_body>.container-fluid tbody").empty().append(str2);
		RF_SP2State.search_markerObj.list = _.cloneDeep(iArra);
	}

	RF_SP2State.search_markerObj.awesomplete = new Awesomplete(document.getElementById("search_marker"), {
		list: RF_SP2State.search_markerObj.list,
		minChars: 1,
		maxItems: 10,
		autoFirst: true
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
	$(this).hasClass("selected") ? RF_SP2State.waferSelected.push(item) : _.pull(RF_SP2State.waferSelected, item);
}).on("click", ".g_bodyin_bodyin_bottom_l_itemin_main", function(){
	if($(this).hasClass("active")){
		$(this).next().slideUp(1000);
	}else{
		$(this).next().slideDown(1000);
	}
	$(this).toggleClass("active");
});

$(".g_bodyin_bodyin_bottom_l_inbottom>input").click(function(){
	if($(this).prop("checked")){
		$(".g_bodyin_bodyin_bottom_l_itemin_main").each(function(){
			$(this).addClass("active").next().slideDown(1000);
		});
		RF_SP2State.waferSelected = [];
		$(".g_bodyin_bodyin_bottom_l_itemin_subin").each(function(){
			$(this).addClass("selected");
			var item = $(this).parent().data("parentfile") +" "+$(this).text();
			RF_SP2State.waferSelected.push(item);
		});
	}else{
		$(".g_bodyin_bodyin_bottom_l_itemin_main").each(function(){
			$(this).removeClass("active").next().slideUp(1000);
		});
		RF_SP2State.waferSelected = [];
		$(".g_bodyin_bodyin_bottom_l_itemin_subin").removeClass("selected");
	}
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
		$("."+target).siblings().fadeOut(300, function(){
			$(this).siblings().fadeIn(300);
			if(target == "g_bodyin_bodyin_bottom_2"){
				if(!RF_SP2State.stateObj.renderSelectCsvSub){
					renderSelectCsv(store.get("futureDT2__projectAnalysis__selectedObj"), 'sub', $(".g_bodyin_bodyin_bottom_lsub_top"));
					eleResize2();
					$(".g_bodyin_bodyin_bottom_lsub_item:first .g_bodyin_bodyin_bottom_lsub_itemin_main").trigger("click");
					$(".g_bodyin_bodyin_bottom_lsub_item:first .g_bodyin_bodyin_bottom_lsub_itemin_sub>.g_bodyin_bodyin_bottom_lsub_itemin_subin:first").trigger("click").next().trigger("click");

					var idata = RF_SP2State.mock.RF_SP2[0].curveinfos[2].smithAndCurve.S21;
					var idata1 = RF_SP2State.mock.RF_SP2[2].curveinfos[2].smithAndCurve.S21;
					var ixData = [];
					ixData[0] = [];
					ixData[1] = [];
					var iyData = [];
					iyData[0] = [];
					iyData[1] = [];
					_.forEach(idata, function(v, i){
						ixData[0].push(v[0]/1000000);
						iyData[0].push(v[2]);
					});
					_.forEach(idata1, function(v, i){
						ixData[1].push(v[0]/1000000);
						iyData[1].push(v[2]);
					});
					renderSpline({
						container: "markerChart",
						title: "marker图",
						data: {
							xData: ixData,
							yData: iyData
						},
						name: RF_SP2State.waferTCFSelected,
						callback: function(chart){
							_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
								var ii = _.indexOf(RF_SP2State.waferTCFSelected, v.name);
								chart.series[ii].data[_.indexOf(iyData[ii], v.y)].select(true, true);
							});
						}
					});
					RF_SP2State.stateObj.renderSelectCsvSub = true;
				}
			}
		});
	}
});

/*分析模型左侧*/
$(document).on("click", ".g_bodyin_bodyin_bottom_lsub_itemin_subin", function(e){
	var item = $(this).parent().data("parentfile") +" "+$(this).text();
	if($(this).hasClass("selected")){
		$(this).removeClass("selected");
		_.pull(RF_SP2State.waferTCFSelected, item);
	}else{
		if($(".g_bodyin_bodyin_bottom_lsub_itemin_subin.selected").length > 1){
			var select0 = $(".g_bodyin_bodyin_bottom_lsub_itemin_subin.selected").eq(0);
			var item1 = select0.parent().data("parentfile") +" "+select0.text();
			$(".g_bodyin_bodyin_bottom_lsub_itemin_subin.selected").eq(0).removeClass("selected");
			_.pull(RF_SP2State.waferTCFSelected, item1);
		}
		$(this).addClass("selected");
		RF_SP2State.waferTCFSelected.push(item);
	}
	if(RF_SP2State.waferTCFSelected.length == 2){
		$(".reRenderBtnDiv").css({
			"left": (e.pageX + 30)+"px",
			"top": (e.pageY - 50)+"px"
		}).slideDown(200);
	}else{
		$(".reRenderBtnDiv").css({
			"left": (e.pageX + 30)+"px",
			"top": (e.pageY - 50)+"px"
		}).slideUp(200);
	}
}).on("click", ".g_bodyin_bodyin_bottom_lsub_itemin_main", function(){
	if($(this).hasClass("active")){
		$(this).next().slideUp(1000);
	}else{
		$(this).next().slideDown(1000);
	}
	$(this).toggleClass("active");
});

/*数据统计*/
$(".g_bodyin_tit_r>.glyphicon-stats").click(function(){
	store.set("RF_SP2_renderCSV", RF_SP2State.mock.RF_SP2_render);
	window.location.assign("dataStatistics.html");
});

/*点击出现计算器*/
$(document).on("click", "tr.canCalc", function(){
	$(".RF_SP2_cover, .subAddParam").slideDown(200);
	RF_SP2State.stateObj.calcTableIndex = $(this).index();
}).on("click", ".subAddParam_tit>span, .subAddParam_footin>.btn-warning", function(){
	$(".RF_SP2_cover, .subAddParam").slideUp(200);
}).on("click", ".subAddParam_footin>.btn-primary", function(){
	var tr = $(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").eq(RF_SP2State.stateObj.calcTableIndex);
	tr.children().eq(0).text($("#calc_text").val());
	tr.children().eq(2).text($("#clac_textarea").val());
	$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").append('<tr class="canCalc"><td></td><td></td><td></td></tr>');
	$(".subAddParam_footin>.btn-warning").trigger("click");
});

$(".calcin>div>.row>div>div").on({
	mousedown: function(){
		$(this).addClass("active");
	},
	mouseup: function(){
		$(this).removeClass("active");
		$("#clac_textarea").val($("#clac_textarea").val()+$(this).text());
	}
});

$("#clac_textarea").on("keydown", function(e){
	var i = e.keyCode || e.which || e.charCode;
	// alert(i)
	if(_.indexOf(RF_SP2State.allowKeyCode, i) == -1) return false;
});

/*显示marker设置*/
$(".g_bodyin_bodyin_bottom_rsubin_tit>button").on({
	click: function(){
		var $next = $(this).next();
		$next.toggleClass("clicked");
		if($next.hasClass("clicked")){
			$next.slideDown(600);
		}else{
			$next.slideUp(600);
		}
	},
	mouseover: function(){
		var $next = $(this).next();
		if($next.hasClass("clicked")) return false;
		$next.addClass("clicked");
		$next.slideDown(600);
	},
	/*mouseout: function(){
		var $next = $(this).next();
		if($next.hasClass("clicked")) return false;
		$next.removeClass("hoverd");
		$next.animate({
			"width": "0px",
			"height": "0px",
			"opacity": 0,
		}, 1000, "swing");
	}*/
});

$("#comfirm_key").click(function(){
	var key = $(this).parent().prev().children("select").val();
	$(".buildMarker_body>div tbody>tr").each(function(){
		$(this).children("td").eq(3).text(key);
	});
	RF_SP2State.stateObj.comfirm_key = key;
	RF_SP2SwalMixin({
		title: "Marker确认Key提示",
		text: "成功",
		type: "success",
		timer: 1000
	});
});

/*marker点提交*/
$(".buildMarker_footin>.btn-primary").click(function(){
	store.set("futureD__RF_SP2__splineSelectedArr", RF_SP2State.stateObj.splineSelectedArr);
	RF_SP2SwalMixin({
		title: "Marker提交提示",
		text: "保存成功",
		type: "success",
		timer: 1000
	});
});