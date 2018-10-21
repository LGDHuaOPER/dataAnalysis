function buildChartContainer(obj){
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
	});
	$(".g_bodyin_bodyin_bottom_rsubin[data-ishowchart='"+obj.ishowchart+"']>.chartBody>.container-fluid").empty().append(str);
}

function initRenderChart(obj){
	console.log(obj);
	var chart;
	var baseOption = {
		chart: {
			type: obj.chart.type
		},
		title: {
			text: obj.title
		},
		subtitle: {
			text: obj.subtitle
		},
		xAxis: obj.xAxis,
		yAxis: obj.yAxis,
	};
	if(obj.chart.type == 'column'){
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
						groupPadding:0,
						pointPadding: 0
					}
				},
				series: [{
					name: '百分比',
					data: [
						// 数据格式： [时间戳, 数值]
						[0.45, 71.5], 
						[0.55, 10.4], 
						[0.65, 19.2], 
						[0.75, 41.0], 
						[0.85, 76.0],
						[0.95,35.6], 
						[1.05,48.5],
						[1.15, 49.9]
					]
				}]
			})
		);
	}
	/*箱线图*/
	else if(obj.chart.type == 'boxplot'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				legend: {
					enabled: false
				},
				tooltip: {
					pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' + // eslint-disable-line no-dupe-keys
					'最大值: {point.high}<br/>' +
					'Q2\t: {point.q3}<br/>' +
					'中位数: {point.median}<br/>' +
					'Q1\t: {point.q1}<br/>' +
					'最小值: {point.low}<br/>'
				},
				series: [{
					name: '观测值',
					data: [
						[760, 801, 848, 895, 965],
						[733, 853, 939, 980, 1080],
						[714, 762, 817, 870, 918],
						[724, 802, 806, 871, 950],
						[834, 836, 864, 882, 910]
					],
					tooltip: {
						headerFormat: '<em>实验号码： {point.key}</em><br/>'
					}
				}, {
					name: '异常值',
					color: Highcharts.getOptions().colors[0],
					type: 'scatter',
					data: [ // x, y positions where 0 is the first category
						[0, 644],
						[4, 718],
						[4, 951],
						[4, 969]
					],
					marker: {
						fillColor: 'white',
						lineWidth: 1,
						lineColor: Highcharts.getOptions().colors[0]
					},
					tooltip: {
						pointFormat: 'Observation: {point.y}'
					}
				}]
			})
		);
	}
	/*CPK图*/
	else if(obj.chart.type == 'line'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				plotOptions: {
					line: {
						dataLabels: {
							// 开启数据标签
							enabled: true          
						},
						// 关闭鼠标跟踪，对应的提示框、点击事件会失效
						enableMouseTracking: false
					}
				},
				series: [{
					name: '数据一',
					data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
				}, {
					name: '数据二',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}]
			})
		);
	}
	/*相关性图*/
	else if(obj.chart.type == 'scatter'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				chart: {
					zoomType: 'xy'
				},
				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x: 100,
					y: 70,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
					borderWidth: 1
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
							pointFormat: '{point.x} cm, {point.y} kg'
						}
					}
				},
				series: [{
					name: '数据一',
					color: 'rgba(223, 83, 83, .5)',
					data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
						   [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
						   [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
						   [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
						   [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
						  ]
				}, {
					name: '数据二',
					color: 'rgba(119, 152, 191, .5)',
					data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
						   [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
						   [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
						   [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
						   [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
						  ]
				}]
			})
		);
	}else if(obj.chart.type == 'gaussiandistribution'){
		var lowerBound = 10, upperBound = 30;
		var normalY = function(x, mean, stdDev) {
			return Math.exp((-0.5) * Math.pow((x - mean) / stdDev, 2)) * 1000;
		}
		var getMean = function(lowerBound, upperBound) {
			return (upperBound + lowerBound) / 2;
		}
		// distance between mean and each bound of a 95% confidence interval 
		// is 2 stdDeviation, so distance between the bounds is 4
		var getStdDeviation = function(lowerBound, upperBound) {
			return (upperBound - lowerBound) / 4;
		}
		var generatePoints = function(lowerBound, upperBound) {
			var stdDev = getStdDeviation(lowerBound, upperBound); 
			var min = lowerBound - 2 * stdDev;
			var max = upperBound + 2 * stdDev;
			var unit = (max - min) / 100;
			return _.range(min, max, unit);
		}
		var mean = getMean(lowerBound, upperBound);
		var stdDev = getStdDeviation(lowerBound, upperBound);
		var points = generatePoints(lowerBound, upperBound);
		var seriesData = points.map(function(x){
			return ({ x: x, y: normalY(x, mean, stdDev)});
		});
		var iData = [];
		_.forEach(seriesData, function(v, i){
			if(i%8 == 0){
				iData.push(v.y);
			}
		});
		console.log(iData)
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
					x: 120,
					verticalAlign: 'top',
					y: 100,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: [{
					name: '参数一',
					type: 'column',
					yAxis: 1,
					data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
					tooltip: {
						valueSuffix: '壹'
					}
				}, {
					name: '参数二',
					type: 'spline',
					data: iData,
					// data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
					tooltip: {
						valueSuffix: '贰'
					}
				}]
			})
		);
	}
	return chart;
}