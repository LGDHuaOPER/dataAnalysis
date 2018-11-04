function dataCompareRenderChart(obj){
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
						groupPadding:0,
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
	/*良品率*/
	else if(obj.chartClassify == 'good_rate'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '{point.x}, {point.y}'
				},
				series: obj.series
			})
		);
	}
	return chart;
}