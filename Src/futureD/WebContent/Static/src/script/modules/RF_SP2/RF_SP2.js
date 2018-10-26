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
	splineSelectedCopyArr: [],
	comfirm_key: store.get("futureD__RF_SP2__comfirm_key"),
	key_y: false,
	curLineInsertIndex: null,
	smithSXCategories: []
};
RF_SP2State.MathMap = {
	"sin": {
		"replace": "Math.sin",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"cos": {
		"replace": "Math.cos",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"tan": {
		"replace": "Math.tan",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"ln": {
		"replace": "Math.log",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"log": {
		"replace": "Math.log(##2)/Math.log(##1)",
		"reg": /log\d+\(\d+\)/g,
		"reg1": /log(\d+)\((\d+)\)/,
		"fun": "match",
		"index": [1, 2]
	},
	"!": {
		"replace": "eouluGlobal.S_factorial(##1)",
		"reg": /\d+\!/g,
		"reg1": /\d+(?=\!)/,
		"fun": "match",
		"index": 0
	},
	"π": {
		"replace": "Math.PI",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"e": {
		"replace": "Math.E",
		"reg": null,
		"fun": null,
		"index": -1
	},
	"^": {
		"replace": "Math.pow(##1, ##2)",
		"reg": /\d+\^\d+/,
		"reg1": /(\d+)\^(\d+)/,
		"fun": "match",
		"index": [1, 2]
	},
	"√": {
		"replace": "Math.sqrt(##1)",
		"reg": /√\d+/g,
		"reg1": /√(\d+)/,
		"fun": "match",
		"index": 1
	}
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

function renderNavItem(obj){
	var str = '';
	var item = obj.item, type = obj.type, inde = obj.index;
	var curveTypeArr = _.find(RF_SP2State.mock.curveType, function(o, k){
		return k == item.curveType;
	});
	if(item.curveType == "RF-S2P"){
		item.curveType = "S2P";
	}
	if(type == "g_bodyin_bodyin_bottom_1"){
		str+='<li class="active" data-targetclass="g_bodyin_bodyin_bottom_1">'+item.curveType+'</li><li data-targetclass="g_bodyin_bodyin_bottom_2">TCF</li>';
	}else if(type == "g_bodyin_bodyin_bottom_2"){
		str+='<li data-targetclass="g_bodyin_bodyin_bottom_1">返回'+item.curveType+'</li>';
		var activeFlag = "";
		if(inde == 1 || _.isNil(inde)){
			activeFlag = "active";
		}
		str+='<li class="'+activeFlag+'" data-targetclass="g_bodyin_bodyin_bottom_2">TCF</li>';
		if(!_.isEmpty(curveTypeArr) && !_.isNil(curveTypeArr)){
			curveTypeArr.map(function(v, i){
				var activeFlag2 = "";
				if(inde - i == 2) activeFlag2 = "active";
				str+='<li class="'+activeFlag2+'" data-targetclass="g_bodyin_bodyin_bottom_2">'+v+'</li>';
			});
		}
		str+='<li data-targetclass="add"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>';
	}
	$(".g_bodyin_bodyin_top_wrap_m_in>ul").empty().append(str);
}

/*before load*/
$(".g_bodyin_bodyin_bottom_2, .signalChart_div, .reRenderBtnDiv").hide();

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
		/*导航栏*/
		renderNavItem({
			item: item,
			type: "g_bodyin_bodyin_bottom_1"
		});
		/*导航栏结束*/
		renderSelectCsv(item, '', $(".g_bodyin_bodyin_bottom_l_intop"));
		$(".g_bodyin_bodyin_bottom_l_item:first .g_bodyin_bodyin_bottom_l_itemin_main").trigger("click");
		$(".g_bodyin_bodyin_bottom_l_item:first .g_bodyin_bodyin_bottom_l_itemin_sub>.g_bodyin_bodyin_bottom_l_itemin_subin:first").trigger("click");

		if($(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() > $(".g_bodyin_bodyin_top_wrap_m").innerWidth()){
			$(".g_bodyin_bodyin_top_wrap_l>span, .g_bodyin_bodyin_top_wrap_r>span").show();
		}
	}
	
	eleResize();
	$(window).on("resize", function(){
		eleResize();
		eleResize2();
	});

	/*回显marker*/
	RF_SP2State.stateObj.splineSelectedArr = store.get("futureD__RF_SP2__splineSelectedArr");
	RF_SP2State.stateObj.splineSelectedCopyArr = store.get("futureD__RF_SP2__splineSelectedArr");
	if(_.isNil(RF_SP2State.stateObj.splineSelectedArr)){
		RF_SP2State.stateObj.splineSelectedArr = [];
	}else{
		RF_SP2State.stateObj.key_y = RF_SP2State.stateObj.comfirm_key == "y" ? true : false;
		var str2 = '';
		var iArra = [];
		_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
			str2+='<tr data-iflag="'+(v.name+v.x)+'"><td contenteditable="true" title="点击修改" data-iorigin="'+v.markerName+'">'+v.markerName+'</td><td>'+v.x+'</td><td>'+v.y+'</td><td>'+v.key+'</td></tr>';
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

	if(!_.isNil(RF_SP2State.stateObj.comfirm_key)){
		$("#comfirm_key_sel").val(RF_SP2State.stateObj.comfirm_key);
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
		var inde = $(this).index();
		$("."+target).siblings().fadeOut(300, function(){
			$(this).siblings().fadeIn(300);
			/*导航栏*/
			renderNavItem({
				item: store.get("futureDT2__projectAnalysis__selectedObj"),
				type: target,
				index: inde
			});
			/*导航栏结束*/
			if(target == "g_bodyin_bodyin_bottom_2"){
				$('button.upflag, button.lowflag').popover("hide");
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
					/*构造新数据*/
					_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v){
						if(v.isNew){
							ixData[0].splice(v.newIndex, 0, v.x);
							iyData[_.indexOf(RF_SP2State.waferTCFSelected, v.name)].splice(v.newIndex, 0, v.y);
							iyData[Number(!_.indexOf(RF_SP2State.waferTCFSelected, v.name))].splice(v.newIndex, 0, iyData[Number(!_.indexOf(RF_SP2State.waferTCFSelected, v.name))][v.newIndex - 1]);
						}
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
							/*_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
								var ii = _.indexOf(RF_SP2State.waferTCFSelected, v.name);
								chart.series[ii].data[_.indexOf(iyData[ii], v.y)].select(true, true);
							});*/
							_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
								var iii = _.indexOf(RF_SP2State.waferTCFSelected, v.name);
								chart.series[iii].data[_.indexOf(chart.xAxis[0].categories, v.x)].select(true, true);
							});
						}
					});
					RF_SP2State.stateObj.renderSelectCsvSub = true;
				}
				/*判断结束*/
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
	var str = $("#clac_textarea").val();
	if(str == "" || str.trim() == "") return false;
	_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(iv, ik){
		if(str.indexOf(iv.markerName) == -1) return true;
		var delayArr = str.match(new RegExp(iv.markerName+"\\."+"X", "g"));
		var delayArr2 = str.match(new RegExp(iv.markerName+"\\."+"Y", "g"));
		_.forEach(delayArr, function(vv, ii){
			str = str.replace(vv, iv.x);
		});
		_.forEach(delayArr2, function(vv, ii){
			str = str.replace(vv, iv.y);
		});
	});
	_.forOwn(RF_SP2State.MathMap, function(v, k){
		if(str.indexOf(k) == -1) return true;
		if(v.reg == null){
			var ireg = new RegExp(k, "g");
			str = _.replace(str, ireg, v.replace);
		}else{
			var delayArr = str.match(v.reg);
			if(_.isNil(delayArr)) return true;
			if(_.isNumber(v.index)){
				_.forEach(delayArr, function(vv, ii){
					var replaceStr = "("+v.replace+")";
					var num = vv.match(v.reg1)[v.index];
					replaceStr = replaceStr.replace("##1", num);
					str = str.replace(vv, replaceStr);
				});
			}else if(_.isArray(v.index)){
				_.forEach(delayArr, function(vv, ii){
					var replaceStr = "("+v.replace+")";
					var num1 = vv.match(v.reg1)[v.index[0]];
					var num2 = vv.match(v.reg1)[v.index[1]];
					replaceStr = replaceStr.replace("##1", num1);
					replaceStr = replaceStr.replace("##2", num2);
					str = str.replace(vv, replaceStr);
				});
			}
		}
	});
	try{
		var iVal = eval(str);
		if(_.isNaN(iVal)){
			RF_SP2SwalMixin({
				title: "公式提示",
				text: "公式有误",
				type: "error",
				timer: 2000
			});
		}else{
			var tr = $(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").eq(RF_SP2State.stateObj.calcTableIndex);
			tr.children().eq(0).text($("#calc_text").val());
			tr.children().eq(1).text(iVal.toFixed(2));
			tr.children().eq(2).text($("#clac_textarea").val());
			var iiflag = false;
			$(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr:last>td").each(function(){
				if($(this).text() != ""){
					iiflag = true;
					return false;
				}
			});
			if(!iiflag) {
				$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").append('<tr class="canCalc"><td></td><td></td><td></td></tr>');
			}
			$(".subAddParam_footin>.btn-warning").trigger("click");
		}
	}catch(err){
		RF_SP2SwalMixin({
			title: "公式提示",
			text: "公式有误",
			type: "error",
			timer: 2000
		});
	}
});

$(".calcin>div>.row>div>div").on({
	mousedown: function(){
		$(this).addClass("active");
	},
	mouseup: function(){
		$(this).removeClass("active");
		var t = $("#clac_textarea").val();
		var k = $(this).text();
		var cp = eouluGlobal.S_getCaretPosition($("#clac_textarea")[0]);
		var s = t.substring(0,cp) + k + t.substring(cp, t.length);
		$("#clac_textarea").val(s);
		eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], cp + k.length);
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
	/*$(".buildMarker_body>div tbody>tr").each(function(){
		$(this).children("td").eq(3).text(key);
	});*/
	RF_SP2State.stateObj.comfirm_key = key;
	/*_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v){
		v.key = key;
	});*/
	/*清空*/
	RF_SP2State.stateObj.splineSelectedArr = [];
	$(".buildMarker_body>div tbody").empty();
	store.set("futureD__RF_SP2__comfirm_key", RF_SP2State.stateObj.comfirm_key);
	RF_SP2SwalMixin({
		title: "Marker确认Key提示",
		text: "成功，现在可以选点了，请记得保存",
		type: "success",
		timer: 1000
	});
});

/*marker点修改*/
$(document).on("input propertychange change", ".buildMarker_body>.container-fluid tbody td:nth-child(1)", function(){
	var origin = $(this).data("iorigin");
	var newMarker = $(this).text();
	var flag = true;
	_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
		if(v.markerName != origin && v.markerName == newMarker){
			flag = false;
			return false;
		}
	});
	if(!flag){
		$(this).text(origin);
	}
}).on("blur", ".buildMarker_body>.container-fluid tbody td:nth-child(1)", function(){
	var origin = $(this).data("iorigin");
	var newMarker = $(this).text();
	if(!/Marker\d+/.test(newMarker)){
		$(this).text(origin);
	}else{
		var ii = $(this).parent().index();
		var flag = true;
		$(".buildMarker_body>.container-fluid tbody td:nth-child(1)").each(function(i){
			/*console.log($(this).index()); // 0*/
			if(ii != i && newMarker == $(this).text()){
				flag = false;
				return false;
			}
		});
		if(!flag){
			$(this).text(origin);
		}
	}
});

/*marker点提交*/
$(".buildMarker_footin>.btn-primary").click(function(){
	/*if(_.isEmpty(RF_SP2State.stateObj.splineSelectedCopyArr)){

	}*/
	_.forEach(RF_SP2State.stateObj.splineSelectedArr, function(v, i){
		var iText = $(".buildMarker_body>.container-fluid tbody>tr[data-iflag='"+(v.name+v.x)+"']").children("td").eq(0).text();
		v.markerName = iText;
		v.id = iText.match(/Marker(\d+)/)[1];
	});
	store.set("futureD__RF_SP2__splineSelectedArr", RF_SP2State.stateObj.splineSelectedArr);
	RF_SP2SwalMixin({
		title: "Marker提交提示",
		text: "保存成功",
		type: "success",
		timer: 1000
	});
});

/*marker搜索*/
$(document).on("click", "div.awesomplete ul[role='listbox']>li", function(){
	// alert($(this).text())
	$("#clac_textarea").val($("#clac_textarea").val()+$("#search_marker").val().trim());
});

/*双击4图表*/
$(document).on("dblclick", ".chartWarp", function(){
	var itargetchart = $(this).data("itargetchart");
	$(".fourChart_div").fadeOut(200, function(){
		$(".signalChart_div").fadeIn(200);
		$("#"+itargetchart).siblings().fadeOut(100, function(){
			$("#"+itargetchart).fadeIn(100, function(){
				var iclassify = itargetchart.replace("_chart_S", "");
				if(iclassify == "S12" || iclassify == "S21"){
					var objec = {};
					objec.xCategories = [];
					_.forEach(RF_SP2State.mock.RF_SP2[0].curveinfos[2].smithAndCurve[iclassify], function(v, i){
						objec.xCategories.push(Math.floor(v[0] / 10000000)/100);
					});
					objec.series = [];
					_.times(3, function(ii){
						objec.series[ii] = {};
						objec.series[ii].data = [];
						_.forEach(RF_SP2State.mock.RF_SP2[ii].curveinfos[2].smithAndCurve[iclassify], function(v, i){
							objec.series[ii].data.push(parseFloat(v[1]));
						});
					});
					objec.container = itargetchart;
					objec.msgDom = null;
					objec.legend_enabled = true;
					objec.zoomType = 'x';
					objec.resetZoomButton = {
						position: {
							align: 'left', // by default
							// verticalAlign: 'top', // by default
							x: 90,
							y: 10
						},
						relativeTo: 'chart'
					};
					objec.text = iclassify;
					RF_SP2State.stateObj.smithSXCategories = _.cloneDeep(objec.xCategories);
					drawDbCurve(objec);
					$(".signalChart_div_tit>.upflag, .signalChart_div_tit>.lowflag").prop("disabled", false);
				}else{
					/*史密斯图*/
					var smithDataArr = [];
					_.times(3, function(ii){
						smithDataArr.push(RF_SP2State.mock.RF_SP2[ii].curveinfos[2].smithAndCurve[iclassify]);
					});
					var smith1 = smithChart($("#"+itargetchart)[0], [''], [iclassify], smithDataArr, iclassify, null);
					window.onresize = function () {
						smith1.onresize();
					};
					$(".signalChart_div_tit>.upflag, .signalChart_div_tit>.lowflag").prop("disabled", true);
				}
			});
		});
	});
});

$(".signalChart_div_tit>button.backover").click(function(){
	$(".signalChart_div").fadeOut(200, function(){
		$(".fourChart_div").fadeIn(200);
		$('button.upflag, button.lowflag').popover("hide");
	});
});

/*指标*/
$(".signalChart_div_tit>button.upflag").popover({
	content: '<div class="container-fluid">'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">X1</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control upflag_X1 AwesompleteX"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">X2</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control upflag_X2 AwesompleteX"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">固定值Y0</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control upflag_Y0"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div><input input="button" class="btn btn-primary" value="确定" id="upflag_comfirm" readonly></div>'+
			'</div>'+
		'</div>',
	html: true
});

$(".signalChart_div_tit>button.lowflag").popover({
	content: '<div class="container-fluid">'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">X1</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control lowflag_X1 AwesompleteX"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">X2</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control lowflag_X2 AwesompleteX"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-sm-6 col-md-6 col-lg-6">固定值Y0</div>'+
				'<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control lowflag_Y0"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div><input input="button" class="btn btn-primary" value="确定" id="lowflag_comfirm" readonly></div>'+
			'</div>'+
		'</div>',
	html: true
});

$('button.upflag, button.lowflag').on('shown.bs.popover', function () {
  	$("input.AwesompleteX").each(function(i, el){
  		new Awesomplete(el, {
  			list: RF_SP2State.stateObj.smithSXCategories,
  			minChars: 1,
  			maxItems: 12,
  			autoFirst: true
  		});
  	});
});

$(document).on("click", "#upflag_comfirm", function(){
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(!_.isNil(id)){
		var X1 = Number($(".upflag_X1").val());
		var X2 = Number($(".upflag_X2").val());
		var Y0 = Number($(".upflag_Y0").val());
		var chartsObj = $("#"+id).highcharts();
		var xCategories = chartsObj.xAxis[0].categories;
		var series = chartsObj.series;
		var inde1 = _.indexOf(xCategories, X1);
		var inde2 = _.indexOf(xCategories, X2);
		_.forEach(series, function(v, i){
			var data = v.yData;
			var flag = false;
			_.forEach(data, function(vv, ii){
				if(inde1<= ii && ii <= inde2){
					if(vv > Y0){
						flag = true;
						return false;
					}
				}
			});
			var icolor = "#00ff00";
			if(flag){
				icolor = "#ff0000";
			}
			chartsObj.series[i].update({
				color: icolor,
			});
			chartsObj.xAxis[0].removePlotLine('plot-line-4');
			chartsObj.xAxis[0].removePlotLine('plot-line-5');
			chartsObj.yAxis[0].removePlotLine('plot-line-6');
			chartsObj.xAxis[0].addPlotLine({           //在x轴上增加
			    value: inde1,                           //在值为2的地方
			    width: 2,                           //标示线的宽度为2px
			    color: '#00aeef',                  //标示线的颜色
			    id: 'plot-line-4',                //标示线的id，在删除该标示线的时候需要该id标示
			    dashStyle: "Dot"
			});
			chartsObj.xAxis[0].addPlotLine({           //在x轴上增加
			    value: inde2,                           //在值为2的地方
			    width: 2,                           //标示线的宽度为2px
			    color: '#00aeef',                  //标示线的颜色
			    id: 'plot-line-5',                //标示线的id，在删除该标示线的时候需要该id标示
			    dashStyle: "Dot"
			});
			chartsObj.yAxis[0].addPlotLine({           //在x轴上增加
			    value: Y0,                           //在值为2的地方
			    width: 2,                           //标示线的宽度为2px
			    color: 'rgb(0, 176, 255)',                  //标示线的颜色
			    id: 'plot-line-6',                //标示线的id，在删除该标示线的时候需要该id标示
			    dashStyle: "Dash"
			});
		});
	}
}).on("click", "#lowflag_comfirm", function(){
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(!_.isNil(id)){
		var X1 = Number($(".lowflag_X1").val());
		var X2 = Number($(".lowflag_X2").val());
		var Y0 = Number($(".lowflag_Y0").val());
		var chartsObj = $("#"+id).highcharts();
		var xCategories = chartsObj.xAxis[0].categories;
		var series = chartsObj.series;
		var inde1 = _.indexOf(xCategories, X1);
		var inde2 = _.indexOf(xCategories, X2);
		_.forEach(series, function(v, i){
			var data = v.yData;
			var flag = false;
			_.forEach(data, function(vv, ii){
				if(inde1<= ii && ii <= inde2){
					if(vv < Y0){
						flag = true;
						return false;
					}
				}
			});
			var icolor = "#00ff00";
			if(flag){
				icolor = "#ff0000";
			}
			chartsObj.series[i].update({
				color: icolor,
			});
		});
		chartsObj.xAxis[0].removePlotLine('plot-line-4');
		chartsObj.xAxis[0].removePlotLine('plot-line-5');
		chartsObj.yAxis[0].removePlotLine('plot-line-6');
		chartsObj.xAxis[0].addPlotLine({           //在x轴上增加
		    value: inde1,                           //在值为2的地方
		    width: 2,                           //标示线的宽度为2px
		    color: '#00aeef',                  //标示线的颜色
		    id: 'plot-line-4',                //标示线的id，在删除该标示线的时候需要该id标示
		    dashStyle: "Dot"
		});
		chartsObj.xAxis[0].addPlotLine({           //在x轴上增加
		    value: inde2,                           //在值为2的地方
		    width: 2,                           //标示线的宽度为2px
		    color: '#00aeef',                  //标示线的颜色
		    id: 'plot-line-5',                //标示线的id，在删除该标示线的时候需要该id标示
		    dashStyle: "Dot"
		});
		chartsObj.yAxis[0].addPlotLine({           //在x轴上增加
		    value: Y0,                           //在值为2的地方
		    width: 2,                           //标示线的宽度为2px
		    color: 'rgb(0, 176, 255)',                  //标示线的颜色
		    id: 'plot-line-6',                //标示线的id，在删除该标示线的时候需要该id标示
		    dashStyle: "Dash"
		});
	}
});
