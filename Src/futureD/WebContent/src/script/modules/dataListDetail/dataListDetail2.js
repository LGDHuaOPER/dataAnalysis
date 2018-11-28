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






