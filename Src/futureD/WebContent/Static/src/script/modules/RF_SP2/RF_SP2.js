/*variable defined*/
/*_.find(Highcharts.charts, function(v){if(!_.isNil(v)) return v.renderTo == $("div#S12_chart_S")[0];});
_.find(Highcharts.charts, function(v){if(!_.isNil(v)) return $(v.renderTo).is("div#S12_chart_S");});*/
var RF_SP2SwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var S_factorial = eouluGlobal.S_factorial;

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
	smithSXCategories: [],
	S12: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	S21: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	indicatrix_min_max: [],
	indicatrix_state_arr: [],
	indicatrix_copy: {
		low: [],
		up: [],
		delFlag: false,
		submitFlag: false
	},
	S2PCanRenderChart: true
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
		"reg": /log\(\d+\)\(\d+\)/g,
		"reg1": /log\((\d+)\)\((\d+)\)/,
		"fun": "match",
		"index": [1, 2]
	},
	"!": {
		"replace": "S_factorial(##1)",
		"reg": /\(\d+\)\!/g,
		"reg1": /\((\d+)\)(?=\!)/,
		"fun": "match",
		"index": 1
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
		"reg": /\(\d+\)\^\(\d+\)/,
		"reg1": /\((\d+)\)\^\((\d+)\)/,
		"fun": "match",
		"index": [1, 2]
	},
	"√": {
		"replace": "Math.sqrt(##1)",
		"reg": /√\(\d+\)/g,
		"reg1": /√\((\d+)\)/,
		"fun": "match",
		"index": 1
	},
	"°": {
		"replace": "*Math.PI/180",
		"reg": null,
		"reg1": null,
		"fun": null,
		"index": -1
	}
};
RF_SP2State.allowKeyCode = [8, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 77, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 190];
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
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 180);
	$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 190);
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
	/*var curveTypeArr = _.find(RF_SP2State.mock.curveType, function(o, k){
		return k == item.curveType;
	});*/
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
		/*if(!_.isEmpty(curveTypeArr) && !_.isNil(curveTypeArr)){
			curveTypeArr.map(function(v, i){
				var activeFlag2 = "";
				if(inde - i == 2) activeFlag2 = "active";
				str+='<li class="'+activeFlag2+'" data-targetclass="g_bodyin_bodyin_bottom_2">'+v+'</li>';
			});
		}*/
		str+='<li data-targetclass="add"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>';
	}
	$(".g_bodyin_bodyin_top_wrap_m_in>ul").empty().append(str);
}

/*MarkerReplace*/
function markerJoinCalc(str){
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
	return str;
}
function markerMathCalc(str){
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
	return str;
}

/*判断线段有交点*/
function judgeLineSegmentIntersect(x1, x2, indicatrix){
	var flag = false;
	if(_.isEmpty(indicatrix)){
		flag = false;
	}else{
		_.forEach(indicatrix, function(v, i){
			if((v[0]<=x1 && x1<=v[1]) || (v[0]<=x2 && x2<=v[1]) || (x1<=v[0] && v[0]<=x2) || (x1<=v[1] && v[1]<=x2)){
				flag = true;
			}
			if(v[0] == x1 && v[1] == x2){
				flag = true;
			}
			if(flag) return false;
		});
	}
	return flag;
}

/*史密斯图S12 S21绘制图形*/
function drawSmithS12S21(obj){
	var iclassify = obj.iclassify;
	var itargetchart = obj.itargetchart;
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
		RF_SP2State.stateObj.indicatrix_min_max[0] = _.min([RF_SP2State.stateObj.indicatrix_min_max[0], _.min(objec.series[ii].data)]);
		RF_SP2State.stateObj.indicatrix_min_max[1] = _.max([RF_SP2State.stateObj.indicatrix_min_max[1], _.max(objec.series[ii].data)]);
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
			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
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

	/*保存Marker后的动作*/
	var saveMarkerFlag = store.get("futureD__RF_SP2__saveMarkerFlag");
	if(saveMarkerFlag == "hasSave"){
		$(".g_bodyin_bodyin_top_wrap_m_in li[data-targetclass='g_bodyin_bodyin_bottom_2']").trigger("click");
		store.remove("futureD__RF_SP2__saveMarkerFlag");
	}
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
			if(_.isNil(v.x)) v.x = NaN;
		});
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

	/*计算参数回显*/
	var tableStr = store.get("futureD__RF_SP2__paramCalc_tableStr");
	$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").html(tableStr);
	$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").append('<tr class="canCalc"><td></td><td></td><td></td></tr>');
	$(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").each(function(){
		var str = $(this).children("td:eq(2)").text().trim();
		if(_.isEmpty(str)) return true;
		str = markerJoinCalc(str);
		str = markerMathCalc(str);
		var iVal = eval(str);
		if(_.isNaN(iVal)){
			/*RF_SP2SwalMixin({
				title: "公式提示",
				text: "公式有误",
				type: "error",
				timer: 2000
			});*/
			$(this).children("td:eq(1)").text("9E+37");
		}else{
			$(this).children("td:eq(1)").text(iVal.toFixed(2));
		}
	});

	/*自动填充*/
	RF_SP2State.search_markerObj.awesomplete = new Awesomplete(document.getElementById("clac_textarea"), {
		list: RF_SP2State.search_markerObj.list,
		minChars: 1,
		maxItems: 10,
		autoFirst: true,
		filter: function (text, input) {
			var cp = eouluGlobal.S_getCaretPosition($("#clac_textarea")[0]);
			if(input.substring(cp-1, cp) == "M"){
				return true;
			}else{
				return false;
			}
			// return text.indexOf(input) === 0;
		},
		replace: function(value) {
			var cp = eouluGlobal.S_getCaretPosition($("#clac_textarea")[0]);
			var s = this.input.value.substring(0, cp - 1) + value.value + this.input.value.substring(cp, this.input.value.length);
			$("#clac_textarea").val(s);
			eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], cp + value.value.length - 1);
		}
	});

	/*计算器里参数自动填充*/
	/* awesomplete */
	var comboplete = new Awesomplete('#calc_text', {
	    minChars: 0,
	    list: ["TCF_L", "TCF_R", "TCF"]
	});
	$('.subAddParam_body button.awesomplete_btn').click(function(){
	    if (comboplete.ul.childNodes.length === 0) {
	        comboplete.minChars = 0;
	        comboplete.evaluate();
	    }
	    else if (comboplete.ul.hasAttribute('hidden')) {
	        comboplete.open();
	    }
	    else {
	        comboplete.close();
	    }
	});
});

/*event handler*/
$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

/*S2P分页左侧切换*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_itemin_subin", function(){
	$(this).toggleClass("selected");
	var item = $(this).parent().data("parentfile") +" "+$(this).text();
	$(this).hasClass("selected") ? RF_SP2State.waferSelected.push(item) : _.pull(RF_SP2State.waferSelected, item);
	if(RF_SP2State.stateObj.S2PCanRenderChart){
		/*可以画图*/
		/*RF_SP2State.mock.RF_SP2[i];*/
		var inewData = [];
		$("#picture2top").highcharts().addSeries({
			data: inewData
		});
	}
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
				$(".g_info .glyphicon-question-sign").hide();
				/*判断重新渲染按钮*/
				if(RF_SP2State.waferTCFSelected.length == 2){
					$(".reRenderBtnDiv").css({
						"left": (310)+"px",
						"top": (180)+"px"
					}).slideDown(200);
				}else{
					$(".reRenderBtnDiv").css({
						"left": (310)+"px",
						"top": (180)+"px"
					}).slideUp(200);
				}
				/*判断重新渲染按钮end*/
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
								if(!_.isNil(v.isNew)){
									var iii = _.indexOf(RF_SP2State.waferTCFSelected, v.name);
									chart.series[iii].data[_.indexOf(chart.xAxis[0].categories, v.x)].select(true, true);
								}
							});
						}
					});
					RF_SP2State.stateObj.renderSelectCsvSub = true;
				}
				/*判断结束*/
			}else{
				$(".reRenderBtnDiv").hide();
				$(".g_info .glyphicon-question-sign").show();
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
	$("#calc_text").val($(this).children("td:eq(0)").text());
	$("#clac_textarea").val($(this).children("td:eq(2)").text());
	RF_SP2State.stateObj.calcTableIndex = $(this).index();
}).on("click", ".subAddParam_tit>span, .subAddParam_footin>.btn-warning", function(){
	$(".RF_SP2_cover, .subAddParam").slideUp(200);
}).on("click", ".subAddParam_footin>.btn-primary", function(){
	if(_.isEmpty($("#calc_text").val().trim())){
		RF_SP2SwalMixin({
			title: "公式提示",
			text: "参数必填",
			type: "error",
			timer: 2000
		});
		return false;
	}
	var str = $("#clac_textarea").val();
	if(str == "" || str.trim() == "") return false;
	str = markerJoinCalc(str);
	str = markerMathCalc(str);
	try{
		var iVal = eval(str);
		var tr = $(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").eq(RF_SP2State.stateObj.calcTableIndex);
		if(_.isNaN(iVal)){
			/*RF_SP2SwalMixin({
				title: "公式提示",
				text: "公式有误",
				type: "error",
				timer: 2000
			});*/
			tr.children().eq(1).text("9E+37");
		}else{
			tr.children().eq(1).text(iVal.toFixed(2));
		}
		tr.children().eq(0).text($("#calc_text").val());
		tr.children().eq(2).text($("#clac_textarea").val());
		var noEmptyLen = 0;
		$(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").each(function(){
			var iiiflag = false;
			$(this).children("td").each(function(){
				if($(this).text() != ""){
					iiiflag = true;
					return false;
				}
			});
			if(iiiflag){
				noEmptyLen++ ;
			}
		});
		store.set("futureD__RF_SP2__paramCalc_tableStr", $(".g_bodyin_bodyin_bottom_lsub_bottom tbody").html());
		if(noEmptyLen == $(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").length) {
			$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").append('<tr class="canCalc"><td></td><td></td><td></td></tr>');
		}
		$(".subAddParam_footin>.btn-warning").trigger("click");
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
		var k = $(this).data("ivalue");
		var cp = eouluGlobal.S_getCaretPosition($("#clac_textarea")[0]);
		if(k != "Number" && k != "退格"){
			var s = t.substring(0,cp) + k + t.substring(cp, t.length);
			$("#clac_textarea").val(s);
			var correctPos = Number($(this).data("ipos"));
			eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], cp + k.toString().length + correctPos);
		}else if(k == "Number"){
			$(".row.toggleRow").slideToggle(150);
			eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], cp);
		}else if(k == "退格"){
			var ss = $("#clac_textarea").val().substring(0, cp - 1) + $("#clac_textarea").val().substring(cp, $("#clac_textarea").val().length);
			$("#clac_textarea").val(ss);
			eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], cp - 1);
		}
	}
});

$("#clac_textarea").on("keydown", function(e){
	var i = e.keyCode || e.which || e.charCode;
	if(_.indexOf(RF_SP2State.allowKeyCode, i) == -1) return false;
}).on("input propertychange change", function(){
	var old = $(this).val();
	old = old.replace(/[\u4e00-\u9fa5]+/g, "");
	$("#clac_textarea").val(old);
	eouluGlobal.S_setCaretPosition($("#clac_textarea")[0], eouluGlobal.S_getCaretPosition($("#clac_textarea")[0]));
});

/*显示marker设置*/
$(".g_bodyin_bodyin_bottom_rsubin_tit>button").on({
	click: function(){
		var $next = $(this).next();
		$next.toggleClass("clicked");
		if($next.hasClass("clicked")){
			$next.slideDown(600);
			$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 关闭Marker设置');
		}else{
			$next.slideUp(600);
			$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 打开Marker设置');
		}
	},
	mouseover: function(){
		var $next = $(this).next();
		if($next.hasClass("clicked")) return false;
		$next.addClass("clicked").slideDown(600);
		$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 关闭Marker设置');
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
		timer: 1000,
		showConfirmButton: false
	}).then(function(re){
		if(re.dismiss == "timer"){
			RF_SP2State.stateObj.key_y = false;
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
			});
			RF_SP2State.stateObj.renderSelectCsvSub = true;
		}
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
		timer: 1200,
		showConfirmButton: false
	}).then(function(result){
		/*console.log(result.dismiss); // timer
		console.log(swal.DismissReason.cancel); // cancel*/
		/*直接点遮罩层*/
		/*console.log(result.dismiss) // overlay
		console.log(swal.DismissReason.cancel) // cancel
		console.log(result.dismiss == "timer") // false
		console.log(result.dismiss == swal.DismissReason.cancel) // false*/
		/*console.log(swal.DismissReason.backdrop) // overlay
		console.log(swal.DismissReason.esc) // esc
		console.log(swal.DismissReason.timer) // timer*/
		if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
			store.set("futureD__RF_SP2__saveMarkerFlag", "hasSave");
			window.location.reload();
		}
	});
});

/*marker搜索*/
$(document).on("click", "div.awesomplete ul[role='listbox']>li", function(){
	// alert($(this).text())
	/*$("#clac_textarea").val($("#clac_textarea").val()+$("#search_marker").val().trim());*/
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
					drawSmithS12S21({
						iclassify: iclassify,
						itargetchart: itargetchart
					});
					$(".signalChart_div_tit>button:not(.backover)").prop("disabled", false);
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
					$(".signalChart_div_tit>button:not(.backover)").prop("disabled", true);
				}
			});
		});
	});
});

/*后退*/
$(".signalChart_div_tit>button.backover").click(function(){
	$(".signalChart_div").fadeOut(200, function(){
		$(".fourChart_div").fadeIn(200);
	});
});

/*指标线 2018/11/07*/
/*显示区间表格*/
$(".signalChart_div_tit>.open_del_indicatrix").click(function(){
	$(".RF_SP2_cover, .indicatrix_div").slideDown(200);
	/*if(RF_SP2State.stateObj.indicatrix_copy.delFlag && !RF_SP2State.stateObj.indicatrix_copy.submitFlag){
		var str1 = '';
		_.forEach(RF_SP2State.stateObj.indicatrix_copy.low, function(v, i){
			str1+='<tr><td>'+v[0]+'</td><td>'+v[1]+'</td><td>'+v[2]+'</td><td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
		});
		$("#lowflag_table>tbody").empty().append(str1);
		var str2 = '';
		_.forEach(RF_SP2State.stateObj.indicatrix_copy.up, function(v, i){
			str2+='<tr><td>'+v[0]+'</td><td>'+v[1]+'</td><td>'+v[2]+'</td><td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
		});
		$("#upflag_table>tbody").empty().append(str2);
	}*/
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	var strup = '', strlow = '';
	_.forEach(RF_SP2State.stateObj[iclassify].indicatrix_up, function(v, i){
		strup+=
		'<tr><td><input type="text" class="form-control AwesompleteX input_X1" value="'+v[0]+'"></td><td><input type="text" class="form-control AwesompleteX input_X2" value="'+v[1]+'"></td><td><input type="text" class="form-control input_Y0" value="'+v[2]+'"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
	});
	_.forEach(RF_SP2State.stateObj[iclassify].indicatrix_low, function(v, i){
		strlow+=
		'<tr><td><input type="text" class="form-control AwesompleteX input_X1" value="'+v[0]+'"></td><td><input type="text" class="form-control AwesompleteX input_X2" value="'+v[1]+'"></td><td><input type="text" class="form-control input_Y0" value="'+v[2]+'"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
	});
	RF_SP2State.stateObj[iclassify].indicatrix_up.length = 0;
	RF_SP2State.stateObj[iclassify].indicatrix_low.length = 0;
	$(".indicatrix_body #upflag_table tbody").empty().append(strup).find(".glyphicon-ok").trigger("click");
	$(".indicatrix_body #lowflag_table tbody").empty().append(strlow).find(".glyphicon-ok").trigger("click");
	$(".indicatrix_body tbody").find("input[type='text']").each(function(i, el){
		new Awesomplete(el, {
			list: RF_SP2State.stateObj.smithSXCategories,
			minChars: 1,
			maxItems: 15,
			autoFirst: true
		});
	});
});
$(".indicatrix_tit>span.glyphicon, .indicatrix_footin>.btn-warning").click(function(){
	$(".RF_SP2_cover, .indicatrix_div").slideUp(200);
});

/*应用*/
/*chartsObj.xAxis[0].addPlotLine({ //在x轴上增加
	value: inde2, //在值为2的地方
	width: 2, //标示线的宽度为2px
	color: '#00aeef', //标示线的颜色
	id: 'plot-line-5', //标示线的id，在删除该标示线的时候需要该id标示
	dashStyle: "Dot"
});
chartsObj.yAxis[0].addPlotLine({ //在x轴上增加
	value: Y0, //在值为2的地方
	width: 2, //标示线的宽度为2px
	color: 'rgb(0, 176, 255)', //标示线的颜色
	id: 'plot-line-6', //标示线的id，在删除该标示线的时候需要该id标示
	dashStyle: "Dash"
});*/

/*删除区间*/
/*RF_SP2State.stateObj.indicatrix_copy low up delFlag submitFlag*/
$(document).on("click", "#upflag_table>tbody .glyphicon-remove, #lowflag_table>tbody .glyphicon-remove", function(){
	/*RF_SP2State.stateObj.indicatrix_copy.delFlag = true;
	RF_SP2State.stateObj.indicatrix_copy.submitFlag = false;*/
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	
	if($(this).parent().parent().hasClass("hasOk")){
		var delArr = [];
		$(this).parent().siblings("td").each(function(i){
			if(i<3){
				delArr[i] = parseFloat($(this).find("input[type='text']").val());
			}
		});
		var pullArr;
		if($(this).parents("#lowflag_table").length){
			pullArr = RF_SP2State.stateObj[iclassify].indicatrix_low;
		}else{
			pullArr = RF_SP2State.stateObj[iclassify].indicatrix_up;
		}
		_.pullAt(pullArr, _.findIndex(pullArr, function(v){
			return _.isEqual(v, delArr);
		}));
	}
	/*var legendDom = $(this).parent().parent().parent().parent().prev().children("span");*/
	/*删除DOM*/
	$(this).parent().parent().remove();
	/*判断是否可以应用*/
	var uphasOk = $("#upflag_table tbody tr.hasOk").length;
	var lowhasOk = $("#lowflag_table tbody tr.hasOk").length;
	var upTr = $("#upflag_table tbody tr").length;
	var lowTr = $("#lowflag_table tbody tr").length;
	if(uphasOk === 0 && lowhasOk === 0){
		drawSmithS12S21({
			iclassify: iclassify,
			itargetchart: id
		});
		$(".indicatrix_footin>.btn-success").prop("disabled", true);
	}else{
		$(".indicatrix_footin>.btn-success").prop("disabled", false);
	}
	var uplegend = $("#upflag_table").prev().children("span");
	var lowlegend = $("#lowflag_table").prev().children("span");
	
	if(upTr === 0 || upTr === uphasOk){
		uplegend.fadeIn(100);
	}else{
		uplegend.fadeOut(100);
	}
	if(lowTr === 0 || lowTr === lowhasOk){
		lowlegend.fadeIn(100);
	}else{
		lowlegend.fadeOut(100);
	}
});

/*确定并应用*/
$(".indicatrix_footin>.btn-success").click(function(){
	/*图表对象*/
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	if(!_.isNil(id)){
		RF_SP2State.stateObj.indicatrix_state_arr = [];
		var curChartObj = _.find(Highcharts.charts, function(v) {
			if (!_.isNil(v)) return $(v.renderTo).is("div#" + id);
		});
		var series = curChartObj.series;
		var remove = 0;
		var removeArr = [];
		/*初始化线段都是绿色*/
		_.forEach(series, function(v, i){
			if(_.includes(v.name, "低于指标#")) removeArr.push(i);
			series[i].update({
				color: "#00FF00"
			});
		});
		_.forEach(series, function(v, i){
			if(_.includes(v.name, "高于指标#")) removeArr.push(i);
		});
		_.forEach(removeArr, function(v, i){
			series[v-remove].remove();
			remove++;
		});
		/*删除原来的线段结束*/
		var xCategories = curChartObj.xAxis[0].categories;
		var diff = (RF_SP2State.stateObj.indicatrix_min_max[1] - RF_SP2State.stateObj.indicatrix_min_max[0])/40;
		/*判断低于区间*/
		_.forEach(RF_SP2State.stateObj[iclassify].indicatrix_low, function(v, i){
			var data = [];
			var inde1 = _.indexOf(xCategories, v[0]);
			var inde2 = _.indexOf(xCategories, v[1]);
			data.push([inde1, v[2]-diff]);
			data.push([inde1, v[2]]);
			data.push([inde2, v[2]]);
			data.push([inde2, v[2]-diff]);
			curChartObj.addSeries({
				name: "低于指标#"+i,
				data: data,
				showInLegend: false,
				enableMouseTracking: true,
				dataLabels: {
					enabled: true,
					formatter: function(){
						// if(this.y != v[2]){
						// 	return "";
						// }else{
						// 	return this.x;
						// }
						return this.x;
					}
				},
				color: "#000",
				tooltip: {
					headerFormat: false,
					pointFormat: false,
					footerFormat: false
				},
				events: {
					mouseOver: function(){
						/*console.log(this); // series对象*/
						var curSeriesArr = _.find(RF_SP2State.stateObj.indicatrix_state_arr, (function(v, i){
							return this.name == v.name;
						}).bind(this));
						_.forEach(curSeriesArr.seriesName, function(v, i){
							var aa = _.find(series, function(vv, ii){
								return vv.name == v;
							});
							aa.update({
								lineWidth: 4,
							});
							aa.select(true);
						});
					},
					mouseOut: function(){
						var curSeriesArr = _.find(RF_SP2State.stateObj.indicatrix_state_arr, (function(v, i){
							return this.name == v.name;
						}).bind(this));
						_.forEach(curSeriesArr.seriesName, function(v, i){
							var aa = _.find(series, function(vv, ii){
								return vv.name == v;
							});
							aa.update({
								lineWidth: 2,
							});
							aa.select(false);
						});
					}
				},
				point: {
					events: {
						mouseOver: undefined
					}
				}
			});
			/*增加低于区间线段结束*/
			/*判断是否符合规则*/
			var iArr = [];
			_.forEach(series, function(vv, ii){
				if(_.includes(vv.name, "低于指标#")) return true;
				if(_.includes(vv.name, "高于指标#")) return true;
				var data = vv.yData;
				var flag = false;
				_.forEach(data, function(vvv, iii){
					if(inde1<= iii && iii <= inde2){
						if(vvv > v[2]){
							flag = true;
							return false;
						}
					}
				});
				if(flag){
					iArr.push(series[ii].name);
					if(series[ii].color!="#FF0000" && series[ii].color!="#ff0000"){
						series[ii].update({
							color: "#FF0000",
						});
					}
				}
			});
			RF_SP2State.stateObj.indicatrix_state_arr.push({
				name: "低于指标#"+i,
				seriesName: iArr
			});
		});
		/*判断低于区间end*/
		/*判断高于区间*/
		_.forEach(RF_SP2State.stateObj[iclassify].indicatrix_up, function(v, i){
			var data = [];
			var inde1 = _.indexOf(xCategories, v[0]);
			var inde2 = _.indexOf(xCategories, v[1]);
			data.push([inde1, v[2]+diff]);
			data.push([inde1, v[2]]);
			data.push([inde2, v[2]]);
			data.push([inde2, v[2]+diff]);
			curChartObj.addSeries({
				name: "高于指标#"+i,
				data: data,
				showInLegend: false,
				enableMouseTracking: true,
				dataLabels: {
					enabled: true,
					formatter: function(){
						// if(this.y != v[2]){
						// 	return "";
						// }else{
						// 	return this.x;
						// }
						return this.x;
					}
				},
				color: "#000",
				tooltip: {
					headerFormat: false,
					pointFormat: false,
					footerFormat: false
				},
				events: {
					mouseOver: function(){
						/*console.log(this); // series对象*/
						var curSeriesArr = _.find(RF_SP2State.stateObj.indicatrix_state_arr, (function(v, i){
							return this.name == v.name;
						}).bind(this));
						_.forEach(curSeriesArr.seriesName, function(v, i){
							var aa = _.find(series, function(vv, ii){
								return vv.name == v;
							});
							aa.update({
								lineWidth: 4,
							});
							aa.select(true);
						});
					},
					mouseOut: function(){
						var curSeriesArr = _.find(RF_SP2State.stateObj.indicatrix_state_arr, (function(v, i){
							return this.name == v.name;
						}).bind(this));
						_.forEach(curSeriesArr.seriesName, function(v, i){
							var aa = _.find(series, function(vv, ii){
								return vv.name == v;
							});
							aa.update({
								lineWidth: 2,
							});
							aa.select(false);
						});
					}
				},
				point: {
					events: {
						mouseOver: undefined
					}
				}
			});
			/*增加高于区间线段结束*/
			/*判断是否符合规则*/
			var iArr = [];
			_.forEach(series, function(vv, ii){
				if(_.includes(vv.name, "低于指标#")) return true;
				if(_.includes(vv.name, "高于指标#")) return true;
				var data = vv.yData;
				var flag = false;
				_.forEach(data, function(vvv, iii){
					if(inde1<= iii && iii <= inde2){
						if(vvv < v[2]){
							flag = true;
							return false;
						}
					}
				});
				if(flag){
					iArr.push(series[ii].name);
					if(series[ii].color!="#FF0000" && series[ii].color!="#ff0000"){
						series[ii].update({
							color: "#FF0000",
						});
					}
				}
			});
			RF_SP2State.stateObj.indicatrix_state_arr.push({
				name: "高于指标#"+i,
				seriesName: iArr
			});
		});
		/*线段变色*/
		_.forEach(RF_SP2State.stateObj.indicatrix_state_arr, function(o, ind){
			if(_.isEmpty(o.seriesName)) return true;
			_.find(series, function(oo){
				return oo.name == o.name;
			}).update({
				color: "#FF1493"
			});
		});
	}
	/*RF_SP2State.stateObj.indicatrix_copy.delFlag = false;
	RF_SP2State.stateObj.indicatrix_copy.submitFlag = true;*/
	/*RF_SP2State.stateObj.indicatrix_copy.low = _.cloneDeep(RF_SP2State.stateObj.indicatrix_low);
	RF_SP2State.stateObj.indicatrix_copy.up = _.cloneDeep(RF_SP2State.stateObj.indicatrix_up);*/
	$(".indicatrix_footin>.btn-warning").trigger("click");
});

/*2018-11-12更新*/
$(".indicatrix_body legend>span").click(function(){
	$('<tr><td><input type="text" class="form-control AwesompleteX input_X1"></td><td><input type="text" class="form-control AwesompleteX input_X2"></td><td><input type="text" class="form-control input_Y0"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>').appendTo($(this).parent().next().children("tbody")).find("input.AwesompleteX")
	.each(function(i, el){
		new Awesomplete(el, {
			list: RF_SP2State.stateObj.smithSXCategories,
			minChars: 1,
			maxItems: 15,
			autoFirst: true
		});
	});
	$(this).fadeOut(100);
});

$(document).on("click", ".indicatrix_body tbody span.glyphicon-ok", function(){
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	/*验证*/
	var tr = $(this).parent().parent();
	var input_X1 = tr.find(".input_X1").val().trim();
	var input_X2 = tr.find(".input_X2").val().trim();
	var input_Y0 = tr.find(".input_Y0").val().trim();
	if(_.isEmpty(input_X1) || _.isEmpty(input_X2) || _.isEmpty(input_Y0)) return false;
	var indicatrixArr;
	if($(this).parents().is("#upflag_table")){
		indicatrixArr = RF_SP2State.stateObj[iclassify].indicatrix_up;
		/*indicatrix_copyArr = RF_SP2State.stateObj.indicatrix_copy.up;*/
	}else if($(this).parents().is("#lowflag_table")){
		indicatrixArr = RF_SP2State.stateObj[iclassify].indicatrix_low;
		/*indicatrix_copyArr = RF_SP2State.stateObj.indicatrix_copy.low;*/
	}
	var X1 = Math.min(Number(input_X1), Number(input_X2));
	var X2 = Math.max(Number(input_X1), Number(input_X2));
	var Y0 = Number(input_Y0);
	if(judgeLineSegmentIntersect(X1, X2, _.concat(RF_SP2State.stateObj[iclassify].indicatrix_up, RF_SP2State.stateObj[iclassify].indicatrix_low))){
		RF_SP2SwalMixin({
			title: '选择区间提示',
			text: "区间与已有区间重合，请重选",
			type: 'info',
			showConfirmButton: false,
			timer: 1500,
		});
	}else{
		indicatrixArr.push([X1, X2, Y0]);
		/*indicatrix_copyArr.push([X1, X2, Y0]);*/
		tr.find(".input_Y0").val(Y0);
		$(".indicatrix_footin>.btn-success").prop("disabled", false);
		$(this).fadeOut(100).parent().parent().parent().parent().prev().children("span").fadeIn(100);
		tr.addClass("hasOk").find("input[type='text']").prop("disabled", true);
	}
})
/*Y0验证数字*/
.on("input propertychange change", ".input_Y0", function(){
	/*正数、负数、和小数：^(\-|\+)?\d+(\.\d+)?$*/
	if(_.isNil($(this).val().match(/(\-|\+)?\d*\.?\d*/g))){
		$(this).val("");
	}else{
		$(this).val(_.head($(this).val().match(/(\-|\+)?\d*\.?\d*/g)));
	}
});

/*删除所有区间并重置*/
$(".indicatrix_footin>.btn-danger").click(function(){
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	if(_.isEmpty(_.concat(RF_SP2State.stateObj[iclassify].indicatrix_up, RF_SP2State.stateObj[iclassify].indicatrix_low))) return false;
	$(".indicatrix_footin>.btn-warning").trigger("click");
	$("#upflag_table>tbody, #lowflag_table>tbody").empty();
	RF_SP2State.stateObj[iclassify].indicatrix_up.length = 0;
	RF_SP2State.stateObj[iclassify].indicatrix_low.length = 0;
	$(".indicatrix_footin>.btn-success").prop("disabled", true);
	$(".indicatrix_body legend>span").fadeIn(100);
	drawSmithS12S21({
		iclassify: iclassify,
		itargetchart: id
	});
});