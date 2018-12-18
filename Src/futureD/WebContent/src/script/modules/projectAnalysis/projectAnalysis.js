/* variable defined */
var projectAnalysisSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var projectAnalysisState = new Object();
projectAnalysisState.paginationObj = {
	normal: null,
	search: null
};
projectAnalysisState.pageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
projectAnalysisState.pageSearchObj = {
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
	    projectAnalysisState.pageSearchObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	    }
	  }
	},
	currentPage: null,
	pageCount: null,
	itemLength: null,
	data: null,
};
projectAnalysisState.searchObj = {
	hasSearch: false,
	searchVal: null,
	searchItem: []
};
projectAnalysisState.sellectObj = {
	selectAll: false,
	selectItem: [],
	selectSearchItem: []
};


//页面数据
function projectAnalysisRenderData(currentPage){
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
	    	  console.log("data",data);
	    	   var str = "";
	    	   data.waferInfo.map(function(v, i, arr){
		   			var ii = v.wafer_id;
		   			var test_operator = (!v.test_operator ? "" : v.test_operator);
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
		   		$(".g_bodyin_bodyin_body tbody").empty().append(str);
		   		
		   		projectAnalysisState.pageObj.pageCount = data.totalPage;
				projectAnalysisState.pageObj.itemLength = data.totalCount;
				projectAnalysisState.pageObj.data =data.waferInfo;
				
				//console.log("projectAnalysisState.searchObj.hasSearch",projectAnalysisState.searchObj.hasSearch);
				//修改为全选当前页
				console.log("searchVal",projectAnalysisState.sellectObj)	
				if(projectAnalysisState.searchObj.hasSearch){
					projectAnalysisState.searchObj.searchVal = searchVal;
					//console.log("selectSearchItem",projectAnalysisState.sellectObj.selectItem)	
					$(".g_bodyin_body_top  tbody [type='checkbox']").each(function(){
						if(_.indexOf(projectAnalysisState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
							$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
						}
					});
					$(".g_bodyin_body_top  tbody td:not(.not_search)").each(function(){
						var iText = $(this).text();
						var ireplace = "<b style='color:red'>"+projectAnalysisState.searchObj.searchVal+"</b>";
						var iHtml = iText.replace(new RegExp(projectAnalysisState.searchObj.searchVal, 'g'), ireplace);
						$(this).empty().html(iHtml);
					});
					
					$("#checkAll").prop("checked", projectAnalysisState.pageObj.itemLength == projectAnalysisState.sellectObj.selectItem.length);
				}else{
					$(".g_bodyin_body_top  tbody [type='checkbox']").each(function(){
						if(_.indexOf(projectAnalysisState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
							$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
						}
					});
					$("#checkAll").prop("checked", projectAnalysisState.pageObj.itemLength == projectAnalysisState.sellectObj.selectItem.length);
				}
				projectAnalysisState.curPageSelectAll = {};
				for(var pagenum = 0 ;pagenum < data.totalPage ; pagenum++ ){
					projectAnalysisState.curPageSelectAll[pagenum+1] = false
				}
	       },
	       error: function (data, status, e) {
	    	   projectAnalysisSwalMixin({
	    			title: '异常',
	    			text: "服务器繁忙！",
	    			type: 'error',
	    			showConfirmButton: false,
	    			timer: 2000,
	    		})
	       }
	  });  
	
	 
	
}


function SaveSelectedToLocal(){
	var key_id = "eoulu_projectAnalysis_select_id";
	var key_item = "eoulu_projectAnalysis_select_item";
	var v_id = [] ;var v_item = [] ;
	for(var v = 0 ;v < $(".g_bodyin_body_bottom  tbody  tr input[type='checkbox']").length; v++ ){
		v_id.push($(".g_bodyin_body_bottom  tbody  tr input[type='checkbox']").eq(v).data("ivalue"));
		v_item.push($(".g_bodyin_body_bottom  tbody  tr input[type='checkbox']").eq(v).parent().parent().html());
	}
	localStorage.setItem(key_id,v_id.join(","));
	localStorage.setItem(key_item,v_item.join("ee_&oo&_uu"));
}
function GetSelectedFromLocal(){
	var eoulu_projectAnalysis_select_item = localStorage.getItem("eoulu_projectAnalysis_select_item");
	var eoulu_projectAnalysis_select_id = localStorage.getItem("eoulu_projectAnalysis_select_id");
	if(!eoulu_projectAnalysis_select_item || eoulu_projectAnalysis_select_item == "")return;
	var s_item = eoulu_projectAnalysis_select_item.split("ee_&oo&_uu");
	var s_id = eoulu_projectAnalysis_select_id.split(",");
}


function analyzeBtn(){
	if($(".g_body_rr_body_item.active").length){
		$(".g_body_rr_body_btn>input").prop("disabled", false);
	}else{
		$(".g_body_rr_body_btn>input").prop("disabled", true);
	}
}

function bottomTableANDAnalyzeBtn(){
	console.log("len",projectAnalysisState.sellectObj.selectItem.length );
	if(projectAnalysisState.sellectObj.selectItem.length == 0){
		$(".g_bodyin_body_bottom tbody").css("border-bottom", "0px solid #fff");
		$(".g_body_rr_body_btn>input").prop("disabled", true);
	}else{
		analyzeBtn();
	}
}

/*page preload*/
$(".g_info_m_in").hide();
$(".g_bodyin_body_top").innerHeight($(".g_bodyin_body").height()/2);
$(".g_bodyin_body_bottom").innerHeight($(".g_bodyin_body").height()/2 - 10);

/*page onload*/
$(function(){
	$(window).on("resize", function(){
		$(".g_bodyin_body_top").height(($(".g_bodyin_body").height())/2);
		$(".g_bodyin_body_bottom").height(($(".g_bodyin_body").height())/2 - 30);
	});

	$(".breadcrumb li:eq(0) a ").attr("href","./HomeInterface");
	
	/*判断是否有选中*/
		projectAnalysisRenderData(1);

		// 分页元素ID（必填）
		projectAnalysisState.pageObj.selector = '#pagelist';
		// 分页配置
		projectAnalysisState.pageObj.pageOption = {
		  // 每页显示数据条数（必填）
		  limit: 10,
		  // 数据总数（一般通过后端获取，必填）
		  count: projectAnalysisState.pageObj.itemLength,
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
		    	projectAnalysisState.pageObj.currentPage = obj.curr;
		    	// 首次不执行
			    if (!obj.isFirst) {
			      // do something
			      	projectAnalysisRenderData( projectAnalysisState.pageObj.currentPage);
			    }
//			    var allData = getProjectAnalysisData(null, false, true);
//			    if(projectAnalysisState.sellectObj.selectItem.length > projectAnalysisState.pageObj.itemLength){
//			    	$("#checkAll").prop("checked", true);
//			    	allData.map(function(v, i){
//			    		if(v.delete_status.value == "1"){
//			    			var ii = v.wafer_id.value;
//			    			if(_.indexOf(projectAnalysisState.sellectObj.selectItem, ii) > -1){
//			    				_.pull(projectAnalysisState.sellectObj.selectItem, ii.toString());
//			    			}
//			    		}
//			    	});
//			    }else if(projectAnalysisState.sellectObj.selectItem.length == projectAnalysisState.pageObj.itemLength){
//			    	$("#checkAll").prop("checked", true);
//			    }
		  	}
		};
		// 初始化分页器
		projectAnalysisState.paginationObj.normal = new Pagination(projectAnalysisState.pageObj.selector, projectAnalysisState.pageObj.pageOption);

});

/*event handler*/
$(".g_info_m_in .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});

$(".g_info_r>.glyphicon-search").click(function(){
	var g_info_m = $(".g_info_m").innerWidth();
	$(this).css("position", "relative").animate({
		left: -(g_info_m/2+20) + "px"
	}, 500, "swing", function(){
		$(this).fadeOut(200, function(){
			$(".g_info_m_in").fadeIn(200).fadeTo(1, 1);
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
		});
	});
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
//

/*表格行点击事件*/
$(document).on("mouseover", ".g_bodyin_body_top  td", function(){
	$(this).addClass("warning").parent().addClass("info");
}).on("mouseout", ".g_bodyin_body_top  td", function(){
	$(this).removeClass("warning").parent().removeClass("info");
}).on("click", ".g_bodyin_body_top  td", function(){
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
	     		   projectAnalysisSwalMixin({
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
	    	   projectAnalysisSwalMixin({
	    			title: '异常',
	    			text: "服务器繁忙！",
	    			type: 'error',
	    			showConfirmButton: false,
	    			timer: 2000,
	    		})
	       }
	  });
}).on("click", ".g_bodyin_body_top  tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".g_bodyin_body_top  tbody [type='checkbox']", function(){
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
		    	   projectAnalysisSwalMixin({
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
   		    projectAnalysisSwalMixin({
  	    			title: '提示',
  	    			text: "无数据，不能访问",
  	    			type: 'warning',
  	    			showConfirmButton: false,
  	    			timer: 2000,
  	    		});
   		    return false;
   	    }
		projectAnalysisState.sellectObj.selectItem.push(ID);
		if(projectAnalysisState.searchObj.hasSearch) projectAnalysisState.sellectObj.selectSearchItem.push(ID);
		$(".g_bodyin_body_bottom tbody>tr [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		$(".g_bodyin_body_bottom tbody").append($(this).parent().parent().clone());
		$(".g_bodyin_body_bottom tbody tr, .g_bodyin_body_bottom tbody td").removeClass("info warning");
	}else{
		_.pull(projectAnalysisState.sellectObj.selectItem, ID);
		if(projectAnalysisState.searchObj.hasSearch) _.pull(projectAnalysisState.sellectObj.selectSearchItem, ID);
		$(".g_bodyin_body_bottom tbody [type='checkbox'][data-ivalue='"+Number(ID)+"']").parent().parent().remove();
		
		projectAnalysisState.curPageSelectAll[projectAnalysisState.pageObj.currentPage] = false;
	}
	projectAnalysisState.sellectObj.selectItem = _.uniq(projectAnalysisState.sellectObj.selectItem);
	projectAnalysisState.sellectObj.selectSearchItem = _.uniq(projectAnalysisState.sellectObj.selectSearchItem);
	$("#checkAll").prop("checked", $(".g_bodyin_body_top  tbody tr.warning").length == $(".g_bodyin_body_top  tbody tr").length);
	projectAnalysisState.sellectObj.selectAll = $("#checkAll").prop("checked");
	bottomTableANDAnalyzeBtn();
	SaveSelectedToLocal();
});
/*点击选中所有*/
$("#checkAll").on({
	click: function(){
			var check_currentPage = projectAnalysisState.pageObj.currentPage;
			var that = $(this);
			if( !projectAnalysisState.curPageSelectAll[check_currentPage]){
				projectAnalysisState.curPageSelectAll[check_currentPage] = true;
				var check_num = 0 ,errorArr = [];
				$(".g_bodyin_body_top  tbody [type='checkbox']").each(function(){
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
					    		   if(_.indexOf(projectAnalysisState.sellectObj.selectItem, _that.data("ivalue").toString() ) < 0){
					    			   _that.prop("checked", true);
						    		   _that.parent().parent().removeClass("info").addClass("warning");
						    		   check_num++;
						    		   projectAnalysisState.sellectObj.selectItem.push(_that.data("ivalue").toString());
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
										if($(".g_bodyin_body_bottom tbody>tr").length){
											$(".g_bodyin_body_bottom tbody>tr:first").before(str);
										}else{
											$(".g_bodyin_body_bottom tbody").append(str);
										}
					    		   }
					    	   }
					    	   else{
					    		   errorArr.push([check_tr.find(".wafer_number").text(),check_tr.find(".die_type").text()]);
					    	   }
					       },
					       error: function (data, status, e) {
					    	   projectAnalysisSwalMixin({
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
						showConfirmButton: true,
					});
				}
				
				that.prop("checked",check_num == $(".g_bodyin_body_top  tbody tr").length);
			}
			else{
				that.prop("checked",false);
				projectAnalysisState.curPageSelectAll[check_currentPage] = false;
				$(".g_bodyin_body_top  tbody tr.warning").each(function(){	
					if(_.indexOf(projectAnalysisState.sellectObj.selectItem, $(this).find("input[type='checkbox']").data("ivalue").toString()) > -1){
						projectAnalysisState.sellectObj.selectItem.splice(projectAnalysisState.sellectObj.selectItem.indexOf($(this).find("input[type='checkbox']").data("ivalue").toString()), 1);
						$(".g_bodyin_body_bottom tbody>tr  input[data-ivalue ='"+$(this).find("input[type='checkbox']").data("ivalue")+"']").parent().parent().remove();
						$(this).removeClass("warning info").find("input[type='checkbox']").prop("checked", false);
					}
				})
			}
			projectAnalysisState.sellectObj.selectAll = that.prop("checked");
			bottomTableANDAnalyzeBtn();
			SaveSelectedToLocal();
	}
});


/*删除选中*/
$(document).on("click",".g_bodyin_body_bottom  .data_trash",function(){
	var ID = $(this).parent().find("input[type='checkbox']").data("ivalue").toString();
	$(".g_bodyin_body_top tr input[type='checkbox'][data-ivalue='"+ID+"']").prop("checked",false).parent().parent().removeClass("warning");
	_.remove(projectAnalysisState.sellectObj.selectItem, function(n) { return n  == ID ;});
	$("#checkAll").prop("checked",false);
	projectAnalysisState.sellectObj.selectAll = $("#checkAll").prop("checked");
	$(this).parent().remove();
	projectAnalysisState.curPageSelectAll[$(this).data("page")] = false;
	bottomTableANDAnalyzeBtn();
	SaveSelectedToLocal();
})
/*删除全部*/
$(document).on("dblclick",".g_bodyin_body_bottom .g_bodyin_body_bottom_del_all",function(){
	$(".g_bodyin_body_top .warning").removeClass("warning").find("input[type='checkbox']").prop("checked",false);
	projectAnalysisState.sellectObj.selectItem = [];
	$("#checkAll").prop("checked",false);
	projectAnalysisState.sellectObj.selectAll = $("#checkAll").prop("checked");
	$(".g_bodyin_body_bottom tbody").empty();
	
	_.forOwn(projectAnalysisState.curPageSelectAll, function(value, key) {
		projectAnalysisState.curPageSelectAll[key] = false;
	});
	bottomTableANDAnalyzeBtn();
	SaveSelectedToLocal();
})




$("#search_button").on("click", function(){
	/*预处理*/
	$("#checkAll").prop("checked", false);
	projectAnalysisState.sellectObj.selectSearchItem = [];

	var isearch = $("#search_input").val().trim();
	projectAnalysisState.searchObj.hasSearch = isearch == "" ? false : true;
	projectAnalysisState.searchObj.searchVal = projectAnalysisState.searchObj.hasSearch == true ? isearch : null;
	
	projectAnalysisRenderData(1);
	
	if(projectAnalysisState.searchObj.hasSearch){
		projectAnalysisState.pageSearchObj.currentPage = 1;
		projectAnalysisState.pageSearchObj.pageOption.curr = 1;
		projectAnalysisState.pageSearchObj.pageOption.count = projectAnalysisState.pageSearchObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		projectAnalysisState.paginationObj.search = new Pagination(projectAnalysisState.pageSearchObj.selector, projectAnalysisState.pageSearchObj.pageOption);
	}else{
		projectAnalysisState.pageObj.pageOption.curr = 1;
		projectAnalysisState.pageObj.pageOption.count = projectAnalysisState.pageObj.itemLength;
		$("ol#pagelist").remove();
		$("span.futureDT2_page_span").before('<ol class="pagination" id="pagelist"></ol>');
		// 初始化分页器
		projectAnalysisState.paginationObj.normal = new Pagination(projectAnalysisState.pageObj.selector, projectAnalysisState.pageObj.pageOption);
	}
	return false;
});

/*翻页跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});

$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = Number(projectAnalysisState.pageObj.currentPage);
	var pageCounts = Number(projectAnalysisState.pageObj.pageCount);
	if(projectAnalysisState.searchObj.hasSearch){
		currentPage = Number(projectAnalysisState.pageSearchObj.currentPage);
		pageCounts = Number(projectAnalysisState.pageSearchObj.pageCount);
	}
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		if(projectAnalysisState.searchObj.hasSearch){
			projectAnalysisState.pageSearchObj.pageOption.curr = iText;
			projectAnalysisState.paginationObj.search.goPage(iText);
			projectAnalysisState.paginationObj.search.renderPages();
			projectAnalysisState.paginationObj.search.options.curr = iText;
			projectAnalysisRenderData(iText);
		}else{
			projectAnalysisState.pageObj.pageOption.curr = iText;
			projectAnalysisState.paginationObj.normal.goPage(iText);
			projectAnalysisState.paginationObj.normal.renderPages();
			projectAnalysisState.paginationObj.normal.options.curr = iText;
			projectAnalysisRenderData(iText);
		}
	}
});
/*翻页跳页end*/

$(".g_info_r>.glyphicon-user").click(function(){
	window.location.assign("admin.html");
});

$(".g_body_rr_body_item").click(function(){
	if(projectAnalysisState.sellectObj.selectItem.length == 0){
		$(".g_body_rr_body_btn>input").prop("disabled", true);
		return false;
	}
	$(this).toggleClass("active").siblings(".g_body_rr_body_item").removeClass("active");
	$(this).children("span").toggleClass("glyphicon-menu-right glyphicon-menu-down");
	$(this).siblings(".g_body_rr_body_item").children("span").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-right");
	var aa = $(this).hasClass("active") ? $(this).children(".g_body_rr_body_itemin").innerHeight() : 0;
	$(this).innerHeight(50 + aa);
	$(this).siblings(".g_body_rr_body_item").innerHeight(50);
	analyzeBtn();
});

$(".g_body_rr_body_itemin").click(function(e){
	e.stopPropagation();
});

$(".g_body_rr_body_btn>input").click(function(){
	/*var iArr = [];
	$(".g_bodyin_body_bottom tbody tr").each(function(){
		iArr.push($(this).find(".not_search [type='checkbox']").data("ivalue").toString());
	});*/
	var item = {};
//	item.selectedItem = projectAnalysisState.sellectObj.selectItem;
//	item.curveType = $(".g_body_rr_body_item.active").data("icurvetype").toString();
//	store.set("futureDT2__projectAnalysis__selectedObj", item);
	window.location.assign("Analysis");
});

