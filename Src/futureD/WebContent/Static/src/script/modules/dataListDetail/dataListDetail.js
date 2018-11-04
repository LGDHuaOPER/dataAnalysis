/*variable defined*/
var dataListDetailStore = Object.create(null);
dataListDetailStore.mock = {
	allDetail: futuredGlobal.S_getDataListDetail().allDetail,
	allDetailThead: [],
	vectorMap: {
		filterArr: [],
		waferData: futuredGlobal.S_getMockWaferData()[0],
		waferData1: futuredGlobal.S_getMockWaferData()[1]
	},
	parameterMap: {
		parameter: ["参数1", "参数2"]
	}
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
		curSelectedDie: Object.create(null)
	},
	parameterMap: {
		curChartContainerNum: 0
	},
	chartTypeMap: {
		"good_rate": "spline",
		"histogram": "column",
		"boxlinediagram": "boxplot",
		"CPK": "line",
		// "correlationgraph": "scatter",
		"gaussiandistribution": "gaussiandistribution",
	}
};
dataListDetailStore.sellectObj.selectItem = ["93"];

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
	that.innerHeight(inH);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.append("<div class='criterion_"+canvasID+"'></div>");
	buildColorGradation({
		width: inH,
		height: inH,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: futuredGlobal.S_getMockWaferData()[0],
		spacePercent: {
			x: 0.05,
			y: 0.05
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
function draw_map_color_order_distribution(that, i, copyData, firstDiff, secondDiff, firstMax, firstMin, secondMax, secondMin, otherColor){
	var inH = that.innerWidth();
	that.innerHeight(inH);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.append("<div class='criterion_"+canvasID+"'></div>");
	buildColorGradation({
		width: inH,
		height: inH,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: copyData,
		spacePercent: {
			x: 0.05,
			y: 0.05
		},
		m_DieDataListNew: copyData.waferMapDataList[i%5].m_DieDataListNew,
		colorGradation: {
			limitColor1: "#00FF00",
			floorColor1: "#0000FF",
			limitColor2: "#FF0000",
			floorColor2: "#0000FF",
			nums1: firstDiff,
			nums2: secondDiff
		},
		colorOrder: true,
		firstMax: firstMax,
		firstMin: firstMin,
		secondMax: secondMax,
		secondMin: secondMin,
		otherColor: otherColor
	});
	/*色阶标尺*/
	var colorGradientDom = that.parent().next().children(".colorGradient");
	colorGradientDom.width(that.parent().next().width() - 60).height(that.parent().next().height() - 30);

	_.times(secondDiff, function(ii){
	    var color = getGradientColor ('#0000FF', '#FF0000', secondDiff, secondDiff-ii);
		var height = colorGradientDom.height();
		var width = colorGradientDom.width() / ((firstDiff+secondDiff)*1.2);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+height+"px; width: "+width+"px'></span>");
	});
	_.times(firstDiff, function(ii){
	    var color = getGradientColor ('#00FF00', '#0000FF', firstDiff, firstDiff-ii);
		var height = colorGradientDom.height();
		var width = colorGradientDom.width() / ((firstDiff+secondDiff)*1.2);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+height+"px; width: "+width+"px'></span>");
	});
}

/*其他图表绘制*/
function draw_other_chart(that, controls, chartType){
	var container = that.attr("id"),
	title_text,
	subtitle_text = null,
	xAxis,
	yAxis,
	series;
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
				item.name = "wafer"+v;
				item.type = "column";
				item.data = [
					2, 8, 10, 5, 15, 20, 3, 7, 10, 20
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

		case "correlationgraph":
			title_text = "相关性图-"+iparam;
			xAxis = {
				title: {
					enabled: true,
					text: dataListDetailStore.stateObj.curParam.other[0],
					/*style:{"fontSize":"16px","fontFamily":"arial","float":"top"}*/
				},
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
				/*labels: {
            	useHTML: true,
                formatter: function () {
                    return '<a href="javascript:alert(\'hello\')">' + this.value + '</a>';
            	}
            },*/
			};
			yAxis = {
				title: {
					text: dataListDetailStore.stateObj.curParam.other[1]
				}
			};
			var iiiidata = dataListDetailStore.mock.dataCompare.correlationgraph;
			var iiiiseries = [];
			_.forEach(dataListDetailStore.sellectObj.selectItem, function(v, i, arr){
				var item = {};
				item.name = "wafer"+v;
				item.data = [];
				_.forOwn(iiiidata.dataMap, function(vv, k){
					var kk = i%3 + 1;
					if(k == "wafer"+kk){
						if(vv.X.length > 0){
		    			  _.forEach(vv.X, function(vvv, iii){
		    			  	item.data.push([vvv, vv.Y[iii]]);
		    			  });
		    		  }
					}
				});
				iiiiseries.push(item);
			});
			series = iiiiseries;
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
		chartClassify: controls
	});
}

/*page preload*/
$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
$(".vectorMap_l, .vectorMap_r").innerHeight($(".tab-content div[role='tabpanel']").innerHeight());
$(".table_data").css("max-height", ($(".tab-content").innerHeight() - 20)+"px");
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
	var maxWidth = 700;
	var maxHeight = 700;
	var dieData = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0].m_DieDataListNew;
	dataListDetailStore.state.vectorMap.waferMapObj = buildColorGradation({
		// 自定义标志
		custom: {
			WH: true
		},
		maxWidth: maxWidth,
		maxHeight: maxHeight,
		container: 'canvas_vectorMap',
		bgFillColor: "#314067",
		waferData: dataListDetailStore.mock.vectorMap.waferData1,
		// 空白空间比例
		spacePercent: {
			x: 0.15,
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
		currentDieCoord: "0:0",
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
		},
		keydownCallback: function(cor){
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+cor+"）");
		}
	});

	/*预加载参数图*/
	$("#parameterMap>div.panel").each(function(i, el){
		var iicontrols = $(el).data("iallstatistics");
		var str = '<div class="container-fluid">';
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
				    		'<div class="chart_body"><div id="'+(iicontrols+dataListDetailStore.state.parameterMap.curChartContainerNum)+'"></div></div>'+
				    		'<div class="chart_foot"></div>'+
				    	'</div>'+
				  	'</div>'+
				'</div>';
			str+='</div>';
			if(i%2 != 0){
				str+='</div>';
			}
			dataListDetailStore.state.parameterMap.curChartContainerNum++;
		});
		str+='</div>';
		$(this).children(".panel-body").append(str);
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
			var firstMax = 400;
			var secondMax = 400;
			var firstMinArr = [];
			var secondMinArr = [];
			_.forEach(copyData.waferMapDataList, function(v, i, arr){
				_.forEach(arr[i].m_DieDataListNew, function(vv, ii, arra){
					_.forOwn(arra[ii], function(vvv, k, obj){
						var iNo = _.random(1, 512, false);
						if(vvv == 1){
							if(iNo > firstMax) iNo = firstMax;
							obj[k] = {bin: 1, color: "1:"+iNo};
							firstMinArr.push(iNo);
						}else if(vvv == 255){
							if(iNo > secondMax) iNo = secondMax;
							obj[k] = {bin: 255, color: "255:"+iNo};
							secondMinArr.push(iNo);
						}else if(vvv == 12){
							if(!("12:" in otherColor)) otherColor["12:"] = "#fff";
							obj[k] = {bin: 12, color: "12:"};
						}else if(vvv == -1){
							if(!("-1:" in otherColor)) otherColor["-1:"] = "#314067";
							obj[k] = {bin: -1, color: "-1:"};
						}
					});
				});
			});
			var firstMin = _.head(_.sortBy(firstMinArr));
			var secondMin = _.head(_.sortBy(secondMinArr));
			var firstDiff = firstMax - firstMin;
			var secondDiff = secondMax - secondMin;
			/*画图*/
			$(el).children(".panel-body").find(".chart_body>div").each(function(i, ele){
				var that = $(this);
				draw_map_color_order_distribution(that, i, copyData, firstDiff, secondDiff, firstMax, firstMin, secondMax, secondMin, otherColor);
			});
		}else{
			var chartType = _.find(dataListDetailStore.chartTypeMap, function(o, k){
				return k == iicontrols;
			});
			$(el).children(".panel-body").find(".chart_body>div").each(function(){
				var that = $(this);
				draw_other_chart(that, iicontrols, chartType);
			});
		}
	});
});

/*event handler*/
$(".allDetail_body .table_body").on("scroll", function(e){
	if(dataListDetailStore.state.allDetail.tbody.scrollTop - 1 < $(this).scrollTop() && dataListDetailStore.state.allDetail.tbody.scrollTop + 1 > $(this).scrollTop()){
		$(".allDetail_body .table_head").scrollLeft($(this).scrollLeft());
	}
	dataListDetailStore.state.allDetail.tbody.scrollTop = $(this).scrollTop();
	dataListDetailStore.state.allDetail.tbody.scrollLeft = $(this).scrollLeft();
});

/*点击收起*/
$(document).on("click", ".vectorMap_l div.panel-heading>span.glyphicon", function(){
	$(this).toggleClass("glyphicon-menu-down glyphicon-menu-right").parent().parent().toggleClass("panel-info panel-success");
	if($(this).hasClass("glyphicon-menu-right")){
		$(this).parent().next().slideUp(200);
	}else{
		$(this).parent().next().slideDown(200);
	}
});