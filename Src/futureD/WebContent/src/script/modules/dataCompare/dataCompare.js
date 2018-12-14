/*variable defined*/
var dataCompareSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var dataCompareState = new Object();
dataCompareState.paginationObj = {
	normal: null,
	search: null
};
dataCompareState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
dataCompareState.pageSearchObj = {
	selector: '#pagelist',
	pageOption: {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: 0,
	  // 当前页码（选填，默认为1）
	  curr: 0,
	  // 是否显示省略号（选填，默认显示）
	  ellipsis: true,
	  // 当前页前后两边可显示的页码个数（选填，默认为2）
	  pageShow: 2,
	  // 开启location.hash，并自定义hash值 （默认关闭）
	  // 如果开启，在触发分页时，会自动对url追加：#!hash值={curr} 利用这个，可以在页面载入时就定位到指定页
	  hash: false,
	  // 页面加载后默认执行一次，然后当分页被切换时再次触发
	  callback: function(obj) {
	    // obj.curr：获取当前页码
	    // obj.limit：获取每页显示数据条数
	    // obj.isFirst：是否首次加载页面，一般用于初始加载的判断
	    dataCompareState.pageSearchObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
	      	dataCompareRenderData({
				chunkArr: dataArr,
				currentPage: dataCompareState.pageSearchObj.currentPage
			});
	    }
	  }
	},
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
dataCompareState.searchObj = {
	hasSearch: false,
	searchVal: null
};
dataCompareState.sellectObj = {
	selectAll: false,
	selectItem: [],
	selectSearchItem: []
};
dataCompareState.stateObj = {
	canClickParam: false,
	curParam: null,
	curChartContainerNum: 0,
	searchShow: true,
	allChoose : false,
	curWaferChange : false
};
dataCompareState.chartTypeMap = {
	"good_rate": "spline",
	"histogram": "column",
	"boxlinediagram": "boxplot",
	"CPK": "line",
	"correlationgraph": "scatter",
};
dataCompareState.chartAjaxUrl = {
	"good_rate": "ShowYield",
	"histogram": "Histogram",
	"boxlinediagram": "Boxplot",
	"CPK": "CPKServlet",
	"correlationgraph": "scatter",
};
dataCompareState.curPageSelectAll = 
	{  //当前页是否全选
		//currentPage : ,
		//SelectAll : 
	}                     
 
var dataListDetailStore = Object.create(null);
dataListDetailStore.state = Object.create(null);
dataListDetailStore.state = {
	allDetail: {
		tbody: {
			scrollTop: 0,
			scrollLeft: 0
		}
	},
	parameterMap: {
		curChartContainerNum: 0,
		hasRender: false,
		ajaxLength: 0
	},
	chartTypeMap: {
		"map_good_rate_distribution": null,
		"map_color_order_distribution": null,
		"good_rate": "spline",
		"histogram": "column",
		"boxlinediagram": "boxplot",
		"CPK": "line",
		"correlationgraph": "scatter",
	},
	chartAjaxUrlMap: {
		"map_good_rate_distribution": "WaferMap",
		"map_color_order_distribution": "ColorMap",
		"good_rate": "ShowYield",
		"histogram": "Histogram",
		"boxlinediagram": "Boxplot",
		"CPK": "CPKServlet",
		"correlationgraph": "Correlation",
	},
	chartCNNameMap: {
		"map_good_rate_distribution": "Map良率分布",
		"map_color_order_distribution": "Map色阶分布",
		"good_rate": "良品率图",
		"histogram": "直方图",
		"boxlinediagram": "箱线图",
		"CPK": "CPK图",
		"correlationgraph": "相关性图",
	},
};

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
			});
			/*iserise.push({
				name: iparam+"频率累加",
				type: "line",
				data: _.map(ndataItem.proportion, function(v){
					return parseFloat(v);
				})
			});*/
			series = iserise;
			console.log("histogram",series);
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
				}, {
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
				}];
			console.log("boxlinediagram",series);
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
			console.log("CPK",series);
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
					text: $(".right_div .list-group-item-info").eq(0).data("iparam"),
					style:{"fontSize":"16px","fontFamily":"arial","float":"top"}
				},
				lineWidth:1,
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
				labels: {
            	useHTML: true,
                formatter: function () {
                    return '<a href="javascript:alert(\'hello\')">' + this.value + '</a>';
            	}
            },
			};
			yAxis = {
				title: {
					text: $(".right_div .list-group-item-info").eq(1).data("iparam")
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
			console.log("correlationgraph",series);
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
			console.log("良品率图",series);
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

/*参数分布统计 Map良率绘制*/
function draw_map_good_rate(obj){
	//console.log("draw_map_good_rate",obj);
	var data = obj.data;
	var waferNO = obj.IDParamObj.wafer;
	if(_.isNil(waferNO)) return false;
	var IDParamObj = obj.IDParamObj;
	var that = $("#"+IDParamObj.id);
	var inH = that.innerWidth();
	that.innerHeight(inH*0.8);
	var canvasID = "canvas_" + that.attr("id");
	that.append("<canvas id='"+canvasID+"'></canvas>");
	that.append("<div class='criterion_"+canvasID+"'></div>");

	/*预处理数据*/
	var waferData = _.find(data, function(v, k){
		return _.toString(k) == _.toString(waferNO);
	});
		var dieData = [];
		var currentDieItem = _.find(waferData.waferList, function(v, k){
			return _.toString(v.parameter) == _.toString(IDParamObj.param);
		});
		//console.log("map_currentDieItem=====",currentDieItem);
		_.forOwn(currentDieItem.currentDieList, function(v, k){
			var item = {};
			item[k] = v;
			dieData.push(item);
		});
		_.forOwn(waferData.otherDieType, function(v, k){
			var item = {};
			item[k] = v;
			dieData.push(item);
		});
		
		/*预处理数据end*/
	
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
			param :IDParamObj.param,
			m_DieDataListNew: dieData,
			colorGradation: {
				limitColor: "#FF0000",
				floorColor: "#00FF00",
				nums: 256
			},
			callback: function(positionFlag, newRenderWaferMap){
				/*var uplow = findParamUpLow(IDParamObj.param[p_num]);
				var str = '<div class="container-fluid">'+
							'<table class="table table-striped table-bordered table-hover table-condensed">'+
								'<thead>'+
									'<tr>'+
										'<th>合格数</th>'+
										'<th>不合格数</th>'+
										'<th>良率</th>'+
										'<th>下限</th>'+
										'<th>上限</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody>'+
									'<tr>'+
										'<td>'+currentDieItem.qualify+'</td>'+
										'<td>'+currentDieItem.unqulify+'</td>'+
										'<td>'+currentDieItem.yield+'</td>'+
										'<td>'+uplow.low+'</td>'+
										'<td>'+uplow.up+'</td>'+
									'</tr>'+
								'</tbody>'+
							'</table>'+
						'</div>';
				that.parent().next().append(str);*/
			}
		});
}

/*map色阶分布图绘制*/
function draw_map_color_order_distribution(obj){
	console.log("draw_map_color_order_distribution",obj);
	/*获取参数*/
	var data = obj.data;
	var IDParamObj = obj.IDParamObj;
	var waferNO = IDParamObj.wafer;
	/*预处理数据*/
	var that = $("#"+IDParamObj.id),
	waferData = _.find(data, function(v, k){
		return _.toString(k) == _.toString(waferNO);
	}),
	dieData = [],
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
	/*合并有效die和其他器件die*/
	_.forEach([currentDieItem.currentDieList, waferData.otherDieType], function(val, ind){
		_.forOwn(val, function(v, k){
			var item = {},
			iNo,
			ibin,
			addNum,
			percentV,
			binV;
			if(_.isObject(v)){
				percentV = v.percent;
				binV = v.bin;
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

	
	//console.table(dieData);
	/*预处理数据end*/

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
		otherColor: otherColor
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
	
	var countObj = _.countBy(dieData, function(v, i){
		var retur;
		_.forOwn(v, function(vv, k){
			retur = vv.color.split(":")[0];
		});
		return retur;
	});
	var tableStr = '<table class="table table-striped table-bordered table-condensed">'+
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

/*参数分布统计*/
/*寻找参数上下限*/
function findParamUpLow(param){
	var UpLow = {};
	if(param.toLocaleUpperCase() == "ALL"){
		UpLow.up = "无";
		UpLow.low = "无";
	}else{
		var data = $("body").data("result").paramLimit;
		var iindex = _.findIndex(data.paramList, function(v, i){
			return v.replace(/\([\s\S]*\)$/, "") == param;
		});
		if(iindex == -1){
			UpLow.up = "无";
			UpLow.low = "无";
		}else{
			UpLow.up = data.upperList[iindex];
			UpLow.low = data.lowerList[iindex];
		}
	}
	return _.cloneDeep(UpLow);
}
function buildParameterChartContainer(obj){
	//console.log("obj",obj);
	var classify = obj.classify;
	var paramsArr = obj.paramsArr;
	var str = '<div class="container-fluid">';
	var returnIDArr = [];
	var inStr = '';
	 if(["good_rate","histogram", "boxlinediagram", "CPK","correlationgraph"].indexOf(classify) > -1){
		if(["histogram"].indexOf(classify) > -1) paramsArr = _.pull(paramsArr, "sectionX");
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
					    		'<div class="chart_body"><div id="'+(classify+dataListDetailStore.state.parameterMap.curChartContainerNum)+'" data-iparam="'+v+'"></div></div>'+
					    		'<div class="chart_foot">'+inStr+'</div>'+
					    	'</div>'+
					  	'</div>'+
					'</div>';
				str+='</div>';
			if(i%2 == 1 || (i%2 == 0 && i == arr.length-1)){
				str+='</div>';
			}
			returnIDArr.push({
				id: (classify+dataListDetailStore.state.parameterMap.curChartContainerNum),
				param: v,
				isAll: false
			});
			dataListDetailStore.state.parameterMap.curChartContainerNum++;
		});
		str+='</div>';
	}
	 else if(["map_good_rate_distribution", "map_color_order_distribution"].indexOf(classify) > -1){
		//for(var num = 0 ; num < obj.waferArr.length ; num++){
		for(var num = 0 ; num < paramsArr.length ; num++){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+paramsArr[num]+
					  	'</div>'+
					  	'<div class="panel-body">'+
					  		'<div class="container-fluid">';
			for(var p = 0 ; p < obj.waferArr.length ; p++){
				if(p%2 == 0){
					str+='<div class="row">';
				}
					str+='<div class="col-sm-12 col-md-6 col-lg-6">';
					str+='<div class="panel panel-info">'+
						  	'<div class="panel-heading">'+
						    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+obj.curWaferName[obj.waferArr[p]]+
						  	'</div>'+
						  	'<div class="panel-body">'+
						    	'<div class="container-fluid">'+
						    		'<div class="chart_title"></div>'+
						    		'<div class="chart_body"><div id="'+(classify+dataListDetailStore.state.parameterMap.curChartContainerNum)+'" data-iparam="'+paramsArr[num][p]+'"></div></div>'+
						    		'<div class="chart_foot">'+inStr+'</div>'+
						    	'</div>'+
						  	'</div>'+
						'</div>';
					str+='</div>';
					
				if(p%2 == 1 || (p%2 == 0 && p ==  obj.waferArr.length-1)){
					str+='</div>';
				}
				returnIDArr.push({
					id: (classify+dataListDetailStore.state.parameterMap.curChartContainerNum),
					param: paramsArr[num],
					isAll: false,
					wafer :  obj.waferArr[p]
				});
				dataListDetailStore.state.parameterMap.curChartContainerNum++;
			}
			
			str+='</div></div></div>';
		} 
		
		str+='</div>';
		
	 }
	 if(obj.controls == "all_statistics"){
		 //console.log("classify",classify);
		 $("#all_statistics .panel_"+classify+">.panel-body").append(str);
	 }
	 else{
		 $("#"+classify+" .single_div_in").append(str);
	 }
	
	return returnIDArr;
}




function ajax_all_chart(obj){
	//console.log("obj",obj);
	var times = obj.times;
	var alltimes = obj.alltimes;
	var whenArr = obj.whenArr;
	var errorArr = obj.errorArr || [];
	var curWaferName = obj.curWaferName;
	var whenArrItem = whenArr[times];
	var curWaferID = [];var curParam=[];var curParam_nototal=[];
	for(var _i = 0 ; _i < $(".home_dataCompare_bottom table tbody tr").length ; _i++){
		curWaferID.push( $(".home_dataCompare_bottom table tbody  tr").eq(_i).find("input[type='checkbox']").data("ivalue"));
	}
	for(var _i = 0 ; _i < $(".home_dataCompare_bottom .right_div  li").length ; _i++){
		if($(".home_dataCompare_bottom .right_div  li").eq(_i).hasClass("list-group-item-info")){
			if(_i != 0){
				curParam_nototal.push($(".home_dataCompare_bottom .right_div  li").eq(_i).data("iparam"));
			}
			curParam.push($(".home_dataCompare_bottom .right_div  li").eq(_i).data("iparam"));
		}
	}
	if(whenArrItem.classify === "correlationgraph"){
		var ajax_data = {
			waferIdStr: curWaferID.join(","),
			paramX : $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(0).data("iparam") ,
			paramY : $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(1).data("iparam"),
			minX :  $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(0).data("min"),
			minY :  $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(1).data("min") ,
			maxX : $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(0).data("max") ,
			maxY : $(".home_dataCompare_bottom .right_div  li.list-group-item-info").eq(1).data("max") ,
		}
	}
	else{
		var ajax_data = {
			waferIdStr: curWaferID.join(","),
			paramAtt : curParam_nototal
		}
	}
	$.ajax({
		type: "GET",
		url: whenArrItem.chartAjaxUrl,
		data: ajax_data,
		dataType: "json",
		beforeSend: function(){
			$("body").data("iglobalerror", "allow");
			/*提示框修改text*/
			$("#swal2-content").text("正在请求"+whenArrItem.chartCNName+"数据，绘图进度 "+(times+1)+"/"+alltimes);
		}
	}).then(function(data){
		//console.log("ajaxdata",data);
		var waferArr = curWaferID;
		if(_.isEmpty(data) || _.isNil(data)) {
			errorArr.push({
				chartCNName: whenArrItem.chartCNName,
				errorParamArr: [],
				classify: whenArrItem.classify,
				message: "数据为空"
			});
		}else{
			/*提示框修改text*/
			//$("#swal2-content").text("正在绘制"+whenArrItem.chartCNName+"，绘图进度 "+(times+1)+"/"+alltimes);
			var paramsArr;
			if(["map_good_rate_distribution", "map_color_order_distribution"].indexOf(whenArrItem.classify) > -1){
				var paramsArr = curParam;
			}
			else if(["good_rate"].indexOf(whenArrItem.classify) > -1){
				paramsArr = curParam;
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
				controls : obj.controls
			});
			//console.log("IDParamObjArr===",IDParamObjArr);
			/*画图*/
			_.forEach(IDParamObjArr, function(v, i){
				if(whenArrItem.classify == "map_good_rate_distribution"){
					draw_map_good_rate({
						IDParamObj: v,
						data: _.cloneDeep(data),
						curWaferName : curWaferName,
						paramsArr : paramsArr
					});
				}else if(whenArrItem.classify == "map_color_order_distribution"){
					/*map色阶分布图绘制*/
					draw_map_color_order_distribution({
						data: _.cloneDeep(data),
						IDParamObj: v,
						curWaferName : curWaferName,
						paramsArr : paramsArr
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
						curWaferName : curWaferName
						//waferNO: waferNO
					});
				}
			});
		}
		//console.table(errorArr)
		times++;
		if(times != alltimes){
			setTimeout(function(){
				ajax_all_chart({
					times: times,
					alltimes: alltimes,
					whenArr: whenArr,
					curWaferName : curWaferName,
					errorArr: errorArr,
					controls : obj.controls
				});
			}, 50);
		}else{
			eouluGlobal.S_getSwalMixin()({
				title: "加载提示",
				text: "数据请求完成",
				type: "info",
				showConfirmButton: false,
				timer: 1200
			}).then(function(){
				if(_.isEmpty(errorArr)){
					eouluGlobal.S_getSwalMixin()({
						title: "加载提示",
						text: "全部图表绘制完成",
						type: "success",
						showConfirmButton: false,
						timer: 1200
					});
				}else{
					var iiistr = '部分图表绘制完成，以下图表请求/绘制失败';
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
						}else{
							_.forEach(v.errorParamArr, function(vv){
								iiistr+=vv+":"+v.message+"<br/>";
							});
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
				$("body").data("iglobalerror", "unallow");
				dataListDetailStore.state.parameterMap.hasRender = true;
			});
		}
	}, function(){
		// errorArr.push(whenArrItem.chartCNName);
		eouluGlobal.S_getSwalMixin()({
			title: "加载提示",
			text: whenArrItem.chartCNName+"数据请求失败，请刷新页面或重新登录",
			type: "error",
			showConfirmButton: false,
			timer: 1800
		});
	}).always(function(){
		/*(times == alltimes) && (dataListDetailStore.state.parameterMap.hasRender = true);*/
	});
}


$(document).on('shown.bs.tab', 'div.g_bodyin_bodyin_top_wrap a[data-toggle="tab"]', function (e) {
	if($(this).parent().attr("ischange") == "true") return true;
	$(this).parent().attr("ischange", "true");
	
	
	var curWaferID = [];var curWaferName = {};
	for(var _i = 0 ; _i < $(".home_dataCompare_bottom table tbody tr").length ; _i++){
		curWaferID.push( $(".home_dataCompare_bottom table tbody  tr").eq(_i).find("input[type='checkbox']").data("ivalue"));
		curWaferName[$(".home_dataCompare_bottom table tbody  tr").eq(_i).find("input[type='checkbox']").data("ivalue")] =$(".home_dataCompare_bottom table tbody  tr").eq(_i).find(".wafer_number").text();
	}
  	var curParam = dataCompareState.stateObj.curParam;
  	var controls = $(e.target).attr("aria-controls");
  	$(".g_info_m, .g_info_r .glyphicon-search, .g_info .glyphicon-question-sign").hide();
  	if(controls == "home_dataCompare"){
  		$(".g_info_m, .g_info .glyphicon-question-sign").show();
  		if(dataCompareState.stateObj.searchShow) $(".g_info_r .glyphicon-search").show();
  	}
  	else{
  		if(controls == "all_statistics"){
  			eouluGlobal.S_getSwalMixin()({
  				title: '加载数据',
  				text: "数据加载绘制图形中...",
  				type: 'info',
  				showConfirmButton: false,
  				showCancelButton: false,
  			});
  			//根据导航栏个数展示对应图形
  			$("#all_statistics>.panel").hide();
  			for(var li_num = 1 ; li_num < $(".g_bodyin_bodyin_top_wrap>ul li").length-1 ; li_num++){
  				var curcontrols = $(".g_bodyin_bodyin_top_wrap>ul li").eq(li_num).find("a").data("controls");
  				$("#all_statistics .panel_"+curcontrols).show();
  			}
  			$("#all_statistics>.panel>.panel-body").empty();
  			setTimeout(function(){
  				/*绘制参数图*/
  				var whenArr = [];
  				$("#all_statistics>div.panel").each(function(i, el){
  					if($(this).css("display") == "none") return true;
  					var iicontrols = $(el).data("iallstatistics");
					var chartType = _.find(dataListDetailStore.state.chartTypeMap, function(o, k){
  						return k == iicontrols;
  					});
  					var chartAjaxUrl = _.find(dataListDetailStore.state.chartAjaxUrlMap, function(o, k){
  						return k == iicontrols;
  					});
  					var chartCNName = _.find(dataListDetailStore.state.chartCNNameMap, function(o, k){
  						return k == iicontrols;
  					});
  					whenArr.push({
  						chartType: chartType,
  						chartAjaxUrl: chartAjaxUrl,
  						chartCNName: chartCNName,
  						classify: iicontrols,
  					});
  				});
  				ajax_all_chart({
  					times: 0,
  					alltimes: whenArr.length,
  					whenArr: _.cloneDeep(whenArr),
  					curWaferName : curWaferName,
  					controls : "all_statistics"
  				});
  			}, 50);
  		}
  		else{
  			
  			eouluGlobal.S_getSwalMixin()({
  				title: '加载数据',
  				text: "数据加载绘制图形中...",
  				type: 'info',
  				showConfirmButton: false,
  				showCancelButton: false,
  			});
  			setTimeout(function(){
	  			$("#"+controls+" .single_div_in").empty();
	  			var chartType = _.find(dataListDetailStore.state.chartTypeMap, function(o, k){
					return k == controls;
				});
				var chartAjaxUrl = _.find(dataListDetailStore.state.chartAjaxUrlMap, function(o, k){
					return k == controls;
				});
				var chartCNName = _.find(dataListDetailStore.state.chartCNNameMap, function(o, k){
					return k == controls;
				});
				var whenArr = [];
				whenArr.push({
					chartType: chartType,
					chartAjaxUrl: chartAjaxUrl,
					chartCNName: chartCNName,
					classify: controls
				});
				ajax_all_chart({
					times: 0,
					alltimes: whenArr.length,
					whenArr: _.cloneDeep(whenArr),
					curWaferName : curWaferName,
					controls : "single_statistics"
				});
  			}, 50);
  		}
  	}
  	if($(this).attr("aria-controls") == "all_statistics"){
  		var tog_span = $("#all_statistics>.panel>.panel-heading>span");
  		tog_span.removeClass("glyphicon-menu-right").addClass("glyphicon-menu-down").parent().parent().removeClass("panel-success").addClass("panel-info");
		tog_span.parent().next().slideDown(200);
  	}
});




//页面数据

function dataCompareRenderData(currentPage){
	var searchVal = $("#search_input").val().trim();
	$.ajax({
	       url: 'DataListAjax', 
	       type: 'GET',
	       data: {
	    	   currentPage : currentPage ,
	    	   keyword : searchVal,
	       },
	       dataType: 'json',
	       async : false ,
	       success: function (data) {
	    	  //console.log("data",data);
	    	   var str = "";
	    	   data.waferInfo.map(function(v, i, arr){
		   			var ii = v.wafer_id;
		   			if(!v.test_operator){var test_operator = ""}else{var test_operator = v.test_operator};
		   			str+='<tr>'+
		   					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
		   					'<td class="product_category" data-itext="'+v.product_category+'">'+v.product_category+'</td>'+
		   					'<td class="device_number" data-itext="'+v.device_number+'">'+v.device_number+'</td>'+
		   					'<td class="lot_number" data-itext="'+v.lot_number+'">'+v.lot_number+'</td>'+
		   					'<td class="wafer_number" data-itext="'+v.wafer_number+'">'+v.wafer_number+'</td>'+
		   					'<td class="die_type" data-itext="'+v.die_type+'">'+v.die_type+'</td>'+
		   					'<td class="qualified_rate" data-itext="'+v.qualified_rate+'">'+v.qualified_rate+'</td>'+
		   					'<td class="test_end_date" data-itext="'+v.test_end_date+'">'+v.test_end_date+'</td>'+
		   					'<td class="test_operator" data-itext="'+test_operator+'">'+test_operator+'</td>'+
		   					'<td class="description" data-itext="'+v.description+'">'+v.description+'</td>'+
		   					'<td class="data_format" data-itext="'+v.data_format+'" style="display:none;">'+v.data_format+'</td>'+
		   					'<td class="data_trash not_search"   data-page="'+currentPage+'" ><img src="assets/img/common/del_24px.svg"  data-iicon="glyphicon-remove" alt="删除" title="删除" ></td>'+
		   				'</tr>';
		   		});
		   		$(".home_dataCompare_top tbody").empty().append(str);
		   		
		   		dataCompareState.pageObj.pageCount = data.totalPage;
				dataCompareState.pageObj.itemLength = data.totalCount;
				dataCompareState.pageObj.data =data.waferInfo;
				
				//console.log("dataCompareState.searchObj.hasSearch",dataCompareState.searchObj.hasSearch);
				//修改为全选当前页
				if(dataCompareState.searchObj.hasSearch){
					dataCompareState.searchObj.searchVal = searchVal;
					//console.log("selectSearchItem",dataCompareState.sellectObj.selectItem)	
					$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
						if(_.indexOf(dataCompareState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
							$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
						}
					});
					$(".home_dataCompare_top tbody td:not(.not_search)").each(function(){
						var iText = $(this).text();
						var ireplace = "<b style='color:red'>"+dataCompareState.searchObj.searchVal+"</b>";
						var iHtml = iText.replace(new RegExp(dataCompareState.searchObj.searchVal, 'g'), ireplace);
						$(this).empty().html(iHtml);
					});
					//console.log("searchVal",dataCompareState.pageSearchObj)	
					$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
				}else{
					$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
						if(_.indexOf(dataCompareState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
							$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
						}
					});
					$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
				}
				dataCompareState.curPageSelectAll = {};
				for(var pagenum = 0 ;pagenum < data.totalPage ; pagenum++ ){
					dataCompareState.curPageSelectAll[pagenum+1] = false
				}
	       },
	       error: function (data, status, e) {
	    	   dataCompareSwalMixin({
	    			title: '异常',
	    			text: "服务器繁忙！",
	    			type: 'error',
	    			showConfirmButton: false,
	    			timer: 2000,
	    		})
	       }
	  });  
}

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 165);
	$(".g_bodyin_bodyin_bottom>.tab-content").innerHeight(winHeight - 165);
	$(".home_dataCompare_top .body_div").innerHeight(winHeight / 2 - 83);
	$(".home_dataCompare_bottom .left_div, .home_dataCompare_bottom .right_div").innerHeight(winHeight / 2 - 92);
	$(".home_dataCompare_bottom .right_div .panel-body").innerHeight(winHeight / 2 - 175);
}

function judgeNav(obj){
	if(obj.classify == "wafer"){
		if(dataCompareState.sellectObj.selectItem.length == 0){
			$(".g_bodyin_bodyin_top_wrap>ul").empty().append('<li role="presentation" class="active"><a href="#home_dataCompare" aria-controls="home_dataCompare" role="tab" data-toggle="tab">主页面</a></li>');
			dataCompareState.stateObj.canClickParam = false;
			dataCompareState.stateObj.curParam = null;
			return false;
		}else{
			dataCompareState.stateObj.canClickParam = true;
			var iArr = judgeNav({
				classify: "param",
				param: {
					TotalYield: obj.param.TotalYield,
					other: _.cloneDeep(obj.param.other)
				}
			});
			return iArr;
		}
	}else if(obj.classify == "param"){
		var mapArr = [];
		var mapArr1 = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布",
					value : 44
				},{
					href: "map_color_order_distribution",
					text: "Map色阶分布",
					value : 45
				},{
					href: "good_rate",
					text: "良品率图",
					value : 46
				},{
					href: "histogram",
					text: "直方图",
					value : 47
				},{
					href: "boxlinediagram",
					text: "箱线图",
					value : 48
				},{
					href: "CPK",
					text: "CPK图",
					value : 49
				}];
		var mapArr2 = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布",
					value : 44
				},{
					href: "map_color_order_distribution",
					text: "Map色阶分布",
					value : 45
				},{
					href: "good_rate",
					text: "良品率图",
					value : 46
				},{
					href: "histogram",
					text: "直方图",
					value : 47
				},{
					href: "boxlinediagram",
					text: "箱线图",
					value : 48
				},{
					href: "CPK",
					text: "CPK图",
					value : 49
				},{
					href: "correlationgraph",
					text: "相关性图",
					value : 50
				}];
		dataCompareState.stateObj.curParam = _.cloneDeep(obj.param);
		if(obj.param.TotalYield == 0){
			if(obj.param.other.length == 0){
				/*mapArr = [{
					href: "map_good_rate_distribution",
					text: "Map良率分布"
				}];*/
				mapArr.length = 0;
			}else if(obj.param.other.length == 2){
				mapArr = _.cloneDeep(mapArr2);
			}else if(obj.param.other.length != 2){
				mapArr = _.cloneDeep(mapArr1);
			}
		}else{
			mapArr = [{
				href: "map_good_rate_distribution",
				text: "Map良率分布",
				value : 44
			},{
				href: "good_rate",
				text: "良品率图",
				value : 46
			}];
		}
		return mapArr;
	}
}

function renderNav(mapArr){
	//console.log("mapArr",mapArr);
	if(mapArr !== false){
		var str = '<li role="presentation" class="active" ischange ="false"><a href="#home_dataCompare" aria-controls="home_dataCompare" role="tab" data-toggle="tab">主页面</a></li>';
		var a_diff = eouluGlobal.S_getCurPageJudgedAuthority().diff;
		var all_statistics_flag = false;
		mapArr.map(function(v, i, arr){
			if(_.find(a_diff, function(v1,k){return v1[0].value==v.value}))  return true;
			str+='<li role="presentation" ischange ="false"><a href="#'+v.href+'" aria-controls="'+v.href+'" data-controls="'+v.href+'" role="tab" data-toggle="tab">'+v.text+'</a></li>';
			all_statistics_flag = true;
		});
		if(!_.isEmpty(mapArr) && all_statistics_flag){
			str+='<li role="presentation" ischange ="false"><a href="#all_statistics" aria-controls="all_statistics" role="tab" data-toggle="tab">所有统计</a></li>';
		} 
		$(".g_bodyin_bodyin_top_wrap>ul").empty().append(str);
	}
}

function groupJudgeRenderNav(classify){
	var iAr = [];
	$("#home_param_ul>li.list-group-item-info:not([data-iparam='Total Yield'])").each(function(){
		iAr.push($(this).data("iparam"));
	});
	var mapArr = judgeNav({
		classify: classify,
		param: {
			TotalYield: $("#home_param_ul>li.list-group-item-info[data-iparam='Total Yield']").length,
			other: _.cloneDeep(iAr)
		}
	});
	renderNav(mapArr);
}

function renderCommonParameter(){
	var waferIdStr = dataCompareState.sellectObj.selectItem.join(",");
	if(waferIdStr !=""){
		$.ajax({
		       url: 'ParameterRange', 
		       type: 'GET',
		       data: {
		    	   waferIdStr : waferIdStr ,
		       },
		       dataType: 'json',
		       success: function (data) {
		    	   //console.log("data",data);
		    	   var str = "";
		    	   if(data.paramList.length != 0){
		    		   str = '<li class="list-group-item" data-iparam="Total Yield"><span class="badge">选中</span>Total Yield</li>';
		    		   for(var _i = 0 ; _i < data.paramList.length ; _i++){
		    			   str += '<li class="list-group-item" data-iparam="'+data.paramList[_i]+'" data-min="'+data.rangeList[data.paramList[_i]][0]+'" data-max="'+data.rangeList[data.paramList[_i]][1]+'"><span class="badge">选中</span>'+data.paramList[_i]+'</li>';
		    		   }
		    	   }
		    	   else{
		    		   str = '<li class="list-group-item" data-iparam="Total Yield"><span class="badge">选中</span>Total Yield</li>';
		    	   }
		    	   $("#home_param_ul").empty().append(str); 
		    	   $(".home_dataCompare_bottom .right_div .allchoose").text("全选").prop("ischoose",false);
		       },
		       error: function (data, status, e) {
		    	   dataCompareSwalMixin({
		    			title: '异常',
		    			text: "服务器繁忙！",
		    			type: 'error',
		    			showConfirmButton: false,
		    			timer: 2000,
		    		})
		       }
		  });
	}
	else{
		$("#home_param_ul").empty(); 
	}
}

/*渲染图表外部面板*/
function renderPanel(TotalYield, other, controls, isAllStatistics, AllStatistics){
	var str = '';
	if(controls == "map_good_rate_distribution" || controls == "map_color_order_distribution"){
		if(TotalYield == 1 && controls == "map_good_rate_distribution"){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Total Yield'+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">';
			var inStr = buildMapContainer({
					    		divi: 3,
					    		controls: controls,
					    		iparam: "TotalYield",
					    		iclassify: "map"
					    	});
					    	str+=inStr;
					    	str+='</div>'+
					  	'</div>'+
					'</div>';
		}
		other.map(function(v, i){
			str += '<div class="panel panel-info">'+
					  	'<div class="panel-heading">'+
					    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+v+
					  	'</div>'+
					  	'<div class="panel-body">'+
					    	'<div class="container-fluid">';
					    	str+=buildMapContainer({
					    		divi: 3,
					    		controls: controls,
					    		iparam: v,
					    		iclassify: "map"
					    	});
					    	str+='</div>'+
					  	'</div>'+
					'</div>';
		});
	}else if(controls == "good_rate"){
		var idivi = 2;
		if(dataCompareState.sellectObj.selectItem.length > 6 || dataCompareState.stateObj.curParam.other.length == 1) idivi = 1;
		str = buildMapContainer({
				    		divi: idivi,
				    		controls: controls,
				    		iparam: null,
				    		iclassify: "otherSingle"
				    	});
	}else if(["histogram", "boxlinediagram", "CPK"].indexOf(controls) > -1){
		var iidivi = 2;
		if(dataCompareState.sellectObj.selectItem.length > 6 || dataCompareState.stateObj.curParam.other.length == 1) iidivi = 1;
		str = buildMapContainer({
				    		divi: iidivi,
				    		controls: controls,
				    		iparam: null,
				    		iclassify: "otherSingleNotTY"
				    	});
	}else if(controls == "correlationgraph"){
		str = buildMapContainer({
				    		divi: 1,
				    		controls: controls,
				    		iparam: dataCompareState.stateObj.curParam.other.join(" VS "),
				    		iclassify: "correlationgraph"
				    	});
	}
	if(isAllStatistics === true){
		AllStatistics && AllStatistics(str);
	}else{
		$("div[role='tabpanel']#"+controls+">.single_div_in").empty().append(str);
	}
}

/*map图图表容器构建*/
function buildMapContainer(obj){
	var str = '',
	divi = obj.divi,
	controls = obj.controls,
	iparam = obj.iparam,
	iclassify = obj.iclassify;
	if(iclassify == "otherSingle" || iclassify == "otherSingleNotTY"){
		var paramArr = [];
		if(iclassify == "otherSingle"){
			paramArr[dataCompareState.stateObj.curParam.TotalYield] = "TotalYield";
			_.pullAt(paramArr, 0);
		}
		var allParam = _.concat(paramArr, dataCompareState.stateObj.curParam.other);
		var rowss = Math.ceil(allParam.length / divi);
		var selectItemStr = _.join(_.sortBy(dataCompareState.sellectObj.selectItem));
		str+='<div class="container-fluid">';
		_.times(rowss, function(i){
			str+='<div class="row">';
			_.times(divi, function(ii){
				var curI = i*divi+ii;
				if(curI < allParam.length){
					str+='<div class="col-sm-12 col-md-'+12/divi+' col-lg-'+12/divi+'">';
						str += '<div class="panel panel-info">'+
								  	'<div class="panel-heading">'+
								    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+allParam[curI]+
								  	'</div>'+
								  	'<div class="panel-body">'+
								    	'<div class="chart_otherSingle_tit">头</div>'+
								    	'<div class="chart_otherSingle_body">'+
											'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+selectItemStr+'" data-ichart="'+controls+'" data-iparam="'+allParam[curI]+'"></div>'+
										'</div>'+
										'<div class="chart_otherSingle_foot">脚</div>'+
								  	'</div>'+
								'</div>';
					str+='</div>';
					dataCompareState.stateObj.curChartContainerNum++;
				}
			});
			str+='</div>';
		});
		str+='</div>';
	}else if(iclassify == "map"){
		var len = dataCompareState.sellectObj.selectItem.length;
		var rows = Math.ceil(len / divi);
		_.times(rows, function(i){
			str+='<div class="row">';
			_.times(divi, function(ii){
				var curI = i*divi+ii;
				if(curI < len){
					str+='<div class="col-sm-6 col-md-'+12/divi+' col-lg-'+12/divi+'">';
						str+='<div class="chart_map_tit">wafer'+dataCompareState.sellectObj.selectItem[curI]+'</div>';
							str+='<div class="chart_map_body">'+
									'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+dataCompareState.sellectObj.selectItem[curI]+'" data-ichart="'+controls+'" data-iparam="'+iparam+'"></div>'+
								'</div>';
						str+='<div class="chart_map_foot"></div>';
					str+='</div>';
					dataCompareState.stateObj.curChartContainerNum++;
				}
			});
			str+='</div>';
		});
	}else if(iclassify == "correlationgraph"){
		var selectItemStr2 = _.join(_.sortBy(dataCompareState.sellectObj.selectItem));
		str+='<div class="container-fluid">'+
				'<div class="row">'+
					'<div class="col-sm-12 col-md-12 col-lg-12">'+
						'<div class="panel panel-info">'+
						  	'<div class="panel-heading">'+
						    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+iparam+
						  	'</div>'+
						  	'<div class="panel-body">'+
						    	'<div class="chart_otherSingle_tit">头</div>'+
						    	'<div class="chart_otherSingle_body">'+
									'<div id="'+(controls+dataCompareState.stateObj.curChartContainerNum)+'" data-ivalue="'+selectItemStr2+'" data-ichart="'+controls+'" data-iparam="'+iparam+'"></div>'+
								'</div>'+
								'<div class="chart_otherSingle_foot">脚</div>'+
						  	'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
		dataCompareState.stateObj.curChartContainerNum++;
	}
	return str;
}

/*page preload*/
$(".g_info_m_in").hide();
eleResize();
$(window).on("resize", function(){
	eleResize();
});

/*page onload*/
$(function(){
	//兼容IE下样式
	if(_.isEqual(_.toUpper(eouluGlobal.S_getBrowserType()[0]), "IE") || _.isEqual(_.toUpper(eouluGlobal.S_getBrowserType()[0]), "IE11")){
		var wrap_width = $(".g_body").width();
		$(".g_bodyin_bodyin_top,.g_bodyin_bodyin_top_wrap,.g_bodyin_bodyin_bottom,.body_div,.home_dataCompare").width(wrap_width);
	}
	
	/*判断权限*/
	eouluGlobal.C_pageAuthorityCommonHandler({
		authorityJQDomMap: _.cloneDeep({
			"管理员": [$('.g_info_r  .AdminOperat')],
		}),
	});
	/*判断权限end*/
	
	
	$(".breadcrumb li:eq(0) a ").attr("href","./HomeInterface");
	/*判断是否有选中*/
	//var dataArr = getdataCompareData(null);
	//if(dataArr !== false){
		dataCompareRenderData(1);

		// 分页元素ID（必填）
		dataCompareState.pageObj.selector = '#pagelist';
		// 分页配置
		dataCompareState.pageObj.pageOption = {
		  // 每页显示数据条数（必填）
		  limit: 10,
		  // 数据总数（一般通过后端获取，必填）
		  count: dataCompareState.pageObj.itemLength,
		  // 当前页码（选填，默认为1）
		  curr: 1,
		  // 是否显示省略号（选填，默认显示）
		  ellipsis: true,
		  // 当前页前后两边可显示的页码个数（选填，默认为2）
		  pageShow: 2,
		  // 开启location.hash，并自定义hash值 （默认关闭）
		  // 如果开启，在触发分页时，会自动对url追加：#!hash值={curr} 利用这个，可以在页面载入时就定位到指定页
		  hash: false,
		  // 页面加载后默认执行一次，然后当分页被切换时再次触发
		  callback: function(obj) {
		    	// obj.curr：获取当前页码
		    	// obj.limit：获取每页显示数据条数
		    	// obj.isFirst：是否首次加载页面，一般用于初始加载的判断
		    	dataCompareState.pageObj.currentPage = obj.curr;
		    	// 首次不执行
			    if (!obj.isFirst) {
			      // do something
			      	dataCompareRenderData(obj.curr);
			      	$("#checkAll").prop("checked", $(".home_dataCompare_top tbody tr.warning").length == $(".home_dataCompare_top tbody tr").length);
			    }
		  	}
		};
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	//}
});

/*event handler*/

$(".g_info_r>.glyphicon-search").click(function(){
	var g_info_m = $(".g_info_m").innerWidth();
	$(this).css("position", "relative").animate({
		left: -(g_info_m/2+20) + "px"
	}, 500, "swing", function(){
		$(this).fadeOut(200, function(){
			$(".g_info_m_in").fadeIn(200).fadeTo(1, 1);
			dataCompareState.stateObj.searchShow = false;
		});
	});
});

$(".g_info_m_in span.input-group-addon").click(function(){
	$(".g_info_m_in").fadeTo(0, 200, function(){
		$(this).fadeOut(200);
		$(".g_info_r>.glyphicon-search").fadeIn(100).animate({
			left: "0px"
		}, 600, "swing", function(){
			$(this).css("position", "static");
			dataCompareState.stateObj.searchShow = true;
		});
	});
});

/* @@主页面 */
/*表格行点击事件*/
$(document).on("mouseover", ".home_dataCompare_top td", function(){
	$(this).addClass("warning").parent().addClass("info");
}).on("mouseout", ".home_dataCompare_top td", function(){
	$(this).removeClass("warning").parent().removeClass("info");
}).on("click", ".home_dataCompare_top td", function(){
	var that = $(this);
	var ID = that.parent().find("input[type='checkbox']").data("ivalue").toString();
	$.ajax({
	       url: 'Examine', 
	       type: 'GET',
	       data: {
	    	   waferId : ID ,
	       },
	       dataType: 'json',
	       success: function (data) {
	    	   if(!data){
	     		   dataCompareSwalMixin({
	    	    			title: '提示',
	    	    			text: "无数据，不能访问",
	    	    			type: 'warning',
	    	    			showConfirmButton: false,
	    	    			timer: 2000,
	    	    		});
	     		   return false;
	     	   }
	    	   else{
	    		   that.parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !that.parent().find("[type='checkbox']").prop("checked")).change();
	    	   }
	       },
	       error: function (data, status, e) {
	    	   dataCompareSwalMixin({
	    			title: '异常',
	    			text: "服务器繁忙！",
	    			type: 'error',
	    			showConfirmButton: false,
	    			timer: 2000,
	    		})
	       }
	  });
}).on("click", ".home_dataCompare_top tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".home_dataCompare_top tbody [type='checkbox']", function(){
	var ID = $(this).data("ivalue").toString();
	var curDataExamine = true;
	//console.log('$(this).prop("checked")',$(this).prop("checked"));
	if($(this).prop("checked")){
		$.ajax({
		       url: 'Examine', 
		       type: 'GET',
		       data: {
		    	   waferId : ID ,
		       },
		       dataType: 'json',
		       async : false ,
		       success: function (data) {
		    	   curDataExamine = data;
		       },
		       error: function (data, status, e) {
		    	   dataCompareSwalMixin({
		    			title: '异常',
		    			text: "服务器繁忙！",
		    			type: 'error',
		    			showConfirmButton: false,
		    			timer: 2000,
		    		})
		       }
		  });
		 if(!curDataExamine){
			$(this).prop("checked",false);
   		    dataCompareSwalMixin({
  	    			title: '提示',
  	    			text: "无数据，不能访问",
  	    			type: 'warning',
  	    			showConfirmButton: false,
  	    			timer: 2000,
  	    		});
   		    return false;
   	    }
		dataCompareState.sellectObj.selectItem.push(ID);
		if(dataCompareState.searchObj.hasSearch) dataCompareState.sellectObj.selectSearchItem.push(ID);
		$(".home_dataCompare_bottom tbody>tr [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		$(".home_dataCompare_bottom tbody").append($(this).parent().parent().clone());
		$(".home_dataCompare_bottom tbody tr, .home_dataCompare_bottom tbody td").removeClass("info warning");
	}else{
		_.pull(dataCompareState.sellectObj.selectItem, ID);
		if(dataCompareState.searchObj.hasSearch) _.pull(dataCompareState.sellectObj.selectSearchItem, ID);
		$(".home_dataCompare_bottom tbody [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		
		dataCompareState.curPageSelectAll[dataCompareState.pageObj.currentPage] = false;
	}
	dataCompareState.sellectObj.selectItem = _.uniq(dataCompareState.sellectObj.selectItem);
	dataCompareState.sellectObj.selectSearchItem = _.uniq(dataCompareState.sellectObj.selectSearchItem);
	$("#checkAll").prop("checked", $(".home_dataCompare_top tbody tr.warning").length == $(".home_dataCompare_top tbody tr").length);
	dataCompareState.sellectObj.selectAll = $("#checkAll").prop("checked");
	renderCommonParameter();
	groupJudgeRenderNav("wafer");
});

/*点击选中所有*/
$("#checkAll").on({
	click: function(){
			var check_currentPage = dataCompareState.pageObj.currentPage;
			var that = $(this);
			if( !dataCompareState.curPageSelectAll[check_currentPage]){
				dataCompareState.curPageSelectAll[check_currentPage] = true;
				var check_num = 0 ,errorArr = [];
				$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
					var ID = $(this).data("ivalue");
					var _that = $(this);
					$.ajax({
					       url: 'Examine', 
					       type: 'GET',
					       data: {
					    	   waferId : ID ,
					       },
					       dataType: 'json',
					       async : false ,
					       success: function (data) {
					    	   var check_tr = _that.parent().parent();
					    	   if(data){
					    		   if(_.indexOf(dataCompareState.sellectObj.selectItem, _that.data("ivalue").toString() ) < 0){
					    			   _that.prop("checked", true);
						    		   _that.parent().parent().removeClass("info").addClass("warning");
						    		   check_num++;
						    		   dataCompareState.sellectObj.selectItem.push(_that.data("ivalue").toString());
										var str = '<tr>'+
											'<td class="not_search"><input type="checkbox" data-ivalue="'+check_tr.find("input[type='checkbox']").data("ivalue")+'"></td>'+
											'<td class="product_category" data-itext="'+check_tr.find(".product_category").text()+'">'+check_tr.find(".product_category").text()+'</td>'+
											'<td class="device_number" data-itext="'+check_tr.find(".device_number").text()+'">'+check_tr.find(".device_number").text()+'</td>'+
											'<td class="lot_number" data-itext="'+check_tr.find(".lot_number").text()+'">'+check_tr.find(".lot_number").text()+'</td>'+
											'<td class="wafer_number" data-itext="'+check_tr.find(".wafer_number").text()+'">'+check_tr.find(".wafer_number").text()+'</td>'+
											'<td class="die_type" data-itext="'+check_tr.find(".die_type").text()+'">'+check_tr.find(".die_type").text()+'</td>'+
											'<td class="qualified_rate" data-itext="'+check_tr.find(".qualified_rate").text()+'">'+check_tr.find(".qualified_rate").text()+'</td>'+
											'<td class="test_end_date" data-itext="'+check_tr.find(".test_end_date").text()+'">'+check_tr.find(".test_end_date").text()+'</td>'+
											'<td class="test_operator" data-itext="'+check_tr.find(".test_operator").text()+'">'+check_tr.find(".test_operator").text()+'</td>'+
											'<td class="description" data-itext="'+check_tr.find(".description").text()+'">'+check_tr.find(".description").text()+'</td>'+
											'<td class="data_format" data-itext="'+check_tr.find(".data_format").text()+'" style="display:none;">'+check_tr.find(".data_format").text()+'</td>'+
											'<td  class="data_trash" data-page="'+check_currentPage+'"><img src="assets/img/common/del_24px.svg"  data-iicon="glyphicon-remove" alt="删除" title="删除" ></td>'+
										'</tr>';
										if($(".home_dataCompare_bottom tbody>tr").length){
											$(".home_dataCompare_bottom tbody>tr:first").before(str);
										}else{
											$(".home_dataCompare_bottom tbody").append(str);
										}
					    		   }
					    	   }
					    	   else{
					    		   errorArr.push([check_tr.find(".wafer_number").text(),check_tr.find(".die_type").text()]);
					    	   }
					       },
					       error: function (data, status, e) {
					    	   dataCompareSwalMixin({
					    			title: '异常',
					    			text: "服务器繁忙！",
					    			type: 'error',
					    			showConfirmButton: false,
					    			timer: 2000,
					    		})
					       }
					  });
					
				});
				if(!_.isEmpty(errorArr)){
					var iiistr = '';
					iiistr+='<div class="container-fluid">'+
								'<table class="table table-striped table-bordered table-hover table-condensed">'+
									'<thead>'+
										'<tr><th style="font-size:14px;width: 80px;text-align:center;">无数据晶圆</th></tr>'+
									'</thead><tbody>';
					for(var e = 0 ; e < errorArr.length ; e++){
						iiistr+='<tr>'+
							'<td style="vertical-align: top;font-size:14px;">'+errorArr[e][0]+" : "+errorArr[e][1]+
							'</td></tr>';
					}
					iiistr+='</tbody></table></div>';
					eouluGlobal.S_getSwalMixin()({
						title: "当前页部分晶圆无数据",
						html: iiistr,
						// type: "info",
						showConfirmButton: true,
					});
				}
				
				that.prop("checked",check_num == $(".home_dataCompare_top tbody tr").length);
			}
			else{
				that.prop("checked",false);
				dataCompareState.curPageSelectAll[check_currentPage] = false;
				$(".home_dataCompare_top tbody tr.warning").each(function(){	
					if(_.indexOf(dataCompareState.sellectObj.selectItem, $(this).find("input[type='checkbox']").data("ivalue").toString()) > -1){
						dataCompareState.sellectObj.selectItem.splice(dataCompareState.sellectObj.selectItem.indexOf($(this).find("input[type='checkbox']").data("ivalue").toString()), 1);
						$(".home_dataCompare_bottom tbody>tr  input[data-ivalue ='"+$(this).find("input[type='checkbox']").data("ivalue")+"']").parent().parent().remove();
						$(this).removeClass("warning info").find("input[type='checkbox']").prop("checked", false);
					}
				})
			}
			
			dataCompareState.sellectObj.selectAll = that.prop("checked");
			renderCommonParameter();
			groupJudgeRenderNav("wafer");
	}
});
/*删除选中*/
$(document).on("click",".home_dataCompare_bottom .data_trash",function(){
	var ID = $(this).parent().find("input[type='checkbox']").data("ivalue").toString();
	$(".home_dataCompare_top tr input[type='checkbox'][data-ivalue='"+ID+"']").prop("checked",false).parent().parent().removeClass("warning");
	_.remove(dataCompareState.sellectObj.selectItem, function(n) { return n  == ID ;});
	$("#checkAll").prop("checked",false);
	dataCompareState.sellectObj.selectAll = $("#checkAll").prop("checked");
	renderCommonParameter();
	groupJudgeRenderNav("wafer");
	$(this).parent().remove();
	
	dataCompareState.curPageSelectAll[$(this).data("page")] = false;
})
/*删除全部*/
$(document).on("dblclick",".home_dataCompare_bottom .home_dataCompare_bottom_del_all",function(){
	$(".home_dataCompare_top .warning").removeClass("warning").find("input[type='checkbox']").prop("checked",false);
	dataCompareState.sellectObj.selectItem = [];
	$("#checkAll").prop("checked",false);
	dataCompareState.sellectObj.selectAll = $("#checkAll").prop("checked");
	renderCommonParameter();
	groupJudgeRenderNav("wafer");
	$(".home_dataCompare_bottom tbody").empty();
	
	_.forOwn(dataCompareState.curPageSelectAll, function(value, key) {
		dataCompareState.curPageSelectAll[key] = false;
	});
})


/*搜索*/
$(".g_info_m_in .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});
$("#search_input").on("input propertychange change", function(){
	if($(this).val().trim() != ""){
		$(this).parent().parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled", false);
	}else{
		$(this).val("");
		$(this).parent().parent().next().removeClass("btn-primary").addClass("btn-default").prop("disabled", true);
	}
}).on("keyup", function(e){
	var i = e.keyCode || e.which || e.charCode;
	if(i == 13 && $(this).val().trim() != ""){
		$(this).parent().parent().next().trigger("click");
	}
});
$("#search_button").on("click", function(){
	/*预处理*/
	$("#checkAll").prop("checked", false);
	dataCompareState.sellectObj.selectSearchItem = [];

	var isearch = $("#search_input").val().trim();
	dataCompareState.searchObj.hasSearch = isearch == "" ? false : true;
	dataCompareState.searchObj.searchVal = dataCompareState.searchObj.hasSearch == true ? isearch : null;

	dataCompareRenderData(1);
	
	if(dataCompareState.searchObj.hasSearch){
		dataCompareState.pageSearchObj.currentPage = 1;
		dataCompareState.pageSearchObj.pageOption.curr = 1;
		dataCompareState.pageSearchObj.pageOption.count = dataCompareState.pageSearchObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		dataCompareState.paginationObj.search = new Pagination(dataCompareState.pageSearchObj.selector, dataCompareState.pageSearchObj.pageOption);
	}else{
		dataCompareState.pageObj.pageOption.curr = 1;
		dataCompareState.pageObj.pageOption.count = dataCompareState.pageObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	}
	return false;
});


/*翻页跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});

$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = Number(dataCompareState.pageObj.currentPage);
	var pageCounts = Number(dataCompareState.pageObj.pageCount);
	if(dataCompareState.searchObj.hasSearch){
		currentPage = Number(dataCompareState.pageSearchObj.currentPage);
		pageCounts = Number(dataCompareState.pageSearchObj.pageCount);
	}
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
		if(dataArr !== false){
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageOption.curr = iText;
				dataCompareState.paginationObj.search.goPage(iText);
				dataCompareState.paginationObj.search.renderPages();
				dataCompareState.paginationObj.search.options.curr = iText;
				//console.log(dataCompareState.paginationObj.search);
	          	dataCompareState.paginationObj.search.options.callback && dataCompareState.paginationObj.search.options.callback({
	            	curr: dataCompareState.paginationObj.search.pageNumber,
	            	/*limit: dataCompareState.paginationObj.search.options.limit,*/
	            	isFirst: false
	          	});
			}else{
				dataCompareState.pageObj.pageOption.curr = iText;
				dataCompareState.paginationObj.normal.goPage(iText);
				dataCompareState.paginationObj.normal.renderPages();
				dataCompareState.paginationObj.normal.options.curr = iText;
				//console.log(dataCompareState.paginationObj.normal);
	          	dataCompareState.paginationObj.normal.options.callback && dataCompareState.paginationObj.normal.options.callback({
	            	curr: dataCompareState.paginationObj.normal.pageNumber,
	            	isFirst: false
	          	});
			}
		}else{
			dataCompareSwalMixin({
				title: '出错！',
				text: "页面将在2秒后刷新",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			}).then(function(result){
				/*console.log(result.dismiss) // timer*/
				/*console.log(swal.DismissReason.cancel) // cancel*/
				/*console.log(result.dismiss == "timer") // true*/
				if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
					window.location.reload();
				}
			});
		}
	}
});
/*翻页跳页end*/

/*共有参数选择*/
$(document).on("click", ".home_dataCompare_bottom .panel-body li", function(){
	if(!dataCompareState.stateObj.canClickParam) return false;
	$(this).toggleClass("list-group-item-info").children("span").text(["选中", "取消选中"][Number($(this).hasClass("list-group-item-info"))]);
	groupJudgeRenderNav("param");
	//dataCompareState.stateObj.curWaferChange = false;
});
//共有参数全选与全不选
$(document).on("click", ".home_dataCompare_bottom .right_div .allchoose", function(){
	if($(".right_div>.panel>.panel-body ul li").length == 0) return false;
	if(!$(this).prop("ischoose")){
		$(this).text("取消全选").prop("ischoose",true);
		$(".right_div>.panel>.panel-body ul li").addClass("list-group-item-info").children("span").text("取消选中");
	}
	else{
		$(this).text("全选").prop("ischoose",false);
		$(".right_div>.panel>.panel-body ul li").removeClass("list-group-item-info").children("span").text("选中");
	}
	groupJudgeRenderNav("param");
});
//allChoose

/*点击收起*/
$(document).on("click", ".g_bodyin_bodyin_bottom div.panel-heading>span.glyphicon", function(){
	$(this).toggleClass("glyphicon-menu-down glyphicon-menu-right").parent().parent().toggleClass("panel-info panel-success");
	if($(this).hasClass("glyphicon-menu-right")){
		$(this).parent().next().slideUp(200);
	}else{
		$(this).parent().next().slideDown(200);
	}
});

