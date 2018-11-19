/*variable defined*/
var dataListDetailSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataListDetailStore = Object.create(null);
dataListDetailStore.mock = {
	allDetail: futuredGlobal.S_getDataListDetail().allDetail,
	allDetailThead: [],
	vectorMap: {
		filterArr: [],
		waferData: futuredGlobal.S_getMockWaferData()[0],
		waferData1: futuredGlobal.S_getMockWaferData()[1],
		curveTypeData: [futuredGlobal.S_getRF_SP2()[0], futuredGlobal.S_getRF_SP2()[1], futuredGlobal.S_getRF_SP2()[2], futuredGlobal.S_getDataListDetail().vectorMapChart[0], futuredGlobal.S_getDataListDetail().vectorMapChart[1]]
	},
	parameterMap: {
		parameter: ["参数1", "参数2", "参数3"]
	},
	dataCompare: futuredGlobal.S_getDataCompare(),
	boxlinediagram_data: futuredGlobal.S_getDataCompare().boxlinediagram.data["5"],
};
dataListDetailStore.state = {
	allDetail: {
		tbody: {
			scrollTop: 0,
			scrollLeft: 0
		}
	},
	vectorMap: {
		canKeydown: false,
		coordsArray: new HashTable(),
		waferMapObj: Object.create(null),
		curSelectedDie: Object.create(null),
		curveType: ["ID_VD", "OutputCurve", "SP2RF", "MOS_Cgg_Vgs_Vds_ext", "Noise_MOS_Normal"],
		curCurveTypeNo: 0,
		renderChartByCoordFlag: false,
		smithObjArr: []
	},
	parameterMap: {
		curChartContainerNum: 0,
		hasRender: false
	},
	chartTypeMap: {
		"good_rate": "spline",
		"histogram": "column",
		"boxlinediagram": "boxplot",
		"CPK": "line",
		// "correlationgraph": "scatter",
		"gaussiandistribution": "gaussiandistribution",
	},
};
dataListDetailStore.sellectObj = {
	selectItem: ["93"]
};

/*绘制参数数据分页表格*/
function renderTheadTbody(obj){
	var str = '<tr>';
	if(obj.th){
		if(obj.name == "位置"){
			str = '<tr><th>类型</th><th>Die编号</th><th>Quality</th><th>'+obj.name+'</th>';
		}else{
			str = '<tr><th></th><th></th><th></th><th>'+obj.name+'</th>';
		}
	}
	var thead = dataListDetailStore.mock.allDetail.thead[0];
	_.forEach(obj.data, function(v, i){
		if(obj.th){
			str+='<th>'+v+'</th>';
		}else if(obj.td){
			if(i == 2){
				if(v == 1){
					str+='<td>Pass</td>';
				}else{
					str+='<td style="color: red;">Fail</td>';
				}
			}else if(i > 3){
				if(parseFloat(v) > parseFloat(thead.UpLimit[i-4])  || parseFloat(v) < parseFloat(thead.LowerLimit[i-4])){
					str+='<td style="color: red;">'+v+'</td>';
				}else{
					str+='<td>'+v+'</td>';
				}
			}else{
				str+='<td>'+v+'</td>';
			}
		}
	});
	str+='</tr>';
	return str;
}

/*map良率分布图绘制*/
function draw_map_good_rate_distribution(that, i){
	var inH = that.innerWidth();
	that.innerHeight(inH*0.8);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.append("<div class='criterion_"+canvasID+"'></div>");
	buildColorGradation({
		width: inH,
		height: inH*0.8,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: futuredGlobal.S_getMockWaferData()[0],
		spacePercent: {
			x: 0.1,
			y: 0
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
	that.innerHeight(inH*0.8);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.after("<div class='criterion_"+canvasID+"'><div class='colorGradient'></div></div>");
	buildColorGradation({
		width: inH,
		height: inH*0.8,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: copyData,
		spacePercent: {
			x: 0.1,
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
	_.forOwn(countObj, function(v, k){
		that.parent().next().find("th").eq(k-1).text(k+"区间");
		that.parent().next().find("td").eq(k-1).text(v+"个");
	});
}

/*其他图表绘制*/
function draw_other_chart(that, controls, chartType){
	var container = that.attr("id"),
	title_text,
	subtitle_text = null,
	xAxis,
	yAxis,
	series,
	callback = null;
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
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i){
				var item = {};
				item.name = "wafer"+v+"频率分布";
				item.type = "column";
				item.data = [
					2, 8, 10, 5, 15, 20, 3, 7, 10, 20
				];
				iserise.push(item);
			});
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i){
				var item = {};
				item.name = "wafer"+v+"频率累加";
				item.type = "line";
				item.data = [
					2, 10, 20, 25, 40, 60, 63, 70, 80, 100
				];
				iserise.push(item);
			});
			series = iserise;
		break;

		case "boxlinediagram":
			title_text = "箱线图-"+iparam;
			xAxis = {
						categories: _.forEach(_.cloneDeep(dataListDetailStore.sellectObj.selectItem), function(v, i, arr){
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
			var iidata = dataListDetailStore.mock.boxlinediagram_data;
			var iidata1 = [];
			var iidata2 = [];
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i, arr){
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
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i){
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

		case "gaussiandistribution":
			title_text = "高斯分布图-"+iparam;
			xAxis = [{
				categories: _.range(1, 9, 1),
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
					text: '正态分布',
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

			var lowerBound = 10, upperBound = 30;
			var normalY = function(x, mean, stdDev) {
				return Math.exp((-0.5) * Math.pow((x - mean) / stdDev, 2)) * 1000;
			};
			var getMean = function(lowerBound, upperBound) {
				return (upperBound + lowerBound) / 2;
			};
			// distance between mean and each bound of a 95% confidence interval 
			// is 2 stdDeviation, so distance between the bounds is 4
			var getStdDeviation = function(lowerBound, upperBound) {
				return (upperBound - lowerBound) / 4;
			};
			var generatePoints = function(lowerBound, upperBound) {
				var stdDev = getStdDeviation(lowerBound, upperBound); 
				var min = lowerBound - 2 * stdDev;
				var max = upperBound + 2 * stdDev;
				var unit = (max - min) / 100;
				return _.range(min, max, unit);
			};
			var mean = getMean(lowerBound, upperBound);
			var stdDev = getStdDeviation(lowerBound, upperBound);
			var points = generatePoints(lowerBound, upperBound);
			var seriesData = points.map(function(x){
				return ({ x: x, y: normalY(x, mean, stdDev)});
			});
			var iiiiData = [];
			_.forEach(seriesData, function(v, i){
				if(i%13 == 0){
					iiiiData.push(v.y/10);
				}
			});
			iiiiseries = [{
					name: '频率',
					type: 'column',
					data: [0.5, 2.5, 7, 26, 38, 20, 5.5, 0.5],
					tooltip: {
						valueSuffix: '%'
					}
				}, {
					name: '正态分布',
					type: 'spline',
					yAxis: 1,
					data: iiiiData,
					// data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
					tooltip: {
						valueSuffix: ''
					}
				}];
			series = iiiiseries;
			callback = function(ichart){
				var $chart_foot = $("#"+container).parent().next();
				var $table1_tds = $chart_foot.find("div.row>div").eq(0).find("tbody td");
				var $table2_tds = $chart_foot.find("div.row>div").eq(1).find("tbody td");
				$table1_tds.eq(0).data("ivalue", 0.00000498);
				$table1_tds.eq(1).data("ivalue", 0.000005);
				$table1_tds.eq(2).data("ivalue", 0.00000623);
				$table1_tds.eq(3).data("ivalue", 0.00000423);
				$table2_tds.eq(0).data("ivalue", 0.000004991);
				$table2_tds.eq(1).data("ivalue", Math.sqrt(0.000005*1.5));
				$table2_tds.eq(2).data("ivalue", 0.000005*1e8*1.5/1e8);
				$chart_foot.find("tbody td").each(function(){
					$(this).attr("title", $(this).data("ivalue")).text($(this).data("ivalue"));
				});
			};
		break;
		/*良品率图*/
		default:
			title_text = "良品率图-"+iparam;
			var item = {};
			item.name = iparam;
			item.data = [];
			var iiiiicategories = [];
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i, arr){
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
		chartClassify: controls,
		callback: callback
	});
}

/*窗口大小改变事件函数*/
function calculateLayout(wi, hi, mapObj){
	if($(".g_menu li[role='presentation'].active").data("iclassify") == "vectorMap"){
		var maxmin;
		var winH = $(window).height(), winW = $(window).width(), vectorMap_rH = $(".vectorMap_r").innerHeight(), vectorMap_rW = $(".vectorMap_r").innerWidth();
		maxmin = {
			w: _.sortBy([winW, vectorMap_rW])[0],
			h: _.sortBy([winH, vectorMap_rH])[0],
		};
		var finall = _.sortBy([maxmin.w, maxmin.h])[1]*0.78;
		var container = mapObj.container;
		var can = document.getElementById(container);
		var oriW = can.width;
		var oriH = can.height;
		var ctx = can.getContext('2d');
		ctx.clearRect(0, 0, oriW, oriH);
		can.width = finall;
		can.height = finall*0.8;
		mapObj.setPlotParam({
			centerX: finall/2,
			centerY: finall*0.4,
			r: finall*0.4,
		});
		mapObj.plot();
	}
}

function commonCalcLayout(){
	$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
	$(".vectorMap_l, .vectorMap_r").innerHeight($("#vectorMap").innerHeight());

	$(".allDetail_body .table_body").innerHeight($(".allDetail_body").innerHeight() - $(".allDetail_body .table_head").innerHeight());
	if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+7){
		$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - 7);
	}
}

function drawDbCurve(obj){
	var container = obj.container;
	var xCategories = obj.xCategories;
	var series = obj.series;
	var msgDom = obj.msgDom;
	var legend_enabled = obj.legend_enabled || false;
	var zoomType = obj.zoomType || "None";
	var resetZoomButton = obj.resetZoomButton;
	var text = obj.text || null;
	var chart = Highcharts.chart(container, {
		chart: {
			type: 'line',
			zoomType: zoomType,
			resetZoomButton: resetZoomButton
		},
		title: {
			text: text
		},
        lang: {
            loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
        },
        legend: {
			enabled: legend_enabled
		},
	    xAxis: {
			title: {
				text: "GHz",
			}, 
			categories : xCategories,
		}, 
		yAxis: {
			title: {
				text: "dB",
			},
		    gridLineColor: '#eee',
		    gridLineWidth: 1,
		  /*  labels: {
		      step: 0.01
	    	}  */
		},
		series: series,
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function (e) {
				return '<b>'+this.series.name+'</b><br>'+this.x+' GHz, '+this.y+' dB';
            },
            useHTML: true
			/*headerFormat: '<b>{series.name}</b><br>',
			pointFormat: option.data.xData[0][point.index]+' MHz, {point.y} db'*/
		},
		plotOptions: {
			series: {
				point: {
					events: {
						mouseOver: function (pa) {
							/*console.log(this);
							console.log(pa);*/
							var x = xCategories[this.x] ;
							var y = this.y ;
							var str = y+" dB,"+x+" GHz" ;
							msgDom && msgDom.find(".Smith_Msg2").text(str);
						}
					}
				},
				showCheckbox: true
			}
		},
	});
	return chart;
}

/*矢量图分页SP2RF绘制*/
function drawDbCurveANDSmith(obj) {
	var smithAndCurve = obj.smithAndCurve;
	var container = obj.container;
	/*首先构造内部容器*/
	var str = '<div class="panel panel-info" data-dbcurveandsmith="S11">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S11'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S11</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S12">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S12'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S12</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S21">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S21'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S21</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S22">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S22'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S22</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>';
    $("#"+container).empty().append(str).find("[data-dbcurveandsmith]").each(function(){
    	var dbcurveandsmith = $(this).data("dbcurveandsmith");
    	var iW = $(this).find(".panel-body").innerWidth();
    	var multiples = 0.5;
    	if($(window).width() <= 1199) multiples = 1;
    	$(this).find(".picturetop").innerHeight(iW*multiples);
    	if(dbcurveandsmith == "S11" || dbcurveandsmith == "S22"){
    		var dom1 = $(this).find(".picturetop")[0];
    		var msgdom1  = $(this).find(".picturebottom")[0];
    		var title = [''];
    		var legendName1 = [dbcurveandsmith];
    		var smith1 = smithChart(dom1, title, legendName1, [smithAndCurve[dbcurveandsmith]], dbcurveandsmith, msgdom1);
    		if(dataListDetailStore.state.vectorMap.smithObjArr.length == 2){
    			dataListDetailStore.state.vectorMap.smithObjArr.length = 0;
    		}
    		dataListDetailStore.state.vectorMap.smithObjArr.push(smith1);
    	}else{
    		$('<div id="'+container+'_'+dbcurveandsmith+'"></div>').appendTo($(this).find(".picturetop")).innerHeight($(this).find(".picturetop").innerHeight());
    		//曲线
    		var iiData = smithAndCurve[dbcurveandsmith];
    		var objec = {};
    		objec.xCategories = [];
    		_.forEach(iiData, function(v, i){
    			objec.xCategories.push(Math.floor(v[0] / 10000000)/100);
    		});
    		objec.series = [];
    		objec.series[0] = {};
    		objec.series[0].data = [];
    		_.forEach(iiData, function(v, i){
    			objec.series[0].data.push(parseFloat(v[1]));
    		});
    		objec.container = $(this).find(".picturetop").children("div").attr("id");
    		objec.msgDom = $(this).find(".picturebottom");
    		objec.resetZoomButton = {
    			position: {
    				align: 'left', // by default
    				// verticalAlign: 'top', // by default
    				x: 0,
    				y: 0
    			},
    			relativeTo: 'chart'
    		};
    		drawDbCurve(objec);
    	}
    });
}

/*矢量图分页chart绘制*/
function drawCurve(obj){
	var dimension = obj.dimension;
	var curveType = obj.curveType;
	var container = obj.container;
	var xAxisTitle = obj.xAxisTitle;
	var yAxisTitle = obj.yAxisTitle;
	var CVX = obj.CVX;
	var CVY = obj.CVY;
	var CVZ = obj.CVZ;
	var x_axis = obj.x_axis;
	var y_axis = obj.y_axis;
	var chart;
	var baseOption = {
		credits: {
			enabled: false
		},
		title: {
			text: curveType
		},
		subtitle: {
			text: null
		},
		lang: {
		    loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
		},
        xAxis: {
			title: {
				text: xAxisTitle,
			},
			lineColor: 'black',
		},
		yAxis: [{
			lineWidth: 1,
			lineColor: 'black',
			arrow: true,
			reversed: false,
			title: {
				text: yAxisTitle,
				align: 'high',
				rotation: 0,
			},
		}],
	};
	if(dimension == 3){
		var yData  = [];
		var arra = [];
		_.times(CVX.length, function(i){
			var item = [];
			_.forEach(CVX[i], function(vv, ii){
				var item1 = {};
				item1.x = CVX[i][ii];
				item1.y = CVY[i][ii];
				item1.z = CVZ[i];
				item.push(item1);
			});
			arra.push(item);
		});
		_.forEach(arra, function(v, i){
			var sortArr = _.sortBy(arra[i], function(vv, ii){
				return vv.x;
			});
			arra[i] = sortArr;
		});
		_.forEach(arra, function(v, i){
			var item = {};
			item.name = "P="+v[0].z;
			item.data = [];
			_.forEach(arra[i], function(vv, ii){
				item.data.push(vv.y);
			});
			yData.push(item);
		});
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '{point.x}, {point.y}'
				},
				series: yData
			})
		);
	}
	else if(dimension == 2){ 
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '{point.x}, {point.y}'
				},
				series: [{data: y}]
			})
		);
	}
	return chart;
}

/*获取矢量Map的曲线数据*/
function drawVectorChart(obj) {
	if (!_.isEmpty(obj.data.curveinfos)) {
		var itemData = _.find(obj.data.curveinfos, function(v, i){
			return v.curveType == obj.curveType;
		});
		var dimension = itemData.dimension;
		var x_axis, y_axis, CVX, CVY, CVZ;
		var Subdie = itemData.Subdie;
		var DeviceGroup = itemData.DeviceGroup;
		var xAxisTitle = itemData.ParamX + (itemData.ParamXUnit == "" ? "" : ("(" + itemData.ParamXUnit + "）"));
		var yAxisTitle = itemData.ParamY + (itemData.ParamYUnit == "" ? "" : ("(" + itemData.ParamYUnit + "）"));
		if(dimension == 0){
			console.log("只加载史密斯");
			var smithAndCurve = itemData.smithAndCurve;
			drawDbCurveANDSmith({
				smithAndCurve: smithAndCurve,
				container: obj.container
			});
		}else if(dimension == 1){
			dataListDetailSwalMixin({
				title: '加载数据',
				text: "当前曲线仅有一列数据！",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false,
				timer: 1500
			});
		}else if(dimension == 2){
			x = itemData.axis[0].curvedatas;
			y = itemData.axis[1].curvedatas;
			drawCurve({
				dimension: dimension,
				curveType: obj.curveType,
				container: obj.container,
				xAxisTitle: xAxisTitle,
				yAxisTitle: yAxisTitle,
				CVX: CVX,
				CVY: CVY,
				CVZ: CVZ,
				x_axis: x_axis,
				y_axis: y_axis
			});
		}else if(dimension == 3){
			CVZ = itemData.ZAxis;
			CVX = itemData.XAxis;
			CVY = itemData.YAxis;
			drawCurve({
				dimension: dimension,
				curveType: obj.curveType,
				container: obj.container,
				xAxisTitle: xAxisTitle,
				yAxisTitle: yAxisTitle,
				CVX: CVX,
				CVY: CVY,
				CVZ: CVZ,
				x_axis: x_axis,
				y_axis: y_axis
			});
		}
		obj.callback && obj.callback(Subdie, DeviceGroup);
	}
}

/*矢量图分页chart container Build*/
function buildChartContainer(curveType){
	var str = '';
	if(_.indexOf(dataListDetailStore.state.vectorMap.curveType, curveType) > -1){
		str='<div id="'+curveType+'_charts_'+dataListDetailStore.state.vectorMap.curCurveTypeNo+'"></div>';
		$("div.all_charts_rows>div."+curveType+"_col .panel_chart_body").empty().append(str);
		$("div.all_charts_rows>div."+curveType+"_col").fadeIn(200);
	}else{
		str='<div class="col-sm-12 col-md-12 col-lg-12 '+curveType+'_col">'+
				'<div class="panel panel-info">'+
				  	'<div class="panel-heading">'+
				    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+curveType+
				  	'</div>'+
				  	'<div class="panel-body">'+
				    	'<div class="panel_chart_body"><div id="'+curveType+'_charts_'+dataListDetailStore.state.vectorMap.curCurveTypeNo+'"></div></div>'+
				    	'<div class="panel_chart_foot"></div>'+
				  	'</div>'+
				'</div>'+
			'</div>';
		$("div.all_charts_rows").append(str);
		dataListDetailStore.state.vectorMap.curveType.push(curveType.toString());
	}
	var returnID = curveType+'_charts_'+dataListDetailStore.state.vectorMap.curCurveTypeNo;
	dataListDetailStore.state.vectorMap.curCurveTypeNo++;
	return returnID;
}

/*根据坐标绘制chart*/
function renderChartByCoord(){
	$("div.all_charts_rows>div").fadeOut(100);
	/*这里是随机数*/
	var data = dataListDetailStore.mock.vectorMap.curveTypeData[_.random(0, 4, false)];
	console.log(data.curveinfos);
	_.forEach(data.curveinfos, function(v, i){
		var ID = buildChartContainer(v.curveType);
		console.log(ID)
		drawVectorChart({
			data: data,
			curveType: v.curveType,
			container: ID,
			callback: null
		});
	});
}

/*page preload*/
$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
$(".vectorMap_l, .vectorMap_r").innerHeight($("#vectorMap").innerHeight());
_.forOwn(dataListDetailStore.mock.allDetail.thead[0], function(v, k){
	switch (k){
		case "PassPercent":
			dataListDetailStore.mock.allDetailThead[0] = v;
		break;
		case "UpLimit":
			dataListDetailStore.mock.allDetailThead[1] = v;
		break;
		case "LowerLimit":
			dataListDetailStore.mock.allDetailThead[2] = v;
		break;
		default:
			dataListDetailStore.mock.allDetailThead[3] = v;
	}
});
_.forEach(dataListDetailStore.mock.allDetailThead, function(v, i){
	var name;
	switch (i){
		case 0:
			name = "合格率%";
		break;
		case 1:
			name = "上限";
		break;
		case 2:
			name = "下限";
		break;
		default:
			name = "位置";
	}
	var str = renderTheadTbody({
		data: v,
		th: true,
		name: name
	});
	$("#allDetail .allDetail_body .table_head thead").append(str);
});
$(".allDetail_body .table_body").innerHeight($(".allDetail_body").innerHeight() - $(".allDetail_body .table_head").innerHeight());
_.forOwn(dataListDetailStore.mock.allDetail.tbody[0], function(v, k){
	var str = renderTheadTbody({
		data: v,
		td: true
	});
	$("#allDetail .allDetail_body .table_body tbody").append(str);
});
if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+7){
	$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - 7);
}

/*page onload*/
$(function(){
	$("#allDetail>.table_data").html(futuredGlobal.S_getDataListDetail().allDetail);

	/*加载矢量图*/
	var dieDataList = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0];
	dataListDetailStore.mock.vectorMap.filterArr = [];
	_.forEach(dieData, function(v, i){
		dataListDetailStore.mock.vectorMap.filterArr.push(_.keys(v)[0]);
	});
	var maxWidth = ($(".vectorMap_r").innerHeight() - 20)*1.25;
	var maxHeight = $(".vectorMap_r").innerHeight() - 20;
	var dieData = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0].m_DieDataListNew;
	var currentDieCoord;
	_.forEach(dieData, function(v, i){
		var flag = false;
		_.forOwn(v, function(vv, k){
			if(vv == 1){
				currentDieCoord = k.toString();
				flag = true;
			}
		});
		if(flag) return false;
	});
	if(_.isNil(currentDieCoord)) currentDieCoord = "0:0";
	dataListDetailStore.state.vectorMap.waferMapObj = buildColorGradation({
		/*// 自定义标志
		custom: {
			WH: true
		},
		maxWidth: maxWidth,
		maxHeight: maxHeight,*/
		width: maxWidth,
		height: maxHeight,
		container: 'canvas_vectorMap',
		bgFillColor: "#314067",
		waferData: dataListDetailStore.mock.vectorMap.waferData1,
		// 空白空间比例
		spacePercent: {
			x: 0.1,
			y: 0
		},
		m_DieDataListNew: dieData,
		colorGradation: {
			limitColor: "#FF0000",
			floorColor: "#008000",
			nums: 256
		},
		/*存放过滤后数据坐标 "x:y"*/
		filterArr: dataListDetailStore.mock.vectorMap.filterArr,
		currentDieCoord: currentDieCoord,
		// 第一次加载标志。可以做一些事情
		isFirst: true,
		coordsArra: dataListDetailStore.state.vectorMap.coordsArray,
		returnFlag: true,
		addEvent: true,
		curSelectedDie: dataListDetailStore.state.vectorMap.curSelectedDie,
		vectorMap: true,
		callback: function(positionFlag){
			$(".vectorMap_l .positionFlag_div>img").attr("src", "../img/modules/dataListDetail/"+positionFlag+".png");
			var Yield = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0].Yield;
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(1)>td:eq(1)").text(Yield*100 + "%");
			var countByObj = _.countBy(dieData, function(v, i){
				var ret;
				_.forOwn(v, function(vv, kk){
					ret = vv;
				});
				return ret;
			});
			var qualifiedNu = countByObj["1"];
			var unQualifiedNu = countByObj["255"];
			if(_.isNil(qualifiedNu)) qualifiedNu = 0;
			if(_.isNil(unQualifiedNu)) unQualifiedNu = 0;
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(2)>td:eq(1)").text(qualifiedNu);
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(3)>td:eq(1)").text(unQualifiedNu);
		},
		clickCallback: function(cor){
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+cor+"）");
			renderChartByCoord();
		},
		keydownCallback: function(cor){
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+cor+"）");
			renderChartByCoord();
		},
		resizeCallback: function(wi, hi, mapObj){
			$(window).on("resize", _.debounce(function(){
				calculateLayout(wi, hi, mapObj);
			}, 200));
		}
	});

	/*预加载参数图*/
	$("#parameterMap>div.panel").each(function(i, el){
		var iicontrols = $(el).data("iallstatistics");
		var str = '<div class="container-fluid">';
		if(["good_rate", "CPK"].indexOf(iicontrols) > -1){
				str+='<div class="row">';
					str+='<div class="col-sm-12 col-md-6 col-lg-6">';
					str+='<div class="panel panel-info">'+
						  	'<div class="panel-heading">'+
						    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+dataListDetailStore.mock.parameterMap.parameter.join("&")+
						  	'</div>'+
						  	'<div class="panel-body">'+
						    	'<div class="container-fluid">'+
						    		'<div class="chart_title"></div>'+
						    		'<div class="chart_body"><div id="'+(iicontrols+dataListDetailStore.state.parameterMap.curChartContainerNum)+'" data-iparam="'+dataListDetailStore.mock.parameterMap.parameter.join("&")+'"></div></div>'+
						    		'<div class="chart_foot"></div>'+
						    	'</div>'+
						  	'</div>'+
						'</div>';
					str+='</div>';
				str+='</div>';
				dataListDetailStore.state.parameterMap.curChartContainerNum++;
		}else{
			var inStr = '';
			if(_.indexOf(["gaussiandistribution"], iicontrols) > -1){
				inStr = '<div class="container-fluid">'+
								'<div class="row">'+
									'<div class="col-sm-12 col-md-12 col-lg-7">'+
										'<table class="table table-striped table-bordered table-condensed">'+
											'<thead>'+
												'<tr>'+
													'<th>中值</th>'+
													'<th>平均值</th>'+
													'<th>最大值</th>'+
													'<th>最小值</th>'+
												'</tr>'+
											'</thead>'+
											'<tbody>'+
												'<tr>'+
													'<td>中值</td>'+
													'<td>平均值</td>'+
													'<td>最大值</td>'+
													'<td>最小值</td>'+
												'</tr>'+
											'</tbody>'+
										'</table>'+
									'</div>'+
									'<div class="col-sm-12 col-md-12 col-lg-5">'+
										'<table class="table table-striped table-bordered table-condensed">'+
											'<thead>'+
												'<tr>'+
													'<th>期望</th>'+
													'<th>标准差</th>'+
													'<th>方差</th>'+
												'</tr>'+
											'</thead>'+
											'<tbody>'+
												'<tr>'+
													'<td>期望</td>'+
													'<td>标准差</td>'+
													'<td>方差</td>'+
												'</tr>'+
											'</tbody>'+
										'</table>'+
									'</div>'+
								'</div>'+
							'</div>';
			}
			dataListDetailStore.mock.parameterMap.parameter.map(function(v, i){
				if(i%2 == 0){
					str+='<div class="row">';
				}
				str+='<div class="col-sm-12 col-md-6 col-lg-6">';
				str+='<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+v+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">'+
					    		'<div class="chart_title"></div>'+
					    		'<div class="chart_body"><div id="'+(iicontrols+dataListDetailStore.state.parameterMap.curChartContainerNum)+'" data-iparam="'+v+'"></div></div>'+
					    		'<div class="chart_foot">'+inStr+'</div>'+
					    	'</div>'+
					  	'</div>'+
					'</div>';
				str+='</div>';
				if(i%2 != 0){
					str+='</div>';
				}
				dataListDetailStore.state.parameterMap.curChartContainerNum++;
			});
		}
		str+='</div>';
		$(this).children(".panel-body").append(str);
	});

	/*预加载参数图分页chart容器*/
	_.forEach(dataListDetailStore.state.vectorMap.curveType, function(v){
		buildChartContainer(v);
	});
});

/*event handler*/
/*浏览器窗口大小改变普通事件*/
$(window).on("resize", _.debounce(commonCalcLayout, 200));
$(window).on("resize", _.debounce(function(){
	_.forEach(dataListDetailStore.state.vectorMap.smithObjArr, function(v, i, arr){
		arr[i].onresize();
	});
}, 200));

$(".allDetail_body .table_body").on("scroll", function(e){
	if(dataListDetailStore.state.allDetail.tbody.scrollTop - 1 < $(this).scrollTop() && dataListDetailStore.state.allDetail.tbody.scrollTop + 1 > $(this).scrollTop()){
		$(".allDetail_body .table_head").scrollLeft($(this).scrollLeft());
	}
	dataListDetailStore.state.allDetail.tbody.scrollTop = $(this).scrollTop();
	dataListDetailStore.state.allDetail.tbody.scrollLeft = $(this).scrollLeft();
});

/*点击收起*/
$(document).on("click", ".vectorMap_l div.panel-heading>span.glyphicon, #parameterMap div.panel-heading>span.glyphicon", function(){
	$(this).toggleClass("glyphicon-menu-down glyphicon-menu-right").parent().parent().toggleClass("panel-info panel-success");
	if($(this).hasClass("glyphicon-menu-right")){
		$(this).parent().next().slideUp(200);
	}else{
		$(this).parent().next().slideDown(200);
	}
});

$(document).on('shown.bs.tab', 'div.g_menu a[data-toggle="tab"]', function(e){
	var licontrols = $(e.target).attr("aria-controls");
	if(licontrols == "parameterMap" && !dataListDetailStore.state.parameterMap.hasRender){
		dataListDetailSwalMixin({
			title: '加载数据',
			text: "正在绘图中......",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false,
			timer: 1000
		}).then(function(){
			dataListDetailSwalMixin({
				title: '加载数据',
				text: "正在绘图中......",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false,
			});
			/*绘制参数图*/
			$("#parameterMap>div.panel").each(function(i, el){
				var iicontrols = $(el).data("iallstatistics");
				if(iicontrols == "map_good_rate_distribution"){
					/*Map良率分布*/
					$(el).children(".panel-body").find(".chart_body>div").each(function(i, ele){
						var that = $(this);
						draw_map_good_rate_distribution(that, i);
					});
				}else if(iicontrols == "map_color_order_distribution"){
					/*Map色阶分布*/
					var copyData = _.cloneDeep(futuredGlobal.S_getMockWaferData()[0]);
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
					$(el).children(".panel-body").find(".chart_body>div").each(function(i, ele){
						var that = $(this);
						draw_map_color_order_distribution(that, i, copyData, theMax, theMin, lowwer, upper, midder, twoDiff, threeDiff, fourDiff, fiveDiff, otherColor);
					});
				}else{
					var chartType = _.find(dataListDetailStore.state.chartTypeMap, function(o, k){
						return k == iicontrols;
					});
					$(el).children(".panel-body").find(".chart_body>div").each(function(){
						var that = $(this);
						draw_other_chart(that, iicontrols, chartType);
					});
				}
			});
			swal.clickCancel();
			dataListDetailStore.state.parameterMap.hasRender = true;
		});
	}else if(licontrols == "allDetail"){
		_.debounce(commonCalcLayout, 200)();
	}else if(licontrols == "vectorMap" && !dataListDetailStore.state.vectorMap.renderChartByCoordFlag){
		/*初始化曲线图*/
		renderChartByCoord();
		dataListDetailStore.state.vectorMap.renderChartByCoordFlag = true;
	}
});