/*单独获取数据，构造数据，绘制S12,S21*/
function getDataBuildS12S21(obj){
	var allData = obj.allData,
	container = obj.container,
	zoomType = obj.zoomType,
	showCheckbox = obj.showCheckbox,
	title = obj.title,
	legend_enabled = obj.legend_enabled,
	renderData = obj.renderData,
	GHzFlag = obj.GHzFlag,
	callback = obj.callback,
	pointMouseOverCallback = obj.pointMouseOverCallback;
	var objec = {};
	objec.xCategories = [];
	_.forEach(allData[0].data, function(v, i){
		if(GHzFlag === true) {
			objec.xCategories.push(v[0]);
		}else{
			objec.xCategories.push(Math.floor(v[0] / 10000000)/100);
		}
	});
	objec.series = [];
	if(renderData){
		_.forEach(allData, function(v, i){
			var item = {};
			item.name = v.name;
			item.data = [];
			_.forEach(v.data, function(vv, ii){
				item.data.push(parseFloat(vv[1]));
			});
			objec.series.push(item);
		});
	}
	objec.container = container;
	objec.zoomType = zoomType;
	objec.resetZoomButton = {
		position: {
			align: 'left', // by default
			// verticalAlign: 'top', // by default
			x: 0,
			y: 0
		},
		relativeTo: 'chart'
	};
	objec.showCheckbox = showCheckbox;
	objec.title = title;
	objec.legend_enabled = legend_enabled;
	objec.callback = callback;
	objec.pointMouseOverCallback = pointMouseOverCallback;
	drawRealS12S21(objec);
}

function getDataBuildS11S22(obj) {
	var smith1 = smithChart({
		dom: obj.wrapDOM,
		titleOneArr: obj.title,
		legendNameOneArr: obj.legendName,
		allDataArr: obj.data,
		Type: obj.classify,
		msgdom: obj.msgDOM,
		lineColorArray: obj.lineColorArray,
		msgFun: obj.msgFun,
		msgInitFun: obj.msgInitFun,
		GHzFlag: obj.GHzFlag
	});
	_.isFunction(obj.callback) && obj.callback(smith1);
}

/*实际绘制S12 S21*/
function drawRealS12S21(obj){
	var container = obj.container;
	var xCategories = obj.xCategories;
	var series = obj.series;
	var legend_enabled = _.isNil(obj.legend_enabled) ? true : obj.legend_enabled;
	var zoomType = obj.zoomType || "None";
	var resetZoomButton = obj.resetZoomButton;
	var title = obj.title || {text: null};
	var showCheckbox = obj.showCheckbox || false;
	var chart = Highcharts.chart(container, {
		chart: {
			type: 'line',
			zoomType: zoomType,
			resetZoomButton: resetZoomButton
		},
		title: title,
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
						mouseOver: function (ev) {
							var point = this;
							_.isFunction(obj.pointMouseOverCallback) && obj.pointMouseOverCallback(point, chart, ev);
						}
					}
				},
				showCheckbox: showCheckbox
			}
		},
	});
	_.isFunction(obj.callback) && obj.callback(chart);
	return chart;
}
			
//得到点击的坐标
function getEventPosition(ev) {
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { 
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {x: x, y: y};
}

/*绘制曲线图*/
function renderSpline(option){
	var nameArr = option.name;
	var chart = Highcharts.chart(option.container, {
		chart: {
			type: 'spline',
			zoomType: 'x',
			resetZoomButton: {
				position: {
					align: 'left', // by default
					// verticalAlign: 'top', // by default
					x: 90,
					y: 10
				},
				relativeTo: 'chart'
			}
		},
		title: {
			text: option.title
		},
        lang: {
            loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
        },
        legend: {
			enabled: true
		},
	    xAxis: {
			title: {
				text: "GHz",
			}, 
			categories : option.data.xData[0],
			gridLineColor: '#197F07',
			// 网格线线条宽度，当设置为 0 时则不显示网格线
            gridLineWidth: 0,
            crosshair: {
            	dashStyle: "LongDashDotDot",
            	width: 2,
            	color: "#bbbbbb",
            	snap: true
            }
		}, 
		yAxis: {
			title: {
				text: "dB",
			},
		    gridLineColor: '#eee',
		    gridLineWidth: 1,
		  	crosshair: {
		  		dashStyle: "LongDashDotDot",
		  		width: 2,
		  		color: "#bbbbbb",
		  		snap: true
		  	}
		},
		series:  [{
			name: option.name[0],
			data: option.data.yData[0]
		},{
			name: option.name[1],
			data: option.data.yData[1]
		}],
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function (e) {
				if(RF_SP2Store.stateObj.comfirm_key == "y"){
					return '<b>'+this.series.name+'</b><br>'+this.x+' GHz, <b class="underline_b">'+this.y+' dB</b>';
				}else if(RF_SP2Store.stateObj.comfirm_key == "x"){
					return '<b>'+this.series.name+'</b><br><b class="underline_b">'+this.x+' GHz</b>, '+this.y+' dB';
				}else{
					return '<b>'+this.series.name+'</b><br>'+this.x+' GHz, '+this.y+' dB';
				}
            },
            useHTML: true
			/*headerFormat: '<b>{series.name}</b><br>',
			pointFormat: option.data.xData[0][point.index]+' GHz, {point.y} db'*/
		},
		plotOptions: {
			series: {
				allowPointSelect: false,
				connectNulls: true,
				marker: {
					enabled: true,
					/*fillColor: "#00aeef",*/
					radius: 1,
					symbol: "diamond",
					states: {
						hover: {
							fillColor: 'white',
	                        lineColor: 'black',
	                        lineWidth: 3
						},
						select: {
							fillColor: 'white',
	                        lineColor: 'red',
	                        lineWidth: 3,
	                        radius: 4
						}
					}
				},
				cursor: "pointer",
				point: {
					events: {
						mouseOver: function (ev) {
							/*console.log(chart.getSelectedPoints());*/
							var ii = this.colorIndex;
							if(ii == 0){
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(0).children().text(this.series.name+" "+this.category+"GHz, "+this.y+"dB");
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(1).children().text(option.name[1]+" "+this.category+"GHz, "+option.data.yData[1][this.x]+"dB");
							}else{
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(1).children().text(this.series.name+" "+this.category+"GHz, "+this.y+"dB");
								$(".g_bodyin_bodyin_bottom_rsubin_foot>.container-fluid>.row").eq(0).children().text(option.name[0]+" "+this.category+"GHz, "+option.data.yData[0][this.x]+"dB");
							}
							/*chart.series[ii].data[1].select(true, true);*/
						},
						click: function(ev){
							// console.log("point.click", ev);
							// console.log(chart.series);
							// console.log(chart.xAxis);
							// console.log(this);
							if(_.isNil(RF_SP2Store.stateObj.comfirm_key) || _.isEqual(RF_SP2Store.stateObj.comfirm_key, "请选择")){
								RF_SP2SwalMixin({
									title: 'Key值设置提醒',
									text: "请先设置Key值并保存",
									type: 'info',
									showConfirmButton: false,
									timer: 1900,
								});
								return false;
							}
							var TCFsParameter = RF_SP2Store.stateObj.TCFsParameter;
							var ii = !this.colorIndex;
							var name = this.series.name; // 自己的name
							var name2 = chart.series[Number(ii)].name;
							var x = this.category;
							var y = this.y;
							var iindex = this.x;
							// 首先判断当前的选中curve是不是绘图的两个curve
							var curTCFSelectWafer = RF_SP2Store.util.curTCFSelectWafer();
							if(_.isNil(curTCFSelectWafer)){
								RF_SP2SwalMixin({
									title: 'Key值设置提醒',
									text: "请检查是否更换选择了曲线文件，但是未重新绘图",
									type: 'warning',
									showConfirmButton: false,
									timer: 2500,
								});
								return false;
							}else{
								var waferfile = curTCFSelectWafer.waferfile.replace(/\..*$/, "");
								var true1 = _.some(curTCFSelectWafer.selected, function(valu){
									return _.eq(waferfile+"  "+valu.curvefile, name);
								});
								var true2 = _.some(curTCFSelectWafer.selected, function(valu){
									return _.eq(waferfile+"  "+valu.curvefile, name2);
								});
								if(!true1 || !true2){
									RF_SP2SwalMixin({
										title: 'Key值设置提醒',
										text: "请检查是否更换选择了曲线文件，但是未重新绘图",
										type: 'warning',
										showConfirmButton: false,
										timer: 2500,
									});
									return false;
								}
							}

							if(RF_SP2Store.stateObj.comfirm_key == "x"){
								/*以X为Key*/
								var y2 = chart.series[Number(ii)].yData[iindex];
								if(this.selected){
									/*以前选中了*/
									this.select(false,true);
									chart.series[Number(ii)].data[iindex].select(false, true);
									_.pull(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], _.find(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(o) { 
											var flag = false;
											if(o.name == name && o.x == x) flag = true;
											return flag;
										 }));
									_.pull(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], _.find(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(o) { 
											var flag = false;
											if(o.name == name2 && o.x == x) flag = true;
											return flag;
										 }));
									$(".buildMarker_body>.container-fluid tbody>tr[data-iflag='"+(name+x)+"']").remove();
									$(".buildMarker_body>.container-fluid tbody>tr[data-iflag='"+(name2+x)+"']").remove();
									RF_SP2Store.util.applyOtherDieBtn();
								}else{
									/*以前未选中*/
									var serise1 = 0;
									_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(o){
										 if(o.name == name){
										 	serise1++;
										 }
									});
									if(serise1 > 1){
										RF_SP2SwalMixin({
											title: "Marker打点提示",
											text: "以x为Key时一条曲线最多打2个点",
											type: "warning",
											timer: 2500
										});
										return false;
									}
									this.select(true,true);
									chart.series[Number(ii)].data[iindex].select(true, true);
									saveMarkerANDaddTr(name, x, y, false, iindex);
									saveMarkerANDaddTr(name2, x, y2, false, iindex);
								}
							}else if(RF_SP2Store.stateObj.comfirm_key == "y"){
								/*以Y为Key*/
								if(this.selected){
									/*选中过*/
									/*第一步，自己曲线找*/
									
									/*第二步，另一条曲线找*/
									_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
										if(!_.isNil(v.isNew)){
											var curSeries = chart.series[_.indexOf(nameArr, v.name)];
											var findInde = _.findIndex(chart.xAxis[0].categories, function(vv, ii){
												return _.eq(curSeries.yData[ii], v.y) && _.eq(vv, v.x);
											});
											!_.eq(findInde, -1) && curSeries.data[findInde].select(false, true);
										}
									});
									RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter] = [];
									$(".buildMarker_body>.container-fluid tbody").empty();
									RF_SP2Store.stateObj.key_y = false;
									RF_SP2Store.util.applyOtherDieBtn();
								}else{
									/*先前未选中*/
									/*只可选一次*/
									if(RF_SP2Store.stateObj.key_y) {
										RF_SP2SwalMixin({
											title: 'Key值设置提醒',
											text: "以y为key时，仅可选取一次",
											type: 'info',
											showConfirmButton: false,
											timer: 1900,
										});
										return false;
									}
									/*第一步，自己曲线找*/
									var yData1 = chart.series[Number(!ii)].yData;
									var lastYIndex1 = _.lastIndexOf(yData1, y);
									var firstYIndex1 = _.indexOf(yData1, y);
									if(iindex == lastYIndex1 && iindex == firstYIndex1){
										/*不存在或者另一点存在但是还未找到*/
										var isIntersect = judgeIntersect(yData1, iindex, 1, y);
										var reverseyData1 = _.reverse(_.cloneDeep(yData1));
										var reverseyData1FromIndex = reverseyData1.length-iindex-1;
										var isIntersect2 = judgeIntersect(reverseyData1, reverseyData1FromIndex, 1, y);
										if(!isIntersect && !isIntersect2){
											RF_SP2SwalMixin({
												title: "Marker打点提示",
												text: "以y为Key时，当前曲线另一点不存在",
												type: "warning",
												timer: 2000
											});
											// this.select(true,true);
											saveMarkerANDaddTr(name, x, y, false, iindex);
											saveMarkerANDaddTr(name, NaN, y, null, -1);
										}else if(isIntersect && !isIntersect2){
											console.warn("第一步，自己曲线找", "以y为Key时，当前曲线另一点存在但是还未找到，位置大于当前点");
											// 找一对一对的
											renderPointToChart({
												iindex: iindex,
												yData1: yData1,
												y: y,
												chart: chart,
												ii: ii,
												name: name,
												x: x,
												flag: "last",
											});
										}else if(!isIntersect && isIntersect2){
											console.warn("第一步，自己曲线找", "以y为Key时，当前曲线另一点存在但是还未找到，位置小于当前点");
											// 找一对一对的
											renderPointToChart({
												iindex: reverseyData1FromIndex,
												yData1: reverseyData1,
												y: y,
												chart: chart,
												ii: ii,
												name: name,
												x: x,
												flag: "first"
											});
										}else if(isIntersect && isIntersect2){
											console.warn("第一步，自己曲线找", "以y为Key时，当前曲线存在两极");
											var theOneCombinatorial = findPointCombinatorial({
												fromIndex: 0,
												Arr: yData1,
												baseVal: y,
												flag: "last"
											});
											var theOneNewPointArr = [];
											var theOneXData = chart.xAxis[0].categories;
											_.forEach([_.head(theOneCombinatorial), _.last(theOneCombinatorial)], function(qv, wi){
												var xx1 = theOneXData[qv.index];
												var xx2 = theOneXData[qv.index + 1];
												var yy1 = qv.arr[0];
												var yy2 = qv.arr[1];
												theOneNewPointArr.push(getPointXY({
													one: [xx1, yy1],
													two: [xx2, yy2],
													baseVal: y,
													index: qv.index
												}));
											});
											var theOneNewxyData = buildNewxyData({
												pointArr: theOneNewPointArr,
												xData: _.cloneDeep(theOneXData),
												yData: _.cloneDeep(yData1),
												yData2: _.cloneDeep(chart.series[Number(ii)].yData),
											});
											chart.xAxis[0].setCategories(theOneNewxyData.xData);
											chart.series[Number(!ii)].setData(theOneNewxyData.yData);
											chart.series[Number(ii)].setData(theOneNewxyData.yData2);
											saveMarkerANDaddTr(name, theOneNewPointArr[0].x, y, true, theOneNewPointArr[0].index+1);
											saveMarkerANDaddTr(name, theOneNewPointArr[1].x, y, true, theOneNewPointArr[1].index+2);
										}
									}else if(iindex == lastYIndex1 && iindex != firstYIndex1){
										console.warn("第一步，自己曲线找", "当前曲线两点都存在，点击点位置在"+iindex+"，另一点位置在"+firstYIndex1);
										saveMarkerANDaddTr(name, x, y, false, iindex);
										saveMarkerANDaddTr(name, chart.xAxis[0].categories[firstYIndex1], y, false, firstYIndex1);
									}else if(iindex != lastYIndex1 && iindex == firstYIndex1){
										console.warn("第一步，自己曲线找", "当前曲线两点都存在，点击点位置在"+iindex+"，另一点位置在"+lastYIndex1);
										saveMarkerANDaddTr(name, x, y, false, iindex);
										// chart.series[Number(!ii)].data[lastYIndex1].select(true, true);
										saveMarkerANDaddTr(name, chart.xAxis[0].categories[lastYIndex1], y, false, lastYIndex1);
									}else if(iindex != lastYIndex1 && iindex != firstYIndex1){
										console.warn("第一步，自己曲线找", "当前曲线两点都存在，两点位置在"+firstYIndex1+","+lastYIndex1);
										saveMarkerANDaddTr(name, chart.xAxis[0].categories[firstYIndex1], y, false, firstYIndex1);
										// chart.series[Number(!ii)].data[lastYIndex1].select(true, true);
										saveMarkerANDaddTr(name, chart.xAxis[0].categories[lastYIndex1], y, false, lastYIndex1);
									}
									/*第二步，另一条曲线找*/
									var anotherXData = chart.xAxis[0].categories;
									var anotherYData = chart.series[Number(ii)].yData;
									var hasYDataIndexArr = [];
									_.forEach(anotherYData, function(cv, ci){
										if(cv == y){
											hasYDataIndexArr.push(ci);
										}
									});
									if(hasYDataIndexArr.length == 0){
										/*没有相同的*/
										var anotherjudge = judgeIntersect(anotherYData, 0, 0, y);
										if(anotherjudge){
											var anotherCombinatorial = findPointCombinatorial({
												fromIndex: 0,
												Arr: anotherYData,
												baseVal: y,
												flag: "last"
											});
											var anotherNewPointArr = [];
											var anotherNewxyData;
											if(anotherCombinatorial.length == 1){
												_.forEach([_.head(anotherCombinatorial)], function(qv, wi){
													var xx1 = anotherXData[qv.index];
													var xx2 = anotherXData[qv.index + 1];
													var yy1 = qv.arr[0];
													var yy2 = qv.arr[1];
													anotherNewPointArr.push(getPointXY({
														one: [xx1, yy1],
														two: [xx2, yy2],
														baseVal: y,
														index: qv.index
													}));
												});
												anotherNewxyData = buildNewxyData({
													pointArr: anotherNewPointArr,
													xData: _.cloneDeep(anotherXData),
													yData: _.cloneDeep(anotherYData),
													yData2: _.cloneDeep(chart.series[Number(!ii)].yData),
												});
												chart.xAxis[0].setCategories(anotherNewxyData.xData);
												chart.series[Number(ii)].setData(anotherNewxyData.yData);
												chart.series[Number(!ii)].setData(anotherNewxyData.yData2);
												saveMarkerANDaddTr(name2, NaN, y, null, -1);
												saveMarkerANDaddTr(name2, anotherNewPointArr[0].x, y, true, anotherNewPointArr[0].index+1);
											}else{
												_.forEach([_.head(anotherCombinatorial), _.last(anotherCombinatorial)], function(qv, wi){
													var xx1 = anotherXData[qv.index];
													var xx2 = anotherXData[qv.index + 1];
													var yy1 = qv.arr[0];
													var yy2 = qv.arr[1];
													anotherNewPointArr.push(getPointXY({
														one: [xx1, yy1],
														two: [xx2, yy2],
														baseVal: y,
														index: qv.index
													}));
												});
												anotherNewxyData = buildNewxyData({
													pointArr: anotherNewPointArr,
													xData: _.cloneDeep(anotherXData),
													yData: _.cloneDeep(anotherYData),
													yData2: _.cloneDeep(chart.series[Number(!ii)].yData),
												});
												chart.xAxis[0].setCategories(anotherNewxyData.xData);
												chart.series[Number(ii)].setData(anotherNewxyData.yData);
												chart.series[Number(!ii)].setData(anotherNewxyData.yData2);
												saveMarkerANDaddTr(name2, anotherNewPointArr[0].x, y, true, anotherNewPointArr[0].index+1);
												saveMarkerANDaddTr(name2, anotherNewPointArr[1].x, y, true, anotherNewPointArr[1].index+2);
											}
											/*判断一个交点和两个交点结束*/
										}else{
											/*不相交*/
											RF_SP2SwalMixin({
												title: "Marker打点提示",
												text: "以y为Key时，另一条曲线两点都不存在",
												type: "warning",
												timer: 2000
											});
											saveMarkerANDaddTr(name2, NaN, y, null, -1);
											saveMarkerANDaddTr(name2, NaN, y, null, -1);
										}
									}else if(hasYDataIndexArr.length == 1){
										/*有相同的*/
										console.warn("第二步，另一条曲线找", "另一条曲线有相同的y，有一个");								
										var reverseanotherYData = _.reverse(_.cloneDeep(anotherYData));
										var reverseanotherYDataFromIndex = reverseanotherYData.length-_.head(hasYDataIndexArr)-1;
										var anotherjudge1 = judgeIntersect(anotherYData, _.head(hasYDataIndexArr), 1, y);
										var anotherjudge2 = judgeIntersect(reverseanotherYData, reverseanotherYDataFromIndex, 1, y);
										if(!anotherjudge1 && !anotherjudge2){
											RF_SP2SwalMixin({
												title: "Marker打点提示",
												text: "以y为Key时，另一条曲线只存在一个点",
												type: "info",
												timer: 2000
											});
											/*先保存一个点*/
											saveMarkerANDaddTr(name2, anotherXData[_.head(hasYDataIndexArr)], y, false, _.head(hasYDataIndexArr));
											saveMarkerANDaddTr(name2, NaN, y, null, -1);
										}else if(anotherjudge1 && !anotherjudge2){
											/*向后找有，向前找没*/
											console.warn("第二步，另一条曲线找", "向后找有，向前找没");	
											renderPointToChart({
												iindex: _.head(hasYDataIndexArr),
												yData1: anotherYData,
												y: y,
												chart: chart,
												ii: !ii,
												name: name2,
												x: anotherXData[_.head(hasYDataIndexArr)],
												flag: "last",
											});
										}else if(!anotherjudge1 && anotherjudge2){
											/*向前找有，向后找没*/
											console.warn("第二步，另一条曲线找", "向前找有，向后找没");
											renderPointToChart({
												iindex: reverseanotherYDataFromIndex,
												yData1: reverseanotherYData,
												y: y,
												chart: chart,
												ii: !ii,
												name: name2,
												x: anotherXData[_.head(hasYDataIndexArr)],
												flag: "first",
											});
										}else if(anotherjudge1 && anotherjudge2){
											console.warn("第二步，另一条曲线找", "另一条曲线存在两极点");
											var anotherCombinatorial12 = findPointCombinatorial({
												fromIndex: 0,
												Arr: anotherYData,
												baseVal: y,
												flag: "last"
											});
											var anotherNewPointArr12 = [];
											var anotherNewxyData12;
											_.forEach([_.head(anotherCombinatorial12), _.last(anotherCombinatorial12)], function(qv, wi){
												var xx1 = anotherXData[qv.index];
												var xx2 = anotherXData[qv.index + 1];
												var yy1 = qv.arr[0];
												var yy2 = qv.arr[1];
												anotherNewPointArr12.push(getPointXY({
													one: [xx1, yy1],
													two: [xx2, yy2],
													baseVal: y,
													index: qv.index
												}));
											});
											anotherNewxyData12 = buildNewxyData({
												pointArr: anotherNewPointArr12,
												xData: _.cloneDeep(anotherXData),
												yData: _.cloneDeep(anotherYData),
												yData2: _.cloneDeep(chart.series[Number(!ii)].yData),
											});
											chart.xAxis[0].setCategories(anotherNewxyData12.xData);
											chart.series[Number(ii)].setData(anotherNewxyData12.yData);
											chart.series[Number(!ii)].setData(anotherNewxyData12.yData2);
											saveMarkerANDaddTr(name2, anotherNewPointArr12[0].x, y, true, anotherNewPointArr12[0].index+1);
											saveMarkerANDaddTr(name2, anotherNewPointArr12[1].x, y, true, anotherNewPointArr12[1].index+2);
										}
									}else{
										/*有相同的*/
										console.warn("第二步，另一条曲线找", "另一条曲线有相同的y，大于一个");
										saveMarkerANDaddTr(name2, anotherXData[_.head(hasYDataIndexArr)], y, false, _.head(hasYDataIndexArr));
										saveMarkerANDaddTr(name2, anotherXData[_.last(hasYDataIndexArr)], y, false, _.last(hasYDataIndexArr));
									}
									_.forEach(RF_SP2Store.stateObj.splineSelectedArr[TCFsParameter], function(v, i){
										if(!_.isNil(v.isNew)){
											var curSeries = chart.series[_.indexOf(nameArr, v.name)];
											var findInde = _.findIndex(chart.xAxis[0].categories, function(vv, ii){
												return _.eq(curSeries.yData[ii], v.y) && _.eq(vv, v.x);
											});
											!_.eq(findInde, -1) && curSeries.data[findInde].select(true, true);
										}
									});
									/*第二步，另一条曲线找end*/
									RF_SP2Store.stateObj.key_y = true;
									/*判断另一条曲线是否有相同的y结束*/
								}
							}
						}
					}
				},
			}
		},
	});
	_.isFunction(option.callback) && option.callback(chart);
}

function judgeIntersect(yData1, iindex, cur, y){
	var flag1 = false;
	_.forEach(yData1, function(v, i){
		if(i>iindex){
			if(yData1[iindex+cur] > y){
				if(v<y){
					flag1 = true;
					return false;
				}
			}else if(yData1[iindex+cur] < y){
				if(v>y){
					flag1 = true;
					return false;
				}
			}else{
				flag1 = true;
				return false;
				/*if(cur < (yData1.length - iindex - 1)){
					cur++;
					judgeIntersect(yData1, iindex, cur, y);
				}*/
			}
		}
	});
	return flag1;
}

/*保存marker和添加表格行*/
function saveMarkerANDaddTr(name, x, y, isNew, newIndex){
	if(_.isNil(RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter])) RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter] = [];
	var splineSelectedArr = RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter];
	// 查找data-curvetypeid
	var findTCFWafer = _.find(RF_SP2Store.waferTCFSelected, function(v) {
		return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && (v.selected || []).length == 2);
	});
	if(!_.isNil(findTCFWafer)){
		var curvetypeid = _.find(findTCFWafer.selected, function(v){
			return _.isEqual(v.curvefile, name.split("  ")[1]);
		}).curvetypeid;

		// 规定是L, 还是R
		var preMarkerCurCurve = _.find(splineSelectedArr, function(v){
			return (_.isEqual(RF_SP2Store.stateObj.TCFsParameter, v.sParameter) && _.isEqual(v.name, name));
		}),
		LR,
		Numb = _.findIndex(findTCFWafer.selected, function(v){
			return _.isEqual(v.curvefile, name.split("  ")[1]);
		})+1;
		if(_.isNil(preMarkerCurCurve)){
			LR = 'L';
		}else{
			var x1 = preMarkerCurCurve.x;
			if(x1<=x){
				LR = 'R';
			}else{
				preMarkerCurCurve.markerName = 'Marker'+Numb+'_R';
				LR = 'L';
			}
		}
		var id,
		markerName;
		if(_.isNil(splineSelectedArr) || _.isEmpty(splineSelectedArr)){
			id = '1_L';
		}else{
			// id = Number(_.last(_.sortBy(RF_SP2Store.stateObj.splineSelectedArr, function(o) { return o.id; })).id) + 1;
			id = Numb+LR;
		}
		markerName = 'Marker'+Numb+'_'+LR;
		splineSelectedArr.push({
			name: name,
			x: x,
			y: y,
			markerName: markerName,
			key: RF_SP2Store.stateObj.comfirm_key,
			id: id,
			isNew: isNew,
			newIndex: newIndex,
			curvetypeid: curvetypeid,
			sParameter: findTCFWafer.sParameter
		});
		renderMarkerAddTr();
	}
}

function renderMarkerAddTr(){
	if(_.isNil(RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter])) RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter] = [];
	var splineSelectedArr = RF_SP2Store.stateObj.splineSelectedArr[RF_SP2Store.stateObj.TCFsParameter],
	str = '';
	_.forEach(splineSelectedArr, function(v){
		str+='<tr data-iflag="'+(v.name+v.x)+'" data-curvetypeid="'+v.curvetypeid+'" data-imarkername="'+v.markerName+'" data-ix="'+v.x+'"><td contenteditable="true" title="点击修改" data-iorigin="'+v.markerName+'">'+v.markerName+'</td><td>'+v.x+'</td><td>'+v.y+'</td><td>'+v.key+'</td></tr>';
	});
	$(".buildMarker_body>.container-fluid tbody").empty().append(str);
}

function findPointCombinatorial(obj){
	var flagNum = obj.fromIndex;
	var returnArr = [];
	_.reduce(obj.Arr, function(result, value, key, arra) {
		if(key > obj.fromIndex){
			if(_.sortBy([result, value])[0] < obj.baseVal && obj.baseVal < _.sortBy([result, value])[1]){
				var iKey;
				var iarr;
				if(obj.flag == "last"){
					iKey = key - 1;
					iarr = [result, value];
				}else if(obj.flag == "first"){
					iKey = arra.length - key - 1;
					iarr = [value, result];
				}
				returnArr.push({
					index: iKey,
					arr: iarr
				});
			}
		  	return value;
		}
	}, obj.Arr[obj.fromIndex + 1]);
	return returnArr;
}

function getPointXY(obj){
	var k = (obj.two[1] - obj.one[1]) / obj.two[0] - obj.one[0];
	var x = obj.two[0] - (obj.two[1] - obj.baseVal) / k;
	console.log("1", x)
	x = _.round(x * 1000) / 1000;
	console.log("2", obj.one[0])
	console.log("3", obj.two[0])
	console.log("4", x)
	return {
		x: x,
		y: obj.baseVal,
		index: obj.index
	};
}

function buildNewxyData(obj){
	_.forEach(obj.pointArr, function(v, i){
		obj.xData.splice(v.index+i+1, 0, v.x); // 不能和x一样
		obj.yData.splice(v.index+i+1, 0, v.y);
		obj.yData2.splice(v.index+i+1, 0, obj.yData2[v.index+i]);
	});
	return {
		xData: _.cloneDeep(obj.xData),
		yData: _.cloneDeep(obj.yData),
		yData2: _.cloneDeep(obj.yData2),
	};
}

function renderPointToChart(obj){
	var iindex = obj.iindex;
	var yData1 = obj.yData1;
	var y = obj.y;
	var chart = obj.chart;
	var xData1 = chart.xAxis[0].categories;
	var ii = obj.ii;
	var name = obj.name;
	var x = obj.x;
	var flag = obj.flag;

	var Combinatorial = findPointCombinatorial({
		fromIndex: iindex,
		Arr: yData1,
		baseVal: y,
		flag: flag
	});
	var newPointArr = [];
	var analyzeCombinatorial = [];
	if(flag == "last" || flag == "first"){
		analyzeCombinatorial[0] = _.last(Combinatorial);
	}else if(flag == "twoSlide"){
		// analyzeCombinatorial[0] = _.head(Combinatorial);
		analyzeCombinatorial[0] = _.last(Combinatorial);
	}
	_.forEach(analyzeCombinatorial, function(qv, wi){
		var xx1 = xData1[qv.index];
		var xx2 = xData1[qv.index + 1];
		var yy1 = qv.arr[0];
		var yy2 = qv.arr[1];
		newPointArr.push(getPointXY({
			one: [xx1, yy1],
			two: [xx2, yy2],
			baseVal: y,
			index: qv.index
		}));
	});
	var NewxyData = buildNewxyData({
		pointArr: newPointArr,
		xData: _.cloneDeep(xData1),
		yData: _.cloneDeep(chart.series[Number(!ii)].yData),
		yData2: _.cloneDeep(chart.series[Number(ii)].yData),
	});

	chart.xAxis[0].setCategories(NewxyData.xData);
	chart.series[Number(!ii)].setData(NewxyData.yData);
	chart.series[Number(ii)].setData(NewxyData.yData2);
	saveMarkerANDaddTr(name, x, y, false, iindex);
	saveMarkerANDaddTr(name, _.last(newPointArr).x, _.last(newPointArr).y, true, _.last(newPointArr).index+1);
}