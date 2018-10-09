/*variable defined*/
var dataListState = new Object();
dataListState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null
};
dataListState.hasSearch = false;

/*page onload*/
$(function(){
	var futuredDatalist = store.get('futuredDatalist');
	var futuredDatalistArr;
	if(futuredDatalist == undefined){
		var iArr = futuredGlobal.S_getDataList();
		var item = {};
		item.data = _.cloneDeep(iArr);
		item.expires = Date.now() + 1*60*1000;
		futuredDatalistArr = _.cloneDeep(iArr);
		store.set('futuredDatalist', JSON.stringify(item));
	}else{
		futuredDatalistArr = JSON.parse(futuredDatalist).data;
	}

	var futuredDatalistArray = [];
	_.times(33, function(){
		futuredDatalistArray.push(futuredDatalistArr[0]);
	});

	var futuredDatalistChunkArray = _.chunk(futuredDatalistArray, 10);
	dataListState.pageObj.pageCount = futuredDatalistChunkArray.length;
	function renderData(currentPage){
		var iArr = futuredDatalistChunkArray[currentPage-1];
		if(iArr!=undefined){
			var str = '';
			iArr.map(function(v, i, arr){
				var ii = (currentPage-1)*10+i+1;
				str+='<tr>'+
						'<td class="not_search"><input type="checkbox" data-ivalue="'+ii+'"></td>'+
						'<td>第'+ii+'条'+v.product_category.value+'</td>'+
						'<td>'+v.lot_number.value+'</td>'+
						'<td>'+v.wafer_number.value+'</td>'+
						'<td>'+v.qualified_rate.value+'</td>'+
						'<td>'+v.test_start_date.value+'</td>'+
						'<td>'+v.archive_user.value+'</td>'+
						'<td>'+v.description.value+'</td>'+
						'<td class="not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></td>'+
					'</tr>';
			});
			$(".g_bodyin_bodyin_body tbody").empty().append(str);
		}
	}

	renderData(1);

	// 分页元素ID（必填）
	dataListState.pageObj.selector = '#pagelist';
	// 分页配置
	dataListState.pageObj.pageOption = {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: futuredDatalistArray.length,
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
	      	renderData(obj.curr);
	      	dataListState.hasSearch && ($("#search_button").trigger("click"));
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
		if(currentPage == iText || currentPage <= 0 || currentPage>pageCounts){
		    $("#jumpText").val('');
		    return;
		}else{
		    dataListState.pageObj.pageOption.curr = iText;
		    renderData(iText);
		    dataListState.hasSearch && ($("#search_button").trigger("click"));
		    new Pagination(dataListState.pageObj.selector, dataListState.pageObj.pageOption);
		}
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
	$("#checkAll").prop("checked", ($(".g_bodyin_bodyin_body tbody [type='checkbox']").filter(":checked").length == $(".g_bodyin_bodyin_body tbody [type='checkbox']").length));
});

$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
	}
});

$("#search_button").on("click", function(){
	var isearch = $("#search_input").val().trim();
	$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
		var iText = $(this).text();
		var ireplace = "<b style='color:red'>"+isearch+"</b>";
		var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
		$(this).empty().html(iHtml);
	});
	dataListState.hasSearch = true;
	return false;
});