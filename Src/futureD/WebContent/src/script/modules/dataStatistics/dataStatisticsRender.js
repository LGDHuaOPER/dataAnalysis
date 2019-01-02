/*function buildChartContainer(obj){
	console.log("obj",obj);
	var str = '';									
	var flag = false;							
	dataStatisticsState.csvANDparamSelected.param.map(function(v, i, arr){
		var id = $(".g_bodyin_bodyin_bottom_lsub_mid [data-ishowchartparam='"+v+"']").data("chartcurid");
		if(i%2 == 0){
			str+='<div class="row">';
			flag = false;
		}else{
			flag = true;
		}
		str+='<div class="col-sm-12 col-md-12 col-lg-6"><div id="'+id+'" data-initrenderchart="'+obj.ishowchart+'"></div></div>';
		if(flag){
			str+='</div>';
		}
		var instr = '';
		if(obj.ishowchart == "wafermap") instr = '<div class="colorOrder_wrap"><div class="colorOrder_g"></div><div class="colorOrder_table"></div></div>';
		str+='<div class="row">';
		str+='<div class="col-sm-12 col-md-12 col-lg-12"><div id="'+id+'" data-initrenderchart="'+obj.ishowchart+'"></div>'+instr+'</div>';
		str+='</div>';
	});
	$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+obj.ishowchart+"']>.chartBody>.container-fluid").empty().append(str);
}*/

function dataCompareRenderChart(obj){
	//console.log("correlationgraph",obj);
		var chart;
		var baseOption = {
			chart: {
				type: obj.chart.type
			},
			credits: {
				enabled: false
			},
			title: {
				text: obj.title.text
			},
			subtitle: {
				text: obj.subtitle.text
			},
			xAxis: obj.xAxis,
			yAxis: obj.yAxis,
		};
		/*直方图 column*/
		if(obj.chartClassify == "histogram"){
			chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							// pointPlacement: 'between',
							groupPadding: 0.1,
							pointPadding: 0
						}
					},
					series: obj.series
				})
			);
		}
		/*箱线图 boxplot*/
		else if(obj.chartClassify == "boxlinediagram"){
			chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
					legend: {
						enabled: true
					},
					tooltip: {
						pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' + // eslint-disable-line no-dupe-keys
						'最大值: {point.high}<br/>' +
						'Q2\t: {point.q3}<br/>' +
						'中位数: {point.median}<br/>' +
						'Q1\t: {point.q1}<br/>' +
						'最小值: {point.low}<br/>'
					},
					series: obj.series
				})
			);
		}
		/*CPK图*/
		else if(obj.chartClassify == "CPK"){
			chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
					tooltip: {
						headerFormat: '<b>{point.key}</b><br>',
						pointFormat: '{point.x}, {point.y}'
					},
					plotOptions: {
						line: {
							dataLabels: {
								// 开启数据标签
								enabled: true          
							},
							// 关闭鼠标跟踪，对应的提示框、点击事件会失效
							enableMouseTracking: true
						}
					},
					series: obj.series
				})
			);
		}
		/*相关性图 scatter*/
		else if(obj.chartClassify == "correlationgraph"){
			chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
					chart: {
						zoomType: 'xy'
					},
					legend: {
						/*layout: 'vertical',
						align: 'left',
						verticalAlign: 'top',
						x: 70,
						y: 50,*/
						layout: 'horizontal',
				        align: 'center',
				        verticalAlign: 'bottom',
						floating: false,
						backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
						borderWidth: 0
					},
					plotOptions: {
						scatter: {
							marker: {
								radius: 5,
								states: {
									hover: {
										enabled: true,
										lineColor: 'rgb(100,100,100)'
									}
								}
							},
							states: {
								hover: {
									marker: {
										enabled: false
									}
								}
							},
							tooltip: {
								headerFormat: '<b>{series.name}</b><br>',
								pointFormat: '{point.x}, {point.y}'
							}
						}
					},
					series: obj.series
				})
			);
		}
		/*高斯分布*/
		else if(obj.chartClassify == 'gaussiandistribution'){
			chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
					chart: {
						zoomType: 'xy',
						type: 'line'
					},
					tooltip: {
						shared: true
					},
					legend: {
						layout: 'vertical',
						align: 'left',
						x: 55,
						verticalAlign: 'top',
						y: 25,
						floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
					},
					series: obj.series
				})
			);
		}
		_.isFunction(obj.callback) && obj.callback(chart);
		return chart;
	}

/*参数分布统计 其他图表绘制*/
function draw_other_chart(obj){
	console.log("draw_other_chart",obj);
	/*参数获取*/
	var chartType = obj.chartType;
	var classify = obj.classify;
	var IDParamObj = obj.IDParamObj;
	var paramsArr = obj.paramsArr;
	var data = obj.data;
	var errorArr = obj.errorArr;
	var curWaferId = obj.curWaferId;
	var curWaferName = obj.curWaferName;
	var container = IDParamObj.id,
	iparam = IDParamObj.param,
	isAll = IDParamObj.isAll,
	title_text,
	subtitle_text = null,
	xAxis,
	yAxis,
	series,
	callback = null;

	/*错误数组增加*/
	switch(classify) {
		case "CPK":
			var curDataItem = _.find(_.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			}), function(vv, kk){
				return _.toString(kk) == _.toString(curWaferId);
			});
			if(curDataItem.length<20){
				var errorArrItem = _.find(errorArr, function(v, i){
					return v.chartCNName == "CPK图";
				});
				if(_.isNil(errorArrItem)){
					errorArr.push({
						chartCNName: "CPK图",
						errorParamArr: [iparam],
						classify: classify,
						message: "参数数据不足"
					});
				}else{
					errorArrItem.errorParamArr.push(iparam);
				}
				return errorArr;
			}
		break;
		case "gaussiandistribution":
			var curParamData = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			})[curWaferId];
			if(_.indexOf(_.keys(curParamData), "status") > -1){
				var errorArrItem2 = _.find(errorArr, function(v, i){
					return v.chartCNName == "高斯分布图";
				});
				if(_.isNil(errorArrItem2)){
					errorArr.push({
						chartCNName: "高斯分布图",
						errorParamArr: [iparam],
						classify: classify,
						message: curParamData.status
					});
				}else{
					errorArrItem2.errorParamArr.push(iparam);
				}
				return errorArr;
			}
		break;
	}
	/*错误数组增加end*/
	
	switch(classify){
		case "histogram":
			/*处理数据*/
			var ndata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			});
			title_text = "直方图-"+iparam;
			xAxis = {
				categories: _.map(ndata.sectionX, function(v, i){
					var vArr = v.split("~");
					_.forEach(vArr, function(vv, ii, arr){
						var vArrIt;
						if(vv.indexOf("∞")>-1){
							vArrIt = vv;
						}else{
							if(vv.length>8){
								vArrIt = numeral(vv).format('0.0000e+0');
							}else{
								vArrIt = vv;
							}
						}
						arr[ii] = vArrIt;
					});
					return _.join(vArr, "~");
				}),
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
					value: ndata.sectionX.length-1.5
				}]
			};
			yAxis = {
				title: {
					text: '百分数'
				}
			};
			var iserise = [];var ndataItem;
			_.forEach(curWaferId, function(v) {
				ndataItem = ndata.percentList[v] ;
				iserise.push({
					name: curWaferName[v],
					type: "column",
					data: _.map(ndataItem.percent, function(v){
						return parseFloat(v);
					})
				});
				
				iserise.push({
					name: iparam+"频率累加",
					type: "line",
					data: _.map(ndataItem.proportion, function(v){
						return parseFloat(v);
					})
				});
			});
			
			series = iserise;
			//console.log("histogram",series);
		break;

		case "boxlinediagram":
			var categories = [];
			for(var b_i = 0 ; b_i< curWaferId.length ; b_i++){
				categories.push(curWaferName[curWaferId[b_i]])
			}
			
			title_text = "箱线图-"+iparam;
			xAxis = {
						categories: categories,
					};
			yAxis = {
						title: {
							text: '值'
						},
					};
		
			var ndata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			});
			var series = [];
			var data_eigenValue =[] ,data_extreme =[] ,data_soft =[] ;
			for(var _id in ndata){
				data_eigenValue.push(ndata[_id].eigenValue);
				data_extreme = ndata[_id].extreme;
				data_soft= ndata[_id].soft;
			}
			/*暂时处理*/
			series = [{
					name: '观测值',
					data: data_eigenValue,
					tooltip: {
						headerFormat: '<em>参数： {point.key}</em><br/>'
					}
				},{
					name: '温和异常值',
					color: Highcharts.getOptions().colors[1],
					type: 'scatter',
					data: data_soft,
					marker: {
						fillColor: '#ccc',
						lineWidth: 1,
						lineColor: Highcharts.getOptions().colors[1]
					},
					tooltip: {
						pointFormat: '温和异常值: {point.y}'
					}
				}, {
					name: '极端异常值',
					color: Highcharts.getOptions().colors[0],
					type: 'scatter',
					// x, y positions where 0 is the first category
					data: data_extreme,
					marker: {
						fillColor: 'white',
						lineWidth: 1,
						lineColor: Highcharts.getOptions().colors[0]
					},
					tooltip: {
						pointFormat: '极端异常值: {point.y}'
					}
				},];
			//console.log("boxlinediagram",series);
		break;
		case "CPK":
			var CPK_data = [];
			var ndata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			});
		
			for(var wafernum = 0 ; wafernum < obj.curWaferId.length ; wafernum++ ){
				var curDataItem = _.find(ndata, function(vv, kk){
					return _.toString(kk) == _.toString(obj.curWaferId[wafernum]);
				});
				var errorWaferName = obj.curWaferName[obj.curWaferId[wafernum]];
				
				if(curDataItem.length<20){
					var errorArrItem = _.find(errorArr, function(v, i){
						return v.chartCNName == "CPK图";
					});
					if(_.isNil(errorArrItem)){
						errorArr.push({
							chartCNName: "CPK图",
							errorParamArr: [errorWaferName+":"+iparam],
							classify: classify,
							message: "参数数据不足"
						});
					}else{
						errorArrItem.errorParamArr.push(errorWaferName+":"+iparam);
					}
				}
				else{
					var iiitem = {};
					iiitem.name = curWaferName[obj.curWaferId[wafernum]];
					iiitem.data  = ndata[obj.curWaferId[wafernum]];
					CPK_data.push(iiitem);
				}
			}
			title_text = "CPK-"+iparam;
			xAxis = {
				categories:["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"]
			};
			yAxis = {
				title: {
					text: 'values'
				}
			};
			series = CPK_data;
			//console.log("CPK",series);
		break;
		case "correlationgraph":
			title_text = "相关性图-"+iparam;
			var _iparam ;  // waferid
			for(var _i in curWaferName){
				if(iparam === curWaferName[_i]){
					_iparam = _i;
					break;
				}
			}
			var ndata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(_iparam);
			});
			xAxis = {
				title: {
					enabled: true,
					text:  ndata.parameter[0],
					style:{"fontFamily":"arial","float":"top"}
				},
				lineWidth:1,
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
				labels: {
	            	useHTML: true,
	                formatter: function () {
	                    return '<a href="javascript:alert(\'hello\')" style="font-size:11px;color:#666666;">' + this.value + '</a>';
	            	},
	            },
			};
			yAxis = {
				title: {
					text:  ndata.parameter[1]
				}
			};
    		var item = {};
			item.name = iparam;
			var seriesData = [];
			for(var c_num = 0 ; c_num < ndata.X.length ; c_num++){
				var seriesData_XY= [];
    			seriesData_XY.push(parseFloat(ndata.X[c_num]));  //插入X轴数据
    			seriesData_XY.push(parseFloat(ndata.Y[c_num]));  //插入Y轴数据
    			seriesData.push(seriesData_XY);
			}
			
			item.data = seriesData;
			series = [item];
		break;
		case "gaussiandistribution":
			var iiiindata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			})[curWaferId[0]];
			title_text = "高斯分布图-"+iparam;
			xAxis = [{
				categories: _.map(iiiindata.groupX, function(v){
					var iflag = true;
					if(Math.abs(v)>1) iflag = false;
					return eouluGlobal.S_ComSCMRound(v, 2, iflag);
				}),
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
					text: '频次',
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
			
			var iiiiseries = [{
					name: '频次',
					type: 'column',
					data: iiiindata.frequency,
					tooltip: {
						valueSuffix: ''
					}
				}, {
					name: '正态分布',
					type: 'spline',
					yAxis: 1,
					data: iiiindata.density,
					// data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
					tooltip: {
						valueSuffix: ''
					}
				}];
			series = iiiiseries;
			callback = function(ichart){
				var $chart_foot = $("#"+container).parent().next();
				var $trs = $chart_foot.find("tbody>tr");
				$trs.eq(0).children("td").eq(1).data("ivalue", iiiindata.median);
				$trs.eq(1).children("td").eq(1).data("ivalue", iiiindata.average);
				$trs.eq(2).children("td").eq(1).data("ivalue", iiiindata.max);
				$trs.eq(3).children("td").eq(1).data("ivalue", iiiindata.min);
				$trs.eq(5).children("td").eq(1).data("ivalue", iiiindata.expectation);
				$trs.eq(6).children("td").eq(1).data("ivalue", iiiindata.standard);
				$trs.eq(7).children("td").eq(1).data("ivalue", iiiindata.variance);
				$trs.find("td:nth-child(2)").each(function(i, el){
					if(i == 4) return true;
					var iflag = true;
					if(Math.abs(parseFloat($(this).data("ivalue")))>1) iflag = false;
					var roundV = eouluGlobal.S_ComSCMRound(parseFloat($(this).data("ivalue")), 2, iflag);
					$(this).attr("title", $(this).data("ivalue")).text(roundV);
				});
			};
		break;
		/*良品率图*/
		default:
			title_text = "良品率图";
			var item = {};
			item.name = iparam;
			item.data = [];
			var iiiiicategories = [];
			var ndata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			});
			_.forEach(curWaferId, function(v) {
				iiiiicategories.push(curWaferName[v]);
				var y_data = parseFloat(ndata[v]);
				item.data.push( y_data);
			});
			xAxis = {
				categories: iiiiicategories
			};
			yAxis = {
				title: {
					text: "比率(%)"
				},
				min:0,
		        max:100,
		        tickInterval: 10,
		        labels: {
		            formatter: function () {
		                return this.value;
		            }
		        },
			};
			series = [item];
	}
	/*画图*/
	dataCompareRenderChart({
		container: container,
		chart: {
			zoomType: 'x',
			type: chartType,
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
		chartClassify: classify,
		callback: callback
	});
	return errorArr;
}



function ajax_all_chart(obj){
	console.log("obj11",obj);
	var whenArr = obj.whenArr;
	var errorArr = obj.errorArr || [];
	var curWaferName = obj.curWaferName;
	var whenArrItem = whenArr[0];
	var curWaferID = obj.curWaferID;
	var curParam= obj.curParam;
	if(!curParam){  //初次加载 显示所有参数
		var ajax_data = {
			waferIdStr: curWaferID.join(","),
		}
	}
	else{
		if(whenArrItem.classify === "correlationgraph"){
			var ajax_data = {
				waferIdStr: curWaferID.join(","),
				paramX : curParam[0] ,
				paramY : curParam[1] ,
				minX : obj.leftrange[0],
				minY : obj.leftrange[1] ,
				maxX : obj.rightrange[0] ,
				maxY : obj.rightrange[1] ,
			}
		}
		else if(whenArrItem.classify === "wafermap"){
			var ajax_data = {
				waferIdStr: curWaferID.join(","),
				paramAtt : curParam,
				leftRange :  obj.leftrange,
				rightRange : obj.rightrange ,
			}
		}
		else if(whenArrItem.classify === "gaussiandistribution" || whenArrItem.classify === "histogram"){
			var ajax_data = {
				waferIdStr: curWaferID.join(","),
				paramAtt : curParam,
				leftRange :  obj.leftrange,
				rightRange : obj.rightrange,
				equal :  obj.equal
			}
		}
		else{
			var ajax_data = {
				waferIdStr: curWaferID.join(","),
				paramAtt : curParam
			}
		}
	}
	
	$.ajax({
		type: "GET",
		url: whenArrItem.chartAjaxUrl,
		data: ajax_data,
		dataType: "json",
		beforeSend: function(){
//			$("body").data("iglobalerror", "allow");
			/*提示框修改text*/
//			$("#swal2-content").text("正在请求"+whenArrItem.chartCNName+"数据，绘图进度 "+(times+1)+"/"+alltimes);
		}
	}).then(function(data){
		console.log("ajaxdata",data);
		var waferArr = curWaferID;
		if(_.isEmpty(data) || _.isNil(data)) {
			errorArr.push({
				chartCNName: whenArrItem.chartCNName,
				errorParamArr: [],
				classify: whenArrItem.classify,
				message: "数据为空"
			});
		}else{
			var paramsArr;
			if(["wafermap"].indexOf(whenArrItem.classify) > -1){
				paramsArr = [];
				for(var _p = 0 ; _p<data[curWaferID[0]].waferList.length ; _p++){
					paramsArr.push(data[curWaferID[0]].waferList[_p].parameter);
				}
				paramsArr = _.sortBy(paramsArr, function(vv, ii){
					var returnV;
					if(_.isNil(vv.match(/\d+/))) {
						returnV = 0;
					}else{
						returnV = _.toNumber(vv.match(/\d+/)[0]);
					}
					return returnV;
				});
			}
			else{
				if(["correlationgraph"].indexOf(whenArrItem.classify) > -1){
					delete data.status;
					paramsArr = [];
					for(var waferid in curWaferName){
						paramsArr.push(curWaferName[waferid]);
					}
				}
				else{
					paramsArr = _.keys(data);
					paramsArr = _.sortBy(paramsArr, function(vv, ii){
						var returnV;
						if(_.isNil(vv.match(/\d+/))) {
							returnV = 0;
						}else{
							returnV = _.toNumber(vv.match(/\d+/)[0]);
						}
						return returnV;
					});
					
				}
			}	
			var IDParamObjArr = buildParameterChartContainer({
				classify: whenArrItem.classify,
				paramsArr: _.cloneDeep(paramsArr),
				waferArr: _.cloneDeep(waferArr),
				curWaferName : curWaferName,
			});
			//console.log(IDParamObjArr)
			/*画图*/
			_.forEach(IDParamObjArr, function(v, i){
				
				if(whenArrItem.classify == "wafermap"){
					/*map色阶分布图绘制*/
					draw_map_color_order_distribution({
						data: _.cloneDeep(data),
						IDParamObj: v,
						curWaferName : curWaferName,
						paramsArr : paramsArr,
					});
				}else{
					errorArr = draw_other_chart({
						chartType: whenArrItem.chartType,
						classify: whenArrItem.classify,
						IDParamObj: v,
						paramsArr: paramsArr,
						data: _.cloneDeep(data),
						curWaferId: curWaferID,
						errorArr: errorArr,
						curWaferName : curWaferName,
						curParam :curParam
					});
				}
			});
			eouluGlobal.S_getSwalMixin()({
				title: "加载提示",
				text: "数据请求完成",
				type: "info",
				showConfirmButton: false,
				timer: 1200
			}).then(function(){
				if(_.isEmpty(errorArr)){
				}else{
					var iiistr = '以下图表请求/绘制失败';
					iiistr+='<div class="container-fluid">'+
								'<table class="table table-striped table-bordered table-hover table-condensed">'+
									'<thead>'+
										'<tr><th style="font-size:14px;width: 80px;text-align:center;">图表名字</th><th style="font-size:14px;text-align:center;">参数及原因</th></tr>'+
									'</thead><tbody>';
					_.forEach(errorArr, function(v){
						iiistr+='<tr>'+
									'<td style="vertical-align: top;font-size:14px;width: 80px;">'+v.chartCNName+'</td><td style="vertical-align: top;font-size:14px;">';
						if(_.isEmpty(v.errorParamArr)){
							iiistr+=v.message;
							setTimeout(function(){
								$("div.panel.panel_"+v.classify).data("icontextual", "danger").removeClass("panel-info panel-success panel-warning").addClass("panel-danger").children(".panel-heading").children("span.glyphicon").trigger("click");
							}, 20);
						}else{
							var $curClassify = $("div.panel.panel_"+v.classify);
							$curClassify.data("icontextual", "warning").removeClass("panel-info panel-success panel-danger").addClass("panel-warning");
							_.forEach(v.errorParamArr, function(vv){
								iiistr+=vv+"："+v.message+"<br/>";
								$curClassify.find(".panel-body div.panel[data-contextualparam='"+vv+"']").data("icontextual", "warning").children(".panel-heading").children("span.glyphicon").trigger("click");
							});
							if($curClassify.find(".panel-body div.panel[data-contextualparam]").length == v.errorParamArr.length){
								$curClassify.children(".panel-heading").children("span.glyphicon").trigger("click");
							}
						}
						iiistr+='</td></tr>';
					});
					iiistr+='</tbody></table></div>';
					eouluGlobal.S_getSwalMixin()({
						title: "加载提示",
						html: iiistr,
						// type: "info",
						showConfirmButton: true,
					});
				}
				//$("body").data("iglobalerror", "unallow");
				//dataListDetailStore.state.parameterMap.hasRender = true;
			});
		
		}
	}, function(){
		// errorArr.push(whenArrItem.chartCNName);
//		eouluGlobal.S_getSwalMixin()({
//			title: "加载提示",
//			text: "数据请求失败，请刷新页面或重新登录",
//			type: "error",
//			showConfirmButton: false,
//			timer: 1800
//		});
	}).always(function(){
		/*(times == alltimes) && (dataListDetailStore.state.parameterMap.hasRender = true);*/
	});
}





function buildParameterChartContainer(obj){
	console.log("buildParameterChartContainer",obj);
	var classify = obj.classify;
	var paramsArr = obj.paramsArr;
	//var str = '<div class="container-fluid">';   //单一参数
	var str = '';
	var returnIDArr = [];
	var inStr = '';
	 if(["histogram", "boxlinediagram", "CPK","gaussiandistribution","wafermap"].indexOf(classify) > -1){
		if(["histogram"].indexOf(classify) > -1) paramsArr = _.pull(paramsArr, "sectionX");
		if(_.indexOf(["gaussiandistribution"], classify) > -1){
			inStr = '<table class="table table-striped table-bordered table-condensed">'+
						'<tbody>'+
							'<tr>'+
								'<td>中值</td>'+
								'<td>中值</td>'+
							'</tr>'+
							'<tr>'+
								'<td>平均值</td>'+
								'<td>平均值</td>'+
							'</tr>'+
							'<tr>'+
								'<td>最大值</td>'+
								'<td>最大值</td>'+
							'</tr>'+
							'<tr>'+
								'<td>最小值</td>'+
								'<td>最小值</td>'+
							'</tr>'+
							'<tr>'+
								'<td></td>'+
								'<td></td>'+
							'</tr>'+
							'<tr>'+
								'<td>标准差</td>'+
								'<td>标准差</td>'+
							'</tr>'+
							'<tr>'+
								'<td>方差</td>'+
								'<td>方差</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>';
		}
		
		_.forEach(paramsArr, function(v, i, arr){
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
					    		'<div class="chart_body"><div id="'+(classify+dataStatisticsState.stateObj.curChartContainerNum)+'" data-iparam="'+v+'"></div></div>'+
					    		'<div class="chart_foot">'+inStr+'</div>'+
					    	'</div>'+
					  	'</div>'+
					'</div>';
				str+='</div>';
			if(i%2 == 1 || (i%2 == 0 && i == arr.length-1)){
				str+='</div>';
			}
			returnIDArr.push({
				id: (classify+dataStatisticsState.stateObj.curChartContainerNum),
				param: v,
				isAll: false,
				wafer :  obj.waferArr[0]
			});
			dataStatisticsState.stateObj.curChartContainerNum++;
		});
	//	str+='</div>';  //单一参数
	}
	 else if(["correlationgraph"].indexOf(classify) > -1){
			_.forEach(paramsArr, function(v, i, arr){
					str+='<div class="col-sm-24 col-md-12 col-lg-12">';
					str+='<div class="panel panel-info">'+
						  	'<div class="panel-heading">'+
						    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+v+
						  	'</div>'+
						  	'<div class="panel-body">'+
						    	'<div class="container-fluid">'+
						    		'<div class="chart_title"></div>'+
						    		'<div class="chart_body"><div id="'+(classify+dataStatisticsState.stateObj.curChartContainerNum)+'" data-iparam="'+v+'"></div></div>'+
						    		'<div class="chart_foot">'+inStr+'</div>'+
						    	'</div>'+
						  	'</div>'+
						'</div>';
					str+='</div>';
				returnIDArr.push({
					id: (classify+dataStatisticsState.stateObj.curChartContainerNum),
					param: v,
					isAll: false,
					wafer :  obj.waferArr[0]
				});
				dataStatisticsState.stateObj.curChartContainerNum++;
			});
			//str+='</div>';  //单一参数
		}
	$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+classify+"']>.chartBody>.container-fluid").empty().append(str);
	return returnIDArr;
}






/*map色阶分布图绘制*/
function draw_map_color_order_distribution(obj){
	//console.log("draw_map_color_order_distribution",obj);
	/*获取参数*/
	var data = obj.data;
	var IDParamObj = obj.IDParamObj;
	var waferNO = obj.IDParamObj.wafer;
	/*预处理数据*/
	var that = $("#"+IDParamObj.id),
	waferData = _.find(data, function(v, k){
		return _.toString(k) == _.toString(waferNO);
	})
	//console.log("waferData",waferData);
	dieData = [],
	subdieData = [],
	currentDieItem = _.find(waferData.waferList, function(v, k){
		return _.toString(v.parameter) == _.toString(IDParamObj.param);
	}),
	theMax = 200, 
	theMin = -100, 
	lowwer = theMin+_.floor((theMax-theMin)/3), 
	upper = theMin+_.floor((theMax-theMin)/3)*2, 
	midder = _.floor((theMax+theMin)/2),
	otherColor = {},
	twoDiff = lowwer - theMin,
	threeDiff = midder - lowwer,
	fourDiff = upper - midder,
	fiveDiff = theMax - upper,
	precision = 0;
	var currentItem_currentList = (waferData.containSubdie ? waferData.waferDie.currentDieList : currentDieItem.currentDieList);
	var mergeDieType = (waferData.containSubdie ?  [currentItem_currentList] : [currentItem_currentList, waferData.otherDieType] );
	/*合并有效die和其他器件die*/
	_.forEach(mergeDieType, function(val, ind){
		//console.log("val",val);
		_.forOwn(val, function(v, k){
			var item = {},
			iNo,
			ibin,
			addNum,
			percentV,
			binV;
			if(_.isObject(v)){
				percentV = v.percent;
				binV = v.bin ||  v.subdieBin;
			}else{
				percentV = v;
				binV = v;
			}
			iNo = _.round(parseFloat(percentV)*Math.pow(10,precision));
			var addMat = _.toString(percentV).match(/^\+/);
			var minusMat = _.toString(percentV).match(/^\-/);
			if(_.isObject(v)){
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*合格数据*/
					addNum = 1;
				}else{
					if(!_.isNil(addMat)){
						/*大于上限*/
						addNum = 100;
					}
					if(!_.isNil(minusMat)){
						/*小于下限*/
						addNum = -100;
					}
				}
			}else{
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*bin为非负数*/
					addNum = 0;
				}else{
					if(!_.isNil(addMat)){
						/*bin为正数，+号*/
						addNum = 2;
					}
					if(!_.isNil(minusMat)){
						/*bin为负数，-号*/
						addNum = -2;
					}
				}
			}
			
			if(addNum > 2){
				iNo = iNo+(addNum);
			}
			ibin = binV;

			/*判断位置*/
			/*bin 5000 表示未被测试的die  ，bin 5001 表示其他期间类型的die 未被测试的die依然可以显示曲线*/
			if(ibin == 5000){
				if(!("5000:" in otherColor)) otherColor["5000:"] = "#FDFDFD";
				item[k] = {bin: 5000, color: "5000:"};
			}else if(ibin == 5001){
				if(!("5001:" in otherColor)) otherColor["5001:"] = "#fff";
				item[k] = {bin: 5001, color: "5001:"};
			}else if(ibin == -1){
				if(!("-1:" in otherColor)) otherColor["-1:"] = "#314067";
				item[k] = {bin: -1, color: "-1:"};
			}else{
				var iiNo = _.round(iNo);
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*合格数据*/
					if(lowwer<=iNo && iNo<midder){
						item[k] = {bin: ibin, color: "3:"+iiNo};
					}else if(midder<=iNo && iNo<=upper){
						item[k] = {bin: ibin, color: "4:"+iiNo};
					}
				}else{
					if(!_.isNil(addMat)){
						/*大于上限*/
						if(upper<=iNo && iNo<theMax){
							item[k] = {bin: ibin, color: "5:"+iiNo};
						}else if(theMax<=iNo){
							iNo = theMax;
							item[k] = {bin: ibin, color: "6:"+iiNo};
						}
					}
					if(!_.isNil(minusMat)){
						/*小于下限*/
						if(iNo<=theMin){
							iNo = theMin;
							item[k] = {bin: ibin, color: "1:"+iiNo};
						}else if(theMin<iNo && iNo<=lowwer){
							item[k] = {bin: ibin, color: "2:"+iiNo};
						}
					}
				}
				// if(iNo<theMin){
				// 	iNo = theMin;
				// 	item[k] = {bin: ibin, color: "1:"+iiNo};
				// }else if(theMin<=iNo && iNo<lowwer){
				// 	item[k] = {bin: ibin, color: "2:"+iiNo};
				// }else if(lowwer<=iNo && iNo<midder){
				// 	item[k] = {bin: ibin, color: "3:"+iiNo};
				// }else if(midder<=iNo && iNo<=upper){
				// 	item[k] = {bin: ibin, color: "4:"+iiNo};
				// }else if(upper<iNo && iNo<theMax){
				// 	item[k] = {bin: ibin, color: "5:"+iiNo};
				// }else if(theMax<=iNo){
				// 	iNo = theMax;
				// 	item[k] = {bin: ibin, color: "6:"+iiNo};
				// }
			}
			/*判断位置end*/
			dieData.push(item);
		});
	});
	//console.log("dieData",dieData);
	/*合并有效subdie和其他器件subdie*/
	var sub_currentItem_currentList = (waferData.containSubdie ? currentDieItem.currentSubdieList : {});
	var othersubDieType = (waferData.containSubdie ?  waferData.otherSubdieType :  {});
	var mergesubDieType = (waferData.containSubdie ?  [sub_currentItem_currentList,othersubDieType] : [] );
	_.forEach(mergesubDieType, function(val, ind){
		//console.log("val",val);
		_.forOwn(val, function(v, k){
			var item = {},
			iNo,
			ibin,
			addNum,
			percentV,
			binV;
			if(_.isObject(v)){
				percentV = v.percent;
				binV =  v.subdieBin;
			}else{
				percentV = v;
				binV = v;
			}
			iNo = _.round(parseFloat(percentV)*Math.pow(10,precision));
			var addMat = _.toString(percentV).match(/^\+/);
			var minusMat = _.toString(percentV).match(/^\-/);
			if(_.isObject(v)){
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*合格数据*/
					addNum = 1;
				}else{
					if(!_.isNil(addMat)){
						/*大于上限*/
						addNum = 100;
					}
					if(!_.isNil(minusMat)){
						/*小于下限*/
						addNum = -100;
					}
				}
			}else{
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*bin为非负数*/
					addNum = 0;
				}else{
					if(!_.isNil(addMat)){
						/*bin为正数，+号*/
						addNum = 2;
					}
					if(!_.isNil(minusMat)){
						/*bin为负数，-号*/
						addNum = -2;
					}
				}
			}
			if(addNum > 2){
				iNo = iNo+(addNum);
			}
			ibin = binV;

			/*判断位置*/
			/*bin 5000 表示未被测试的die  ，bin 5001 表示其他期间类型的die 未被测试的die依然可以显示曲线*/
			if(ibin == 5000){
				if(!("5000:" in otherColor)) otherColor["5000:"] = "#FDFDFD";
				item[k] = {bin: 5000, color: "5000:"};
			}else if(ibin == 5001){
				if(!("5001:" in otherColor)) otherColor["5001:"] = "#fff";
				item[k] = {bin: 5001, color: "5001:"};
			}else if(ibin == -1){
				if(!("-1:" in otherColor)) otherColor["-1:"] = "#314067";
				item[k] = {bin: -1, color: "-1:"};
			}else{
				var iiNo = _.round(iNo);
				if(_.isNil(addMat) && _.isNil(minusMat)){
					/*合格数据*/
					if(lowwer<=iNo && iNo<midder){
						item[k] = {bin: ibin, color: "3:"+iiNo};
					}else if(midder<=iNo && iNo<=upper){
						item[k] = {bin: ibin, color: "4:"+iiNo};
					}
				}else{
					if(!_.isNil(addMat)){
						/*大于上限*/
						if(upper<=iNo && iNo<theMax){
							item[k] = {bin: ibin, color: "5:"+iiNo};
						}else if(theMax<=iNo){
							iNo = theMax;
							item[k] = {bin: ibin, color: "6:"+iiNo};
						}
					}
					if(!_.isNil(minusMat)){
						/*小于下限*/
						if(iNo<=theMin){
							iNo = theMin;
							item[k] = {bin: ibin, color: "1:"+iiNo};
						}else if(theMin<iNo && iNo<=lowwer){
							item[k] = {bin: ibin, color: "2:"+iiNo};
						}
					}
				}
			}
			/*判断位置end*/
			subdieData.push(item);
		});
	});
	// console.table(dieData);
	//
	var ArraMap = {
		"1": [],
		"2": [],
		"3": [],
		"4": [],
		"5": [],
		"6": [],
		"5000": [],
		"5001": [],
		"-1": [],
		"12": []
	};
	_.forEach(dieData, function(v, i){
		var nu = _.values(v)[0].color.split(":")[0];
		var ik = _.keys(v)[0];
		var item = {};
		item.old1 = _.find(currentDieItem.currentDieList, function(vv, kk){
			return kk == ik;
		});
		item.new1 = v;
		ArraMap[nu].push(item);
	});
	window.ArraMap = ArraMap;
	//
	/*预处理数据end*/

	var inH = that.innerWidth();
	that.innerHeight(inH*0.8);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.after("<div class='criterion_"+canvasID+" ' style='height:60px;text-align: center;'><div class='colorGradient' style=' margin-bottom: 30px;display: inline-block;'></div></div>");
	buildColorGradation({
		width: inH,
		height: inH*0.8,
		container: canvasID,
		bgFillColor: "#314067",
		waferData: waferData,
		spacePercent: {
			x: 0.1,
			y: 0
		},
		m_DieDataListNew: dieData,
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
		otherColor: otherColor,
		param : obj.IDParamObj.param,
		subcoordsArray :  subdieData  // subdie的色阶分布
	});
	
	/*色阶标尺*/
	var colorGradientDom = that.next().find("div.colorGradient");
	colorGradientDom.width(that.next().width() - 60).height(that.next().height() - 30);
	var all = twoDiff+threeDiff+fourDiff+fiveDiff;
	var itemHeight = colorGradientDom.height();
	var itemWidth = colorGradientDom.width() / (all*1.2);
	var multip = _.floor((theMax-theMin)/200);
	if($("body").innerWidth()<1920) multip = multip+0.5;
	if($("body").innerWidth()<1366) multip = multip+0.5;
	//console.log("multip", multip);
	colorGradientDom.append("<span class='colorGradientSpan oneSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth*multip+"px;'></span>");
	_.times(twoDiff, function(ii){
	    var color = getGradientColor ('#00FFFF', '#0000FF', twoDiff, twoDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan twoSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth*multip+"px;'></span>");
	_.times(threeDiff, function(ii){
	    var color = getGradientColor ('#00FF00', '#00FFFF', threeDiff, threeDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan threeSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth*multip+"px;'></span>");
	_.times(fourDiff, function(ii){
	    var color = getGradientColor ('#FFFF00', '#00FF00', fourDiff, fourDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan fourSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth*multip+"px;'></span>");
	_.times(fiveDiff, function(ii){
	    var color = getGradientColor ('#FF0000', '#FFFF00', fiveDiff, fiveDiff-ii);
		colorGradientDom.append("<span class='colorGradientSpan' data-icolor='"+color+"' style='background: "+color+"; height: "+itemHeight+"px; width: "+itemWidth+"px'></span>");
	});
	colorGradientDom.append("<span class='colorGradientSpan fiveSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	colorGradientDom.append("<span class='colorGradientSpan splitSpan' style='height: "+itemHeight+"px; width: "+itemWidth*multip+"px;'></span>");
	colorGradientDom.append("<span class='colorGradientSpan sixSpan outSpan'><span style='height: "+itemHeight+"px; width: "+itemWidth+"px'></span></span>");
	
	var countByData = (waferData.containSubdie ?  subdieData : dieData);
	var countObj = _.countBy(countByData, function(v, i){
		var retur;
		_.forOwn(v, function(vv, k){
			retur = vv.color.split(":")[0];
		});
		return retur;
	});
	var tableStr = '<table class="table table-striped table-bordered table-condensed colorinterval">'+
		'<thead><tr><th></th><th></th><th></th><th></th><th></th><th></th><th>合格数</th><th>不合格数</th><th>良率</th></tr></thead>'+
		'<tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td class="qualify_tt" data-ipara="qualify">0</td><td class="unqulify_tt" data-ipara="unqulify">0</td><td class="yield_tt" data-ipara="yield">0%</td></tr></tbody></table>';
	$(tableStr).appendTo(that.parent().next());
	_.forOwn(countObj, function(v, k){
		if(_.indexOf(["1", "2", "3", "4", "5", "6"], k) == -1) return true;
		that.parent().next().find("th").eq(k-1).text(k+"区间");
		that.parent().next().find("td").eq(k-1).text(v+"个");
	});
	var $tableO = that.parent().next();
	$tableO.find("[class$='_tt']").each(function(){
		var para = $(this).data("ipara");
		$(this).text(currentDieItem[para]);
	});
	$tableO.find("th").each(function(i){
		if($(this).text().trim() == "") {
			$(this).text((i+1)+"区间");
			$tableO.find("td").eq(i).text("0个");
		}
	});
}