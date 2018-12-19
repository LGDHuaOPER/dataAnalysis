/*before load*/
$(".g_bodyin_bodyin_bottom_2, .signalChart_div, .reRenderBtnDiv, .g_bodyin_bodyin_top_wrap_m_in li[data-targetclass='add']").hide();
$(".reRenderBtnDiv, button.backover, button.open_del_indicatrix, .g_bodyin_bodyin_bottom_rsubin_tit>button").css({
	"opacity": 1
});

/*variable defined*/
/*_.find(Highcharts.charts, function(v){if(!_.isNil(v)) return v.renderTo == $("div#S12_chart_S")[0];});
_.find(Highcharts.charts, function(v){if(!_.isNil(v)) return $(v.renderTo).is("div#S12_chart_S");});*/
/*result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer*/
var RF_SP2SwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var S_factorial = eouluGlobal.S_factorial;

var RF_SP2Store = Object.create(null);
RF_SP2Store.waferSelected = [];
RF_SP2Store.waferTCFSelected = {};
RF_SP2Store.contextObj = {
	classify: null,
	flag: null
};
RF_SP2Store.stateObj = {
	renderSelectCsvSub: false,
	calcTableIndex: -1,
	splineSelectedArr: {
		S11: [],
		S12: [],
		S21: [],
		S22: []
	},
	splineSelectedCopyArr: {
		S11: [],
		S12: [],
		S21: [],
		S22: []
	},
	comfirm_key: store.get("futureDT2Online__"+$("body").data("curusername")+"__ProjectAnalysis__comfirm_key") || "请选择",
	key_y: false,
	/*awesomeX坐标备选*/
	smithSXCategories: [],
	/*保存指标线区间*/
	S12: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	S21: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	S11: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	S22: {
		indicatrix_low: [],
		indicatrix_up: [],
	},
	/*指标线的最大最小值*/
	indicatrix_min_max: [],
	indicatrix_state_arr: [],
	indicatrix_copy: {
		low: [],
		up: [],
		delFlag: false,
		submitFlag: false
	},
	/*小图的Smith对象*/
	S2PSmallChartSmithArr: [],
	/*保存的数据*/
	S2PSmallChartSmithData: {
		S11: [],
		S12: [],
		S21: [],
		S22: []
	},
	/*双击小图的标志*/
	dblclickFlag: false,
	// smith小图图表容器加载标志
	smithSmallContainerFlag: {
		S11: false,
		S12: false,
		S21: false,
		S22: false
	},
	// 导航栏
	navCurveType: "RF-S2P",
	// 大图史密斯对象
	S2PBigChartSmithData: {
		S11: {

		},
		S12: {

		},
		S21: {

		},
		S22: {

		}
	},
	// RFSP2选中全部复选框
	RFSP2Checkbox: null,
	// TCF页面S参数
	TCFsParameter: "S11"
};
RF_SP2Store.MathMap = {
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
RF_SP2Store.allowKeyCode = [8, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 77, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 190];
RF_SP2Store.search_markerObj = {
	awesomplete: null,
	list: []
};

RF_SP2Store.util = Object.create(null);
RF_SP2Store.util.renderWaferFile = function(obj){
	var data = obj.data || [],
	waferFile = obj.waferFile,
	waferId = obj.waferId;
	var str = '<div class="panel panel-default slideUp">'+
				  	'<div class="panel-heading" title="点击展开" data-waferid="'+waferId+'" data-waferfile="'+waferFile+'">'+waferFile+'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>'+
				  	'<ul class="list-group">';
	data = _.sortBy(data, function(o) { return o[2]; });
	_.forEach(data, function(v, i){
		str+='<li class="list-group-item" data-waferfile="'+waferFile+'" data-curvefile="'+v[0]+'" data-curvetypeid="'+v[1]+'" data-dieid="'+v[2]+'">'+v[0]+'</li>';
	});
	str+='</ul></div>';
	return str;
};
// 自适应布局
RF_SP2Store.util.eleResize = function(obj){
	obj = obj || {};
	var classify = obj.classify || 1;
	if(classify === 1){
		var winHeight = $(window).height();
		if(winHeight<600){
			winHeight = 600;
		}
		$("body").height(winHeight);
		$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 180);
		$(".g_bodyin_bodyin_bottom_l, .g_bodyin_bodyin_bottom_r").innerHeight(winHeight - 190);
		$("div.picturetop").each(function(){
			if($(this).is("#picture2top") || $(this).is("#picture3top")){
				var radios = 1, minus = 0;
				if(RF_SP2Store.waferSelected.length > 20) {
					radios = 2;
					minus = _.get(eouluGlobal.S_getPageAllConfig(), "futureDT2.scrollBarWidth", 7);
				}
				$(this).innerHeight(~~($(this).parent().height()*radios)-30).innerWidth(~~($(this).parent().width()-minus));
			}else{
				$(this).innerHeight($(this).parent().height() - 30);
			}
		});
		$(".picturebottom_in_m ul>li").innerWidth($(".picturebottom_in_m").innerWidth());
	}else if(classify === 2){
		$(".g_bodyin_bodyin_bottom_lsub, .g_bodyin_bodyin_bottom_rsub").height($(".g_bodyin_bodyin_bottom").height());
		$(".g_bodyin_bodyin_bottom_lsub_top, .g_bodyin_bodyin_bottom_lsub_bottom").innerHeight($(".g_bodyin_bodyin_bottom_lsub").innerHeight() / 2 - 1);
	}
};
RF_SP2Store.util.smithHandler = function(obj){
	var s = obj.s,
	data = obj.data,
	seriesName = obj.seriesName,
	delLi = obj.delLi || false;
	if(_.isEqual(s, "S11") || _.isEqual(s, "S22")){
		if(delLi === false){
			setTimeout(function(){
				var lineColorArray = [],
				smithData = [];
				/*保存数据*/
				var addColor = _.find($("#picture2top").highcharts().series, function(o){
						return o.name == seriesName;
					}).color;
				RF_SP2Store.stateObj.S2PSmallChartSmithData[s].push({
					name: seriesName,
					data: _.cloneDeep(data),
					color: addColor
				});

				_.forEach(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], function(v){
					smithData.push(_.cloneDeep(v.data));
					lineColorArray.push(v.color);
				});
				var sClassify;
				if(_.isEqual(s, "S11")){
					sClassify = "1";
				}else{
					sClassify = "4";
				}
				getDataBuildS11S22({
					wrapDOM: document.getElementById("picture"+sClassify+"top"),
					title: [''],
					legendName: [s],
					data: smithData,
					classify: s,
					msgDOM: document.getElementById("picture"+sClassify+"bottom"),
					lineColorArray: lineColorArray,
					msgInitFun: _.bind(msgInitFun, this, _, s, sClassify, seriesName),
					msgFun: _.bind(imsgFun, this, _, _, s, sClassify),
					GHzFlag: true,
					callback: function(smith1){
						if(RF_SP2Store.stateObj.S2PSmallChartSmithArr.length >= 2) RF_SP2Store.stateObj.S2PSmallChartSmithArr.length = 0;
						RF_SP2Store.stateObj.S2PSmallChartSmithArr.push(smith1);
					}
				});
			}, 10);
		}else if(delLi === true){
			/*删除数据*/
			_.pullAt(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], _.findIndex(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], function(vv){
				return vv.name == seriesName;
			}));
			var lineColorArray2 = [],
			sClassify3,
			delSmithData = [];
			if(_.isEqual(s, "S11")){
				sClassify3 = "1";
			}else{
				sClassify3 = "4";
			}
			_.forEach(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], function(v){
				delSmithData.push(_.cloneDeep(v.data));
				lineColorArray2.push(v.color);
			});
			getDataBuildS11S22({
				wrapDOM: document.getElementById("picture"+sClassify3+"top"),
				title: [''],
				legendName: [s],
				data: delSmithData,
				classify: s,
				msgDOM: document.getElementById("picture"+sClassify3+"bottom"),
				lineColorArray: lineColorArray2,
				msgInitFun: _.bind(msgInitFun, this, _, s, sClassify3, false),
				msgFun: _.bind(imsgFun, this, _, _, s, sClassify3),
				GHzFlag: true,
				callback: function(smith1){
					if(RF_SP2Store.stateObj.S2PSmallChartSmithArr.length >= 2) RF_SP2Store.stateObj.S2PSmallChartSmithArr.length = 0;
					RF_SP2Store.stateObj.S2PSmallChartSmithArr.push(smith1);
				}
			});
		}
	}else if(_.isEqual(s, "S12") || _.isEqual(s, "S21")){
		var sClassify2;
		if(_.isEqual(s, "S12")){
			sClassify2 = "2";
		}else{
			sClassify2 = "3";
		}
		if(delLi === false){
			var messag = "(" + data[0][1].toFixed(2) + " dB," + data[0][0].toFixed(2) + " GHz)";
			if(RF_SP2Store.stateObj.smithSmallContainerFlag[s] === false){
				getDataBuildS12S21({
					allData: [{
						name: seriesName,
						data: data
					}],
					renderData: true,
					container: "picture"+sClassify2+"top",
					zoomType: "None",
					showCheckbox: false,
					title: {
						text: s,
						floating: true,
						align: 'right',
						x: -10,
						y: 10
					},
					legend_enabled: false,
					GHzFlag: true, 
					callback: function(){
						RF_SP2Store.stateObj.smithSmallContainerFlag[s] = true;
						setTimeout(function() {
							// 生成图例
							msgInitFun(messag, s, sClassify2, false);
						}, 10);
					},
					pointMouseOverCallback: function(point, chart, ev){
						var icategories = chart.xAxis[0].categories;
						var str = "("+point.y+" dB,"+icategories[point.x]+" GHz)";
						$("#picture"+sClassify2+"bottom .picturebottom_in_m_in ul>li[data-iparamter='"+point.series.name+"']").addClass("active").siblings().removeClass("active");
						$("#picture"+sClassify2+"bottom .picturebottom_in_m_in ul>li.active").find(".Smith_Msg2").text(str);
					}
				});
			}else{
				var inewData = [];
				_.forEach(data, function(v, i){
					inewData.push(parseFloat(v[1]));
				});
				$("#picture"+sClassify2+"top").highcharts().addSeries({
					name: seriesName,
					data: inewData,
					showInLegend: true,
					enableMouseTracking: true,
					events: {
						mouseOver: function(){
							/*console.log(this); // series对象*/
						},
					},
					// point: {
					// 	events: {
					// 		mouseOver: function(){

					// 		}
					// 	}
					// }
				});
				setTimeout(function() {
					// 生成图例
					msgInitFun(messag, s, sClassify2, seriesName);
				}, 10);
			}
			/*保存数据*/
			var addColor2 = _.find($("#picture"+sClassify2+"top").highcharts().series, function(o){
					return o.name == seriesName;
				}).color;
			RF_SP2Store.stateObj.S2PSmallChartSmithData[s].push({
				name: seriesName,
				data: _.cloneDeep(data),
				color: addColor2
			});
		}else if(delLi === true){
			var itemChart = _.find($("#picture"+sClassify2+"top").highcharts().series, function(o){
				return o.name == seriesName;
			});
			(!_.isNil(itemChart)) && itemChart.remove();
			/*删除数据*/
			_.pullAt(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], _.findIndex(RF_SP2Store.stateObj.S2PSmallChartSmithData[s], function(vv){
				return vv.name == seriesName;
			}));
		}
	}
};
RF_SP2Store.util.linkage = function(obj){
	var classify = obj.classify || 1, // 全选联动标志
	jQDOM = obj.jQDOM,
	TCFflag = obj.TCFflag || false;
	if(jQDOM.children(".list-group-item-info").length>0){
		jQDOM.parent().removeClass("panel-default").addClass("panel-success");
	}else{
		jQDOM.parent().removeClass("panel-success").addClass("panel-default");
	}
	if(TCFflag === true){

	}else if(TCFflag === false){
		if(classify === 1){
			/*全选联动*/
			$(".g_bodyin_bodyin_bottom_l_inbottom>input").prop("checked", $(".g_bodyin_bodyin_bottom_l_intop li.list-group-item").length === $(".g_bodyin_bodyin_bottom_l_intop li.list-group-item.list-group-item-info").length);
		}else if(classify === 2){
		}
	}
};
RF_SP2Store.util.renderNav = function(obj){
	var str = '';
	var item = obj.item == "RF-S2P" ? "S2P" : obj.item, 
	type = obj.type, 
	inde = obj.index;
	if(type == "g_bodyin_bodyin_bottom_1"){
		str+='<li class="active" data-targetclass="g_bodyin_bodyin_bottom_1">'+item+'</li><li data-targetclass="g_bodyin_bodyin_bottom_2">TCF</li>';
	}else if(type == "g_bodyin_bodyin_bottom_2"){
		str+='<li data-targetclass="g_bodyin_bodyin_bottom_1">返回'+item+'</li>';
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
};
// 切换后处理
RF_SP2Store.util.graphStyleHandler = function(obj){
	var graphStyle = obj.graphStyle,
	iclassify = obj.iclassify,
	itargetchart = obj.itargetchart,
	contextFlag = obj.contextFlag,
	callback = obj.callback;
	if(graphStyle == "XYOfPhase" || graphStyle == "XYOfMagnitude"){
		$(".signalChart_div_foot").fadeOut(10);
		var jdata = RF_SP2Store.stateObj.S2PBigChartSmithData[iclassify][graphStyle];
		var iseries = _.map(jdata, function(v, i){
			var item = {};
			item.name = v.name;
			item.color = v.color;
			item.data = _.zip.apply(undefined, v.data)[1];
			return item;
		}),
		xCategories;
		if(_.isNil(iseries[0])){
			xCategories = [];
		}else{
			RF_SP2Store.util.min_maxHandler({
				series: _.cloneDeep(jdata)
			});
			xCategories = _.zip.apply(undefined, jdata[0].data)[0];
		}
		RF_SP2Store.util.graphStyleDraw({
			graphStyle: graphStyle,
			sParameter: iclassify,
			container: itargetchart,
			series: iseries,
			xCategories: xCategories,
			callback: callback
		});
	}else if(graphStyle == "Polar"){
		$(".signalChart_div_foot").fadeIn(10);
		var PolarSeries = [],
		data = RF_SP2Store.stateObj.S2PBigChartSmithData[iclassify][graphStyle];
		// 频率、半径、角度、实部、虚部
		_.forEach(data, function(v, i){
			var item = {};
			item.name = v.name;
			item.color = v.color;
			item.data = [];
			_.forEach(v.data, function(vv, ii){
				var x, x1;
				if(vv[2] < 0){
					x = vv[2] + 360;
				}else{
					x = vv[2];
				}
				if(x<=90){
					x1 = x - 90 + 360;
				}else{
					x1 = x - 90;
				}
				item.data.push([x1, vv[1]]);
			});
			PolarSeries.push(item);
		});
		RF_SP2Store.util.graphStyleDraw({
			graphStyle: graphStyle,
			sParameter: iclassify,
			container: itargetchart,
			data: _.cloneDeep(data),
			series: PolarSeries,
			callback: callback
		});
	}
};
RF_SP2Store.util.graphStyleDraw = function(obj){
	var container = obj.container,
	graphStyle = obj.graphStyle,
	sParameter = obj.sParameter,
	xCategories = obj.xCategories,
	series = obj.series,
	callback = obj.callback;
	var chart;
	if(graphStyle == "XYOfPhase" || graphStyle == "XYOfMagnitude"){
		chart = Highcharts.chart(container, {
			chart: {
				type: 'line',
				zoomType: 'x',
				resetZoomButton: {
					position: {
						align: 'left', // by default
						// verticalAlign: 'top', // by default
						x: 0,
						y: 0
					},
					relativeTo: 'chart'
				}
			},
			title: {
				text: sParameter+" - "+graphStyle
			},
	        lang: {
	            loading: 'Loading...' //设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
	        },
	        legend: {
				enabled: true
			},
		    xAxis: {
				title: {
					text: "GHz",
				},
				categories : xCategories
			}, 
			yAxis: {
				title: {
					text: _.isEqual(graphStyle, "XYOfPhase") ? "Degrees" : "Magnitude",
				},
			    gridLineColor: '#eee',
			    gridLineWidth: 1
			},
			series: series,
			credits: {
				enabled: false
			},
			tooltip: {
				formatter: function (e) {
					// this 属性
					// color: "#DDA0DD"
					// colorIndex: undefined
					// key: 21.51
					// percentage: undefined
					// point: C {series: e, color: "#DDA0DD", y: 0.05, options: {…}, isNull: false, …}
					// series: e {chart: a.Chart, userOptions: {…}, tooltipOptions: {…}, stickyTracking: true, zoneAxis: undefined, …}
					// total: undefined
					// x: 21.51
					// y: 0.05
					return '<b>'+this.series.name+'</b><br>'+this.x+' GHz, '+this.y+' '+(_.isEqual(graphStyle, "XYOfPhase") ? "Degrees" : "Magnitude");
	            },
	            useHTML: true
				/*headerFormat: '<b>{series.name}</b><br>',
				pointFormat: option.data.xData[0][point.index]+' MHz, {point.y} db'*/
			},
			plotOptions: {
				series: {
					point: {
						events: {
							mouseOver: function (ev) {
								var point = this;
								/*var x = xCategories[this.x] ;
								var y = this.y ;
								var str = y+" dB,"+x+" GHz" ;
								msgDom && msgDom.find(".Smith_Msg2").text(str);*/
								_.isFunction(obj.pointMouseOverCallback) && obj.pointMouseOverCallback(point, chart, ev);
							}
						}
					},
					showCheckbox: true
				}
			},
		});
		RF_SP2Store.stateObj.smithSXCategories = _.cloneDeep(xCategories);
	}else if(graphStyle == "Polar"){
		var origData = obj.data;
		chart = Highcharts.chart(container, {
			chart: {
				polar: true,
				type: "scatter",
				backgroundColor: "#fff"
			},
			credits: {
				enabled: false
			},
			title: {
				text: sParameter+" - "+graphStyle
			},
			pane: {
				startAngle: 0,
				endAngle: 360
			},
			tooltip: {
				backgroundColor: null,
				borderWidth: 0,
				shadow: false,
				useHTML: true,
				style: {
					padding: 0
				},
				formatter: function () {
					var x;
					if(this.x>=270){
						x = this.x+90-360;
					}else{
						x = this.x+90;
					}
					x = _.round(x, 2);
					var str = '<span style="color:'+this.point.color+'">\u25CF</span> '+this.series.name+': <br/>'+
							'角度：<b>'+x+'°</b><br/>半径：<b>'+this.y+'</b><br/>';
					return str;
				}
			},
			xAxis: {
				tickInterval: 45,
				minTickInterval: 45,
				min: 0,
				max: 360,
				labels: {
					formatter: function () {
						var ivalue;
						if(this.value>=270){
							ivalue = this.value+90-360;
						}else{
							ivalue = this.value+90;
						}
						return ivalue + '°';
					}
				},
				tickmarkPlacement: 'on',  
				gridLineColor: '#ccc',
				gridLineWidth: 1,
				gridZIndex: 1,
				lineColor: null,
				lineWidth: 0,
				reversed: true
			},
			yAxis: {
				min: 0,
				lineWidth: 0,
				gridLineColor: "#ccc",
				gridLineWidth: 1,
				gridLineInterpolation: "circle",
				gridZIndex: 1
			},
			plotOptions: {
				series: {
					pointStart: 0,
					pointInterval: 45,
					lineWidth: 0,
					point: {
						events: {
							mouseOver: function(ev){
								// 函数中的 this 代表着 Point 对象。
								var That = this,
								curIndex,
								curSeries = _.find(origData, function(o, i){
									curIndex = i;
									return o.name == That.series.name;
								});
								var _data = curSeries.data[this.index],
								_initdata,
								messag = "(" + _data[3].toFixed(2) + "," + _data[4].toFixed(2) + ")," + (_data[0]).toFixed(2) + "GHz",
								initMess;
								if(origData.length == 1){
									initMess = "( , ), GHz";
								}else{
									if(curIndex == origData.length - 1){
										curIndex = -1;
									}
									_initdata = _.cloneDeep(origData[curIndex+1].data[0]);
									initMess = "(" + _initdata[3].toFixed(2) + "," + _initdata[4].toFixed(2) + ")," + (_initdata[0]).toFixed(2) + "GHz";
								}
								curDOM = $(".signalChart_div_foot_in_m_in ul>li[data-iparamter='"+That.series.name+"']");
								curDOM.siblings().removeClass("active");
								curDOM.addClass("active").next().addClass("active").find(".Smith_Msg2").text(initMess);
								curDOM.find(".Smith_Msg2").text(messag);
							}
						}
					}
				}
			},
			series: series
		});
	}
	_.isFunction(callback) && callback(chart);
	return chart;
};
RF_SP2Store.util.graphStyleDispatch = function(obj){
	var key = obj.graphStyle,
	callback = obj.callback;
	var curvetypeid = [],
	legend = [];
	$(".g_bodyin_bodyin_bottom_l_intop .panel>ul>li.list-group-item-info").each(function(i, el){
		curvetypeid.push($(el).data("curvetypeid"));
		legend.push($(el).data("waferfile")+"  "+$(el).data("curvefile"));
	});
	var dblid = $("[id$=_chart_S]:visible").attr("id"),
	dblclassify = dblid.replace("_chart_S", "");
	if(!_.isEmpty(curvetypeid)){
		RF_SP2SwalMixin({
			title: '信息',
			text: "正在绘图，请勿点击",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false
		});
		
		RF_SP2Store.ajax.AnalysisCurve({
			curveTypeId: curvetypeid,
			legend: legend,
			graphStyle: key,
			sParameter: dblclassify,
			async: false,
			done: function(data){
				if(_.isNil(data) || _.isEmpty(data)){
					eouluGlobal.S_getSwalMixin()({
					 	title: "信息",
					 	text: "所选晶圆无曲线数据！",
					 	html: undefined,
					 	type: "info",
					 	showConfirmButton: false,
						timer: 1900,
					}).then(function(){
					});
				}else{
					RF_SP2Store.stateObj.S2PBigChartSmithData[dblclassify][key] = [];
					_.forOwn(data, function(v, k){
						_.forOwn(v, function(vv, kk){
							// RF_SP2Store.util.smithHandler({
							// 	s: kk,
							// 	data: vv,
							// 	seriesName: k
							// });
							var item = {};
							item.name = k;
							item.data = _.cloneDeep(vv);
							item.color = _.find($("#picture2top").highcharts().series, function(o){
								return o.name == k;
							}).color;
							RF_SP2Store.stateObj.S2PBigChartSmithData[dblclassify][key].push(item);
						});
					});
					switch(key){
						case "Smith":
							// 史密斯圆图
							getDataBuildBigS11S22({
								iclassify: dblclassify,
								itargetchart: dblid,
								contextFlag: true,
								graphStyle: key,
								callback: function(smith1){
									$(".signalChart_div_tit>button:not(.backover)").prop("disabled", true);
								}
							});
						break;

						case "Polar":
							RF_SP2Store.util.graphStyleHandler({
								iclassify: dblclassify,
								itargetchart: dblid,
								contextFlag: true,
								graphStyle: key,
								callback: function(chart) {
									$(".signalChart_div_tit>button:not(.backover)").prop("disabled", true);
									// 生成图例
									buildS11ANDS22Bottom({
										classify: dblclassify,
										bottomJQDOM: $(".signalChart_div_foot .signalChart_div_foot_in_m_in ul"),
										callback: function() {
											$(".signalChart_div_foot_in_m_in ul>li").innerHeight($(".signalChart_div_foot_in_m").innerHeight()).innerWidth($(".signalChart_div_foot_in_m").innerWidth() * 0.5 - 1);
											$(".signalChart_div_foot_in_m_in ul>li:first").addClass("active").next().addClass("active");
										},
										contextFlag: true,
										graphStyle: key
									});
									var _data = _.cloneDeep(RF_SP2Store.stateObj.S2PBigChartSmithData[dblclassify][key][0].data),
										messag = "(" + _data[0][3].toFixed(2) + "," + _data[0][4].toFixed(2) + ")," + (_data[0][0]).toFixed(2) + "GHz";
									$(".signalChart_div_foot_in_m_in ul>li.active").find(".Smith_Msg2").text(messag);
								}
							});
						break;

						case "XYOfPhase":
							RF_SP2Store.util.graphStyleHandler({
								iclassify: dblclassify,
								itargetchart: dblid,
								contextFlag: true,
								graphStyle: key,
								callback: function(chart){
									setTimeout(function(){
										$(".indicatrix_footin>.btn-success").trigger("click");
									}, 50);
									$(".signalChart_div_tit>button:not(.backover)").prop("disabled", false);
								}
							});
						break;

						case "XYOfMagnitude":
							RF_SP2Store.util.graphStyleHandler({
								iclassify: dblclassify,
								itargetchart: dblid,
								contextFlag: true,
								graphStyle: key,
								callback: function(chart){
									setTimeout(function(){
										$(".indicatrix_footin>.btn-success").trigger("click");
									}, 50);
									$(".signalChart_div_tit>button:not(.backover)").prop("disabled", false);
								}
							});
						break;

						case "XYdBOfMagnitude":
							getDataBuildBigS12S21({
								iclassify: dblclassify,
								itargetchart: dblid,
								contextFlag: true,
								graphStyle: key,
								callback: function(){
									setTimeout(function(){
										$(".indicatrix_footin>.btn-success").trigger("click");
									}, 50);
									$(".signalChart_div_tit>button:not(.backover)").prop("disabled", false);
								}
							});
						break;
					}
					swal.close();
				}
			}
		});
	}else{
		RF_SP2Store.stateObj.S2PBigChartSmithData[dblclassify][key] = [];
		$(".signalChart_div_tit>button:not(.backover)").prop("disabled", true);
		var delAllFn;
		switch(key){
			case "Smith":
				// 史密斯圆图
				delAllFn = getDataBuildBigS11S22;
			break;

			case "Polar":
				delAllFn = RF_SP2Store.util.graphStyleHandler;
			break;

			case "XYOfPhase":
				delAllFn = RF_SP2Store.util.graphStyleHandler;
			break;

			case "XYOfMagnitude":
				delAllFn = RF_SP2Store.util.graphStyleHandler;
			break;

			case "XYdBOfMagnitude":
				delAllFn = getDataBuildBigS12S21;
			break;
		}
		delAllFn.call(undefined, {
			iclassify: dblclassify,
			itargetchart: dblid,
			contextFlag: true,
			graphStyle: key
		});
		$(".signalChart_div_foot").fadeOut(10);
	}
};
// 最小最大值处理
RF_SP2Store.util.min_maxHandler = function(obj){
	var series = obj.series;
	var min_maxArr = [];
	var arrFlag = false;
	if(_.isArray(series[0].data[0])){
		arrFlag = true;
	}
	_.times(series.length, function(ii){
		if(arrFlag){
			min_maxArr[0] = _.min([min_maxArr[0], _.min(_.zip.apply(undefined, series[ii].data)[1])]);
			min_maxArr[1] = _.max([min_maxArr[1], _.max(_.zip.apply(undefined, series[ii].data)[1])]);
		}else{
			min_maxArr[0] = _.min([min_maxArr[0], _.min(series[ii].data)]);
			min_maxArr[1] = _.max([min_maxArr[1], _.max(series[ii].data)]);
		}
	});
	RF_SP2Store.stateObj.indicatrix_min_max[0] = min_maxArr[0];
	RF_SP2Store.stateObj.indicatrix_min_max[1] = min_maxArr[1];
};
// TCF曲线获取数据后处理
RF_SP2Store.util.MarkerCurveHandler = function(obj){
	var data = obj.data,
	container = obj.container,
	title = obj.title || "marker图",
	findData = obj.findData,
	callback = _.isFunction(obj.callback) ? obj.callback : null;
	var xData = [], yData = [], nameArr = [];
	_.forOwn(data, function(v, k){
		var curvefile = _.find(findData.selected, function(vv, ii){
			return _.isEqual(vv.curvetypeid, _.toString(k));
		}).curvefile;
		nameArr.push(findData.waferfile.replace(/\..*$/, "")+"  "+curvefile);
		// v.markerData
		var zipArr = _.zip.apply(undefined, v.curveData);
		xData.push(zipArr[0]);
		yData.push(zipArr[1]);
	});
	console.log(xData)
	console.log(yData)
	console.log(nameArr)
	renderSpline({
		container: container,
		title: title,
		data: {
			xData: xData,
			yData: yData
		},
		name: nameArr,
		callback: callback
	});
};
// 回显marker
RF_SP2Store.util.echoMarker = function(obj){
	var classify = obj.classify || 'select',
	chart = obj.chart;
	var curComfirm_key,
	TCFsParameter = RF_SP2Store.stateObj.TCFsParameter;
	if(!_.isEmpty(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter]) && !_.isNil(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter])){
		curComfirm_key = RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter][0].key;
	}
	if(classify == 'select'){
		if(curComfirm_key == "y"){
			RF_SP2Store.stateObj.key_y = false;
			var yArr = _.reduce(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(result, v, i){
				if(_.indexOf(result, v.y) == -1) result.push(v.y);return result;
			}, []);
			var series0_y = chart.series[0].yData;
			var series1_y = chart.series[1].yData;
			RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter].length = 0;
			if(_.indexOf(series0_y, yArr[0]) > -1){
				/*説明原本有點*/
				chart.series[0].options.point.events.click.call(chart.series[0].points[_.indexOf(series0_y, yArr[0])]);
			}else if(_.indexOf(series1_y, yArr[0]) > -1){
				chart.series[1].options.point.events.click.call(chart.series[1].points[_.indexOf(series1_y, yArr[0])]);
			}else{
				console.log("兩條曲綫都沒有真實點");
				var y11, y22, y33, y44, x11, x22, x33, x44, inde1, inde2, copyx, copyy1, copyy2;
				_.forEach(series0_y, function(v, i, arr){
					if(v > yArr[0]){
						y11 = arr[i-1];
						y22 = arr[i];
						x11 = chart.xAxis[0].categories[i-1];
						x22 = chart.xAxis[0].categories[i];
						inde1 = i;
						return false;
					}
				});
				if(!_.isNil(y11) && !_.isNil(y22)){
					var newPoint1 = getPointXY({
						one: [x11, y11],
						two: [x22, y22],
						baseVal: yArr[0],
					});
					// console.log(newPoint1)
					copyx = _.cloneDeep(chart.xAxis[0].categories);
					copyy1 = _.cloneDeep(series0_y);
					copyy2 = _.cloneDeep(series1_y);
					copyx.splice(inde1, 0, newPoint1.x);
					copyy1.splice(inde1, 0, newPoint1.y);
					copyy2.splice(inde1, 0, copyy2[inde1-1]);
					chart.xAxis[0].setCategories(copyx);
					chart.series[0].setData(copyy1);
					//
					// copyy2 = _.cloneDeep(copyy1);
					//
					chart.series[1].setData(copyy2);
					chart.series[0].options.point.events.click.call(chart.series[0].points[_.indexOf(copyy1, yArr[0])]);
				}else{
					/*第一条曲线未找到点*/
					_.forEach(series1_y, function(v, i, arr){
						if(v > yArr[0]){
							y33 = arr[i-1];
							y44 = arr[i];
							x33 = chart.xAxis[0].categories[i-1];
							x44 = chart.xAxis[0].categories[i];
							inde2 = i;
							return false;
						}
					});
					if(!_.isNil(y33) && !_.isNil(y44)) {
						var newPoint2 = getPointXY({
							one: [x11, y11],
							two: [x22, y22],
							baseVal: yArr[0],
						});
						console.log(newPoint2)
						copyx = _.cloneDeep(chart.xAxis[0].categories);
						copyy1 = _.cloneDeep(series0_y);
						copyy2 = _.cloneDeep(series1_y);
						copyx.splice(inde2, 0, newPoint2.x);
						copyy2.splice(inde2, 0, newPoint2.y);
						copyy1.splice(inde2, 0, copyy1[inde2-1]);
						chart.xAxis[0].setCategories(copyx);
						chart.series[0].setData(copyy1);
						chart.series[1].setData(copyy2);
						chart.series[1].options.point.events.click.call(chart.series[1].points[_.indexOf(copyy2, yArr[0])]);
					}else{
						RF_SP2SwalMixin({
							title: "Marker打点提示",
							text: "以y为key，两条曲线都未找到点",
							type: "info",
							timer: 2000
						});
					}
				}
			}
			/*console.log(chart.xAxis[0].categories);
			console.log(chart.series[0].yData);*/
		}else if(curComfirm_key == "x"){
			var xArr = _.reduce(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(result, v, i){
				if(_.indexOf(result, v.x) == -1) result.push(v.x);return result;
			}, []);
			if(xArr.length == 1){
				RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter].length = 0;
				chart.series[0].options.point.events.click.call(chart.series[0].points[_.indexOf(chart.xAxis[0].categories, _.toNumber(xArr[0]))]);
			}else if(xArr.length == 2){
				RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter].length = 0;
				chart.series[0].options.point.events.click.call(chart.series[0].points[_.indexOf(chart.xAxis[0].categories, _.toNumber(xArr[0]))]);
				setTimeout(function(){
					chart.series[1].options.point.events.click.call(chart.series[1].points[_.indexOf(chart.xAxis[0].categories, _.toNumber(xArr[1]))]);
				}, 100);
				/*chart.series[iii].data[_.indexOf(chart.xAxis[0].categories, v.x)].select(true, true);*/
			}
		}
	}
};

RF_SP2Store.ajax = Object.create(null);
RF_SP2Store.ajax.AnalysisFile = function(obj){
	$.ajax({
		type: "GET",
		url: "AnalysisFile",
		data: {
			wafer: obj.wafer
		},
		dataType: "json"
	}).then(obj.done);
};
RF_SP2Store.ajax.AnalysisCurve = function(obj){
	var iasync = obj.iasync;
	if(_.isNil(iasync)) iasync = true;
	$.ajax({
		type: "GET",
		url: "AnalysisCurve",
		async: iasync,
		data: {
			curveTypeId: obj.curveTypeId,
			legend: obj.legend || void(0),
			graphStyle: obj.graphStyle || void(0),
			sParameter: obj.sParameter || void(0)
		},
		dataType: "json"
	}).then(obj.done);
};
// TCF模型分析页面：marker曲线
RF_SP2Store.ajax.MarkerCurve = function(obj){
	var curveTypeId = obj.curveTypeId,
	waferId = obj.waferId,
	sParameter = obj.sParameter || "S11";
	$.ajax({
		type: "GET",
		url: "MarkerCurve",
		data: {
			curveTypeId: curveTypeId,
			waferId: waferId,
			sParameter: sParameter
		},
		dataType: "json"
	}).then(obj.done);
};
// TCF模型分析页面：marker获取
RF_SP2Store.ajax.GetMarker = function(obj){
	var curveTypeId = obj.curveTypeId;
	$.ajax({
		type: "GET",
		url: "GetMarker",
		data: {
			curveTypeId: curveTypeId
		},
		dataType: "json"
	}).then(obj.done);
};


/*MarkerReplace*/
function markerJoinCalc(str){
	_.forEach(RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter], function(iv, ik){
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
	_.forOwn(RF_SP2Store.MathMap, function(v, k){
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

/*史密斯图S12 S21大图获取数据绘制图形
* XYdBOfMagnitude*/
function getDataBuildBigS12S21(obj){
	$(".signalChart_div_foot").fadeOut(10);
	var iclassify = obj.iclassify, 
	itargetchart = obj.itargetchart,
	contextFlag = obj.contextFlag,
	graphStyle = obj.graphStyle,
	callback = obj.callback;
	var originData;
	if(contextFlag === true){
		originData = _.cloneDeep(RF_SP2Store.stateObj.S2PBigChartSmithData[iclassify][graphStyle]);
	}else{
		// 如果不是右键绘制
		originData = _.cloneDeep(RF_SP2Store.stateObj.S2PSmallChartSmithData[iclassify]);
	}
	var objec = {};
	objec.xCategories = [];
	var xCatFlag = false;
	/*真实数据*/
	objec.series = [];
	_.forEach(originData, function(v, i){
		var item = {};
		item.name = v.name;
		item.data = [];
		_.forEach(v.data, function(vv, ii){
			item.data.push(parseFloat(vv[1]));
			if(!xCatFlag){
				objec.xCategories.push(parseFloat(vv[0]));
			}
		});
		item.color = v.color;
		objec.series.push(item);
		xCatFlag = true;
	});
	if(!_.isEmpty(objec.series)){
		RF_SP2Store.util.min_maxHandler({
			series: _.cloneDeep(objec.series)
		});
	}
	objec.container = itargetchart;
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
	if(_.isNil(graphStyle)) {
		objec.text = iclassify;
	}else{
		objec.text = iclassify + " - " + graphStyle;
	}
	objec.showCheckbox = true;
	objec.callback = callback;
	RF_SP2Store.stateObj.smithSXCategories = _.cloneDeep(objec.xCategories);
	drawRealS12S21(objec);
}

/*史密斯S11 S22大图获取数据绘制图形
* 史密斯圆图*/
function getDataBuildBigS11S22(obj){
	$(".signalChart_div_foot").fadeIn(10);
	var iclassify = obj.iclassify,
	itargetchart = obj.itargetchart,
	item = obj.item,
	contextFlag = obj.contextFlag || false,
	graphStyle = obj.graphStyle,
	callback = obj.callback;
	var reduceData;
	if(contextFlag === true){
		reduceData = _.cloneDeep(RF_SP2Store.stateObj.S2PBigChartSmithData[iclassify][graphStyle]);
	}else if(contextFlag === false){
		reduceData = _.cloneDeep(RF_SP2Store.stateObj.S2PSmallChartSmithData[iclassify]);
	}
	getDataBuildS11S22({
		wrapDOM: document.getElementById(itargetchart),
		title: [''],
		legendName: [iclassify],
		data: _.reduce(reduceData, function(result, value, i) {
		  	result.push(_.cloneDeep(value.data));
		  	return result;
		}, []),
		classify: iclassify,
		msgDOM: true,
		lineColorArray: _.reduce(reduceData, function(result, value, i) {
		  	result.push(value.color);
		  	return result;
		}, []),
		msgInitFun: function(messag){
			buildS11ANDS22Bottom({
				classify: iclassify,
				bottomJQDOM: $(".signalChart_div_foot .signalChart_div_foot_in_m_in ul"),
				callback: function() {
					$(".signalChart_div_foot_in_m_in ul>li").innerHeight($(".signalChart_div_foot_in_m").innerHeight()).innerWidth($(".signalChart_div_foot_in_m").innerWidth() * 0.5 - 1);
					if (_.isNil(item)) {
						$(".signalChart_div_foot_in_m_in ul>li:first").addClass("active").next().addClass("active");
					} else {
						$(".signalChart_div_foot_in_m_in ul>li[data-iparamter='" + item + "']").addClass("active").next().addClass("active");
					}
				}
			});
			$(".signalChart_div_foot_in_m_in ul>li.active").find(".Smith_Msg2").text(messag);
		},
		msgFun: function(messag, t, initMess){
			var iparamter = RF_SP2Store.stateObj.S2PSmallChartSmithData[iclassify][t].name;
			if(contextFlag === true) iparamter = RF_SP2Store.stateObj.S2PBigChartSmithData[iclassify][graphStyle][t].name;
			var curDOM = $(".signalChart_div_foot_in_m_in ul>li[data-iparamter='"+iparamter+"']");
			curDOM.siblings().removeClass("active");
			curDOM.addClass("active").next().addClass("active").find(".Smith_Msg2").text(initMess);
			curDOM.find(".Smith_Msg2").text(messag);
		},
		GHzFlag: true,
		callback: function(smith1){
			window.onresize = function () {
				smith1.onresize();
			};
			_.isFunction(callback) && callback(smith1);
		}
	});
}

/*Smith图例S11 S22构建*/
function buildS11ANDS22Bottom(obj){
	var classify = obj.classify,
	bottomJQDOM = obj.bottomJQDOM,
	callback = obj.callback,
	contextFlag = obj.contextFlag,
	graphStyle = obj.graphStyle;
	var str = '';
	var forData;
	if(contextFlag === true){
		forData = RF_SP2Store.stateObj.S2PBigChartSmithData[classify][graphStyle];
	}else{
		forData = RF_SP2Store.stateObj.S2PSmallChartSmithData[classify];
	}
	_.forEach(forData, function(v, i){
		str+='<li data-iparamter="'+v.name+'">'+
				'<div class="pictureline">'+
					'<p style="background: '+v.color+'"></p>'+
				'</div>'+
				'<div class="smithdata">'+
					'<p class="smithdata1"><span class="Smith_Paramter">'+v.name+' </span>(<span class="Smith_Msg1">'+classify+'</span>): <span class="Smith_Msg2"></span></p>'+
				'</div>'+
			'</li>';
	});
	bottomJQDOM.empty().append(str);
	_.isFunction(callback) && callback();
}

/*S11 S22信息bottom显示逻辑*/
function msgInitFun(inmessage, type, classify, item) {
	buildS11ANDS22Bottom({
		classify: type,
		bottomJQDOM: $("#picture" + classify + "bottom .picturebottom_in_m_in ul"),
		callback: function() {
			$("#picture" + classify + "bottom .picturebottom_in_m_in ul>li").innerHeight($("#picture" + classify + "bottom .picturebottom_in_m").innerHeight()).innerWidth($("#picture" + classify + "bottom .picturebottom_in_m").innerWidth());
			if (item === false) {
				$("#picture" + classify + "bottom .picturebottom_in_m_in ul>li:first").addClass("active");
			} else {
				$("#picture" + classify + "bottom .picturebottom_in_m_in ul>li[data-iparamter='" + item + "']").addClass("active");
			}
		}
	});
	$("#picture"+classify+"bottom .picturebottom_in_m_in ul>li.active").find(".Smith_Msg2").text(inmessage);
}
function imsgFun(messag, tt, type, classify){
	var iparamter = RF_SP2Store.stateObj.S2PSmallChartSmithData[type][tt].name;
	$("#picture"+classify+"bottom .picturebottom_in_m_in ul>li[data-iparamter='"+iparamter+"']").addClass("active").siblings().removeClass("active");
	$("#picture"+classify+"bottom .picturebottom_in_m_in ul>li.active").find(".Smith_Msg2").text(messag);
}

/*TCF获取数据并绘制图形*/
function getTCFDataANDDrawChart(obj) {
	var isComfirmKey = obj.isComfirmKey;
	var oldData1 = _.cloneDeep(RF_SP2Store.mock.RF_SP2[2].curveinfos[2].smithAndCurve.S21);
	var oldData2 = _.cloneDeep(RF_SP2Store.mock.RF_SP2[_.random(0, 1, false)].curveinfos[2].smithAndCurve.S21);
	_.forEach(oldData1, function(v, i){
		v[2] = v[2] - _.round(_.random(0.0004, 0.0009, true), 5);
	});
	_.forEach(oldData2, function(v, i){
		v[2] = v[2] + _.round(_.random(0.0004, 0.0009, true), 5);
	});
	/*伪造数据结束*/
	var ixData = [];
	ixData[0] = [];
	ixData[1] = [];
	var iyData = [];
	iyData[0] = [];
	iyData[1] = [];
	_.forEach(oldData1, function(v, i){
		ixData[0].push(v[0]/1000000);
		iyData[0].push(v[2]);
	});
	_.forEach(oldData2, function(v, i){
		ixData[1].push(v[0]/1000000);
		iyData[1].push(v[2]);
	});
	/*构造新数据*/
	
	
	renderSpline({
		container: "markerChart",
		title: "marker图",
		data: {
			xData: ixData,
			yData: iyData
		},
		name: _.cloneDeep(RF_SP2Store.waferTCFSelected),
		callback: function(chart){
			if(!isComfirmKey) {
				
			}
		}
	});
}

/*page onload*/
$(function(){
	var wafer = $("body").data("wafer");
	if(_.isNil(wafer) || _.isEmpty(wafer)) {
		eouluGlobal.S_getSwalMixin()({
			showConfirmButton: false,
			title: "参数验证",
			text: "传参出错！请至工程分析页面重新选取",
			timer: 1900,
			type: "error"
		}).then(function(){
			eouluGlobal.S_settingURLParam({}, false, false, false, "ProjectAnalysis");
		});
	}else{
		RF_SP2Store.ajax.AnalysisFile({
			wafer: wafer,
			done: function(data){
				if(!_.isNil(data) && !_.isEmpty(data)){
					var str = '',
					sizes = 0;
					_.forOwn(data, function(v, k){
						sizes += v.curveFile.length;
						str+=RF_SP2Store.util.renderWaferFile({
							data: v.curveFile,
							waferFile: v.waferFile,
							waferId: k
						});
					});
					var colorArray = eouluGlobal.S_getPageAllConfig().colorArray;
					// _.shuffle([1, 2, 3, 4]);
					Highcharts.setOptions({
						chart: {
							colorCount: sizes
						},
						colors: _.sampleSize(colorArray, sizes)
					});
					$(".g_bodyin_bodyin_bottom_l_intop").empty().append(str).children("div.panel:eq(0)").children("div.panel-heading").trigger("click").siblings("ul").children("li:eq(0)").trigger("click");
					// TCF分页也加上
					$(".g_bodyin_bodyin_bottom_lsub_top").empty().append(str).children("div.panel:eq(0)").children("div.panel-heading").trigger("click");
				}
				// 页面布局适应
				RF_SP2Store.util.eleResize();
				$(window).on("resize", function(){
					RF_SP2Store.util.eleResize();
					RF_SP2Store.util.eleResize({
						classify: 2
					});
				});
			}
		});
	}
	/*导航栏*/
	RF_SP2Store.util.renderNav({
		item: RF_SP2Store.stateObj.navCurveType,
		type: "g_bodyin_bodyin_bottom_1"
	});
	/*导航栏结束*/
	if($(".g_bodyin_bodyin_top_wrap_m_in").innerWidth() > $(".g_bodyin_bodyin_top_wrap_m").innerWidth()){
		$(".g_bodyin_bodyin_top_wrap_l>span, .g_bodyin_bodyin_top_wrap_r>span").show();
	}

	// key值回显
	$("#comfirm_key_sel").val(RF_SP2Store.stateObj.comfirm_key);
	RF_SP2Store.stateObj.key_y = RF_SP2Store.stateObj.comfirm_key == "y" ? true : false;

	// 拖动初始化
	$(".indicatrix_div, .allLegends").draggable({ distance: 5 });
	
	/*保存Marker后的动作*/
	var saveMarkerFlag = store.get("futureDT2Online__RF_SP2__saveMarkerFlag");
	if(!_.isNil(saveMarkerFlag)){
		$(".g_bodyin_bodyin_top_wrap_m_in li[data-targetclass='g_bodyin_bodyin_bottom_2']").trigger("click");
	}

	return false;

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

	
});

/*event handler*/
/*wafer file左侧切换折叠*/
$(document).on("click", ".g_bodyin_bodyin_bottom_l_intop .panel>.panel-heading, .g_bodyin_bodyin_bottom_lsub_top .panel>.panel-heading", function(){
	$(this).children("span").toggleClass("glyphicon-menu-right glyphicon-menu-down");
	var slideFun;
	slideFun = $(this).parent().hasClass("slideUp") ? jQuery().slideDown : jQuery().slideUp;
	slideFun.call($(this).siblings("ul"), 800);
	$(this).parent().toggleClass("slideUp");
}).on("click", ".g_bodyin_bodyin_bottom_l_intop .panel>ul>li", function(){
	var iThat = $(this),
	curvetypeid = _.toString(iThat.data("curvetypeid")),
	seriesName = iThat.data("waferfile")+"  "+iThat.data("curvefile"),
	iparent = iThat.parent();
	if(!iThat.hasClass("list-group-item-info")){
		RF_SP2Store.ajax.AnalysisCurve({
			curveTypeId: [curvetypeid],
			async: false,
			done: function(data){
				if(_.isNil(data) || _.isEmpty(data)){
					eouluGlobal.S_getSwalMixin()({
					 	title: "信息",
					 	text: "此晶圆无曲线数据！",
					 	html: undefined,
					 	type: "info",
					 	showConfirmButton: false,
						timer: 1900,
					}).then(function(){
					});
				}else{
					if(_.keys(data).length == 1){
						_.forOwn(data, function(v, k){
							_.forOwn(v, function(vv, kk){
								RF_SP2Store.util.smithHandler({
									s: kk,
									data: vv,
									seriesName: seriesName
								});
							});
						});
					}
					RF_SP2Store.waferSelected.push(curvetypeid);
					iThat.addClass("list-group-item-info");
					RF_SP2Store.util.linkage({
						classify: 1,
						jQDOM: iparent
					});
					// response
					if(RF_SP2Store.waferSelected.length > 20){
						var oldHeight = ~~$("#picture_box2").innerHeight();
						var oldWidth = ~~$("#picture_box2").innerWidth();
						var radios = 2,
						minus = _.get(eouluGlobal.S_getPageAllConfig(), "futureDT2.scrollBarWidth", 7);
						if(RF_SP2Store.waferSelected.length > 40){
							radios = 3;
						}
						$("#picture2top, #picture3top").innerHeight(oldHeight*radios).innerWidth(oldWidth-minus);
						$("#picture2top").highcharts().setSize(oldWidth-minus, oldHeight*radios);
						$("#picture3top").highcharts().setSize(oldWidth-minus, oldHeight*radios);
					}
					/*如果显示大图*/
					if(RF_SP2Store.stateObj.dblclickFlag !== false){
						var $visible = $("[id$=_chart_S]:visible");
						var dblclassify = $visible.data("iclassify"),
						dblid = $visible.attr("id"),
						iflag = $visible.data("iflag");
						if(iflag == "initial"){
							if(_.indexOf(["S11", "S22"], dblclassify) > -1){
								setTimeout(function(){
									getDataBuildBigS11S22({
										iclassify: dblclassify,
										itargetchart: dblid
									});
								}, 30);
							}else{
								getDataBuildBigS12S21({
									iclassify: dblclassify,
									itargetchart: dblid,
									callback: function(){
										setTimeout(function(){
											$(".indicatrix_footin>.btn-success").trigger("click");
										}, 50);
									}
								});
							}
						}else{
							RF_SP2Store.util.graphStyleDispatch({
								graphStyle: iflag
							});
						}
						// console.assert(dblid=="S11_chart_S", "no S11_chart_S");
						// console.assert(dblclassify=="S11", "no S11");
					}
				}
			}
		});
	}else{
		// 删除
		_.pull(RF_SP2Store.waferSelected, curvetypeid);
		iThat.removeClass("list-group-item-info");
		RF_SP2Store.util.linkage({
			classify: 1,
			jQDOM: iparent
		});
		_.forEach(["S11", "S12", "S21", "S22"], function(v, i){
			RF_SP2Store.util.smithHandler({
				s: v,
				seriesName: seriesName,
				delLi: true
			});
		});
		if(RF_SP2Store.waferSelected.length < 21){
			var oldHeight1 = ~~$("#picture_box2").innerHeight();
			var oldWidth1 = ~~$("#picture_box2").innerWidth();
			$("#picture2top, #picture3top").innerHeight(oldHeight1).innerWidth(oldWidth1);
			$("#picture2top").highcharts().setSize(oldWidth1, oldHeight1);
			$("#picture3top").highcharts().setSize(oldWidth1, oldHeight1);
		}
		/*如果显示大图*/
		if(RF_SP2Store.stateObj.dblclickFlag !== false){
			var $visible1 = $("[id$=_chart_S]:visible");
			var dblclassify1 = $visible1.data("iclassify"),
			dblid1 = $visible1.attr("id"),
			iflag1 = $visible1.data("iflag");
			if(RF_SP2Store.stateObj.RFSP2Checkbox === null){
				if(iflag1 == "initial"){
					if(_.indexOf(["S11", "S22"], dblclassify1) > -1){
						getDataBuildBigS11S22({
							iclassify: dblclassify1,
							itargetchart: dblid1
						});
					}else{
						getDataBuildBigS12S21({
							iclassify: dblclassify1,
							itargetchart: dblid1,
							callback: function(){
								setTimeout(function(){
									$(".indicatrix_footin>.btn-success").trigger("click");
								}, 50);
							}
						});
					}
				}else{
					RF_SP2Store.util.graphStyleDispatch({
						graphStyle: iflag1
					});
				}
			}else if(RF_SP2Store.stateObj.RFSP2Checkbox === false){
				if($(".g_bodyin_bodyin_bottom_l_intop .panel>ul>li.list-group-item-info").length == 0){
					if(iflag1 == "initial"){
						if(_.indexOf(["S11", "S22"], dblclassify1) > -1){
							getDataBuildBigS11S22({
								iclassify: dblclassify1,
								itargetchart: dblid1
							});
						}else{
							getDataBuildBigS12S21({
								iclassify: dblclassify1,
								itargetchart: dblid1
							});
						}
					}else{
						RF_SP2Store.util.graphStyleDispatch({
							graphStyle: iflag1
						});
					}
				}
			}
		}
	}
})
// TCF 左侧li点击
.on("click", ".g_bodyin_bodyin_bottom_lsub_top .panel>ul>li", function(e){
	e = e || window.event;
	var iThat = $(this),
	iparent = iThat.parent();
	var waferid = _.toString(iparent.prev().data("waferid")),
	waferfile = iThat.data("waferfile"),
	curvefile = iThat.data("curvefile"),
	curvetypeid = _.toString(iThat.data("curvetypeid"));
	dieid = _.toString(iThat.data("dieid"));
	var iKey = waferid+"-"+RF_SP2Store.stateObj.TCFsParameter;
	if(iThat.hasClass("list-group-item-info")){
		iThat.removeClass("list-group-item-info");
		_.pullAt(RF_SP2Store.waferTCFSelected[iKey].selected, _.findIndex(RF_SP2Store.waferTCFSelected[iKey].selected, function(v, i){
			return _.isEqual(v.curvetypeid, curvetypeid);
		}));
	}else{
		iThat.addClass("list-group-item-info");
		if(_.isNil(RF_SP2Store.waferTCFSelected[iKey])) RF_SP2Store.waferTCFSelected[iKey] = {};
		RF_SP2Store.waferTCFSelected[iKey].waferfile = waferfile;
		RF_SP2Store.waferTCFSelected[iKey].waferid = waferid;
		RF_SP2Store.waferTCFSelected[iKey].sParameter = RF_SP2Store.stateObj.TCFsParameter;
		if(_.isNil(RF_SP2Store.waferTCFSelected[iKey].selected)) RF_SP2Store.waferTCFSelected[iKey].selected = [];
		if(RF_SP2Store.waferTCFSelected[iKey].selected.length >= 2) {
			var ishift = RF_SP2Store.waferTCFSelected[iKey].selected.shift();
			$('.g_bodyin_bodyin_bottom_lsub_top .panel>ul>li[data-curvetypeid="'+ishift.curvetypeid+'"]').removeClass("list-group-item-info");
		}
		RF_SP2Store.waferTCFSelected[iKey].selected.push({
			curvefile: curvefile,
			curvetypeid: curvetypeid,
			dieid: dieid
		});
		// 操作其他csv文件对象
		_.forEach(RF_SP2Store.waferTCFSelected, function(v, k, obje){
			if(_.isEqual(_.toString(k), iKey)) return true;
			if(_.isNil(v.selected)){
				obje[k].selected = [];
			}else{
				_.forEach(obje[k].selected, function(vv, ii){
					$('.g_bodyin_bodyin_bottom_lsub_top .panel>ul>li[data-curvetypeid="'+vv.curvetypeid+'"]').removeClass("list-group-item-info");
				});
				obje[k].selected = [];
			}
		});
	}
	$(".g_bodyin_bodyin_bottom_lsub_top>.panel>ul").each(function(i, el){
		RF_SP2Store.util.linkage({
			jQDOM: $(el),
			TCFflag: true
		});
	});
	var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v){
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(!_.isNil(findTCFWafer)){
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
});

$(window).on("resize", function(){
	_.forEach(RF_SP2Store.stateObj.S2PSmallChartSmithArr, function(v, i, arr){
		arr[i].onresize();
	});
});

/*RF-SP2全选*/
$(".g_bodyin_bodyin_bottom_l_inbottom>input").click(function(){
	var iconClass;
	if($(this).prop("checked")){
		iconClass = "glyphicon-menu-right";
		var curvetypeid = [],
		legend = [];
		$(".g_bodyin_bodyin_bottom_l_intop .panel>ul>li:not(.list-group-item-info)").each(function(i, el){
			curvetypeid.push($(el).data("curvetypeid"));
			legend.push($(el).data("waferfile")+"  "+$(el).data("curvefile"));
		});
		if(_.isNil(curvetypeid)) return false;
		RF_SP2SwalMixin({
			title: '信息',
			text: "正在绘图，请勿点击",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false
		});
		RF_SP2Store.ajax.AnalysisCurve({
			curveTypeId: curvetypeid,
			legend: legend,
			async: false,
			done: function(data){
				if(_.isNil(data) || _.isEmpty(data)){
					eouluGlobal.S_getSwalMixin()({
					 	title: "信息",
					 	text: "所选晶圆无曲线数据！",
					 	html: undefined,
					 	type: "info",
					 	showConfirmButton: false,
						timer: 1900,
					}).then(function(){
					});
				}else{
					_.forOwn(data, function(v, k){
						_.forOwn(v, function(vv, kk){
							RF_SP2Store.util.smithHandler({
								s: kk,
								data: vv,
								seriesName: k
							});
						});
						var seriesNameArr = k.split("  ");
						$('.g_bodyin_bodyin_bottom_l_intop .panel>ul>li:not(.list-group-item-info)[data-waferfile="'+seriesNameArr[0]+'"][data-curvefile="'+seriesNameArr[1]+'"]').addClass("list-group-item-info");
					});
					Array.prototype.push.apply(RF_SP2Store.waferSelected, _.cloneDeep(curvetypeid));
					$(".g_bodyin_bodyin_bottom_l_intop .panel>.panel-heading").each(function(){
						var $ul = $(this).siblings("ul");
						RF_SP2Store.util.linkage({
							classify: 2,
							jQDOM: $ul
						});
					});
					// response
					if(RF_SP2Store.waferSelected.length > 20){
						var oldHeight = ~~$("#picture_box2").innerHeight();
						var oldWidth = ~~$("#picture_box2").innerWidth();
						var radios = 2,
						minus = _.get(eouluGlobal.S_getPageAllConfig(), "futureDT2.scrollBarWidth", 7);
						if(RF_SP2Store.waferSelected.length > 40){
							radios = 3;
						}
						$("#picture2top, #picture3top").innerHeight(oldHeight*radios).innerWidth(oldWidth-minus);
						$("#picture2top").highcharts().setSize(oldWidth-minus, oldHeight*radios);
						$("#picture3top").highcharts().setSize(oldWidth-minus, oldHeight*radios);
					}
					// 如果显示大图
					if(RF_SP2Store.stateObj.dblclickFlag !== false){
						var $visible = $("[id$=_chart_S]:visible"),
						dblid = $visible.attr("id"),
						dblclassify = $visible.data("iclassify"),
						iflag = $visible.data("iflag");
						if(iflag == "initial"){
							if(_.indexOf(["S11", "S22"], dblclassify) > -1){
								setTimeout(function(){
									getDataBuildBigS11S22({
										iclassify: dblclassify,
										itargetchart: dblid
									});
								}, 40);
							}else{
								getDataBuildBigS12S21({
									iclassify: dblclassify,
									itargetchart: dblid,
									callback: function(){
										setTimeout(function(){
											$(".indicatrix_footin>.btn-success").trigger("click");
										}, 50);
									}
								});
							}
						}else{
							RF_SP2Store.util.graphStyleDispatch({
								graphStyle: iflag
							});
						}
					}
					swal.close();
				}
			}
		});
	}else{
		iconClass = "glyphicon-menu-down";
		checkedF = false;
		RF_SP2SwalMixin({
			title: '信息',
			text: "正在绘图，请勿点击",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false
		});
		RF_SP2Store.stateObj.RFSP2Checkbox = false;
		setTimeout(function(){
			$(".g_bodyin_bodyin_bottom_l_intop .panel>ul>li.list-group-item-info").each(function(i, el){
				$(this).trigger("click");
			});
			swal.close();
			RF_SP2Store.stateObj.RFSP2Checkbox = null;
		}, 30);
	}
	$(".g_bodyin_bodyin_bottom_l_intop .panel>.panel-heading").each(function(){
		if($(this).children("span").hasClass(iconClass)) $(this).trigger("click");
	});
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

/*导航栏条*/
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
			RF_SP2Store.util.renderNav({
				item: RF_SP2Store.stateObj.navCurveType,
				type: target,
				index: inde
			});
			/*导航栏结束*/
			if(target == "g_bodyin_bodyin_bottom_2"){
				/*TCF分页*/
				var saveMarkerFlag = store.get("futureDT2Online__RF_SP2__saveMarkerFlag");
				if(_.isNil(saveMarkerFlag)){
					RF_SP2Store.stateObj.TCFsParameter = RF_SP2Store.stateObj.dblclickFlag === false ? "S11" : RF_SP2Store.stateObj.dblclickFlag;
				}else{
					RF_SP2Store.stateObj.TCFsParameter = saveMarkerFlag;
					store.remove("futureDT2Online__RF_SP2__saveMarkerFlag");
				}
				$(".g_info [data-iicon='glyphicon-question-sign']").hide();
				if(!RF_SP2Store.stateObj.renderSelectCsvSub){
					/*回显marker*/
					RF_SP2Store.stateObj.splineSelectedArr = store.get("futureDT2Online__RF_SP2__splineSelectedArr");
					RF_SP2Store.stateObj.splineSelectedCopyArr = store.get("futureDT2Online__RF_SP2__splineSelectedArr");

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

					RF_SP2Store.util.eleResize({
						classify: 2
					});
					var lis = $(".g_bodyin_bodyin_bottom_lsub_top>.panel:eq(0)>ul>li");
					lis.eq(0).trigger("click");
					lis.eq(1).trigger("click");
					// 触发点击
					$(".reRenderBtnDiv").trigger("click");
					
					// 展示当前晶圆所有参数，结果，公式
					var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v) {
						return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
					});
					if(!_.isNil(findTCFWafer)){
						$.ajax({
							type: "GET",
							url: "CalculationData",
							data: {
								waferId: findTCFWafer.waferid
							}, 
							dataType: "json"
						}).then(function(data){
							if(_.isNil(data) || _.isEmpty(data)){
								$(".g_bodyin_bodyin_bottom_lsub_bottom tbody").empty().append('<tr class="canCalc"><td></td><td></td><td></td></tr>');
							}else{

							}
						});
					}else{
						eouluGlobal.S_getSwalMixin()({
							title: '请求参数数据',
							text: "异常！未选中曲线",
							type: 'warning',
							showConfirmButton: false,
							showCancelButton: false,
							timer: 1900
						});
					}
					RF_SP2Store.stateObj.renderSelectCsvSub = true;
				}

				// 根据S参数回显
				if(_.isNil(RF_SP2Store.stateObj.splineSelectedArr)){
					RF_SP2Store.stateObj.splineSelectedArr = {
						S11: [],
						S12: [],
						S21: [],
						S22: []
					};
				}else{
					var iArra = [],
					TCFsParameter = RF_SP2Store.stateObj.TCFsParameter;
					_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
						if(_.isNil(v.x)) v.x = NaN;
					});
					_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
						/*str2+='<tr data-iflag="'+(v.name+v.x)+'"><td contenteditable="true" title="点击修改" data-iorigin="'+v.markerName+'">'+v.markerName+'</td><td>'+v.x+'</td><td>'+v.y+'</td><td>'+v.key+'</td></tr>';*/
						iArra.push({
							label: v.markerName+".X: "+v.x,
							value: v.markerName+".X"
						});
						iArra.push({
							label: v.markerName+".Y: "+v.y,
							value: v.markerName+".Y"
						});
					});
					/*$(".buildMarker_body>.container-fluid tbody").empty().append(str2);*/
					RF_SP2Store.search_markerObj.list = _.cloneDeep(iArra);
				}

				/*Marker值自动填充*/
				RF_SP2Store.search_markerObj.awesomplete && RF_SP2Store.search_markerObj.awesomplete.destroy();
				RF_SP2Store.search_markerObj.awesomplete = new Awesomplete(document.getElementById("clac_textarea"), {
					list: RF_SP2Store.search_markerObj.list,
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

				$(".reRenderBtnDiv").slideDown(200);
				/*判断结束*/
			}else{
				$(".reRenderBtnDiv").hide();
				$(".g_info [data-iicon='glyphicon-question-sign']").show();
				RF_SP2Store.stateObj.TCFsParameter = "S11";
			}
		});
	}
});

/*重新绘制事件*/
$(".reRenderBtnDiv").click(function(){
	var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v){
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(!_.isNil(findTCFWafer)){
		var curveTypeId = [],
		waferId = findTCFWafer.waferid,
		TCFsParameter = RF_SP2Store.stateObj.TCFsParameter,
		comfirm_key = RF_SP2Store.stateObj.comfirm_key;
		_.forEach(findTCFWafer.selected, function(v, i){
			curveTypeId.push(v.curvetypeid);
		});
		RF_SP2Store.ajax.MarkerCurve({
			curveTypeId: curveTypeId,
			waferId: waferId,
			sParameter: TCFsParameter,
			done: function(data){
				if(!_.isNil(data)){
					if(_.isNil(comfirm_key) || _.isEqual(comfirm_key, "请选择")){
						RF_SP2Store.util.MarkerCurveHandler({
							data: data,
							container: "markerChart",
							findData: findTCFWafer
						});
					}else{
						RF_SP2Store.ajax.GetMarker({
							curveTypeId: _.reduce(findTCFWafer.selected, function(res, v) {
								return _.isEmpty(res) ? v.curvetypeid : (res + "," + v.curvetypeid);
							}, ""),
							done: function(data1) {
								RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter] = [];
								$(".buildMarker_body>div tbody").empty();
								if(_.isNil(data1) || _.isEmpty(data1)){
									RF_SP2Store.util.MarkerCurveHandler({
										data: data,
										container: "markerChart",
										findData: findTCFWafer
									});
								}else{
									_.forEach(data1, function(v, i){
										var iObj = {};
										iObj.name = findTCFWafer.waferfile + "  " + _.find(findTCFWafer.selected, function(vv){
											return _.isEqual(vv.curvetypeid, v[0]);
										}).curvefile;
										iObj.x = v[3];
										iObj.y = v[4];
										iObj.markerName = v[2];
										iObj.key = v[5];
										iObj.id = v[2].replace("Marker", "");
										iObj.isNew = comfirm_key === 'y';
										iObj.newIndex = -1;
										iObj.curvetypeid = v[0];
										iObj.sParameter = TCFsParameter;
										RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter].push(iObj);
									});

									RF_SP2Store.util.MarkerCurveHandler({
										data: data,
										container: "markerChart",
										findData: findTCFWafer,
										callback: function(chart){
											RF_SP2Store.util.echoMarker({
												classify: 'select',
												chart: chart
											});
										}
									});
								}
							}
						});
					}
				}
			}
		});
	}
	// getTCFDataANDDrawChart({
	// 	isComfirmKey: false
	// });
});

/*数据统计*/
$(".g_bodyin_tit_r>.glyphicon-stats").click(function(){
	var  waferNO = [];
	
	eouluGlobal.S_settingURLParam({
		waferId: $("body").data("wafer"),
		waferNO: $("body").data("wafer"),
	}, false, false, false, "DataStatistics");
});

/*点击出现计算器*/
$(document).on("click", "tr.canCalc", function(){
	$(".RF_SP2_cover, .subAddParam").slideDown(200);
	$("#calc_text").val($(this).children("td:eq(0)").text());
	$("#clac_textarea").val($(this).children("td:eq(2)").text());
	RF_SP2Store.stateObj.calcTableIndex = $(this).index();
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
		var tr = $(".g_bodyin_bodyin_bottom_lsub_bottom tbody>tr").eq(RF_SP2Store.stateObj.calcTableIndex);
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
	if(_.indexOf(RF_SP2Store.allowKeyCode, i) == -1) return false;
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
		if($next.data("imouseenter") == "enter") return false;
		$next.toggleClass("clicked");
		if($next.hasClass("clicked")){
			$next.slideDown(600);
			$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 关闭Marker设置');
		}else{
			$next.slideUp(600);
			$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 打开Marker设置');
		}
	},
	mouseenter: function(){
		var $next = $(this).next();
		if($next.hasClass("clicked")) return false;
		$next.data("imouseenter", "enter");
		$next.addClass("clicked").slideDown(600, function(){
			$next.data("imouseenter", "leave");
		});
		$(this).html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 关闭Marker设置');
	}
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

// 切换key
$("#comfirm_key").click(function(){
	var key = $(this).parent().prev().children("select").val(),
	findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v){
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(_.isNil(key) || _.isEqual(key, "请选择") || _.isNil(findTCFWafer)) return false;
	if($(".buildMarker_body>.container-fluid tbody>tr").length == 0){
		RF_SP2Store.stateObj.comfirm_key = key;
		store.set("futureDT2Online__"+$("body").data("curusername")+"__ProjectAnalysis__comfirm_key", RF_SP2Store.stateObj.comfirm_key);
		RF_SP2SwalMixin({
			title: "Marker确认Key提示",
			text: "成功，现在可以选点了，请记得保存",
			type: "success",
			timer: 1100,
			showConfirmButton: false
		}).then(function(re){
			if(re.dismiss == swal.DismissReason.backdrop || re.dismiss == swal.DismissReason.esc || re.dismiss == swal.DismissReason.timer){
				RF_SP2Store.stateObj.key_y = false;
				$(".reRenderBtnDiv").trigger("click");
			}
		});
	}else{
		$.ajax({
			type: 'POST',
			url: 'MarkerOperate',
			data: {
				classify: 'remove',
				sParameter: RF_SP2Store.stateObj.TCFsParameter,
				curveTypeId: _.reduce(findTCFWafer.selected, function(res, v) {
					return _.isEmpty(res) ? v.curvetypeid : (res + "," + v.curvetypeid);
				}, "")
			},
			dataType: 'json'
		}).then(function(data) {
			if(data === true){
				RF_SP2Store.stateObj.comfirm_key = key;
				store.set("futureDT2Online__"+$("body").data("curusername")+"__ProjectAnalysis__comfirm_key", RF_SP2Store.stateObj.comfirm_key);
				RF_SP2SwalMixin({
					title: "Marker确认Key提示",
					text: "成功，现在可以选点了，请记得保存",
					type: "success",
					timer: 1100,
					showConfirmButton: false
				}).then(function(re){
					if(re.dismiss == swal.DismissReason.backdrop || re.dismiss == swal.DismissReason.esc || re.dismiss == swal.DismissReason.timer){
						RF_SP2Store.stateObj.key_y = false;
						$(".reRenderBtnDiv").trigger("click");
					}
				});
			}else if(data === false){
				RF_SP2SwalMixin({
					title: "Marker切换key提示",
					text: "切换失败",
					type: "warning",
					timer: 1600,
					showConfirmButton: false
				});
			}else{
				RF_SP2SwalMixin({
					title: "Marker切换key提示",
					text: data,
					type: "info",
					timer: 1900,
					showConfirmButton: false
				});
			}
		});
	}
});

/*marker点修改*/
// $(document).on("input propertychange change", ".buildMarker_body>.container-fluid tbody td:nth-child(1)", function(){
// 	var origin = $(this).data("iorigin");
// 	var newMarker = $(this).text();
// 	var flag = true;
// 	_.forEach(RF_SP2Store.stateObj.splineSelectedArr, function(v, i){
// 		if(v.markerName != origin && v.markerName == newMarker){
// 			flag = false;
// 			return false;
// 		}
// 	});
// 	if(!flag){
// 		$(this).text(origin);
// 	}
// }).on("blur", ".buildMarker_body>.container-fluid tbody td:nth-child(1)", function(){
// 	var origin = $(this).data("iorigin");
// 	var newMarker = $(this).text();
// 	if(!/Marker\d+/.test(newMarker)){
// 		$(this).text(origin);
// 	}else{
// 		var ii = $(this).parent().index();
// 		var flag = true;
// 		$(".buildMarker_body>.container-fluid tbody td:nth-child(1)").each(function(i){
// 			if(ii != i && newMarker == $(this).text()){
// 				flag = false;
// 				return false;
// 			}
// 		});
// 		if(!flag){
// 			$(this).text(origin);
// 		}
// 	}
// });
$(document).on({
	"input propertychange change": function(){
		var itext = $(this).text(),
		ireg = /\s*[\n\r]*\s*/g;
		if(ireg.test(itext)){
			$(this).text(itext.replace(ireg, ""));
		}
	},
	keydown: function(e){
		var i = e.keyCode || e.which || e.charCode;
		if(i == 13) return false;
	},
	blur: function(){
		var origin = $(this).data("iorigin"),
		newMarker = $(this).text(),
		flag = true;
		_.forEach(RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter], function(v, i){
			if(v.markerName != origin && v.markerName == newMarker){
				flag = false;
				return false;
			}
		});
		if(!flag){
			// 重复了
			$(this).text(origin);
		}else{
			var curvetypeid = $(this).parent().data("curvetypeid");
			$.ajax({
				type: 'POST',
				url: 'MarkerOperate',
				data: {
					classify: 'modify'
				},
				dataType: 'json',
				beforeSend: function(){
					RF_SP2SwalMixin({
						title: "Marker修改提示",
						text: "正在请求...",
						type: "info",
						showConfirmButton: false
					});
				}
			}).then(function(data){

			});
		}
	}
}, ".buildMarker_body>.container-fluid tbody td:nth-child(1)");

/*marker点提交*/
$(".buildMarker_footin>.btn-primary").click(function(){
	if($(".buildMarker_body>.container-fluid tbody>tr").length == 0) return false;
	var TCFsParameter = RF_SP2Store.stateObj.TCFsParameter;
	_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
		var iText = $(".buildMarker_body>.container-fluid tbody>tr[data-iflag='"+(v.name+v.x)+"']").children("td").eq(0).text();
		v.markerName = iText;
		v.id = iText.match(/Marker(\S+)/)[1];
	});
	var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v) {
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(!_.isNil(findTCFWafer)){
		var ajaxData = {};
		ajaxData.waferId = findTCFWafer.waferid;
		ajaxData.classify = 'add';
		ajaxData.sParameter = TCFsParameter;
		_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
			ajaxData[v.markerName] = [];
			ajaxData[v.markerName].push(v.curvetypeid);
			ajaxData[v.markerName].push(v.markerName);
			ajaxData[v.markerName].push(v.x);
			ajaxData[v.markerName].push(v.y);
			ajaxData[v.markerName].push(v.key);
		});

		$.ajax({
			type: 'POST',
			url: 'MarkerOperate',
			data: ajaxData,
			dataType: 'json'
		}).then(function(data){
			if(data === true){
				store.set("futureDT2Online__RF_SP2__splineSelectedArr", RF_SP2Store.stateObj.splineSelectedArr);
				RF_SP2SwalMixin({
					title: "Marker提交提示",
					text: "保存成功",
					type: "success",
					timer: 1200,
					showConfirmButton: false
				}).then(function(result){
					// console.log(swal.DismissReason.cancel) // cancel
					// console.log(swal.DismissReason.backdrop) // overlay
					// console.log(swal.DismissReason.esc) // esc
					// console.log(swal.DismissReason.timer) // timer
					if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
						// store.set("futureDT2Online__RF_SP2__saveMarkerFlag", TCFsParameter);
						// window.location.reload();
					}
				});
				RF_SP2Store.ajax.GetMarker({
					curveTypeId: _.reduce(findTCFWafer.selected, function(res, v) {
						return _.isEmpty(res) ? v.curvetypeid : (res + "," + v.curvetypeid);
					}, ""),
					done: function(data) {

					}
				});
			}else if(data === false){
				RF_SP2SwalMixin({
					title: "Marker提交提示",
					text: "保存失败",
					type: "warning",
					timer: 1600,
					showConfirmButton: false
				});
			}else{
				RF_SP2SwalMixin({
					title: "Marker提交提示",
					text: data,
					type: "info",
					timer: 1900,
					showConfirmButton: false
				});
			}
		});
	}
});
// marker应用到其他die
$(".buildMarker_footin>.btn-success").click(function(){
	if($(".buildMarker_body>.container-fluid tbody>tr").length == 0 || RF_SP2Store.stateObj.comfirm_key == "请选择") return false;
	var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v) {
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(!_.isNil(findTCFWafer)){
		$.ajax({
			type: 'POST',
			url: 'MarkerSave',
			data: {
				coordinateId: coordinateId,
				markerKey: RF_SP2Store.stateObj.comfirm_key,
				sParameter: findTCFWafer.sParameter,
				waferId: findTCFWafer.waferid
			},
			// contentType: 'application',
			dataType: 'json'
		}).then(function(data) {

		});
	}
});

/*marker搜索*/
$(document).on("click", "div.awesomplete ul[role='listbox']>li", function(){
	// alert($(this).text())
	/*$("#clac_textarea").val($("#clac_textarea").val()+$("#search_marker").val().trim());*/
});

/*双击4图表*/
$(document).on("dblclick", ".chartWarp", function(){
	$(".allLegends").hide();
	var itargetchart = $(this).data("itargetchart"),
	iclassify = itargetchart.replace("_chart_S", "");
	RF_SP2Store.stateObj.dblclickFlag = iclassify;
	$(".fourChart_div").fadeOut(200, function(){
		$(".signalChart_div").fadeIn(200);
		$("#"+itargetchart).siblings().fadeOut(100);
		$("#"+itargetchart).delay(100).fadeIn(150, function(){
			
			if(iclassify == "S12" || iclassify == "S21"){
				getDataBuildBigS12S21({
					iclassify: iclassify,
					itargetchart: itargetchart,
					callback: function(){
						$(".signalChart_div_tit>button:not(.backover)").prop("disabled", false);
						setTimeout(function(){
							$(".indicatrix_footin>.btn-success").trigger("click");
						}, 50);
					}
				});
			}else{
				/*史密斯图*/
				getDataBuildBigS11S22({
					iclassify: iclassify,
					itargetchart: itargetchart
				});
				$(".signalChart_div_tit>button:not(.backover)").prop("disabled", true);
			}
		}).data("iflag", "initial");
	});
});

/*后退*/
$(".signalChart_div_tit>button.backover").click(function(){
	$(".signalChart_div").fadeOut(200, function(){
		$(".fourChart_div").fadeIn(100, function(){
			$(window).trigger("resize");
			setTimeout(function(){
				_.forEach(RF_SP2Store.stateObj.S2PSmallChartSmithArr, function(v, i, arr){
					arr[i].onresize();
				});
			}, 50);
		});
		RF_SP2Store.stateObj.dblclickFlag = false;
	});
});

/*指标线 2018/11/07*/
/*显示区间表格*/
$(".signalChart_div_tit>.open_del_indicatrix").click(function(){
	$(".RF_SP2_cover, .indicatrix_div").slideDown(200);
	var id = $("[id$='_chart_S']:visible").attr("id");
	if(_.isNil(id)) return false;
	var iclassify = id.replace("_chart_S", "");
	var strup = '', strlow = '';
	_.forEach(RF_SP2Store.stateObj[iclassify].indicatrix_up, function(v, i){
		strup+=
		'<tr><td><input type="text" class="form-control AwesompleteX input_X1" value="'+v[0]+'"></td><td><input type="text" class="form-control AwesompleteX input_X2" value="'+v[1]+'"></td><td><input type="text" class="form-control input_Y0" value="'+v[2]+'"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
	});
	_.forEach(RF_SP2Store.stateObj[iclassify].indicatrix_low, function(v, i){
		strlow+=
		'<tr><td><input type="text" class="form-control AwesompleteX input_X1" value="'+v[0]+'"></td><td><input type="text" class="form-control AwesompleteX input_X2" value="'+v[1]+'"></td><td><input type="text" class="form-control input_Y0" value="'+v[2]+'"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>';
	});
	RF_SP2Store.stateObj[iclassify].indicatrix_up.length = 0;
	RF_SP2Store.stateObj[iclassify].indicatrix_low.length = 0;
	$(".indicatrix_body #upflag_table tbody").empty().append(strup);
	$(".indicatrix_body #lowflag_table tbody").empty().append(strlow);
	$(".indicatrix_body #upflag_table tbody").find(".glyphicon-ok").trigger("click");
	$(".indicatrix_body #lowflag_table tbody").find(".glyphicon-ok").trigger("click");
	if(_.isEmpty(_.concat(RF_SP2Store.stateObj[iclassify].indicatrix_low, RF_SP2Store.stateObj[iclassify].indicatrix_up))){
		$(".indicatrix_footin>.btn-success").prop("disabled", true);
	}
	$(".indicatrix_body tbody").find("input[type='text']").each(function(i, el){
		new Awesomplete(el, {
			list: RF_SP2Store.stateObj.smithSXCategories,
			minChars: 1,
			maxItems: 15,
			autoFirst: true
		});
	});
});
$(".indicatrix_tit>span.glyphicon, .indicatrix_footin>.btn-warning").click(function(){
	if($("div.indicatrix_body td>.glyphicon-ok:visible").length > 0){
		RF_SP2SwalMixin({
			title: "指标线面板关闭提示",
			text: "请先保存或删除所填",
			type: "warning",
			timer: 1900,
			showConfirmButton: false
		});
		return false;
	}
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
/*RF_SP2Store.stateObj.indicatrix_copy low up delFlag submitFlag*/
$(document).on("click", "#upflag_table>tbody .glyphicon-remove, #lowflag_table>tbody .glyphicon-remove", function(){
	/*RF_SP2Store.stateObj.indicatrix_copy.delFlag = true;
	RF_SP2Store.stateObj.indicatrix_copy.submitFlag = false;*/
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
			pullArr = RF_SP2Store.stateObj[iclassify].indicatrix_low;
		}else{
			pullArr = RF_SP2Store.stateObj[iclassify].indicatrix_up;
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
		var iflag = $("[id$=_chart_S]:visible").data("iflag");
		if(iflag == "initial"){
			getDataBuildBigS12S21({
				iclassify: iclassify,
				itargetchart: id
			});
		}else if(iflag == "XYOfPhase"){
			RF_SP2Store.util.graphStyleHandler({
				iclassify: iclassify,
				itargetchart: id,
				contextFlag: true,
				graphStyle: iflag
			});
		}else if(iflag == "XYOfMagnitude"){
			RF_SP2Store.util.graphStyleHandler({
				iclassify: iclassify,
				itargetchart: id,
				contextFlag: true,
				graphStyle: iflag
			});
		}else if(iflag == "XYdBOfMagnitude"){
			getDataBuildBigS12S21({
				iclassify: iclassify,
				itargetchart: id,
				contextFlag: true,
				graphStyle: iflag
			});
		}
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
	if(_.isEmpty(_.concat(RF_SP2Store.stateObj[iclassify].indicatrix_low, RF_SP2Store.stateObj[iclassify].indicatrix_up))) return false;
	if(!_.isNil(id)){
		RF_SP2Store.stateObj.indicatrix_state_arr = [];
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
		var diff = (RF_SP2Store.stateObj.indicatrix_min_max[1] - RF_SP2Store.stateObj.indicatrix_min_max[0])*0.02;
		/*判断低于区间*/
		_.forEach(RF_SP2Store.stateObj[iclassify].indicatrix_low, function(v, i){
			var data = [];
			var inde1 = _.indexOf(xCategories, v[0]);
			var inde2 = _.indexOf(xCategories, v[1]);
			// 如果索引值是-1
			var inde1_1Flag = false,
			inde2_1Flag = false;
			if(inde1 == -1){
				var findInde1 = _.findIndex(xCategories, function(va, ind){
					return va > v[0];
				});
				if(findInde1 == -1 || findInde1 == 0){
					inde1_1Flag = true;
				}else{
					var abs11 = Math.abs(v[0] - xCategories[findInde1-1]),
					abs12 = Math.abs(v[0] - xCategories[findInde1]);
					// 索引赋值
					if(abs11<abs12){
						inde1 = findInde1-1;
					}else{
						inde1 = findInde1;
					}
				}
			}
			if(inde2 == -1){
				var findInde2 = _.findLastIndex(xCategories, function(va, ind){
					return va < v[1];
				});
				if(findInde2 == -1 || findInde2 == xCategories.length-1){
					inde2_1Flag = true;
				}else{
					var abs21 = Math.abs(v[1] - xCategories[findInde2-1]),
					abs22 = Math.abs(v[1] - xCategories[findInde2]);
					// 索引赋值
					if(abs21<=abs22){
						inde2 = findInde2-1;
					}else{
						inde2 = findInde2;
					}
				}
			}
			if(inde1_1Flag || inde2_1Flag){
				RF_SP2SwalMixin({
					title: "自动标记指标线提示",
					text: "第"+(i+1)+"条指标线的X1或X2值找不到对应点",
					type: "warning",
					timer: 1900,
					showConfirmButton: false
				});
				return true;
			}
			// 如果索引值是-1结束
			data.push([inde1, v[2]+diff]);
			data.push([inde1, v[2]]);
			data.push([inde2, v[2]]);
			data.push([inde2, v[2]+diff]);
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
						var curSeriesArr = _.find(RF_SP2Store.stateObj.indicatrix_state_arr, (function(v, i){
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
						var curSeriesArr = _.find(RF_SP2Store.stateObj.indicatrix_state_arr, (function(v, i){
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
			RF_SP2Store.stateObj.indicatrix_state_arr.push({
				name: "低于指标#"+i,
				seriesName: iArr
			});
		});
		/*判断低于区间end*/
		/*判断高于区间*/
		_.forEach(RF_SP2Store.stateObj[iclassify].indicatrix_up, function(v, i){
			var data = [];
			var inde1 = _.indexOf(xCategories, v[0]);
			var inde2 = _.indexOf(xCategories, v[1]);
			// 如果索引值是-1
			var inde1_1Flag = false,
			inde2_1Flag = false;
			if(inde1 == -1){
				var findInde1 = _.findIndex(xCategories, function(va, ind){
					return va > v[0];
				});
				if(findInde1 == -1 || findInde1 == 0){
					inde1_1Flag = true;
				}else{
					var abs11 = Math.abs(v[0] - xCategories[findInde1-1]),
					abs12 = Math.abs(v[0] - xCategories[findInde1]);
					// 索引赋值
					if(abs11<abs12){
						inde1 = findInde1-1;
					}else{
						inde1 = findInde1;
					}
				}
			}
			if(inde2 == -1){
				var findInde2 = _.findLastIndex(xCategories, function(va, ind){
					return va < v[1];
				});
				if(findInde2 == -1 || findInde2 == xCategories.length-1){
					inde2_1Flag = true;
				}else{
					var abs21 = Math.abs(v[1] - xCategories[findInde2-1]),
					abs22 = Math.abs(v[1] - xCategories[findInde2]);
					// 索引赋值
					if(abs21<=abs22){
						inde2 = findInde2-1;
					}else{
						inde2 = findInde2;
					}
				}
			}
			if(inde1_1Flag || inde2_1Flag){
				RF_SP2SwalMixin({
					title: "自动标记指标线提示",
					text: "第"+(i+1)+"条指标线的X1或X2值找不到对应点",
					type: "warning",
					timer: 1900,
					showConfirmButton: false
				});
				return true;
			}
			// 如果索引值是-1结束
			data.push([inde1, v[2]-diff]);
			data.push([inde1, v[2]]);
			data.push([inde2, v[2]]);
			data.push([inde2, v[2]-diff]);
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
						var curSeriesArr = _.find(RF_SP2Store.stateObj.indicatrix_state_arr, (function(v, i){
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
						var curSeriesArr = _.find(RF_SP2Store.stateObj.indicatrix_state_arr, (function(v, i){
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
			RF_SP2Store.stateObj.indicatrix_state_arr.push({
				name: "高于指标#"+i,
				seriesName: iArr
			});
		});
		/*线段变色*/
		_.forEach(RF_SP2Store.stateObj.indicatrix_state_arr, function(o, ind){
			if(_.isEmpty(o.seriesName)) return true;
			_.find(series, function(oo){
				return oo.name == o.name;
			}).update({
				color: "#FF1493"
			});
		});
	}
	/*RF_SP2Store.stateObj.indicatrix_copy.delFlag = false;
	RF_SP2Store.stateObj.indicatrix_copy.submitFlag = true;*/
	/*RF_SP2Store.stateObj.indicatrix_copy.low = _.cloneDeep(RF_SP2Store.stateObj.indicatrix_low);
	RF_SP2Store.stateObj.indicatrix_copy.up = _.cloneDeep(RF_SP2Store.stateObj.indicatrix_up);*/
	$(".indicatrix_footin>.btn-warning").trigger("click");
});

/*2018-11-12更新*/
$(".indicatrix_body legend>span").click(function(){
	$('<tr><td><input type="text" class="form-control AwesompleteX input_X1"></td><td><input type="text" class="form-control AwesompleteX input_X2"></td><td><input type="text" class="form-control input_Y0"></td><td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>').appendTo($(this).parent().next().children("tbody")).find("input.AwesompleteX")
	.each(function(i, el){
		new Awesomplete(el, {
			list: RF_SP2Store.stateObj.smithSXCategories,
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
		indicatrixArr = RF_SP2Store.stateObj[iclassify].indicatrix_up;
		/*indicatrix_copyArr = RF_SP2Store.stateObj.indicatrix_copy.up;*/
	}else if($(this).parents().is("#lowflag_table")){
		indicatrixArr = RF_SP2Store.stateObj[iclassify].indicatrix_low;
		/*indicatrix_copyArr = RF_SP2Store.stateObj.indicatrix_copy.low;*/
	}
	var X1 = Math.min(Number(input_X1), Number(input_X2));
	var X2 = Math.max(Number(input_X1), Number(input_X2));
	var Y0 = Number(input_Y0);
	if(judgeLineSegmentIntersect(X1, X2, _.concat(RF_SP2Store.stateObj[iclassify].indicatrix_up, RF_SP2Store.stateObj[iclassify].indicatrix_low))){
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
	if(_.isEmpty(_.concat(RF_SP2Store.stateObj[iclassify].indicatrix_up, RF_SP2Store.stateObj[iclassify].indicatrix_low))) return false;
	$(".indicatrix_footin>.btn-warning").trigger("click");
	$("#upflag_table>tbody, #lowflag_table>tbody").empty();
	RF_SP2Store.stateObj[iclassify].indicatrix_up.length = 0;
	RF_SP2Store.stateObj[iclassify].indicatrix_low.length = 0;
	$(".indicatrix_footin>.btn-success").prop("disabled", true);
	$(".indicatrix_body legend>span").fadeIn(100);
	getDataBuildBigS12S21({
		iclassify: iclassify,
		itargetchart: id
	});
});

/*右键切换开始*/
$.contextMenu({
	selector: "#S11_chart_S, #S22_chart_S, #S12_chart_S, #S21_chart_S",
	callback: function(key, options) {
		if(options.$trigger instanceof jQuery){
			var curJQ = options.$trigger;
			if(_.isNil(curJQ.data("highcharts-chart"))){
				curJQ.empty();
			}else{
				curJQ.highcharts().destroy();
			}
			var $parent = curJQ.parent(),
			iclassify = curJQ.data("iclassify");
			curJQ.remove();
			$parent.append('<div id="'+iclassify+'_chart_S" data-iflag="'+key+'" data-iclassify="'+iclassify+'" style="display: block;"></div>');
		}
		RF_SP2Store.util.graphStyleDispatch({
			graphStyle: key
		});
	},
	items: {
		"Smith": {
			name: "Smith",
			icon: ""
		},
		"Polar": {
			name: "Polar",
			icon: ""
		},
		"XYOfPhase": {
			name: "XYOfPhase",
			icon: ""
		},
		"XYOfMagnitude": {
			name: "XYOfMagnitude",
			icon: ""
		},
		"XYdBOfMagnitude": {
			name: "XYdBOfMagnitude",
			icon: ""
		}
	}
});

// 查看所有图例
$('#RFSP2SmallLegend').click(function(e){
	e = e || window.event;
	$(".allLegends").css({
		left: e.pageX+"px",
		top: e.pageY+"px"
	}).fadeIn(200);
	var str = '';
	_.forEach(RF_SP2Store.stateObj.S2PSmallChartSmithData.S11, function(v, i){
		str+='<div class="row">'+
					'<div class="col-sm-2 col-md-2 col-lg-2"><p class="legend_color" style="background-color: '+v.color+'"></p></div>'+
					'<div class="col-sm-10 col-md-10 col-lg-10"><p class="legend_text">'+v.name+'</p></div>'+
				'</div>';
	});
	$(".allLegends_body>.container-fluid").empty().append(str);
});

$(".allLegends_tit>span").click(function(){
	$(".allLegends").fadeOut(200);
});