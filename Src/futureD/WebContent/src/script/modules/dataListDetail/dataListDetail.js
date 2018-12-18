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
	filterArr: [],
	waferAjaxData: null
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
		curveType: [], // ["ID_VD", "OutputCurve", "SP2", "MOS_Cgg_Vgs_Vds_ext", "Noise_MOS_Normal"]
		curCurveTypeNo: 0,
		/*第一次进入矢量图分页*/
		renderChartByCoordFlag: false,
		smithObjArr: [],
		currentDieCoord: []
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
		// "correlationgraph": "scatter",
		"gaussiandistribution": "gaussiandistribution",
	},
	chartAjaxUrlMap: {
		"map_good_rate_distribution": "WaferMap",
		"map_color_order_distribution": "ColorMap",
		"good_rate": "ShowYield",
		"histogram": "Histogram",
		"boxlinediagram": "Boxplot",
		"CPK": "CPKServlet",
		// "correlationgraph": "scatter",
		"gaussiandistribution": "GaussianDistribution",
	},
	chartCNNameMap: {
		"map_good_rate_distribution": "Map良率分布",
		"map_color_order_distribution": "Map色阶分布",
		"good_rate": "良品率图",
		"histogram": "直方图",
		"boxlinediagram": "箱线图",
		"CPK": "CPK图",
		// "correlationgraph": "scatter",
		"gaussiandistribution": "高斯分布图",
	},
	authorityJQDomMap: {
		"管理员": [$('.g_info_r .AdminOperat')],
		// "详细数据": [$(".g_menu li[role='presentation'][data-iclassify='allDetail']")],
		"导出": [$("div.webParam button")],
		"矢量数据": [$(".g_menu li[role='presentation'][data-iclassify='vectorMap']")],
		"参数分布": [$(".g_menu li[role='presentation'][data-iclassify='parameterMap']")]
	},
	authorityNull: false,
	scrollBarWidth: _.get(eouluGlobal.S_getPageAllConfig(), "futureDT2.scrollBarWidth", 7),
	containSubdie: (_.isNil($("body").data("result")) || _.isEmpty($("body").data("result"))) ? false : $("body").data("result").containSubdie
};

/*绘制参数数据分页表格*/
function renderTheadTbody(obj){
	var str = '<tr>';
	if(obj.th){
		if(obj.name == "位置"){
			str = '<tr><th>类型</th><th>Die编号</th><th>Quality</th><th>subdie编号</th><th>数字坐标</th><th>'+obj.name+'</th>';
		}else{
			str = '<tr><th></th><th></th><th></th><th></th><th></th><th>'+obj.name+'</th>';
		}
	}
	var thead = dataListDetailStore.mock.allDetail.thead;
	_.forEach(obj.data, function(v, i){
		if(obj.th){
			str+='<th title="'+v+'">'+v+'</th>';
		}else if(obj.td){
			if(i == 2){
				if(v == 1){
					str+='<td>Pass</td>';
				}else{
					str+='<td style="color: red;">Fail</td>';
				}
			}else if(i > 5){
				if(parseFloat(v) > parseFloat(thead.UpLimit[i-6])  || parseFloat(v) < parseFloat(thead.LowerLimit[i-6])){
					str+='<td style="color: red;" title="'+v+'">'+v+'</td>';
				}else{
					str+='<td title="'+v+'">'+v+'</td>';
				}
			}else{
				str+='<td title="'+v+'">'+v+'</td>';
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
		var die_number, subdie_number;
		_.forOwn(v, function(vv, k){
			switch (k){
				case "type":
					midArr[0] = vv;
				break;
				case "die_number":
					midArr[1] = vv;
					die_number = vv;
				break;
				case "bin":
					midArr[2] = vv;
				break;
				case "subdie_number":
					// midArr[3] = vv;
				break;
				case "x":
					// midArr[3] = vv;
				break;
				case "y":
					// midArr[3] = vv;
				break;
				case "location":
					midArr[5] = vv;
				break;
				default:
					var item = {};
					item.key = k;
					item.value = vv;
					midArr2.push(item);
			}
		});
		midArr[3] = dataListDetailStore.state.containSubdie ? v.subdie_number : "0";
		subdie_number = midArr[3];
		midArr[4] = v.x + " : " + v.y;
		midArr2 = _.sortBy(midArr2, function(o) { return o.key; });
		_.forEach(midArr2, function(vvv, iii){
			midArr.push(vvv.value);
		});
		dataListDetailStore.mock.allDetail.tbody[die_number+":"+subdie_number] = _.cloneDeep(midArr);
	});
}

function renderSignalTbodyData(){
	if(dataListDetailStore.mock.allDetail.chunkIndex<dataListDetailStore.mock.allDetail.chunkTbodyData.length-1){
		dataListDetailStore.mock.allDetail.chunkIndex++;
		// console.log(dataListDetailStore.mock.allDetail.chunkIndex)
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
	if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+dataListDetailStore.state.scrollBarWidth){
		$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - dataListDetailStore.state.scrollBarWidth);
	}
}

function commonCalcLayout(){
	$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
	$(".vectorMap_l, .vectorMap_r").innerHeight($("#vectorMap").innerHeight());

	$(".allDetail_body .table_body").innerHeight($(".allDetail_body").innerHeight() - $(".allDetail_body .table_head").innerHeight());
	if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+dataListDetailStore.state.scrollBarWidth){
		$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - dataListDetailStore.state.scrollBarWidth);
	}
}

/*矢量Map图晶圆图*/
function renderVectorMapWafer(obj){
	//console.log("renderVectorMapWafer-obj",obj);
	var mapInfo = obj.mapInfo;
	/*预处理数据*/
	var dieData = [];
	var currentDieList = (mapInfo.containSubdie == true ? mapInfo.waferDie.currentDieList : mapInfo.waferList.currentDieList);
	_.forOwn(currentDieList, function(v, k){
		var item = {};
		item[k] = v.bin;
		dieData.push(item);
		/*if(_.isNil(dataListDetailStore.state.vectorMap.currentDieCoord) && v.bin == 1){
			dataListDetailStore.state.vectorMap.currentDieCoord = k.toString();
		}*/
	});
	
	/*if(_.isNil(dataListDetailStore.state.vectorMap.currentDieCoord)) dataListDetailStore.state.vectorMap.currentDieCoord = "0:0";*/
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
		currentDieCoord: "",
		// 第一次加载标志。可以做一些事情 标志第一个高亮die
		isFirst: true,
		isSaveDieCoord: true,
		saveDieCoord: dataListDetailStore.state.vectorMap.currentDieCoord,
		coordsArra: dataListDetailStore.state.vectorMap.coordsArray,
		returnFlag: true,
		addEvent: true,
		curSelectedDie: dataListDetailStore.state.vectorMap.curSelectedDie,
		vectorMap: true,
		callback: function(positionFlag){
			$(".positionFlag_div>img").attr("src", "assets/img/modules/dataListDetail/"+positionFlag+".png");
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(1)>td:eq(1)").text(mapInfo.waferList.yield);
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(2)>td:eq(1)").text(mapInfo.waferList.qualify);
			$(".qualifiedInformation_div .panel-body tbody>tr:eq(3)>td:eq(1)").text(mapInfo.waferList.unqulify);
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+dataListDetailStore.state.vectorMap.currentDieCoord[0]+"）");
		},
		clickCallback: function(cor){
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+cor+"）");
			dataListDetailStore.state.vectorMap.currentDieCoord[0] = cor;
			var scrollTopH = $("div.vectorMap_l").scrollTop();
			getIDByCoordANDRequ({
				callback: null,
				ajaxCallback: function(){
					setTimeout(function(){
						swal.close();
						$("div.vectorMap_l").scrollTop(scrollTopH);
					}, 1500);
				}
			});
		},
		keydownCallback: function(cor){
			$(".coordinateInformation_div .panel-body tbody>tr:eq(0)>td:eq(1)").text("（"+cor+"）");
			dataListDetailStore.state.vectorMap.currentDieCoord[0] = cor;
			var scrollTopH = $("div.vectorMap_l").scrollTop();
			getIDByCoordANDRequ({
				callback: null,
				ajaxCallback: function(){
					setTimeout(function(){
						swal.close();
						$("div.vectorMap_l").scrollTop(scrollTopH);
					}, 1500);
				}
			});
		},
		resizeCallback: function(wi, hi, mapObj){
			$(window).on("resize", _.debounce(function(){
				calculateLayout(wi, hi, mapObj);
			}, 150));
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
function renderChartByCoord(obj){
	var ajaxData = obj.ajaxData;
	var callback = obj.callback;
	var ajaxCallback = obj.ajaxCallback;
	eouluGlobal.S_getSwalMixin()({
		title: "加载提示",
		text: "正在绘制曲线",
		type: "info",
		showConfirmButton: false,
	});
	$("div.all_charts_rows>div").fadeOut(100);
	$(".row.all_charts_rows").find("div[data-highcharts-chart]").each(function(i, el){
		$(el).highcharts().destroy();
	});
	//console.table && console.table(Highcharts.charts);
	//console.log("ajaxData",ajaxData);
	$.ajax({
		type: "GET",
		url: "VectorCurve",
		data: ajaxData,
		dataType: "json"
	}).then(function(data){
		if(_.isNil(data) || _.isEmpty(data)){
			eouluGlobal.S_getSwalMixin()({
				title: "加载提示",
				text: "曲线数据获取失败或者为空",
				type: "warning",
				showConfirmButton: false,
				timer: 1600
			});
		}else{
			_.forOwn(data, function(v, k){
				var ID = buildChartContainer(k);
				judgeVectorCurveChart({
					container: ID,
					curveData: v,
					curveType: k,
					callback: callback
				});
			});
		}
	}).always(function(){
		ajaxCallback && _.isFunction(ajaxCallback) && ajaxCallback();
	});
}

/*判断矢量Map的曲线*/
function judgeVectorCurveChart(obj) {
	var container = obj.container;
	var curveData = obj.curveData;
	var curveType = obj.curveType;
	var callback = obj.callback;
	if(_.keys(curveData).length == 2){
		/*普通曲綫*/
		if(curveData.curve.length == 1 || curveData.curve.length == 0){
			eouluGlobal.S_getSwalMixin()({
				title: "加载提示",
				text: "曲线数据不存在或只有一列",
				type: "warning",
				showConfirmButton: false,
				timer: 1600
			});
		}else if(curveData.curve.length == 2){
			/*X轴 Y轴*/
			drawCommonCurve({
				curveType: curveType,
				container: container,
				xAxisTitle: curveData.paramList[0],
				yAxisTitle: curveData.paramList[1],
				seriesData: [{
					name: curveType,
					data: curveData.curve[1]
				}],
				xcategories: _.map(curveData.curve[0], function(v){
					var iflag = true;
					if(Math.abs(v)>1) iflag = false;
					return eouluGlobal.S_ComSCMRound(v, 2, iflag);
				}),
				callback: callback
			});
		}else if(curveData.curve.length == 3){
			/*P轴 X轴 Y轴*/
			var seriesData = [],
			xcategories;
			_.forOwn(_.countBy(curveData.curve[0]), function(v, k){
				var start = _.findIndex(curveData.curve[0], function(o) { return _.toString(o) == _.toString(k); });
				var item = {};
				item.name = "P="+k;
				item.data = _.slice(curveData.curve[2], start, start+v);
				xcategories = _.slice(curveData.curve[1], start, start+v);
				seriesData.push(item);
			});
			// console.table(seriesData);
			drawCommonCurve({
				curveType: curveType,
				container: container,
				xAxisTitle: curveData.paramList[1],
				yAxisTitle: curveData.paramList[2],
				seriesData: seriesData,
				xcategories: xcategories,
				callback: callback
			});
		}
	}else if(_.keys(curveData).length == 4){
		/*Smith*/
		drawDbCurveANDSmith({
			smithAndCurve: curveData,
			container: container,
			callback: callback
		});
	}
}

/*矢量图分页smith绘制*/
function drawDbCurveANDSmith(obj) {
	var smithAndCurve = obj.smithAndCurve;
	var container = obj.container;
	var callback = obj.callback;
	/*首先构造内部容器*/
	var str = '<div class="panel panel-info" data-dbcurveandsmith="S11">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S11'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S11</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S12">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S12'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S12</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S21">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S21'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S21</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>'+
    			'<div class="panel panel-info" data-dbcurveandsmith="S22">'+
    			  	'<div class="panel-heading">'+
    			    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>S22'+
    			  	'</div>'+
    			  	'<div class="panel-body">'+
	    	  			'<div class="picturetop"></div>'+
	    	  			'<div class="picturebottom">'+
	    	  				'<div class="picturebottom_in">'+
	    						'<div class="pictureline">'+
									'<p></p>'+
								'</div>'+
								'<div class="smithdata">'+
									'<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S22</span>)</p>'+
									'<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>'+
								'</div>'+
	    					'</div>'+
	    	  			'</div>'+
    			  	'</div>'+
    			'</div>';
    $("#"+container).empty().append(str).find("[data-dbcurveandsmith]").each(function(){
    	var dbcurveandsmith = $(this).data("dbcurveandsmith");
    	var iW = $(this).find(".panel-body").innerWidth();
    	var multiples = 0.5;
    	if($(window).width() <= 1199) multiples = 1;
    	$(this).find(".picturetop").innerHeight(iW*multiples);
    	/*找数据*/
    	var classifyData = _.find(smithAndCurve, function(v, k){ if(_.toString(k).indexOf(dbcurveandsmith) > -1) return true; });
    	if(dbcurveandsmith == "S11" || dbcurveandsmith == "S22"){
    		var dom1 = $(this).find(".picturetop")[0];
    		var msgdom1  = $(this).find(".picturebottom")[0];
    		var title = [''];
    		var legendName1 = [dbcurveandsmith];
    		var smithInData = [];
    		smithInData.push(classifyData);
    		var smith1 = smithChart({
    			dom: dom1,
    			titleOneArr: title,
    			legendNameOneArr: legendName1,
    			allDataArr: smithInData,
    			Type: dbcurveandsmith,
    			msgdom: msgdom1,
    			GHzFlag: true
    		});
    		if(dataListDetailStore.state.vectorMap.smithObjArr.length == 2){
    			dataListDetailStore.state.vectorMap.smithObjArr.length = 0;
    		}
    		dataListDetailStore.state.vectorMap.smithObjArr.push(smith1);
    	}else{
    		$('<div id="'+container+'_'+dbcurveandsmith+'"></div>').appendTo($(this).find(".picturetop")).innerHeight($(this).find(".picturetop").innerHeight());
    		//曲线
    		var iiData = classifyData;
    		var objec = {};
    		objec.xCategories = [];
    		_.forEach(iiData, function(v, i){
    			// objec.xCategories.push(Math.floor(v[0] / 10000000)/100);
    			objec.xCategories.push(v[0]);
    		});
    		objec.series = [];
    		objec.series[0] = {};
    		objec.series[0].data = [];
    		_.forEach(iiData, function(v, i){
    			objec.series[0].data.push(parseFloat(v[1]));
    		});
    		objec.container = $(this).find(".picturetop").children("div").attr("id");
    		objec.msgDom = $(this).find(".picturebottom");
    		objec.resetZoomButton = {
    			position: {
    				align: 'left', // by default
    				// verticalAlign: 'top', // by default
    				x: 0,
    				y: 0
    			},
    			relativeTo: 'chart'
    		};
    		drawDbCurve(objec);
    	}
    });
    setTimeout(function(){
    	callback && _.isFunction(callback) && callback(null, "SmithCurve");
    }, 500);
}

/*smith图S12S21*/
function drawDbCurve(obj){
	var container = obj.container;
	var xCategories = obj.xCategories;
	var series = obj.series;
	var msgDom = obj.msgDom;
	var legend_enabled = obj.legend_enabled || false;
	var zoomType = obj.zoomType || "None";
	var resetZoomButton = obj.resetZoomButton;
	var text = obj.text || null;
	var chart = Highcharts.chart(container, {
		chart: {
			type: 'line',
			zoomType: zoomType,
			resetZoomButton: resetZoomButton
		},
		title: {
			text: text
		},
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
						mouseOver: function (pa) {
							/*console.log(this);
							console.log(pa);*/
							var x = xCategories[this.x] ;
							var y = this.y ;
							var str = y+" dB,"+x+" GHz" ;
							msgDom && msgDom.find(".Smith_Msg2").text(str);
						}
					}
				},
				showCheckbox: true
			}
		},
	});
	return chart;
}

/*矢量图分页普通chart绘制*/
function drawCommonCurve(obj){
	var curveType = obj.curveType;
	var container = obj.container;
	var xAxisTitle = obj.xAxisTitle;
	var yAxisTitle = obj.yAxisTitle;
	var seriesData = obj.seriesData;
	var xcategories = obj.xcategories;
	var callback = obj.callback;
	/*var CVX = obj.CVX;
	var CVY = obj.CVY;
	var CVZ = obj.CVZ;
	var x_axis = obj.x_axis;
	var y_axis = obj.y_axis;*/
	var chart;
	var baseOption = {
		credits: {
			enabled: false
		},
		title: {
			text: curveType
		},
		subtitle: {
			text: null
		},
		lang: {
		    loading: 'Loading...' ,//设置载入动画的提示内容，默认为'Loading...'，若不想要文字提示，则直接赋值空字符串即可 
		},
        xAxis: {
			title: {
				text: xAxisTitle,
			},
			lineColor: 'black',
			categories: xcategories
		},
		yAxis: [{
			lineWidth: 1,
			lineColor: 'black',
			arrow: true,
			reversed: false,
			title: {
				text: yAxisTitle,
				align: 'high',
				rotation: 0,
			},
		}],
	};
	chart = Highcharts.chart(obj.container, _.merge({}, baseOption, {
			tooltip: {
				// Defaults to <span style="font-size: 10px">{point.key}</span><br/>
				// {point.x} == {point.key}
				headerFormat: '{point.key}, {point.y}<br>',
				// 默认是：<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>.
				// {point.x} 为series data里数组每项里的每个点的x  0,1,2...
				pointFormat: '<b>{series.name}</b>'
			},
			series: seriesData
		})
	);
	callback && _.isFunction(callback) && callback(chart, "CommonCurve");
	return chart;
}

/*矢量Map根据坐标获取ID，然后请求数据*/
function getIDByCoordANDRequ(obj){
	if(_.isNil(dataListDetailStore.mock.vectorMap.waferAjaxData)) {
		eouluGlobal.S_getSwalMixin()({
			title: "加载曲线提示",
			text: "获取不到参数",
			type: "warning",
			showConfirmButton: false,
			timer: 1600
		});
	}else{
		//die -- subdie
		var currentDieOrSubList = (dataListDetailStore.mock.vectorMap.waferAjaxData.mapInfo.containSubdie == true ? dataListDetailStore.mock.vectorMap.waferAjaxData.mapInfo.waferList.currentSubdieList : dataListDetailStore.mock.vectorMap.waferAjaxData.mapInfo.waferList.currentDieList);
		var coordinateIdObj = _.find(currentDieOrSubList, function(v, k) {
			return k == dataListDetailStore.state.vectorMap.currentDieCoord[0];
		});
		
		if(_.isNil(coordinateIdObj)) {
			eouluGlobal.S_getSwalMixin()({
				title: "加载曲线提示",
				text: "选择die异常，获取不到参数",
				type: "warning",
				showConfirmButton: false,
				timer: 1600
			});
		}else{
			var ajaxData = {};
			ajaxData.coordinateId = coordinateIdObj.coordinateId;
			var subdie = $("#SubdieSel").val();
			var deviceGroup = $("#GroupSel").val();
			var dieType = $("#DieTypeSel").val();
			if(_.isNil(subdie) || subdie == "AllSubdie") subdie = void(0);
			if(_.isNil(deviceGroup) || deviceGroup == "AllGroup") deviceGroup = void(0);
			if(_.isNil(dieType) || dieType == "AllDieType") dieType = void(0);
			ajaxData.subdie = subdie;
			//ajaxData.subdieNO = coordinateIdObj.subdieNO;
			ajaxData.deviceGroup = deviceGroup;
			ajaxData.dieType = dieType;
			renderChartByCoord({
				ajaxData: ajaxData,
				callback: obj.callback,
				ajaxCallback: obj.ajaxCallback
			});
		}
	}
}

/*矢量坐标图大小*/
function calcCoordImgWH(){
	if($(window).width()>1366){
		$(".positionFlag_div").css({
			"width": "100px",
			"height": "100px"
		});
		$(".positionFlag_div>img").attr({
			"width": "100",
			"height": "100"
		});
	}else{
		$(".positionFlag_div").css({
			"width": "95px",
			"height": "95px"
		});
		$(".positionFlag_div>img").attr({
			"width": "95",
			"height": "95"
		});
	}
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
	var classify = obj.classify;
	var paramsArr = obj.paramsArr;
	var str = '<div class="container-fluid">';
	var returnIDArr = [];
	if(["good_rate"].indexOf(classify) > -1){
		// var eclipse = '';
		// if(paramsArr.length > 5) eclipse = "&...";
		// var iparam = _.join(_.slice(paramsArr, 0, 5), ", ")+eclipse;
		var itext = "良品率（"+paramsArr.length+"个参数）",
		iparam = _.join(paramsArr, ", ");
		str+='<div class="row">';
			str+='<div class="col-sm-12 col-md-12 col-lg-12">';
			str+='<div class="panel panel-info" data-contextualparam="'+itext+'">'+
				  	'<div class="panel-heading">'+
				    	'<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>'+itext+
				  	'</div>'+
				  	'<div class="panel-body">'+
				    	'<div class="container-fluid">'+
				    		'<div class="chart_title"></div>'+
				    		'<div class="chart_body"><div id="'+(classify+dataListDetailStore.state.parameterMap.curChartContainerNum)+'" data-iparam="'+iparam+'"></div></div>'+
				    		'<div class="chart_foot"></div>'+
				    	'</div>'+
				  	'</div>'+
				'</div>';
			str+='</div>';
		str+='</div>';
		returnIDArr.push({
			id: (classify+dataListDetailStore.state.parameterMap.curChartContainerNum),
			param: iparam,
			isAll: true
		});
		dataListDetailStore.state.parameterMap.curChartContainerNum++;
	}else if(["histogram", "boxlinediagram", "CPK","gaussiandistribution", "map_good_rate_distribution", "map_color_order_distribution"].indexOf(classify) > -1){
		if(["histogram"].indexOf(classify) > -1) paramsArr = _.pull(paramsArr, "sectionX");
		var inStr = '';
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
								'<td>期望</td>'+
								'<td>期望</td>'+
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
				str+='<div class="panel panel-info" data-contextualparam="'+v+'">'+
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
	}
	str+='</div>';
	$("#parameterMap>div.panel[data-iallstatistics='"+classify+"']").children(".panel-body").append(str);
	return returnIDArr;
}

/*参数分布统计 Map良率绘制*/
function draw_map_good_rate(obj){
	console.log("draw_map_good_rate==obj",obj);
	var data = obj.data;
	var waferNO = obj.waferNO;
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
		m_DieDataListNew: dieData,
		colorGradation: {
			limitColor: "#FF0000",
			floorColor: "#00FF00",
			nums: 256
		},
		param : obj.IDParamObj.param,
		callback: function(positionFlag, newRenderWaferMap){
			var uplow = findParamUpLow(IDParamObj.param);
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
			that.parent().next().append(str);
		}
	});
}

/*map色阶分布图绘制*/
function draw_map_color_order_distribution(obj){
	console.log("draw_map_color_order_distribution",obj);
	/*获取参数*/
	var data = obj.data;
	var IDParamObj = obj.IDParamObj;
	var waferNO = obj.waferNO;
	/*预处理数据*/
	var that = $("#"+IDParamObj.id),
	waferData = _.find(data, function(v, k){
		return _.toString(k) == _.toString(waferNO);
	})
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
	var mergesubDieType = (waferData.containSubdie ?  [sub_currentItem_currentList] : [] );
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
	console.log("multip", multip);
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

/*参数分布统计 其他图表绘制*/
function draw_other_chart(obj){
	/*参数获取*/
	var chartType = obj.chartType;
	var classify = obj.classify;
	var IDParamObj = obj.IDParamObj;
	var paramsArr = obj.paramsArr;
	var data = obj.data;
	var curWaferId = obj.curWaferId;
	var errorArr = obj.errorArr;
	var waferNO = obj.waferNO;
	/*chartCNName: whenArrItem.chartCNName,
	errorParamArr: [],
	classify*/
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
				return _.toString(kk) == _.toString(waferNO);
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
			});
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
			var iserise = [],
			ndataItem = _.find(ndata.percentList, function(v, k){
				return _.toString(k) == curWaferId;
			});
			iserise.push({
				name: iparam+"频率分布",
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
			series = iserise;
		break;

		case "boxlinediagram":
			title_text = "箱线图-"+iparam;
			xAxis = {
						categories: [iparam],
						title: {
							text: "参数"
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
			var iindata = _.find(_.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			}), function(vv, kk){
				return _.toString(kk) == _.toString(curWaferId);
			});
			/*暂时处理*/
			series = [{
					name: '观测值',
					data: [iindata.eigenValue],
					tooltip: {
						headerFormat: '<em>参数： {point.key}</em><br/>'
					}
				}, {
					name: '极端异常值',
					color: Highcharts.getOptions().colors[0],
					type: 'scatter',
					// x, y positions where 0 is the first category
					data: iindata.extreme,
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
					data: iindata.soft,
					marker: {
						fillColor: '#ccc',
						lineWidth: 1,
						lineColor: Highcharts.getOptions().colors[1]
					},
					tooltip: {
						pointFormat: '温和异常值: {point.y}'
					}
				}];
		break;

		case "CPK":
			title_text = "CPK-"+iparam;
			/*var dataLength = 12;
			var iiicategories = _.range(1, dataLength + 1);
			_.forEach(iiicategories, function(v, i, arr){
				arr[i] = eouluGlobal.S_numToChineseSm(v);
			});*/
			/*num.toLocaleString()*/
			var iiitem = {};
			iiitem.name = iparam;
			var iiidata = _.find(_.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			}), function(vv, kk){
				return _.toString(kk) == _.toString(waferNO);
			});
			iiitem.data = _.map(iiidata, function(v, i){
				var iflag = true;
				if(Math.abs(parseFloat(v))>1) iflag = false;
				return _.toNumber(eouluGlobal.S_ComSCMRound(parseFloat(v), 2, iflag));
			});

			xAxis = {
				categories: _.reduce(iiidata, function(result, v, i, ar){
					result.push(eouluGlobal.S_numToChineseSm(i+1));
					return result;
				}, [])
			};
			yAxis = {
				title: {
					text: 'values'
				}
			};
			series = [iiitem];
		break;

		case "gaussiandistribution":
			var iiiindata = _.find(data, function(v, k){
				return _.toString(k) == _.toString(iparam);
			});
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
			var iiiiitem = {};
			// iiiiitem.name = iparam;
			iiiiitem.name = "良品率";
			iiiiitem.data = [];
			_.forOwn(data, function(v, k){
				iiiiitem.data[_.findIndex(paramsArr, function(o){ return _.toString(o) == _.toString(k); })] = parseFloat(_.values(v)[0]);
			});
			var iiiiicategories = paramsArr;
			xAxis = {
				categories: iiiiicategories
			};
			yAxis = {
				title: {
					text: "%"
				},
				min: 0,
				max: 110,
				tickInterval: 10,
				labels: {
					formatter: function() {
						return this.value;
					}
				}
			};
			series = [iiiiitem];
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
		chartClassify: classify,
		callback: callback
	});
	return errorArr;
}

function ajax_all_chart(obj){
	var times = obj.times;
	var alltimes = obj.alltimes;
	var whenArr = obj.whenArr;
	var errorArr = obj.errorArr || [];
	/*chartType: chartType,
	chartAjaxUrl: chartAjaxUrl,
	chartCNName: chartCNName,
	classify: iicontrols*/
	var whenArrItem = whenArr[times];
	$.ajax({
		type: "GET",
		url: whenArrItem.chartAjaxUrl,
		data: {
			waferIdStr: $("body").data("waferid")
		},
		dataType: "json",
		beforeSend: function(){
			$("body").data("iglobalerror", "allow");
			/*提示框修改text*/
			$("#swal2-content").text("正在请求"+whenArrItem.chartCNName+"数据，绘图进度 "+(times+1)+"/"+alltimes);
		}
	}).then(function(data){
		/*console.log(whenArrItem.chartAjaxUrl, data); // GaussianDistribution {}*/
		if(_.isEmpty(data) || _.isNil(data)) {
			errorArr.push({
				chartCNName: whenArrItem.chartCNName,
				errorParamArr: [],
				classify: whenArrItem.classify,
				message: "数据为空"
			});
		}else{
			/*显示当前图表父容器*/
			$("#parameterMap>div.panel[data-iallstatistics='"+whenArrItem.classify+"']").fadeIn(100);
			/*提示框修改text*/
			$("#swal2-content").text("正在绘制"+whenArrItem.chartCNName+"，绘图进度 "+(times+1)+"/"+alltimes);
			var paramsArr,
			// webParam = $("body").data("webparam"),
			waferNO = $("body").data("waferid"); // 2018-11-30修改，意思是晶圆主键
			if(["map_good_rate_distribution", "map_color_order_distribution"].indexOf(whenArrItem.classify) > -1){
				var waferList = _.find(data, function(v, k){
					return _.toString(k) == _.toString(waferNO);
				}).waferList;
				paramsArr = _.reduce(waferList, function(result, value, i) {
				  result.push(value.parameter);
				  return result;
				}, []);
			}else{
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
			var IDParamObjArr = buildParameterChartContainer({
				classify: whenArrItem.classify,
				paramsArr: _.cloneDeep(paramsArr)
			});
			/*画图*/
			_.forEach(IDParamObjArr, function(v, i){
				if(whenArrItem.classify == "map_good_rate_distribution"){
					draw_map_good_rate({
						IDParamObj: v,
						data: _.cloneDeep(data),
						waferNO: waferNO
					});
				}else if(whenArrItem.classify == "map_color_order_distribution"){
					/*map色阶分布图绘制*/
					draw_map_color_order_distribution({
						data: _.cloneDeep(data),
						IDParamObj: v,
						waferNO: waferNO
					});
				}else{
					errorArr = draw_other_chart({
						chartType: whenArrItem.chartType,
						classify: whenArrItem.classify,
						IDParamObj: v,
						paramsArr: paramsArr,
						data: _.cloneDeep(data),
						curWaferId: $("body").data("waferid").toString(),
						errorArr: errorArr,
						waferNO: waferNO
					});
				}
			});
		}
		//console.table && console.table(errorArr)
		times++;
		if(times != alltimes){
			setTimeout(function(){
				ajax_all_chart({
					times: times,
					alltimes: alltimes,
					whenArr: whenArr,
					errorArr: errorArr
				});
			}, 50);
		}else{
			eouluGlobal.S_getSwalMixin()({
				title: "加载提示",
				text: "数据请求完成",
				type: "info",
				showConfirmButton: false,
				timer: 900
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
		}).then(function(){
			$("body").data("iglobalerror", "unallow");
		});
	}).always(function(){
		/*(times == alltimes) && (dataListDetailStore.state.parameterMap.hasRender = true);*/
	});
}
/*参数分布统计end*/
/*page preload*/
$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
$(".vectorMap_l, .vectorMap_r").innerHeight($("#vectorMap").innerHeight());
eouluGlobal.S_getSwalMixin()({
	title: "加载提示",
	text: "正在加载数据",
	type: "info",
	showConfirmButton: false
});

/*page onload*/
$(function(){
	/*判断权限*/
	eouluGlobal.C_pageAuthorityCommonHandler({
		authorityJQDomMap: _.cloneDeep(dataListDetailStore.state.authorityJQDomMap),
		callback: function(){
			if($(".g_menu li[role='presentation'][data-iclassify]:visible").length == 0){
				eouluGlobal.S_getSwalMixin()({
					title: "权限判断提示",
					text: "权限不足，请先申请",
					type: "error",
					showConfirmButton: false,
					timer: 2000
				}).then(function(){
					eouluGlobal.S_settingURLParam({}, false, false, false, "DataList");
				});
				dataListDetailStore.state.authorityNull = true;
				return false;
			}else if($(".g_menu li[role='presentation'][data-iclassify]:visible.active").length == 0){
				$(".g_menu li[role='presentation'][data-iclassify]:visible:not(.active)").eq(0).children("a").trigger("click");
			}else{
				setTimeout(function(){
					swal.close();
				}, 300);
			}
		}
	});
	/*判断权限end*/

	if(dataListDetailStore.state.authorityNull !== true){
		/*加载参数数据分页*/
		setTimeout(function(){
			getTableDataANDRender();
		}, 50);
		/*加载参数数据分页结束*/

		/*回显晶圆信息*/
		var webParam = eouluGlobal.S_getUrlPrmt().webParam;
		var webParamStr, webParamArr;
		if(!_.isNil(webParam)){
			webParamArr = webParam.split("futureDT2OnlineDataListSplitor");
			webParamStr = '晶圆信息：'+webParamArr[0]+' / '+webParamArr[1]+' / '+webParamArr[2]+' / '+webParamArr[3];
		}else{
			webParamStr = '晶圆信息获取失败!';
		}
		var titleStr = webParamStr;
		if(webParamStr.length>80) webParamStr = webParamStr.substr(0, 80)+"...";
		webParamStr+='<button type="button" class="btn btn-default" aria-label="Left Align">'+
						  '<span class="glyphicon glyphicon-export" aria-hidden="true"></span> 导出'+
						'</button>';
		$("div.webParam").html(webParamStr).attr("title", titleStr);
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
		_.forEach(_.compact([webParamArr[3]]), function(v, i){
			$("#DieTypeSel").append('<option value="'+v+'">'+v+'</option>');
		});
		calcCoordImgWH();
		/*矢量数据分页end*/
	}
});

/*event listener*/
/*浏览器窗口大小改变普通事件*/
$(window).on("resize", _.debounce(commonCalcLayout, 150));
$(window).on("resize", _.debounce(function(){
	_.forEach(dataListDetailStore.state.vectorMap.smithObjArr, function(v, i, arr){
		arr[i].onresize();
	});
	calcCoordImgWH();
}, 150));

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
			data = data.replace("#", "%23");
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
$(document).on("click", ".vectorMap_l div.panel-heading>span.glyphicon:not(.glyphicon-ok), #parameterMap div.panel-heading>span.glyphicon:not(.glyphicon-ok)", function(){
	$(this).toggleClass("glyphicon-menu-down glyphicon-menu-right");
	var iParent = $(this).parent().parent();
	if($(this).hasClass("glyphicon-menu-right")){
		$(this).parent().next().slideUp(200);
		iParent.removeClass("panel-warning panel-danger panel-info");
		var icontextual = iParent.data("icontextual");
		if(_.isNil(icontextual) || _.isEmpty(icontextual)){
			iParent.addClass("panel-success");
		}else{
			iParent.addClass("panel-"+icontextual);
		}
	}else{
		$(this).parent().next().slideDown(200);
		iParent.removeClass("panel-warning panel-danger panel-success").addClass("panel-info");
	}
});

$(document).on('shown.bs.tab', 'div.g_menu a[data-toggle="tab"]', function(e){
	var licontrols = $(e.target).attr("aria-controls");
	if(licontrols == "parameterMap" && !dataListDetailStore.state.parameterMap.hasRender){
		$("#parameterMap>div.panel").hide();
		eouluGlobal.S_getSwalMixin()({
			title: '加载数据',
			text: "正在绘图中......",
			type: 'info',
			showConfirmButton: false,
			showCancelButton: false,
		});
		setTimeout(function(){
			/*var ajaxInterval = setInterval(function(){ 
				if($("#parameterMap>div.panel").length-2 == dataListDetailStore.state.parameterMap.ajaxLength){
					setTimeout(function(){
						swal.clickCancel();
					}, 1000);
					clearInterval(ajaxInterval);
				}
			}, 2000);*/
			/*绘制参数图*/
			var whenArr = [];
			$("#parameterMap>div.panel").each(function(i, el){
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
					classify: iicontrols
				});
			});
			ajax_all_chart({
				times: 0,
				alltimes: whenArr.length,
				whenArr: _.cloneDeep(whenArr)
			});
		}, 50);
	}else if(licontrols == "allDetail"){
		_.debounce(commonCalcLayout, 150)();
	}else if(licontrols == "vectorMap" && !dataListDetailStore.state.vectorMap.renderChartByCoordFlag){
		/*初始化曲线图*/
		$.ajax({
			type: "GET",
			url: "VectorMap",
			data: {
				waferId: $("body").data("waferid")
			},
			dataType: "json"
		}).then(function(data){
			console.log("data",data);
			/*第一次加载需要全部显示*/
			/*保存*/
			dataListDetailStore.mock.vectorMap.waferAjaxData = _.cloneDeep(data);
			dataListDetailStore.mock.vectorMap.filterArr = [];
			/*Subdie Group DieType*/
			_.forEach(_.compact(data.subdie), function(v, i){
				$("#SubdieSel").append('<option value="'+v+'">'+v+'</option>');
			});
			_.forEach(_.compact(data.deviceGroup), function(v, i){
				$("#GroupSel").append('<option value="'+v+'">'+v+'</option>');
			});
			renderVectorMapWafer({
				mapInfo: data.mapInfo
			});
			getIDByCoordANDRequ({
				callback: null,
				ajaxCallback: function(){
					setTimeout(function(){
						swal.close();
					}, 1500);
				}
			});
			dataListDetailStore.state.vectorMap.renderChartByCoordFlag = true;
		}, function(){
			/*eouluGlobal.C_server500Message({
				callback: null
			});*/
		});
	}
});

/*点击过滤*/
$(document).on("click", "#filterMap", function(e){
	e.stopPropagation();
	eouluGlobal.S_getSwalMixin()({
		title: '加载数据',
		text: "正在请求过滤后Map数据...",
		type: 'info',
		showConfirmButton: false,
		showCancelButton: false,
	});
	var ajaxData = {},
	subdie = $("#SubdieSel").val(),
	deviceGroup = $("#GroupSel").val(),
	dieType = $("#DieTypeSel").val();
	if(_.isNil(subdie) || subdie == "AllSubdie") subdie = void(0);
	if(_.isNil(deviceGroup) || deviceGroup == "AllGroup") deviceGroup = void(0);
	if(_.isNil(dieType) || dieType == "AllDieType") dieType = void(0);
	ajaxData.waferId = $("body").data("waferid");
	ajaxData.subdie = subdie;
	ajaxData.deviceGroup = deviceGroup;
	ajaxData.dieType = dieType;
	$.ajax({
		type: "GET",
		url: "VectorMapFilter",
		data: ajaxData,
		dataType: "json"
	}).then(function(data){
		if(_.isNil(data) || _.isEmpty(data)){

		}else{
			/*提示框修改text*/
			$("#swal2-content").text("请求Map数据完成，正在请求曲线数据...");
			var scrollTopH = $("div.vectorMap_l").scrollTop();
			/*保存*/
			dataListDetailStore.mock.vectorMap.filterArr = (dataListDetailStore.mock.vectorMap.waferAjaxData.mapInfo.containSubdie ? _.keys(data.currentSubdieList) : _.keys(data.currentDieList));  //考虑过滤后subdie
			console.log("data",data);
			console.log("vectorMap",dataListDetailStore.mock.vectorMap);
			renderVectorMapWafer({
				mapInfo: dataListDetailStore.mock.vectorMap.waferAjaxData.mapInfo
			});
			getIDByCoordANDRequ({
				callback: null,
				ajaxCallback: function(){
					setTimeout(function(){
						// swal.clickCancel();
						swal.close();
						$("div.vectorMap_l").scrollTop(scrollTopH);
					}, 1500);
				}
			});
		}
	});
});

/*右键切换开始*/
$.contextMenu({
	selector: "div.vectorMap_l div.panel[data-dbcurveandsmith]>.panel-body",
	callback: function(key, options) {
		alert(key+"图功能正在开发");
		// window.console && console.log(m) || alert(m);
	},
	items: {
		"Smith": {
			name: "Smith",
			icon: ""
		},
		"Polar": {
			name: "Polar",
			icon: ""
		},
		"XYOfPhase": {
			name: "XYOfPhase",
			icon: ""
		},
		"XYOfMagnitude": {
			name: "XYOfMagnitude",
			icon: ""
		},
		"XYdBOfMagnitude": {
			name: "XYdBOfMagnitude",
			icon: ""
		}
	}
});
/*$.contextMenu({
	selector: '.Mos_Vg_Vd_Id0_col',
	callback: function(key, options) {
		var m = "clicked: " + key;
		window.console && console.log(m) || alert(m);
		console.log(options)
	},
	items: {
		"edit": {
			name: "Edit",
			icon: ""
		},
		"cut": {
			name: "Cut",
			icon: "cut"
		},
		"copy": {
			name: "Copy",
			icon: "copy"
		},
		"paste": {
			name: "Paste",
			icon: "paste"
		},
		"delete": {
			name: "Delete",
			icon: "delete"
		},
		"sep1": "---------",
		"quit": {
			name: "Quit",
			icon: function() {
				return 'context-menu-icon context-menu-icon-quit';
			}
		}
	}
});*/

