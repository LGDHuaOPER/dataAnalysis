/*variable defined*/
var dataListSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

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
dataListState.Bar = null;
dataListState.BarOption = {
	color: '#32c462',
	// This has to be the same size as the maximum width to
	// prevent clipping
	strokeWidth: 4,
	// Default: '#eee'
    trailColor: '#ddd',
	trailWidth: 5,
	easing: 'easeInOut',
	/*duration: 10000,*/
	/*fill: 'rgba(0, 255, 0, 0.5)',*/
	text: {
	    autoStyleContainer: false
	},
	from: { color: '#aaa', width: 3 },
	to: { color: '#333', width: 5 },
	// Set default step function for all animate calls
	step: function(state, circle) {
	  	/*state:
	  	{offset: 3.9034286598630388, width: 3.961177297132, color: "rgb(52,52,52)"}*/
	    circle.path.setAttribute('stroke', '#32c462');
	    circle.path.setAttribute('stroke-width', state.width);

	    var value = Math.round(circle.value() * 100);
	    if (value === 0) {
	      circle.setText('');
	    } else {
	      circle.setText(value+"%");
	    }
	}
};
dataListState.hasBuildBar = false;

function additionUpdateIsSubmit(classify){
	if($(".futureDT2_"+classify).find("span.glyphicon-info-sign").length){
		$(".futureDT2_"+classify+"_r_foot>.btn-primary").prop("disabled", true);
	}else{
		$(".futureDT2_"+classify+"_r_foot>.btn-primary").prop("disabled", false);
	}
}

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

function searchMark(isearch){
	if(isearch != ""){
		$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
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
					if(result.dismiss == "timer"){
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
	      	dataListState.hasSearch && searchMark($("#search_input").val().trim());
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

/*搜索*/
$("#search_button").on("click", function(){
	/*e.preventDefault();
	e.stopPropagation();*/
	var isearch = $("#search_input").val().trim();
	dataListState.searchPageObj.searchVal = isearch;
	dataListState.hasSearch = isearch == "" ? false : true;
	searchRenderData(1, isearch);
	new Pagination(dataListState.searchPageObj.selector, dataListState.searchPageObj.pageOption);
	dataListState.sellectObj = {
		selectAll: false,
		selectItem: []
	};
	$("#checkAll").prop("checked", false);
	return false;
});

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

$(".g_bodyin_bodyin_tit_l>span.glyphicon-saved").click(function(){
	if(dataListState.sellectObj.selectItem.length == 0){
		dataListSwalMixin({
			title: '提示',
			text: "未选中数据！将会默认全部数据",
			type: 'info',
			showConfirmButton: false,
			timer: 2000,
		});
		store.remove("futureDT2__datalist__selectedItem");
		return false;
	}
	store.set("futureDT2__datalist__selectedItem", dataListState.sellectObj.selectItem);
	dataListSwalMixin({
		title: '提示',
		text: "已保存选中数据！",
		type: 'success',
		showConfirmButton: false,
		timer: 2000,
	});
});

/*小眼睛详情*/
$(document).on("click", ".g_bodyin_bodyin_body tbody .glyphicon-eye-open", function(e){
	e.stopPropagation();
	dataListSwalMixin({
		title: '提示',
		text: "功能正在开发中！",
		type: 'info',
		showConfirmButton: false,
		timer: 2000,
	});
}).on("click", ".g_bodyin_bodyin_body tbody .glyphicon-edit", function(e){
	e.stopPropagation();
	var iThat = $(this).parent();
	$(".futureDT2_bg_cover, .futureDT2_update").slideDown(200);
	$(".futureDT2_update_l, .futureDT2_update_r").height($(".futureDT2_update").height());
	var product_categoryArr = dataListState.product_categoryArr;
	if(_.isNil(product_categoryArr)){
		product_categoryArr = [];
	}
	$("#futureDT2_update_data_format").val(iThat.siblings(".td_data_format").data("ivalue"));
	$("#futureDT2_update_product_category").val(iThat.siblings(".td_product_category").data("ivalue"));
	$("#futureDT2_update_td_description").val(iThat.siblings(".td_description").data("ivalue"));
	dataListState.cache.futureDT2_update_td_description = iThat.siblings(".td_description").data("ivalue").toString();
	$("#futureDT2_update_product_category").each(function(i, el){
		new Awesomplete(el, {
			list: product_categoryArr,
			minChars: 1,
			maxItems: 13,
			autoFirst: true
		});
	});
});

$(".g_bodyin_bodyin_tit_l>.glyphicon-remove-circle").click(function(){
	$(".futureDT2_bg_cover, .futureDT2_addition").slideDown(200);
	$(".futureDT2_addition_l, .futureDT2_addition_r").height($(".futureDT2_addition").height());
});

$(".futureDT2_addition_r_foot .btn-warning, .futureDT2_update_r_foot .btn-warning").click(function(){
	var $iparent = $(this).parents("[data-iparent]");
	$(".futureDT2_bg_cover").slideUp(200);
	$iparent.slideUp(200);
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

/*验证*/
$(".isRequired").on("input propertychange change", function(){
	var iVal = $(this).val();
	var str;
	var classify = $(this).parents("[data-iparent]").data("iparent");
	if(_.isNil(iVal)){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
	}else{
		if(iVal.trim() == ""){
			str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		}else{
			str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		}
	}
	$(this).parents("div.row").find("div.info_div").empty().append(str);
	additionUpdateIsSubmit(classify);
});

$("#futureDT2_update_td_description").on("input propertychange change", function(){
	var iVal = $(this).val();
	if(dataListState.cache.futureDT2_update_td_description != iVal){
		additionUpdateIsSubmit("update");
	}
});

/*添加上传*/
$(".row_extra3 .well .glyphicon-plus-sign").click(function(){
	$("#add_file_Upload").val("");
	$(this).next().trigger("click");
});

$("#add_file_Upload").on("change", function(){
	/*console.log($(this));
	console.log($(this)[0]);
	console.log($(this)[0].files);
	console.log($(this)[0].files[0]);*/
	if(dataListState.hasBuildBar){
		dataListState.Bar.destroy();
	}
	var size = $(this)[0].files[0].size;
	var name = $(this)[0].files[0].name;
	$(".upload_l_tit").text($(this)[0].files[0].name);
	$(".upload_l_body").text("大小："+eouluGlobal.S_getFileSize(size));
	dataListState.Bar = new ProgressBar.Circle("#upload_container", dataListState.BarOption);
	dataListState.Bar.text.style.fontFamily = '"microsoft yahei", "Arial", sans-serif';
	dataListState.Bar.text.style.fontSize = '2rem';
	// Number from 0.0 to 1.0
	dataListState.Bar.animate(1.0, {
		duration: 10000
	}, function(){
		dataListSwalMixin({
			title: '上传成功！',
			text: name+" 已经上传至服务器",
			type: 'success',
			showConfirmButton: false,
			timer: 2500,
		});
	});
	/*dataListState.Bar.animate(0.4, {
	    duration: 800
	}, function() {
	    console.log('Animation has finished');
	});*/
	/*set(progress)*/
	dataListState.hasBuildBar = true;
});

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
		if(dataListState.hasSearch){
			dataListState.searchPageObj.pageOption.curr = iText;
			searchRenderData(iText, dataListState.searchPageObj.searchVal);
			new Pagination(dataListState.searchPageObj.selector, dataListState.searchPageObj.pageOption);
		}else{
			dataListState.pageObj.pageOption.curr = iText;
			renderData(iText, "onload", {});
			new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
		}
	}
});

/*重置*/
$(".g_bodyin_bodyin_tit_l .glyphicon-refresh").click(function(){
	renderData(1, "onload", {refreshMock: true});
	dataListState.sellectObj.selectAll = false;
	$("#checkAll").prop("checked", false);
	dataListState.sellectObj.selectItem = [];
	dataListState.hasSearch = false;
	$("#search_input").val("");
	dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
	dataListState.pageObj.pageOption.curr = 1;
	new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
});

$(".g_bodyin_bodyin_tit_l .glyphicon-remove").click(function(){
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
	  		var futuredDatalistChunkArray = _.chunk(_.reverse(_.sortBy(futuredDatalistFilterArr, function(o) { return o.test_start_date.value; })), 10);
	  		dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
	  		dataListState.pageObj.itemLength = futuredDatalistFilterArr.length;
	  		dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
	  		dataListState.pageObj.pageOption.curr = iText;
	  		dataListState.sellectObj.selectItem = [];
	  		if(dataListState.sellectObj.selectAll){
	  			$("#checkAll").prop("checked", false);
	  			dataListState.sellectObj.selectAll = false;
	  		}
	  		return futuredDatalistChunkArray;
	  	}});
	  	new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
	  	dataListState.hasSearch && searchMark($("#search_input").val().trim());
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

/*删除*/
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
	  	// {value: true}
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
	  		var futuredDatalistChunkArray = _.chunk(_.reverse(_.sortBy(futuredDatalistFilterArr, function(o) { return o.test_start_date.value; })), 10);
	  		dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
	  		dataListState.pageObj.itemLength = futuredDatalistFilterArr.length;
	  		dataListState.pageObj.pageOption.count = dataListState.pageObj.itemLength;
	  		dataListState.pageObj.pageOption.curr = iText;
	  		_.pull(dataListState.sellectObj.selectItem, ID);
	  		return futuredDatalistChunkArray;
	  	}}, true);
	  	new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
	  	dataListState.hasSearch && searchMark($("#search_input").val().trim());
	    swalWithBootstrapButtons({
	    	title: '删除成功！',
	    	text: "被选中的记录已经放入回收站",
	    	type: 'success',
	    	showConfirmButton: false,
	    	timer: 1800,
	    });
	  } else if (
	    // Read more about handling dismissals
	    // {dismiss: "overlay"}
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