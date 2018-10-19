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
					name: '东京',
					data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
				}, {
					name: '伦敦',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}]
			})
		);
	}
	/*相关性图*/
	else if(obj.chart.type == 'bubble'){
		chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
				chart: {
					plotBorderWidth: 1,
					zoomType: 'xy'
				},
				series: [{
					name:'气泡1',
					data: [
						[9, 81, 63],
						[98, 5, 89],
						[51, 50, 73],
						[41, 22, 14],
						[58, 24, 20],
						[78, 37, 34],
						[55, 56, 53],
						[18, 45, 70],
						[42, 44, 28],
						[3, 52, 59],
						[31, 18, 97],
						[79, 91, 63],
						[93, 23, 23],
						[44, 83, 22]
					],
					marker: {
						fillColor: {
							radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
							stops: [
								[0, 'rgba(255,255,255,0.5)'],
								[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
							]
						}
					}
				}, {
					name:'气泡2',
					data: [
						[42, 38, 20],
						[6, 18, 1],
						[1, 93, 55],
						[57, 2, 90],
						[80, 76, 22],
						[11, 74, 96],
						[88, 56, 10],
						[30, 47, 49],
						[57, 62, 98],
						[4, 16, 16],
						[46, 10, 11],
						[22, 87, 89],
						[57, 91, 82],
						[45, 15, 98]
					],
					marker: {
						fillColor: {
							radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
							stops: [
								[0, 'rgba(255,255,255,0.5)'],
								[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
							]
						}
					}
				}]
			})
		);
	}else if(obj.chart.type == 'gaussiandistribution'){
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
					name: '降雨量',
					type: 'column',
					yAxis: 1,
					data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
					tooltip: {
						valueSuffix: ' mm'
					}
				}, {
					name: '温度',
					type: 'spline',
					data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
					tooltip: {
						valueSuffix: '°C'
					}
				}]
			})
		);
	}
	return chart;
}