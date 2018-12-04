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
					x: 60,
					verticalAlign: 'top',
					y: 10,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: obj.series
			})
		);
	}
	/*良品率*/
	else if(obj.chartClassify == 'good_rate'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				tooltip: {
					headerFormat: '<b>{point.key}</b><br>',
					pointFormat: '{point.x}, {point.y}%'
				},
				series: obj.series
			})
		);
	}
	_.isFunction(obj.callback) && obj.callback(chart);
	return chart;
}