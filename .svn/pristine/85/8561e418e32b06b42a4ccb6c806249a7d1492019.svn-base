/*variable defined*/
var dataListState = new Object();
dataListState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: 1,
};
dataListState.hasSearch = false;
dataListState.sellectObj = {
	selectAll: false,
	selectItem: []
};

/*page onload*/
$(function(){
	function getDataListPageData(immediately, funObj){
		store.remove("futuredDatalist");
		if(immediately == "delete"){
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
							  	obj[k].value = (Number(ii)%4)+1;
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
			var futuredDatalistChunkArray = _.chunk(futuredDatalistFilterArr, 10);
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
						'<td data-itext="第'+iii+'条'+v.product_category.value+'">第'+iii+'条'+v.product_category.value+'</td>'+
						'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
						'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
						'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
						'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
						'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
						'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
						'<td class="not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" data-ivalue="'+ii+'"></span><span class="glyphicon glyphicon-eye-open" aria-hidden="true" data-ivalue="'+ii+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" data-ivalue="'+ii+'"></span></td>'+
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

	renderData(1, "onload", {});

	// 分页元素ID（必填）
	dataListState.pageObj.selector = '#pagelist';
	// 分页配置
	dataListState.pageObj.pageOption = {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: dataListState.pageObj.itemLength,
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
	    dataListState.pageObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	renderData(obj.curr, "onload", {});
	      	dataListState.hasSearch && ($("#search_button").trigger("click"));
	      	$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
	      		if(_.indexOf(dataListState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
	      			$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
	      		}
	      	});
	    }
	  }
	};
	// 初始化分页器
	new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);

	$("#jumpText").on("input propertychange", function(){
		$(this).val($(this).val().replace(/[^\d]/g,''));
	});

	$("#jumpPage").on("click", function(){
		var iText = Number($("#jumpText").val());
		var currentPage = Number(dataListState.pageObj.currentPage);
		var pageCounts = Number(dataListState.pageObj.pageCount);
		if(currentPage == iText || iText <= 0 || iText>pageCounts){
		    $("#jumpText").val('');
		    return;
		}else{
		    dataListState.pageObj.pageOption.curr = iText;
		    renderData(iText, "onload", {});
		    dataListState.hasSearch && ($("#search_button").trigger("click"));
		    new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
		}
	});

	$(".g_bodyin_bodyin_tit_l .glyphicon-refresh").click(function(){
		renderData(1, "onload", {refreshMock: true});
		dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
		dataListState.pageObj.pageOption.curr = 1;
		dataListState.sellectObj.selectAll = false;
		$("#checkAll").prop("checked", false);
		dataListState.sellectObj.selectItem = [];
		dataListState.hasSearch = false;
		$("#search_input").val("");
		new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
	});

	$(".g_bodyin_bodyin_tit_l .glyphicon-trash").click(function(){
		if(dataListState.sellectObj.selectItem.length == 0){
			swal({
			  	position: 'center',
			  	type: 'info',
			  	title: '未选中数据！',
			  	showConfirmButton: false,
			  	timer: 1500,
			  	animation: false,
			    customClass: 'animated zoomIn'
			});
			return false;
		}

		var swalWithBootstrapButtons = swal.mixin({
		  	confirmButtonClass: 'btn btn-success',
		  	cancelButtonClass: 'btn btn-danger',
		  	buttonsStyling: true,
	  		animation: false,
	    	customClass: 'animated zoomIn'
		});

		swalWithBootstrapButtons({
		 	title: '确定删除吗？',
		 	text: "删除后将放入回收站，点击刷新按钮可以重置数据！",
		 	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: '确定，删除！',
		  	cancelButtonText: '不，取消！',
		  	reverseButtons: false
		}).then(function(result) {
		  if (result.value) {

		  	var IDArr = dataListState.sellectObj.selectItem;
		  	var iText = 1;
		  	if(dataListState.sellectObj.selectAll){
		  		iText = 0;
		  	}
		  	renderData(iText, "delete", {deleteFun: function(){
		  		var futuredDatalistArray;
		  		if(dataListState.sellectObj.selectAll){
		  			futuredDatalistArray = [];
		  		}else{
		  			futuredDatalistArray = JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data;
		  			_.forEach(IDArr, function(vv, ii, arra){
		  				_.forEach(futuredDatalistArray, function(v, i, arr){
		  					if(v.wafer_id.value == vv){
		  						arr[i].delete_status.value = "1";
		  						return false;
		  					}
		  				});
		  			});
		  		}
		  		var item = {};
		  		item.data = _.cloneDeep(futuredDatalistArray);
		  		item.expires = Date.now() + 1*60*1000;
		  		store.set('futureDT2__datalist__pageDataObj', JSON.stringify(item));
		  		var futuredDatalistFilterArr = _.filter(futuredDatalistArray, function(o) { return o.delete_status.value == "0"; });
		  		var futuredDatalistChunkArray = _.chunk(futuredDatalistFilterArr, 10);
		  		dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
		  		dataListState.pageObj.itemLength = futuredDatalistFilterArr.length;
		  		dataListState.hasSearch && ($("#search_button").trigger("click"));
		  		dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
		  		dataListState.pageObj.pageOption.curr = iText;
		  		new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
		  		dataListState.sellectObj.selectItem = [];
		  		if(dataListState.sellectObj.selectAll){
		  			$("#checkAll").prop("checked", false);
		  			dataListState.sellectObj.selectAll = false;
		  		}
		  		return futuredDatalistChunkArray;
		  	}});

		    swalWithBootstrapButtons({
		    	title: '删除成功！',
		    	text: "被选中的记录已经放入回收站",
		    	type: 'success',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		    swalWithBootstrapButtons({
		    	title: '取消了！',
		    	text: "不作处理",
		    	type: 'error',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  }
		});
	});

	$(document).on("click", ".g_bodyin_bodyin_body tbody td.not_search .glyphicon.glyphicon-trash", function(e){
		e.stopPropagation();
		var iThat = $(this);
		var swalWithBootstrapButtons = swal.mixin({
		  	confirmButtonClass: 'btn btn-success',
		 	cancelButtonClass: 'btn btn-danger',
		  	buttonsStyling: true,
	  		animation: false,
	    	customClass: 'animated zoomIn'
		});
		swalWithBootstrapButtons({
		  title: '确定删除吗？',
		  text: "删除后将放入回收站，点击刷新按钮可以重置数据！",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: '确定，删除！',
		  cancelButtonText: '不，取消！',
		  reverseButtons: false
		}).then(function(result) {
		  if (result.value) {

		  	var iText;
		  	if(dataListState.pageObj.currentPage < dataListState.pageObj.pageCount){
		  		iText = dataListState.pageObj.currentPage;
		  	}else if(dataListState.pageObj.itemLength%10 != 1){
		  		iText = dataListState.pageObj.currentPage;
		  	}else{
		  		iText = dataListState.pageObj.currentPage - 1;
		  	}
		  	var ID = iThat.data("ivalue").toString();
		  	renderData(iText, "delete", {deleteFun: function(){
		  		var futuredDatalistArray = JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data;
		  		_.forEach(futuredDatalistArray, function(v, i, arr){
		  			if(v.wafer_id.value == ID){
		  				arr[i].delete_status.value = "1";
		  				return false;
		  			}
		  		});
		  		var item = {};
		  		item.data = _.cloneDeep(futuredDatalistArray);
		  		item.expires = Date.now() + 1*60*1000;
		  		store.set('futureDT2__datalist__pageDataObj', JSON.stringify(item));
		  		var futuredDatalistFilterArr = _.filter(futuredDatalistArray, function(o) { return o.delete_status.value == "0"; });
		  		var futuredDatalistChunkArray = _.chunk(futuredDatalistFilterArr, 10);
		  		dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
		  		dataListState.pageObj.itemLength = futuredDatalistFilterArr.length;
		  		dataListState.hasSearch && ($("#search_button").trigger("click"));
		  		dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
		  		dataListState.pageObj.pageOption.curr = iText;
		  		new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
		  		_.pull(dataListState.sellectObj.selectItem, ID);
		  		return futuredDatalistChunkArray;
		  	}}, true);

		    swalWithBootstrapButtons({
		    	title: '删除成功！',
		    	text: "被选中的记录已经放入回收站",
		    	type: 'success',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		    swalWithBootstrapButtons({
		    	title: '取消了！',
		    	text: "不作处理",
		    	type: 'error',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  }
		});
	});

});

/*event handler*/
$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){
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

$(document).on("mouseover", ".g_bodyin_bodyin_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
});

$(document).on("mouseout", ".g_bodyin_bodyin_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
});

$(document).on("click", ".g_bodyin_bodyin_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
});


$(document).on("click", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
});

$(document).on("change", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(){
	var ID = $(this).data("ivalue").toString();
	$(this).prop("checked") ? dataListState.sellectObj.selectItem.push(ID) : _.pull(dataListState.sellectObj.selectItem, ID);
	dataListState.sellectObj.selectItem = _.uniq(dataListState.sellectObj.selectItem);
	$("#checkAll").prop("checked", dataListState.pageObj.itemLength == dataListState.sellectObj.selectItem.length);
	dataListState.sellectObj.selectAll = $("#checkAll").prop("checked");
});

$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		dataListState.sellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			dataListState.sellectObj.selectItem = [];
			JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data.map(function(v, i, arr){
				if(v.delete_status.value == "0"){
					dataListState.sellectObj.selectItem.push(v.wafer_id.value);
				}
			});
		}else{
			dataListState.sellectObj.selectItem = [];
		}
	}
});

$("#search_button").on("click", function(){
	var isearch = $("#search_input").val().trim();
	if(isearch == ""){
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iiText = _.isNil($(this).data("itext")) ? "" : $(this).data("itext");
			$(this).empty().text(iiText);
		});
		dataListState.hasSearch = false;
		return false;
	}else{
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
		dataListState.hasSearch = true;
		return false;
	}
});

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});