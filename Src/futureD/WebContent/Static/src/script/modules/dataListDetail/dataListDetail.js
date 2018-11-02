/*variable defined*/
var dataListDetailStore = Object.create(null);
dataListDetailStore.mock = {
	allDetail: futuredGlobal.S_getDataListDetail().allDetail,
	allDetailThead: [],
	vectorMap: {
		filterArr: [],
		waferData: futuredGlobal.S_getMockWaferData()[0],
		waferData1: futuredGlobal.S_getMockWaferData()[1]
	}
};
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
		curSelectedDie: Object.create(null)
	}
};

function renderTheadTbody(obj){
	var str = '<tr>';
	if(obj.th){
		if(obj.name == "位置"){
			str = '<tr><th>类型</th><th>Die编号</th><th>Quality</th><th>'+obj.name+'</th>';
		}else{
			str = '<tr><th></th><th></th><th></th><th>'+obj.name+'</th>';
		}
	}
	var thead = dataListDetailStore.mock.allDetail.thead[0];
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

/*page preload*/
$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
$(".vectorMap_l, .vectorMap_r").innerHeight($(".tab-content div[role='tabpanel']").innerHeight());
$(".table_data").css("max-height", ($(".tab-content").innerHeight() - 20)+"px");
_.forOwn(dataListDetailStore.mock.allDetail.thead[0], function(v, k){
	switch (k){
		case "PassPercent":
			dataListDetailStore.mock.allDetailThead[0] = v;
		break;
		case "UpLimit":
			dataListDetailStore.mock.allDetailThead[1] = v;
		break;
		case "LowerLimit":
			dataListDetailStore.mock.allDetailThead[2] = v;
		break;
		default:
			dataListDetailStore.mock.allDetailThead[3] = v;
	}
});
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
_.forOwn(dataListDetailStore.mock.allDetail.tbody[0], function(v, k){
	var str = renderTheadTbody({
		data: v,
		td: true
	});
	$("#allDetail .allDetail_body .table_body tbody").append(str);
});
if($(".allDetail_body .table_body>table").innerHeight() > $(".allDetail_body .table_body").innerHeight()+7){
	$(".allDetail_body .table_head").innerWidth($(".allDetail_body").innerWidth() - 7);
}

/*page onload*/
$(function(){
	$("#allDetail>.table_data").html(futuredGlobal.S_getDataListDetail().allDetail);

	/*加载矢量图*/
	var dieData = dataListDetailStore.mock.vectorMap.waferData1.waferMapDataList[0].m_DieDataListNew;
	dataListDetailStore.mock.vectorMap.filterArr = [];
	_.forEach(dieData, function(v, i){
		dataListDetailStore.mock.vectorMap.filterArr.push(_.keys(v)[0]);
	});
	var maxWidth = 1500;
	var maxHeight = 900;
	dataListDetailStore.state.vectorMap.waferMapObj = buildColorGradation({
		// 自定义标志
		custom: {
			WH: true
		},
		maxWidth: maxWidth,
		maxHeight: maxHeight,
		container: 'canvas_vectorMap',
		bgFillColor: "#314067",
		waferData: dataListDetailStore.mock.vectorMap.waferData1,
		// 空白空间比例
		spacePercent: {
			x: 0.05,
			y: 0.05
		},
		m_DieDataListNew: dieData,
		colorGradation: {
			limitColor: "#FF0000",
			floorColor: "#008000",
			nums: 256
		},
		/*存放过滤后数据坐标 "x:y"*/
		filterArr: dataListDetailStore.mock.vectorMap.filterArr,
		currentDieCoord: "0:0",
		// 第一次加载标志。可以做一些事情
		isFirst: true,
		coordsArra: dataListDetailStore.state.vectorMap.coordsArray,
		returnFlag: true,
		addEvent: true,
		curSelectedDie: dataListDetailStore.state.vectorMap.curSelectedDie,
		vectorMap: true,
		callback: function(positionFlag){
			$(".vectorMap_l .positionFlag_div>img").attr("src", "../img/modules/dataListDetail/"+positionFlag+".png");
		}
	});
});

/*event handler*/
$(".allDetail_body .table_body").on("scroll", function(e){
	if(dataListDetailStore.state.allDetail.tbody.scrollTop - 1 < $(this).scrollTop() && dataListDetailStore.state.allDetail.tbody.scrollTop + 1 > $(this).scrollTop()){
		$(".allDetail_body .table_head").scrollLeft($(this).scrollLeft());
	}
	dataListDetailStore.state.allDetail.tbody.scrollTop = $(this).scrollTop();
	dataListDetailStore.state.allDetail.tbody.scrollLeft = $(this).scrollLeft();
});