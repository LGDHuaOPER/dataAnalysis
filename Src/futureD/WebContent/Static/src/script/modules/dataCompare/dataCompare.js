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
	selectItem: []
};

function redirectLogin(obj){
	dataCompareSwalMixin({
		title: 'mock数据异常',
		text: obj.text,
		type: 'error',
		showConfirmButton: false,
		timer: 2500,
	}).then(function(result){
		if(result.dismiss == "timer"){
			window.location.assign(obj.url);
		}
	});
}

function getdataCompareData(searchVal, isGetFilterAllData, isGetAllData){
	var futureDT2__datalist__pageDataObj = store.get('futureDT2__datalist__pageDataObj');
	if(_.isEmpty(futureDT2__datalist__pageDataObj) || _.isNil(futureDT2__datalist__pageDataObj)){
		redirectLogin({
			text: "意外被删除，请重新进入下数据列表！",
			url: "dataList.html"
		});
		return false;
	}else{
		var dataCompareData = JSON.parse(futureDT2__datalist__pageDataObj).data;
		store.set('futureDT2__datalist__selectedItem', []);
		var futureDT2__datalist__selectedItem = store.get('futureDT2__datalist__selectedItem');
		if(_.isEmpty(futureDT2__datalist__selectedItem) || _.isNil(futureDT2__datalist__selectedItem)){
			var returndataCompareData = [];
			if(searchVal == null || searchVal == ""){
				returndataCompareData = _.cloneDeep(dataCompareData);
			}else{
				_.forEach(dataCompareData, function(v){
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(searchVal)>-1){
							returndataCompareData.push(v);
							return false;
						}
					});
				});
			}
			if(isGetAllData) return returndataCompareData;
			var filterArray = _.filter(returndataCompareData, function(o) { return o.delete_status.value == "0"; });
			if(isGetFilterAllData) return filterArray;
			var chunkArray = _.chunk(_.reverse(_.sortBy(filterArray, function(o) { return o.test_start_date.value; })), 10);
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageCount = chunkArray.length;
				dataCompareState.pageSearchObj.itemLength = filterArray.length;
				dataCompareState.pageSearchObj.data = _.cloneDeep(chunkArray);
			}else{
				dataCompareState.pageObj.pageCount = chunkArray.length;
				dataCompareState.pageObj.itemLength = filterArray.length;
				dataCompareState.pageObj.data = _.cloneDeep(chunkArray);
			}
			return chunkArray;
		}else{
			var dataCompareDataArr = [];
			_.forEach(futureDT2__datalist__selectedItem, function(v, i){
				if(searchVal == null || searchVal == ""){
					dataCompareDataArr.push(_.find(dataCompareData, function(o){
						return o.wafer_id.value == v;
					}));
				}else{
					var item = _.find(dataCompareData, function(o){
						return o.wafer_id.value == v;
					});
					_.forOwn(item, function(va, ke){
						if(String(va.value).indexOf(searchVal) > -1){
							dataCompareDataArr.push(item);
							return false;
						}
					});
				}
			});
			if(isGetAllData) return dataCompareDataArr;
			var filterArray2 = _.filter(dataCompareDataArr, function(o) { return o.delete_status.value == "0"; });
			if(isGetFilterAllData) return filterArray2;
			var chunkArray2 = _.chunk(_.reverse(_.sortBy(filterArray2, function(o) { return o.test_start_date.value; })), 10);
			if(dataCompareState.searchObj.hasSearch){
				dataCompareState.pageSearchObj.pageCount = chunkArray2.length;
				dataCompareState.pageSearchObj.itemLength = filterArray2.length;
				dataCompareState.pageSearchObj.data = _.cloneDeep(chunkArray2);
			}else{
				dataCompareState.pageObj.pageCount = chunkArray2.length;
				dataCompareState.pageObj.itemLength = filterArray2.length;
				dataCompareState.pageObj.data = _.cloneDeep(chunkArray2);
			}
			return chunkArray2;
		}
	}
}

function dataCompareRenderData(obj){
	if(obj.chunkArr!=undefined){
		var str = '';
		obj.chunkArr[obj.currentPage - 1].map(function(v, i, arr){
			var ii = v.wafer_id.value;
			var iii = (obj.currentPage - 1)*10+(i+1);
			str+='<tr>'+
					'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
					'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
					'<td data-itext="'+v.device_number.value+'">'+v.device_number.value+'</td>'+
					'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
					'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
					'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
					'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
					'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
					'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
				'</tr>';
		});
		$(".home_dataCompare_top tbody").empty().append(str);
		$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
			if(_.indexOf(dataCompareState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
				$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
			}
		});
		if(dataCompareState.searchObj.hasSearch){
			$(".home_dataCompare_top tbody td:not(.not_search)").each(function(){
				var iText = $(this).text();
				var ireplace = "<b style='color:red'>"+dataCompareState.searchObj.searchVal+"</b>";
				var iHtml = iText.replace(new RegExp(dataCompareState.searchObj.searchVal, 'g'), ireplace);
				$(this).empty().html(iHtml);
			});
			$("#checkAll").prop("checked", dataCompareState.pageSearchObj.itemLength == dataCompareState.sellectObj.selectItem.length);
		}else{
			$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
		}
	}
}

function eleResize(){
	var winHeight = $(window).height();
	if(winHeight<600){
		winHeight = 600;
	}
	$("body").height(winHeight);
	$(".g_bodyin_bodyin_bottom").innerHeight(winHeight - 165);
	$(".g_bodyin_bodyin_bottom>.tab-content").innerHeight(winHeight - 165);
	$(".home_dataCompare_top .body_div").innerHeight(winHeight / 2 - 123);
	$(".home_dataCompare_bottom .left_div, .home_dataCompare_bottom .right_div").innerHeight(winHeight / 2 - 88);
	$(".home_dataCompare_bottom .right_div .panel-body").innerHeight(winHeight / 2 - 171);
}

/*page preload*/
eleResize();
$(window).on("resize", function(){
	eleResize();
});

/*page onload*/
$(function(){
	/*判断是否有选中*/
	var dataArr = getdataCompareData(null);
	if(dataArr !== false){
		dataCompareRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});

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
			      	var dataArr = getdataCompareData(dataCompareState.searchObj.searchVal);
			      	dataCompareRenderData({
						chunkArr: dataArr,
						currentPage: dataCompareState.pageObj.currentPage
					});
			    }
		  }
		};
		// 初始化分页器
		dataCompareState.paginationObj.normal = new Pagination(dataCompareState.pageObj.selector, dataCompareState.pageObj.pageOption);
	}
});

/*event handler*/
$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

/* @@主页面 */
/*表格行点击事件*/
$(document).on("mouseover", ".home_dataCompare_top td", function(){
	$(this).addClass("warning").parent().addClass("info");
}).on("mouseout", ".home_dataCompare_top td", function(){
	$(this).removeClass("warning").parent().removeClass("info");
}).on("click", ".home_dataCompare_top td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".home_dataCompare_top tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".home_dataCompare_top tbody [type='checkbox']", function(){
	var ID = $(this).data("ivalue").toString();
	if($(this).prop("checked")){
		dataCompareState.sellectObj.selectItem.push(ID);
		$(".home_dataCompare_bottom tbody>tr [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		$(".home_dataCompare_bottom tbody").append($(this).parent().parent().clone());
		$(".home_dataCompare_bottom tbody tr, .home_dataCompare_bottom tbody td").removeClass("info warning");
	}else{
		_.pull(dataCompareState.sellectObj.selectItem, ID);
		$(".home_dataCompare_bottom tbody [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
	}
	dataCompareState.sellectObj.selectItem = _.uniq(dataCompareState.sellectObj.selectItem);
	$("#checkAll").prop("checked", dataCompareState.pageObj.itemLength == dataCompareState.sellectObj.selectItem.length);
	dataCompareState.sellectObj.selectAll = $("#checkAll").prop("checked");
	if(dataCompareState.sellectObj.selectItem.length == 0){
		$(".home_dataCompare_bottom tbody").css("border-bottom", "0px solid #fff");
	}
});

/*点击选中所有*/
$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".home_dataCompare_top tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		dataCompareState.sellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			dataCompareSwalMixin({
				title: '加载全部数据',
				text: "正在加载中......",
				type: 'info',
				showConfirmButton: false,
				showCancelButton: false
			});
			dataCompareState.sellectObj.selectItem = [];
			var str = '';
			JSON.parse(store.get('futureDT2__datalist__pageDataObj')).data.map(function(v, i, arr){
				if(v.delete_status.value == "0"){
					dataCompareState.sellectObj.selectItem.push(v.wafer_id.value);
				}else{
					return true;
				}
				if(dataCompareState.searchObj.hasSearch){
					_.forOwn(v, function(o){
						if(String(o.value).indexOf(dataCompareState.searchObj.searchVal)>-1){
							var ii = v.wafer_id.value;
							var iii = arr.length - i;
							str = '<tr>'+
									'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
									'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
									'<td data-itext="'+v.device_number.value+'">'+v.device_number.value+'</td>'+
									'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
									'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
									'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
									'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
									'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
									'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
								'</tr>' + str;
							return false;
						}
					});
				}else{
					var ii = v.wafer_id.value;
					var iii = arr.length - i;
					str = '<tr>'+
							'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
							'<td data-itext="第'+ii+'条'+v.product_category.value+'">第'+ii+'条'+v.product_category.value+'</td>'+
							'<td data-itext="'+v.device_number.value+'">'+v.device_number.value+'</td>'+
							'<td data-itext="'+v.lot_number.value+'">'+v.lot_number.value+'</td>'+
							'<td data-itext="'+v.wafer_number.value+'">'+v.wafer_number.value+'</td>'+
							'<td data-itext="'+v.qualified_rate.value+'">'+v.qualified_rate.value+'</td>'+
							'<td data-itext="'+v.test_start_date.value+'">'+v.test_start_date.value+'</td>'+
							'<td data-itext="'+v.archive_user.value+'">'+v.archive_user.value+'</td>'+
							'<td data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
						'</tr>' + str;
				}
			});
			$(".home_dataCompare_bottom tbody").empty().append(str);
			setTimeout(function(){
				swal.clickCancel();
			}, 2000);
		}else{
			dataCompareState.sellectObj.selectItem = [];
			$(".home_dataCompare_bottom tbody").empty();
		}
	}
});

/*搜索*/
$(".home_dataCompare_top .form-control-feedback").click(function(){
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
	var isearch = $("#search_input").val().trim();
	dataCompareState.searchObj.hasSearch = isearch == "" ? false : true;
	dataCompareState.searchObj.searchVal = dataCompareState.searchObj.hasSearch == true ? isearch : null;
	var dataArr = getdataCompareData(isearch);
	if(dataArr !== false){
		dataCompareRenderData({
			chunkArr: dataArr,
			currentPage: 1
		});
	}
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
				console.log(dataCompareState.paginationObj.search);
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
				console.log(dataCompareState.paginationObj.normal);
	          	dataCompareState.paginationObj.normal.options.callback && dataCompareState.paginationObj.normal.options.callback({
	            	curr: dataCompareState.paginationObj.normal.pageNumber,
	            	/*limit: dataCompareState.paginationObj.normal.options.limit,*/
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
				if(result.dismiss == "timer" || result.dismiss === swal.DismissReason.timer){
					window.location.reload();
				}
			});
		}
	}
});
/*翻页跳页end*/

/*共有参数选择*/
$(document).on("click", ".home_dataCompare_bottom .panel-body li", function(){
	$(this).toggleClass("list-group-item-info").children("span").text(["选中", "取消选中"][Number($(this).hasClass("list-group-item-info"))]);
});