/*variable defined*/
var dataListDetailStore = Object.create(null);
dataListDetailStore.mock = Object.create(null);
dataListDetailStore.mock.allDetail = {
	thead: [{
		PassPercent: null,
		UpLimit: null,
		LowerLimit: null,
		Param: null,
	}],
	tbody: [{}]
};
dataListDetailStore.mock.allDetailThead = [];

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

function getTableDataANDRender(){
	var data = $("body").data("result");
	/*预处理数据*/
	var theadObj = dataListDetailStore.mock.allDetail.thead[0];
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
	_.forEach(data.dataList, function(v, i){
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
		console.log(midArr2)
		_.forEach(midArr2, function(vvv, iii){
			midArr.push(vvv.value);
		});
		dataListDetailStore.mock.allDetail.tbody[0][die_number] = _.cloneDeep(midArr);
	});
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
}

/*page preload*/
$(".tab-content div[role='tabpanel']").innerWidth($(".tab-content").innerWidth()).innerHeight($(".tab-content").innerHeight());
$(".vectorMap_l, .vectorMap_r").innerHeight($("#vectorMap").innerHeight());
eouluGlobal.S_getSwalMixin()({
	title: "加载提示",
	text: "正在加载数据",
	type: "info",
	showConfirmButton: false
});
setTimeout(function(){
	getTableDataANDRender();
	swal.clickCancel();
}, 50);

/*page onload*/
$(function(){

});