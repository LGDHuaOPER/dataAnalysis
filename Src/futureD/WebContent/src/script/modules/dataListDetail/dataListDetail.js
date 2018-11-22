/*variable defined*/
var dataListDetailStore = Object.create(null);
dataListDetailStore.mock = Object.create(null);
dataListDetailStore.mock.allDetail = {
	thead: {
		PassPercent: null,
		UpLimit: null,
		LowerLimit: null,
		Param: null,
	},
	tbody: {},
	chunkTbodyData: null,
	chunkIndex: -1
};
dataListDetailStore.mock.allDetailThead = [];
dataListDetailStore.mock.vectorMap = {
	filterArr: []
};

dataListDetailStore.state = Object.create(null);
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
		/*第一次进入矢量图分页*/
		renderChartByCoordFlag: false,
		smithObjArr: [],
		currentDieCoord: null
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
	var thead = dataListDetailStore.mock.allDetail.thead;
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

function buildSignalTbodyData(data){
	dataListDetailStore.mock.allDetail.tbody = Object.create(null);
	_.forEach(data, function(v, i){
		var midArr = [];
		var midArr2 = [];
		var die_number;
		_.forOwn(v, function(vv, k){
			switch (k){
				case "die_type":
					midArr[0] = vv;
				break;
				case "die_number":
					midArr[1] = vv;
					die_number = vv;
				break;
				case "bin":
					midArr[2] = vv;
				break;
				case "location":
					midArr[3] = vv;
				break;
				default:
					var item = {};
					item.key = k;
					item.value = vv;
					midArr2.push(item);
			}
		});
		midArr2 = _.sortBy(midArr2, function(o) { return o.key; });
		_.forEach(midArr2, function(vvv, iii){
			midArr.push(vvv.value);
		});
		dataListDetailStore.mock.allDetail.tbody[die_number] = _.cloneDeep(midArr);
	});
}

function renderSignalTbodyData(){
	if(dataListDetailStore.mock.allDetail.chunkIndex<dataListDetailStore.mock.allDetail.chunkTbodyData.length-1){
		dataListDetailStore.mock.allDetail.chunkIndex++;
		console.log(dataListDetailStore.mock.allDetail.chunkIndex)
		buildSignalTbodyData(dataListDetailStore.mock.allDetail.chunkTbodyData[dataListDetailStore.mock.allDetail.chunkIndex]);
		_.forOwn(dataListDetailStore.mock.allDetail.tbody, function(v, k){
			var str = renderTheadTbody({
				data: v,
				td: true
			});
			$("#allDetail .allDetail_body .table_body tbody").append(str);
		});
	}
}

function getTableDataANDRender(){
	var data = $("body").data("result");
	/*预处理数据*/
	var theadObj = dataListDetailStore.mock.allDetail.thead;
	var yieldObj = _.map(_.cloneDeep(data.yield), function(v){return _.floor(v*100, 2);});
	var upperListObj = _.cloneDeep(data.paramLimit.upperList);
	var lowerListObj = _.cloneDeep(data.paramLimit.lowerList);
	var paramListObj = _.cloneDeep(data.paramLimit.paramList);
	dataListDetailStore.mock.allDetailThead[0] = yieldObj;
	theadObj.PassPercent = yieldObj;
	dataListDetailStore.mock.allDetailThead[1] = upperListObj;
	theadObj.UpLimit = upperListObj;
	dataListDetailStore.mock.allDetailThead[2] = lowerListObj;
	theadObj.LowerLimit = lowerListObj;
	dataListDetailStore.mock.allDetailThead[3] = paramListObj;
	theadObj.Param = paramListObj;
	/*处理表体*/
	/*var oneHeight = $(".table_head thead>tr").eq(0).innerHeight();
	$(".table_body table").innerHeight(oneHeight*data.dataList.length);*/
	dataListDetailStore.mock.allDetail.chunkTbodyData = _.chunk(data.dataList, 100);
	
	/*预处理数据结束*/
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
	renderSignalTbodyData();
	if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+7){
		$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - 7);
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

/*矢量Map图晶圆图*/
function renderVectorMapWafer(obj){
	var mapInfo = obj.mapInfo;
	/*加载矢量图*/
	/*var dieDataList = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0];
	dataListDetailStore.mock.vectorMap.filterArr = [];
	_.forEach(dieData, function(v, i){
		dataListDetailStore.mock.vectorMap.filterArr.push(_.keys(v)[0]);
	});*/
	/*预处理数据*/
	var dieData = [];
	_.forOwn(mapInfo.waferList.currentDieList, function(v, k){
		var item = {};
		item[k] = v.bin;
		dieData.push(item);
		if(_.isNil(dataListDetailStore.state.vectorMap.currentDieCoord) && v.bin == 1){
			dataListDetailStore.state.vectorMap.currentDieCoord = k.toString();
		}
	});
	if(_.isNil(dataListDetailStore.state.vectorMap.currentDieCoord)) dataListDetailStore.state.vectorMap.currentDieCoord = "0:0";
	_.forOwn(mapInfo.otherDieType, function(v, k){
		var item = {};
		item[k] = v;
		dieData.push(item);
	});
	/*预处理数据end*/
	var maxWidth = ($(".vectorMap_r").innerHeight() - 20)*1.25;
	var maxHeight = $(".vectorMap_r").innerHeight() - 20;
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
		waferData: mapInfo,
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
		currentDieCoord: dataListDetailStore.state.vectorMap.currentDieCoord,
		// 第一次加载标志。可以做一些事情
		isFirst: true,
		coordsArra: dataListDetailStore.state.vectorMap.coordsArray,
		returnFlag: true,
		addEvent: true,
		curSelectedDie: dataListDetailStore.state.vectorMap.curSelectedDie,
		vectorMap: true,
		callback: function(positionFlag){
			$(".vectorMap_l .positionFlag_div>img").attr("src", "assets/img/modules/dataListDetail/"+positionFlag+".png");
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(1)>td:eq(1)").text(mapInfo.waferList.yield);
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
}

/*窗口大小改变事件函数 矢量Map图*/
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

/*矢量Map根据坐标绘制chart图表*/
function renderChartByCoord(){
	eouluGlobal.S_getSwalMixin()({
		title: "加载提示",
		text: "正在绘制曲线",
		type: "info",
		showConfirmButton: false,
	});
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

/*page onload*/
$(function(){
	/*加载参数数据分页*/
	eouluGlobal.S_getSwalMixin()({
		title: "加载提示",
		text: "正在加载数据",
		type: "info",
		showConfirmButton: false
	});
	setTimeout(function(){
		getTableDataANDRender();
		setTimeout(function(){
			swal.clickCancel();
		}, 20);
	}, 50);
	/*加载参数数据分页结束*/

	/*回显晶圆信息*/
	var webParam = eouluGlobal.S_getUrlPrmt().webParam;
	var webParamStr;
	if(!_.isNil(webParam)){
		var webParamArr = webParam.split("futureDT2OnlineDataListSplitor");
		webParamStr = '晶圆信息：'+webParamArr[0]+' / '+webParamArr[1]+' / '+webParamArr[2];
	}else{
		webParamStr = '晶圆信息获取失败!';
	}
	webParamStr+='<button type="button" class="btn btn-default" aria-label="Left Align">'+
					  '<span class="glyphicon glyphicon-export" aria-hidden="true"></span> 导出'+
					'</button>';
	$("div.webParam").html(webParamStr);
	var waferId = eouluGlobal.S_getUrlPrmt().waferId;
	var dataFormat = eouluGlobal.S_getUrlPrmt().dataFormat;
	if(_.isNil(waferId) || _.isNil(dataFormat)){
		eouluGlobal.S_getSwalMixin()({
			title: "异常",
			text: "参数不完整",
			type: "warning",
			showConfirmButton: false,
			timer: 1500
		}).then(function(result){
			if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
				eouluGlobal.S_settingURLParam({}, false, false, false, "DataList");
			}
		});
		return false;
	}else{
		$("body").data({
			"waferid": waferId,
			"dataformat": dataFormat
		});
	}

	/*矢量数据分页*/
	/*预加载参数图分页chart容器*/
	_.forEach(dataListDetailStore.state.vectorMap.curveType, function(v){
		buildChartContainer(v);
	});
	/*矢量数据分页end*/
});

/*event listener*/
/*浏览器窗口大小改变普通事件*/
$(window).on("resize", _.debounce(commonCalcLayout, 200));

$(".allDetail_body .table_body").on("scroll", _.debounce(function(){
	/*console.log($(this)); // jquery DOM  div.table_body
	console.log(this); // DOM  div.table_body*/
	if(dataListDetailStore.state.allDetail.tbody.scrollTop - 1 < $(this).scrollTop() && dataListDetailStore.state.allDetail.tbody.scrollTop + 1 > $(this).scrollTop()){
		$(".allDetail_body .table_head").scrollLeft($(this).scrollLeft());
	}else{
		/*竖向滚动*/
		if($(this).scrollTop() > dataListDetailStore.state.allDetail.tbody.scrollTop+1 && $(this).scrollTop() > ($(".allDetail_body .table_body table").innerHeight() - $(".allDetail_body .table_body").innerHeight())*0.95){
			renderSignalTbodyData();
		}
	}
	dataListDetailStore.state.allDetail.tbody.scrollTop = $(this).scrollTop();
	dataListDetailStore.state.allDetail.tbody.scrollLeft = $(this).scrollLeft();
}, 100));

/*导出*/
$(document).on("click", "div.webParam button", function(){
	var webParam = $("body").data("webparam");
	var waferNO;
	if(!_.isNil(webParam)){
		waferNO = webParam.split("futureDT2OnlineDataListSplitor")[2];
	}else{
		eouluGlobal.S_getSwalMixin()({
			title: "异常",
			text: "参数不完整",
			type: "warning",
			showConfirmButton: false,
			timer: 1500
		});
		return false;
	}
	var iThat = $(this);
	eouluGlobal.C_btnDisabled(iThat, false);
	/*新方法*/
	eouluGlobal.S_XHR({
		status200: function(data){
			console.log(data);
			window.location.href = data;
		},
		statusError: function(xhr, statusText){
			eouluGlobal.C_server500Message({
				callback: null
			});
		},
		readyState4: function(readyState, xhr, status){
			eouluGlobal.C_btnAbled(iThat, false);
		},
		type: "GET",
		getObject: {
			url: "ExportWafer",
			data: {
				waferId: $("body").data("waferid"),
				dataFormat: $("body").data("dataformat"),
				waferNO: waferNO,
			},
			isObject: true,
			responseType: "text"
		}
	});
	/*新方法end*/
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
		// renderChartByCoord();
		$.ajax({
			type: "GET",
			url: "VectorMap",
			data: {
				waferId: $("body").data("waferid")
			},
			dataType: "json"
		}).then(function(data){
			/*第一次加载需要全部显示*/
			dataListDetailStore.mock.vectorMap.filterArr = [];
			dataListDetailStore.state.vectorMap.currentDieCoord = null;
			renderVectorMapWafer({
				mapInfo: data.mapInfo
			});
		}, function(){
			eouluGlobal.C_server500Message({
				callback: null
			});
		});
		dataListDetailStore.state.vectorMap.renderChartByCoordFlag = true;
	}
});