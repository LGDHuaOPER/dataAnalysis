/*variable defined*/

var dataListState = new Object();
dataListState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: 0,
};
dataListState.searchPageObj = {
	currentPage: 0,
	pageCount: 0,
	itemLength: 0,
	searchVal: null,
	selector: "#pagelist",
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
	    dataListState.searchPageObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      	// do something
      		searchRenderData(obj.curr, dataListState.searchPageObj.searchVal);
	    }
	  }
	}
};
dataListState.hasSearch = false;
dataListState.sellectObj = {
	selectAll: false,
	selectItem: []
};
dataListState.product_categoryArr = store.get("futureDT2__dataList__product_category");
dataListState.cache = {
	futureDT2_update_td_description: null
};



function getDataListPageData(immediately, funObj){
	store.remove("futuredDatalist");
	if(immediately == "search"){
		var searchArr;
		funObj.searchFun && (searchArr = funObj.searchFun());
		return searchArr;
	}else if(immediately == "delete"){
		var deleteArr;
		funObj.deleteFun && (deleteArr = funObj.deleteFun());
		return deleteArr;
	}else if(immediately == "addition"){
		var additionArr;
		funObj.additionFun && (additionArr = funObj.additionFun());
		return additionArr;
	}else if(immediately == "update"){
		var updateArr;
		funObj.updateFun && (updateArr = funObj.updateFun());
		return updateArr;
	}else if(immediately == "onload"){
		var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
		var futuredDatalistArray = [];
		if(futureDT2__datalist__pageDataObj && !funObj.refreshMock){
			futuredDatalistArray = JSON.parse(futureDT2__datalist__pageDataObj).data;
		}else{
			var iArr = futuredGlobal.S_getDataList();
			var futureDT2__dataList__product_category = [];
			_.times(93, function(i){
				var copyObj = _.cloneDeep(iArr[0]);
				var ii = String(i+1);
				_.forOwn(copyObj, function(v, k, obj){
					if(v.detail === null && k!="qualified_rate" && k!="die_type"){
						obj[k].value = _.padEnd(v.value, v.value.length+ii.length, ii);
					}else if(k == "qualified_rate"){
						obj[k].value = _.padStart(v.value, v.value.length+ii.length, ii);
					}else if(k == "die_type"){
						obj[k].value = "DefaultType";
					}else{
						switch(v.detail)
						{
						case "product_category":
							obj[k].value = ii;
							futureDT2__dataList__product_category.push(ii);
						  	break;
						case "time":
						  	obj[k].value = moment().add(Number(ii), 'days').format("YYYY-MM-DD HH:mm:ss");
						  	break;
						case "delete_status":
							obj[k].value = "0";
							break;
						default:
						/*数据格式*/
						  	obj[k].value = (Number(ii)%4);
						}
					}
				});
				futuredDatalistArray.push(copyObj);
			});
			/*mock数据结束*/
			store.set('futureDT2__dataList__product_category', _.uniq(futureDT2__dataList__product_category));
			var item = {};
			item.data = _.cloneDeep(futuredDatalistArray);
			item.expires = Date.now() + 1*60*1000;
			store.set('futureDT2__datalist__pageDataObj', JSON.stringify(item));
		}

		var futuredDatalistFilterArr = _.filter(futuredDatalistArray, function(o) { return o.delete_status.value == "0"; });
		var futuredDatalistChunkArray = _.chunk(_.reverse(_.sortBy(futuredDatalistFilterArr, function(o) { return o.test_start_date.value; })), 10);
		dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
		dataListState.pageObj.itemLength = futuredDatalistFilterArr.length;
		return futuredDatalistChunkArray;
	}
}

function renderData(currentPage, classify, funObj, signalDelete){
	var iArr = getDataListPageData(classify, funObj)[currentPage-1];
	var str = '';
	var icurrentPage = currentPage;
	if(iArr!=undefined){
		iArr.map(function(v, i, arr){
			var ii = v.wafer_id.value;
			var iii = (currentPage-1)*10+i+1;
			str+='<tr>'+
					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
					'<td class="td_product_category" data-itext="第'+iii+'条'+v.product_category.value+'" data-ivalue="'+v.product_category.value+'">第'+iii+'条'+v.product_category.value+'</td>'+
					'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
					'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
					'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
					'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
					'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
					'<td class="td_description" data-itext="'+v.description.value+'" data-ivalue="'+v.description.value+'">'+v.description.value+'</td>'+
					'<td class="not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" data-ivalue="'+ii+'"></span><span class="glyphicon glyphicon-eye-open" aria-hidden="true" data-ivalue="'+ii+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" data-ivalue="'+ii+'"></span></td>'+
					'<td class="not_search td_data_format" data-itext="'+v.data_format.value+'" data-ivalue="'+v.data_format.value+'">'+v.data_format.value+'</td>'+
				'</tr>';
		});
	}else{
		icurrentPage = 0;
	}
	$(".g_bodyin_bodyin_body tbody").empty().append(str);
	$("#checkAll").prop("checked", dataListState.sellectObj.selectAll);
	dataListState.pageObj.currentPage = icurrentPage;
	if(signalDelete == true){
		_.forEach(dataListState.sellectObj.selectItem, function(val){
			$(".g_bodyin_bodyin_body tbody [type='checkbox'][data-ivalue='"+(Number(val))+"']").prop("checked", true).parent().parent().addClass("warning").removeClass("info");
		});
		$("#checkAll").prop("checked", dataListState.pageObj.itemLength == dataListState.sellectObj.selectItem.length);
		dataListState.sellectObj.selectAll = $("#checkAll").prop("checked");
	}
}

function searchRenderData(currentPage, isearch){
	renderData(currentPage, "search", {
		searchFun: function(){
			var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
			if(_.isEmpty(futureDT2__datalist__pageDataObj) || _.isNil(futureDT2__datalist__pageDataObj)){
				dataListSwalMixin({
					title: 'mock数据异常',
					text: "意外被删除，请重新登录！",
					type: 'error',
					showConfirmButton: false,
					timer: 2500,
				}).then(function(result){
					if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
						window.location.assign("login.html");
					}
				});
				return false;
			}else{
				var projectAnalysisData = JSON.parse(futureDT2__datalist__pageDataObj).data;
				
				var returnprojectAnalysisData = [];
				if(isearch == null || isearch == ""){
					returnprojectAnalysisData = projectAnalysisData;
				}else{
					_.forEach(projectAnalysisData, function(v){
						_.forOwn(v, function(o){
							if(String(o.value).indexOf(isearch)>-1){
								returnprojectAnalysisData.push(v);
								return false;
							}
						});
					});
				}
				var futuredDatalistFilterArr = _.filter(returnprojectAnalysisData, function(o) { return o.delete_status.value == "0"; });
				var futuredDatalistChunkArray = _.chunk(_.reverse(_.sortBy(futuredDatalistFilterArr, function(o) { return o.test_start_date.value; })), 10);
				dataListState.searchPageObj.pageCount = futuredDatalistChunkArray.length;
				dataListState.searchPageObj.itemLength = futuredDatalistFilterArr.length;
				dataListState.searchPageObj.pageOption.count = dataListState.searchPageObj.itemLength;
				dataListState.searchPageObj.pageOption.curr = currentPage;
				return futuredDatalistChunkArray;
			}
		}
	}, false);
	searchMark(isearch);
}

/*page onload*/
$(function(){
	renderData(1, "onload", {});

	

});

/*event handler*/
$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});







$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});



/*跳转至回收站*/
$(".g_bodyin_bodyin_tit_l>.glyphicon-trash").click(function(){
	dataListSwalMixin({
		title: '提示',
		text: "功能正在开发中！",
		type: 'info',
		showConfirmButton: false,
		timer: 2000,
	});
});
