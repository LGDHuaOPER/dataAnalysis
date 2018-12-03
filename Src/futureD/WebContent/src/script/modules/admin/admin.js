/*variable defined*/
var adminSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var adminState = new Object();
adminState.staffUpdateUser = "";
adminState.staffAuthorityUser = "";
adminState.adminRoleMap = {
	"成员": "1",
	"管理员": "2",
	"超级管理员": "3"
};
adminState.staffPageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: 1,
};
adminState.staffHasSearch = false;
adminState.staffSellectObj = {
	selectAll: false,
	selectItem: []
};
adminState.operatePageObj = {
	selector: null,
	pageOption: null,
	currentPage: null,
	pageCount: null,
	itemLength: 1,
};
adminState.operateHasSearch = false;
adminState.operateSellectObj = {
	selectAll: false,
	selectItem: []
};
adminState.hasRequestData = false;
adminState.operateChunkArr = [];
adminState.authorityRender = false;


function staffSubmitBtn(That, classify){
	if($(".staff_"+classify+"_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length == 0){
		$(".staff_"+classify+"_r_foot>.btn-primary").prop("disabled", false);
	}else if($(".staff_"+classify+"_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length == 1){
		if(That.parent().next().children(".glyphicon-info-sign").length){
			$(".staff_"+classify+"_r_foot>.btn-primary").prop("disabled", false);
		}else{
			$(".staff_"+classify+"_r_foot>.btn-primary").prop("disabled", true);
		}
	}else{
		$(".staff_"+classify+"_r_foot>.btn-primary").prop("disabled", true);
	}
}

function adminRender(cur, signalDelete){
	adminState.staffPageObj.currentPage = cur;
	adminState.staffPageObj.currentPage = 0;
	adminState.staffPageObj.pageCount = 0;
	adminState.staffPageObj.itemLength = 0;
	var ajaxData ;
	var isserch = $("#search_input").val().trim();
	if(isserch != ""){
		ajaxData = {
    	   currentPage : cur,
    	   keyword : isserch
		}
	}
	else{
		ajaxData = {
    	   currentPage : cur,
		}
	}
	   $.ajax({
	       url: 'UserManager', 
	       type: 'get',
	       dataType: 'json', 
	       data: ajaxData,
	       async : false,
	       success: function (data){
	    	   console.log("data",data);
	    	   $("body").attr("currentRole",data.currentRole);
	    	   var str  ="";
	    	   _.forEach(data.userList, function(v, i, arr){
	    			var iRole = adminState.adminRoleMap[v.role_name];
	    			  str+='<tr class="tr_admin">'+
	    					'<td class="not_search"><input type="checkbox" data-ivalue="'+v.user_id+'" data-iname="'+v.user_name+'" class="user_id" ></td>'+
	    					'<td data-itext="'+((cur-1)*10+i+1)+'">'+((cur-1)*10+i+1)+'</td>'+
	    					'<td class="td__user_name showField" title="'+v.user_name+'" data-iuserId="'+v.user_id+'" data-itext="'+v.user_name+'" data-ivalue="'+v.user_name+'">'+v.user_name+'</td>'+
	    					'<td class="td__sex" title="'+v.sex+'" data-itext="'+v.sex+'" data-ivalue="'+v.sex+'">'+v.sex+'</td>'+
	    					'<td class="td__telephone showField" title="'+v.telephone+'" data-itext="'+v.telephone+'" data-ivalue="'+v.telephone+'">'+v.telephone+'</td>'+
	    					'<td class="td__email showField" title="'+v.email+'" data-itext="'+v.email+'" data-ivalue="'+v.email+'">'+v.email+'</td>'+
	    					'<td class="td__role_id" data-ivalue="'+iRole+'" title="'+v.role_name+'" data-itext="'+v.role_name+'">'+v.role_name+'</td>'+
	    					/*'<td class="td__password not_search" data-ivalue="'+v.password+'">'+v.password+'</td>'+
	    					'<td class="td__authority not_search" data-ivalue="'+v.authority+'"></td>'+*/
	    					'<td class="td__operate not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" title="修改" data-ivalue="'+v.user_id+'" data-iname="'+v.user_name+'"></span><span class="glyphicon glyphicon-user" aria-hidden="true" title="授权" data-ivalue="'+v.user_id+'" data-iname="'+v.user_name+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" title="删除" data-ivalue="'+v.user_id+'" data-iname="'+v.user_name+'"></span></td>'+
	    				'</tr>';
	    		});

	    		$(".staffManage_body tbody").empty().append(str);
	    		
	    		if(isserch != ""){
	    			if( $(".staffManage_body tbody .tr_admin").length >= 1){
	    				var reg = new RegExp("(" + isserch + ")", "g");
	    				for(var i = 0 ; i < $(".staffManage_body tbody .tr_admin").length ; i++){
	    					for(var j = 0 ; j <  $(".staffManage_body tbody .tr_admin").eq(i).find(".showField").length ; j++){
	    						var str = $(".staffManage_body tbody .tr_admin").eq(i).find(".showField").eq(j).text();
	    						var newstr = str.replace(reg, "<font color=red>$1</font>");
	    						 $(".staffManage_body tbody .tr_admin").eq(i).find(".showField").eq(j).text("").html(newstr);
	    					}
	    					
	    				}
	    			}
	    		}
	    		adminState.staffPageObj.pageCount = data.userList.length;
	    		adminState.staffPageObj.itemLength = data.totalCount;
	       },
	       error: function (data, status, e) {
				
	       }
	   }); 
	
	if(signalDelete == true){
		_.forEach(adminState.staffSellectObj.selectItem, function(val){
			$(".staffManage_body tbody .td__user_name[title='"+String(val)+"']").siblings("td:eq(0)").children("input").prop("checked", true).parent().parent().addClass("warning").removeClass("info");
		});
		$("#checkAll").prop("checked", adminState.staffPageObj.itemLength == adminState.staffSellectObj.selectItem.length);
		adminState.staffSellectObj.selectAll = $("#checkAll").prop("checked");
	}
}

function operateRendaer(cur){
	var keyword = $("#search_input2").val().trim();
	if(keyword == ""){
		var ajax_data = { currentPage : cur }
	}
	else{
		var ajax_data = { currentPage : cur ,keyword : keyword }
	}
	adminState.operateHasSearch = false;
	$.ajax({
	       url: 'LogInfo', 
	       type: 'GET',
	       dataType: 'json', 
	       data: ajax_data,
	       async : false,
	       success: function (data) {
	       		console.log("data",data);
		       	adminState.operateChunkArr = data.logList;
	  			adminState.operatePageObj.pageCount = data.totalPage;
	  			adminState.operatePageObj.itemLength = data.totalPage *10;  //总数据条数
	  			var cur = data.currentPage;
	  			adminState.operatePageObj.currentPage = cur;
	  			
	  			var iArr = data.logList;
	  			var str = '';
	  			_.forEach(iArr, function(v, i, arr){
	  				str+='<tr class="tr_operate">'+
  						'<td class="not_search"><input type="checkbox" data-ivalue="'+v.log_id+'"></td>'+
  						'<td data-itext="'+((cur-1)*10+i+1)+'">'+((cur-1)*10+i+1)+'</td>'+
  						'<td title="'+v.user_name+'" data-itext="'+v.user_name+'" class="showField td_user_name">'+v.user_name+'</td>'+
  						'<td title="'+v.page+'" data-itext="'+v.page+'"  class="showField">'+v.page+'</td>'+
  						'<td title="'+v.description+'" data-itext="'+v.description+'" class="showField">'+v.description+'</td>'+
  						'<td title="'+v.operate_date+" "+v.operate_time+'" data-itext="'+v.operate_date+" "+v.operate_time+'" class="showField">'+v.operate_date+" "+v.operate_time+'</td>'+
  						'<td title="'+v.ip_address+'" data-itext="'+v.ip_address+'"  >'+v.ip_address+'</td>'+
  						'<td title="'+v.location+'" data-itext="'+v.location+'"  class="showField">'+v.location+'</td>'+
  					'</tr>';
	  			});
	  			$(".operaDailyLog_body tbody").empty().append(str);
	  			
	  			if(keyword != ""){
	  				adminState.operateHasSearch = true;
	    			if( $(".operaDailyLog_body tbody .tr_operate").length >= 1){
	    				var reg = new RegExp("(" + keyword + ")", "g");
	    				for(var i = 0 ; i < $(".operaDailyLog_body tbody .tr_operate").length ; i++){
	    					for(var j = 0 ; j < $(".operaDailyLog_body tbody .tr_operate").eq(i).find(".showField").length ; j++){
	    						var str = $(".operaDailyLog_body tbody .tr_operate").eq(i).find(".showField").eq(j).text();
	    						var newstr = str.replace(reg, "<font color=red>$1</font>");
	    						$(".operaDailyLog_body tbody .tr_operate").eq(i).find(".showField").eq(j).text("").html(newstr);
	    					}
	    				}
	    			}
	    		}
	  			adminState.operatePageObj.pageCount = data.logList.length;
	    		adminState.operatePageObj.itemLength = data.totalCount;
	    		
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
  				title: '异常',
  				text: "服务器繁忙！",
  				type: 'error',
  				showConfirmButton: false,
  				timer: 2000,
  			});
	       }
	   }); 
	
	
}

/*page onload*/
$(function(){
	$(".breadcrumb li:eq(0) a ").attr("href","./HomeInterface");
	
	adminRender(1, false);
	// 分页元素ID（必填）
	adminState.staffPageObj.selector = '#pagelist';
	// 分页配置
	adminState.staffPageObj.pageOption = {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: adminState.staffPageObj.itemLength,
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
	    adminState.staffPageObj.currentPage = obj.curr;
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	adminRender(obj.curr, false);
	      	adminState.staffHasSearch && ($("#search_button").trigger("click"));
	      	$(".staffManage_body tbody .td__user_name").each(function(){
	      		if(_.indexOf(adminState.staffSellectObj.selectItem, $(this).attr("title").toString()) > -1){
	      			$(this).siblings("td:eq(0)").children("input").prop("checked", true).parent().parent().addClass("warning").removeClass("info");
	      		}
	      	});
	      	adminState.staffPageObj.currentPage = obj.curr;
	       //跳页判断全选按钮是否选中  
		   var checked_length = $(".staffManage_body .tr_admin input[type=checkbox]:checked").length;
		   var all_tr_length =  $(".staffManage_body .tr_admin .td__role_id[data-ivalue!=3]").length;
		   if(checked_length == all_tr_length){
			   $("#checkAll").prop("checked", true);
		   }
		   else{
			 $("#checkAll").prop("checked", false);
		   }
		   adminState.staffSellectObj.selectAll = $("#checkAll").prop("checked");
	      	
	    }
	  }
	};
	// 初始化分页器
	new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);

	$("#jumpText").on("input propertychange", function(){
		$(this).val($(this).val().replace(/[^\d]/g,''));
	});

	$("#jumpPage").on("click", function(){
		var iText = Number($("#jumpText").val());
		var currentPage = Number(adminState.staffPageObj.currentPage);
		var pageCounts = Number(adminState.staffPageObj.pageCount);
		if(currentPage == iText || iText <= 0 || iText>pageCounts){
		    $("#jumpText").val('');
		    return;
		}else{
		    adminState.staffPageObj.pageOption.curr = iText;
		    new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
		    adminRender(iText, false);
		    adminState.staffHasSearch && ($("#search_button").trigger("click"));
		}
	});
	//$(document).on("click","#pagelist ")
	

	/*批量删除*/
	$(".staffManage_tit_l .glyphicon-trash").click(function(){
		console.log("adminState",adminState);
		if(adminState.staffSellectObj.selectItem.length == 0){
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

		adminSwalMixin({
		 	title: '确定删除吗？',
		 	text: "删除后该用户不再存在！",
		 	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: '确定，删除！',
		  	cancelButtonText: '不，取消！',
		  	reverseButtons: false
		}).then(function(result) {
		  if (result.value) {
		  	var IDArr = adminState.staffSellectObj.selectItem; 
		  	var userId='';
		  	for(var i = 0 ; i < IDArr.length; i++){
		  		i == (IDArr.length-1) ? userId += ($(".staffManage_body .tr_admin td[data-itext='"+IDArr[i]+"']").data("iuserid")) : userId += ($(".staffManage_body .tr_admin td[data-itext='"+IDArr[i]+"']").data("iuserid")) +",";
		  	}
		  	$.ajax({
			       url: 'UserRemove', 
			       type: 'POST',
			       data: {
			    	   userId : userId ,
			       },
			       dataType: 'json', 
			       success: function (data) {
			    	   if(data == true){
			    		   var iText = 1;
				   		  	if(adminState.staffSellectObj.selectAll){
				   		  		iText = 0;
				   		  	}
				   		  	adminRender(iText, false);
				   		  	adminState.staffHasSearch && ($("#search_button").trigger("click"));
				   		  	adminState.staffPageObj.pageOption.count = adminState.staffPageObj.itemLength;
				   		  	adminState.staffPageObj.pageOption.curr = iText;
				   		  	new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
				   		  	adminState.staffSellectObj.selectItem = [];
				   		  	if(adminState.staffSellectObj.selectAll){
				   		  		$("#checkAll").prop("checked", false);
				   		  		adminState.staffSellectObj.selectAll = false;
				   		  	}
				   		  	adminSwalMixin({
						    	title: '删除成功！',
						    	text: "被选中的记录已经删除",
						    	type: 'success',
						    	showConfirmButton: false,
						    	timer: 1800,
						    });
			    	   }
			       },
			       error: function (data, status, e) {
			    	   adminSwalMixin({
			   				title: '异常',
			   				text: "服务器繁忙！",
			   				type: 'error',
			   				showConfirmButton: false,
			   				timer: 2000,
			   			});
			       }
			   });  
		    
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		    adminSwalMixin({
		    	title: '取消了！',
		    	text: "不作处理",
		    	type: 'error',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  }
		});
	});

	$(document).on("click", ".staffManage_body tbody td.not_search .glyphicon.glyphicon-trash", function(e){
		e.stopPropagation();
		 console.log("pageOption",adminState.staffPageObj);
		var iThat = $(this);
		if(iThat.parent().siblings(".td__role_id").data("ivalue") == 3){
			adminSwalMixin({
				title: '',
				text: "超级管理员不能被删除",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			return false;
		}
		if(iThat.parent().siblings(".td__role_id").data("ivalue") > adminState.adminRoleMap[$("body").attr("currentRole")]){
			adminSwalMixin({
				title: '',
				text: "权限不足，您删除不了角色等级大于您的用户",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			return false;
		}
		
		adminSwalMixin({
		  title: '确定删除吗？',
		  text: "删除后该用户不再存在，点击刷新按钮可以重置数据！",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: '确定，删除！',
		  cancelButtonText: '不，取消！',
		  reverseButtons: false
		}).then(function(result) {
		  if (result.value) {
			  var userId = 	iThat.parent().parent().find(".user_id").data("ivalue");
			  $.ajax({
			       url: 'UserRemove', 
			       type: 'POST',
			       data: {
			    	   userId : userId ,
			       },
			       dataType: 'json', 
			       success: function (data) {
			    	   if(data == true){
			    		    var iText;
				   		  	if(adminState.staffPageObj.currentPage < adminState.staffPageObj.pageCount){
				   		  		iText = adminState.staffPageObj.currentPage;
				   		  	}else if(adminState.staffPageObj.itemLength%10 != 1){
				   		  		iText = adminState.staffPageObj.currentPage;
				   		  	}else{
				   		  		iText = adminState.staffPageObj.currentPage - 1;
				   		  	}
				   		  	var ID = iThat.data("iname").toString();
				   		  	adminRender(iText, false, true);
				   		  	adminState.staffHasSearch && ($("#search_button").trigger("click"));
				   		  	adminState.staffPageObj.pageOption.count = adminState.staffPageObj.itemLength;
				   		  	adminState.staffPageObj.pageOption.curr = iText;
				   		  	new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
				   		  	_.pull(adminState.staffSellectObj.selectItem, ID);
				   		  	
				   		    adminSwalMixin({
				   		    	title: '删除成功！',
				   		    	text: "被选中的记录已经删除",
				   		    	type: 'success',
				   		    	showConfirmButton: false,
				   		    	timer: 1800,
				   		    });
			    	   }
			       },
			       error: function (data, status, e) {
			    	   adminSwalMixin({
			   				title: '异常',
			   				text: "服务器繁忙！",
			   				type: 'error',
			   				showConfirmButton: false,
			   				timer: 2000,
			   			});
			       }
			   });  
			  
		  } else if (
		    // Read more about handling dismissals
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		    adminSwalMixin({
		    	title: '取消了！',
		    	text: "不作处理",
		    	type: 'error',
		    	showConfirmButton: false,
		    	timer: 1800,
		    });
		  }
		});
	});

	/*修改*/
	$(document).on("click", ".staffManage_body tbody td.not_search .glyphicon.glyphicon-edit", function(e){
		e.stopPropagation();
		var iThat = $(this);
		var iTd = iThat.parent();
		if(iThat.parent().siblings(".td__role_id").data("ivalue") == 3){
			$(".staff_update #staff_update_role_id option[value='3']").prop({
				"selected": true,
				"disabled": false
			}).parent().attr("readonly", "readonly").prop("disabled", true);
			//$(".staff_update_r_foot>.btn-primary").prop("disabled", true);
		}else{
			$(".staff_update #staff_update_role_id option[value='请选择用户角色']").prop({
				"selected": true
			}).parent().removeAttr("readonly").prop("disabled", false);
			$(".staff_update #staff_update_role_id option[value='3']").prop("disabled", true);
			//$(".staff_update_r_foot>.btn-primary").prop("disabled", false);
		}
		
		$(".staff_update_r_bodyin #staff_update_user_name").attr("userId",iTd.parent().find(".not_search").eq(0).find("input").data("ivalue"));
		
		$("[id^='staff_update_']").each(function(){
			if($(this).is("#staff_update_password2")){
				return true;
			}
			var subClassName = $(this).attr("id").replace("staff_update_", "td__");
			var iVal = iTd.siblings("."+subClassName).data("ivalue");
			if(_.isNil(iVal)){
				iVal = "";
			}
			$(this).val(iVal.toString());
			if($(this).is("#staff_update_user_name")){
				adminState.staffUpdateUser = iVal.toString();
			}
		});
		
		$(".futureDT2_bg_cover, .staff_update").slideDown(250);
		$(".staff_update_l, .staff_update_r").height($(".staff_update").height());
		
	});

	$(".staff_update_r_foot .btn-warning").click(function(){
		$(".futureDT2_bg_cover, .staff_update").slideUp(250);
		adminState.staffUpdateUser = "";
	});

});

/*event handler*/
$(document).on("mouseover", ".staffManage_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
}).on("mouseout", ".staffManage_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
}).on("click", ".staffManage_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".staffManage_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	if($(this).parent().parent().find(".td__role_id").data("ivalue") == 3){ return false};
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".staffManage_body tbody [type='checkbox']", function(){
	var iname = $(this).data("iname").toString();
	$(this).prop("checked") ? adminState.staffSellectObj.selectItem.push(iname) : _.pull(adminState.staffSellectObj.selectItem, iname);
	adminState.staffSellectObj.selectItem = _.uniq(adminState.staffSellectObj.selectItem);
	$("#checkAll").prop("checked", adminState.staffPageObj.itemLength == adminState.staffSellectObj.selectItem.length);
	adminState.staffSellectObj.selectAll = $("#checkAll").prop("checked");
});

$("#checkAll").on({
	click: function(){
		var that = $(this);
		$(".staffManage_body tbody [type='checkbox']").each(function(){
			if($(this).parent().parent().find(".td__role_id").data("ivalue") == 3){ return true};
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		adminState.staffSellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			adminState.staffSellectObj.selectItem = [];
			for(var i = 0 ; i < $(".tr_admin").length ; i++){
				if($(".tr_admin").eq(i).find("input[type='checkbox']").is(':checked')){
					adminState.staffSellectObj.selectItem.push($(".tr_admin").eq(i).find(".td__user_name").attr("title").toString());
				}
			}
		}else{
			adminState.staffSellectObj.selectItem = [];
		}
	}
});

//搜索组件开始
$(".staffManage_tit_r_in .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});

$("#search_button").on("click", function(){
	adminRender(1, false);
	adminState.staffPageObj.pageOption.count = adminState.staffPageObj.itemLength;
	new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
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
/*搜索组件结束*/

/*添加用户*/
$(".staffManage_tit_l>.glyphicon-remove-circle").click(function(){
	$(".futureDT2_bg_cover, .staff_addition").slideDown(250);
	$(".staff_addition_l, .staff_addition_r").height($(".staff_addition").height());
});

$(".staff_addition_r_foot .btn-warning").click(function(){
	$(".futureDT2_bg_cover, .staff_addition").slideUp(250);
});

$(".isRequired").on("input propertychange change", function(){
	var str;
	var That = $(this);
	var iclassify;
	if($(this).parents(".staff_addition").length){
		iclassify = "addition";
	}else if($(this).parents(".staff_update").length){
		iclassify = "update";
	}
	if($(this).val().trim() === "" || $(this).val() == null){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_"+iclassify+"_r_foot>.btn-primary").prop("disabled", true);
	}else{
		if($(this).is("#staff_"+iclassify+"_password2")){
			if($("#staff_"+iclassify+"_password").val() != $("#staff_"+iclassify+"_password2").val()){
				str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> 两次输入不一致';
				$(".staff_"+iclassify+"_r_foot>.btn-primary").prop("disabled", true);
			}else{
				str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
				staffSubmitBtn(That, iclassify);
			}
		}else{
			str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
			staffSubmitBtn(That, iclassify);
		}
	}
	$(this).parent().next().empty().append(str);
});

$("#staff_addition_telephone, #staff_update_telephone").on("input propertychange change", function(){
	var iclassify;
	if($(this).parents(".staff_addition").length){
		iclassify = "addition";
	}else if($(this).parents(".staff_update").length){
		iclassify = "update";
	}
	if($(this).val() == ""){
		var iThat = $(this);
		staffSubmitBtn(iThat, iclassify);
		$(this).parent().next().empty();
		return false;
	}
	var str;
	var iReg1 = new RegExp(eouluGlobal.S_getRegExpList("mobile").newRegExp);
	var iReg2 = new RegExp(eouluGlobal.S_getRegExpList("telephone").newRegExp);
	if(iReg1.test($(this).val()) || iReg2.test($(this).val())){
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		var That = $(this);
		staffSubmitBtn(That, iclassify);
	}else{
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_"+iclassify+"_r_foot>.btn-primary").prop("disabled", true);
	}
	$(this).parent().next().empty().append(str);
});

$("#staff_addition_email, #staff_update_email").on("input propertychange change", function(){
	var iclassify;
	if($(this).parents(".staff_addition").length){
		iclassify = "addition";
	}else if($(this).parents(".staff_update").length){
		iclassify = "update";
	}
	if($(this).val() == ""){
		var iThat = $(this);
		staffSubmitBtn(iThat, iclassify);
		$(this).parent().next().empty();
		return false;
	}
	var str;
	var iReg = new RegExp(eouluGlobal.S_getRegExpList("email").newRegExp);
	if(iReg.test($(this).val())){
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		var That = $(this);
		staffSubmitBtn(That, iclassify);
	}else{
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_"+iclassify+"_r_foot>.btn-primary").prop("disabled", true);
	}
	$(this).parent().next().empty().append(str);
});

// gaixia
$("#staff_addition_user_name").on("blur", function(){
	var newUser = $("#staff_addition_user_name").val().trim();
	var str;
	if(newUser == ""){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
		$(this).parent().next().empty().append(str);
		return false;
	}
	$.ajax({
       url: 'UserNameQuery', 
       type: 'get',
       data: {
    	   userName : newUser ,
       },
       dataType: 'json', 
       success: function (data) {
    	   if(data == ""){
    		   str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
    		   staffSubmitBtn($(this), "addition");
    	   }
    	   else{
    		   str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>';
    		   $(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
    	   }
    	   $("#staff_addition_user_name").parent().next().empty().append(str);
       },
       error: function (data, status, e) {
    	   adminSwalMixin({
   				title: '异常',
   				text: "服务器繁忙！",
   				type: 'error',
   				showConfirmButton: false,
   				timer: 2000,
   			});
       }
   });  
});

$("#staff_update_user_name").on("blur", function(){
	var str;
	var newUser = $(this).val().trim();
	if(newUser == ""){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_update_r_foot>.btn-primary").prop("disabled", true);
		$(this).parent().next().empty().append(str);
		return false;
	}
	$.ajax({
	       url: 'UserNameQuery', 
	       type: 'get',
	       data: {
	    	   userName : newUser ,
	       },
	       dataType: 'json', 
	       success: function (data) {
	    	   console.log("data",data);
	    	   if(data == ""){
	    		   str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
	    		   staffSubmitBtn($(this), "update");
	    	   }
	    	   else{
	    		   str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>';
	    		   $(".staff_update_r_foot>.btn-primary").prop("disabled", true);
	    	   }
	    	   $("#staff_update_user_name").parent().next().empty().append(str);
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
	   				title: '异常',
	   				text: "服务器繁忙！",
	   				type: 'error',
	   				showConfirmButton: false,
	   				timer: 2000,
	   			});
	       }
	   });  
	
});

$(".row .has-feedback .form-control-feedback").click(function(){
	if($(this).is(".glyphicon-eye-open")){
		$(this).prev().attr("type", "text");
	}else if($(this).is(".glyphicon-eye-close")){
		$(this).prev().attr("type", "password");
	}
	$(this).toggleClass("glyphicon-eye-open glyphicon-eye-close");
});

$(".staff_addition_r_foot>.btn-primary").click(function(){
	//添加提交交互
	var userName = $("#staff_addition_user_name").val().trim();
	var sex = $("#staff_addition_sex").val().trim();
	var telephone = $("#staff_addition_telephone").val().trim();
	var email = $("#staff_addition_email").val().trim();
	var roleId =$("#staff_addition_role_id").val();
	$.ajax({
	       url: 'UserOperate', 
	       type: 'POST',
	       dataType: 'json', 
	       data: {
	    	   userName : userName ,
	    	   sex : sex ,
	    	   telephone : telephone ,
	    	   email : email ,
	    	   roleId : roleId ,
	       },
	       success: function (data) {
	       		if(data == "添加成功！"){
	    		    adminRender( adminState.staffPageObj.currentPage, false);
	    		    new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
	    		    adminState.staffHasSearch && ($("#search_button").trigger("click"));
	    		    $(".futureDT2_bg_cover, .staff_addition").slideUp(250);
	    		    adminSwalMixin({
	    				title: '添加成功',
	    				text: "成员信息添加成功！",
	    				type: 'success',
	    				showConfirmButton: false,
	    				timer: 2000,
	    			});
	       		}
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
   				title: '异常',
   				text: "服务器繁忙！",
   				type: 'error',
   				showConfirmButton: false,
   				timer: 2000,
   			});
	       }
	   }); 
	
	
	
});

$(".staff_update_r_foot>.btn-primary").click(function(){
	var userId = $(".staff_update_r #staff_update_user_name").attr("userId");
	var userName = $("#staff_update_user_name").val().trim();
	var sex = $("#staff_update_sex").val().trim();
	var telephone = $("#staff_update_telephone").val().trim();
	var email = $("#staff_update_email").val().trim();
	var roleId =$("#staff_update_role_id").val();
	//添加修改提交交互
	$.ajax({
	       url: 'UserOperate', 
	       type: 'POST',
	       dataType: 'json', 
	       data: {
	    	   userId : userId ,
	    	   userName : userName ,
	    	   sex : sex ,
	    	   telephone : telephone ,
	    	   email : email ,
	    	   roleId : roleId ,
	       },
	       success: function (data) {
	       		if(data == "修改成功！"){
	    		    adminRender( adminState.staffPageObj.currentPage, false);
	    		    new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
	    		    adminState.staffHasSearch && ($("#search_button").trigger("click"));
	    		    $(".futureDT2_bg_cover, .staff_update").slideUp(250);
	    		    adminSwalMixin({
	    				title: '修改成功',
	    				text: "成员信息修改成功！",
	    				type: 'success',
	    				showConfirmButton: false,
	    				timer: 2000,
	    			});
	       		}
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
   				title: '异常',
   				text: "服务器繁忙！",
   				type: 'error',
   				showConfirmButton: false,
   				timer: 2000,
   			});
	       }
	   }); 
});

/*操作日志*/
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  	/*e.target // newly activated tab
  	e.relatedTarget // previous active tab*/
  	$(".g_info .glyphicon-question-sign").show();
  	if($(e.target).parent().data("iclassify") == "operaDailyLog"){
  		$(".g_info .glyphicon-question-sign").hide();
  		if(!adminState.hasRequestData){
  			
  			var cur = 1 ;
  			operateRendaer(cur);
  			
  			// 分页元素ID（必填）
  			adminState.operatePageObj.selector = '#pagelist2';
  			// 分页配置
  			adminState.operatePageObj.pageOption = {
  			  // 每页显示数据条数（必填）
  			  limit: 10,
  			  // 数据总数（一般通过后端获取，必填）
  			  count: adminState.operatePageObj.itemLength,
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
  			    adminState.operatePageObj.currentPage = obj.curr;
  			    // 首次不执行
  			    if (!obj.isFirst) {
  			      // do something
  			      	operateRendaer(obj.curr);
	  			   $(".operaDailyLog_body tbody [type='checkbox']").each(function(){
			      		if(_.indexOf(adminState.operateSellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
			      			$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
			      		}
			      	});
	  			   
	  			   //跳页判断全选按钮是否选中  
	  			   var checked_length = $(".operaDailyLog_body .tr_operate input[type=checkbox]:checked").length;
	  			   if(checked_length == $(".operaDailyLog_body .tr_operate").length){
	  				   $("#checkAll2").prop("checked", true);
	  			   }
	  			   else{
	  				 $("#checkAll2").prop("checked", false);
	  			   }
	  			   adminState.operateSellectObj.selectAll = $("#checkAll2").prop("checked");
  			    }
  			  }
  			};
  			// 初始化分页器
  			new Pagination(adminState.operatePageObj.selector, adminState.operatePageObj.pageOption);
  			adminState.hasRequestData = true;
  		}
  	}
});

$("#jumpText2").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});

$("#jumpPage2").on("click", function(){
	var iText = Number($("#jumpText2").val());
	var currentPage = Number(adminState.operatePageObj.currentPage);
	var pageCounts = Number(adminState.operatePageObj.pageCount);
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText2").val('');
	    return;
	}else{
	    adminState.operatePageObj.pageOption.curr = iText;
	    new Pagination(adminState.operatePageObj.selector, adminState.operatePageObj.pageOption);
	    operateRendaer(iText);
	    adminState.operateHasSearch && ($("#search_button2").trigger("click"));
	}
});

$("#search_button2").on("click", function(){
	 operateRendaer(1);
	 adminState.operatePageObj.pageOption.count = adminState.operatePageObj.itemLength;
	 new Pagination(adminState.operatePageObj.selector, adminState.operatePageObj.pageOption);
});

$(".operaDailyLog_tit_r .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
	$(this).parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled", false);
});

$("#search_input2").on("input propertychange change", function(){
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


$("button.export_current,button.export_select").click(function(){
	var logIdStr = "";
	if($(this).hasClass("export_select")){  /*导出选中*/
		for(var i = 0 ; i <  adminState.operateSellectObj.selectItem.length; i++){
			logIdStr = adminState.operateSellectObj.selectItem.join(",");
		}
	}
	console.log("logIdStr",logIdStr);
	$.ajax({
	       url: 'LogExport', 
	       type: 'get',
	       dataType: 'json', 
	       data: {
	    	   logIdStr : logIdStr ,
	       },
	       success: function (data) {
	    	   console.log("data",data);
	    	   if(data != ""){
	    		   window.location.href = data;
	    	   }
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
				title: '异常',
				text: "服务器繁忙！",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
	       }
	   }); 
});

$(document).on("mouseover", ".operaDailyLog_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
}).on("mouseout", ".operaDailyLog_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
}).on("click", ".operaDailyLog_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".operaDailyLog_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".operaDailyLog_body tbody [type='checkbox']", function(){
	var ivalue = $(this).data("ivalue").toString();
	$(this).prop("checked") ? adminState.operateSellectObj.selectItem.push(ivalue) : _.pull(adminState.operateSellectObj.selectItem, ivalue);
	adminState.operateSellectObj.selectItem = _.uniq(adminState.operateSellectObj.selectItem);
	$("#checkAll2").prop("checked", adminState.operatePageObj.itemLength == adminState.operateSellectObj.selectItem.length);
	adminState.operateSellectObj.selectAll = $("#checkAll2").prop("checked");
	if(adminState.operateSellectObj.selectItem.length == 0){
		$("button.export_select").prop("disabled", true);
	}else{
		$("button.export_select").prop("disabled", false);
	}
});

$("#checkAll2").on({
	click: function(){
		var that = $(this);
		$(".operaDailyLog_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		adminState.operateSellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			adminState.operateSellectObj.selectItem = [];
			for(var i = 0 ; i < $(".tr_operate").length ; i++){
				if($(".tr_operate").eq(i).find("input[type='checkbox']").is(':checked')){
					adminState.operateSellectObj.selectItem.push($(".tr_operate").eq(i).find("input[type='checkbox']").data("ivalue").toString());
				}
			}
		}else{
			adminState.operateSellectObj.selectItem = [];
		}
		$("button.export_select").prop("disabled", !that.prop("checked"));
	}
});

/*权限*/
$(document).on("click", ".staffManage_body tbody td.not_search .glyphicon.glyphicon-user", function(e){
	e.stopPropagation();
	var iThat = $(this);
	if(iThat.parent().siblings(".td__role_id").data("ivalue") > adminState.adminRoleMap[$("body").attr("currentrole")]){
		adminSwalMixin({
			title: '异常',
			text: "权限不足，您修改不了角色等级比你高的",
			type: 'error',
			showConfirmButton: false,
			timer: 2000,
		});
		return false;
	}
	if(iThat.parent().siblings(".td__role_id").data("ivalue") == 3){
		$(".staff_authority_r_foot>.btn-primary").prop("disabled", true);
	}else{
		$(".staff_authority_r_foot>.btn-primary").prop("disabled", false);
	}
	
	$(".futureDT2_bg_cover, .staff_authority").slideDown(250);
	var iTd = iThat.parent();
	adminState.staffAuthorityUser = iTd.siblings(".td__user_name").data("ivalue").toString();
	var authority = iTd.siblings(".td__authority").data("ivalue");
	if(!adminState.authorityRender){
		var userId = iTd.parent().find("td").eq(0).find("input").data("ivalue");
		$(".staff_authority_r_bodyin").attr("userId",userId);
		$.ajax({
		       url: 'Authority', 
		       type: 'get',
		       dataType: 'json', 
		       data: {
		    	   userId : userId ,
		       },
		       async : false,
		       success: function (data) {
		    	   console.log("data",data);
		    	   var str = '';
		    	   for(var key in data){
		    		   if(key != "roleName" && key != "userAuthority"){
		    			   str+='<tr>'+
							'<td><span><input type="checkbox">'+key+'</span></td>'+
							'<td>';
			    		   if(data[key].authority.indexOf(",") > -1){
			    			   for(var i = 0 ; i < data[key].authority.split(",").length ; i++){
			    				   if(data[key].authorityName.split(",")[i] == key){
				    				   continue;
				    			   }
			    				   str+='<span><input type="checkbox" data-ivalue="'+data[key].authority.split(",")[i]+'">'+data[key].authorityName.split(",")[i]+'</span>';
			    			   }
			    		   }
			    		   else{
			    			   if(data[key].authorityName == key){
			    				   continue;
			    			   }
			    			   str+='<span><input type="checkbox" data-ivalue="'+data[key].authority+'">'+data[key].authorityName+'</span>';
			    		   }
		    		   }
		    	   }
		    	    $(".staff_authority_r_bodyin tbody").empty().append(str);
			    	$(".staff_authority_r_bodyin tbody span>input").each(function(){
			    			$(this).prop("checked", false);
			    	});
		    	   //加载选中权限
		    	  if(data.userAuthority != ""){
		    		  var userAuthorityArr = data.userAuthority.split(",");
		    			_.forEach(userAuthorityArr, function(o){
		    				$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input[data-ivalue='"+o+"']").prop("checked", true);
		    			});
		    			$(".staff_authority_r_bodyin tbody tr").each(function(){
		    				$(this).children("td:eq(0)").find("input").prop("checked", $(this).children("td:eq(1)").find("input").length == $(this).children("td:eq(1)").find("input").filter(":checked").length);
		    			});
		    	  }
		    	   
		       },
		       error: function (data, status, e) {
		    	   adminSwalMixin({
	   				title: '异常',
	   				text: "服务器繁忙！",
	   				type: 'error',
	   				showConfirmButton: false,
	   				timer: 2000,
	   			});
		       }
		   }); 
		
		//adminState.authorityRender = true;
	}
	$(".staff_authority_r_tit").text("详细信息 - "+adminState.staffAuthorityUser);
	 $(".staff_authority_l, .staff_authority_r").height($(".staff_authority").height());
});

$(".staff_authority_r_foot .btn-warning").click(function(){
	$(".futureDT2_bg_cover, .staff_authority").slideUp(250);
	adminState.staffAuthorityUser = "";
});

//父集选中
$(document).on("change", ".staff_authority_r_bodyin tbody td:nth-child(1) span>input", function(){
	$(this).parent().parent().next().find("input").prop("checked", $(this).prop("checked"));
});
//子集选中
$(document).on("change", ".staff_authority_r_bodyin tbody td:nth-child(2) span>input", function(){
	$(this).parent().parent().prev().find("input").prop("checked", $(this).parent().parent().find("input").length == $(this).parent().parent().find("input").filter(":checked").length);
});
//授权提交
$(".staff_authority_r_foot .btn-primary").click(function(){
	var iArr = [];
	$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input:checked").each(function(){
		iArr.push($(this).data("ivalue"));
	});
	var userId =  $(".staff_authority_r_bodyin").attr("userId");
	var authority = iArr.join(",");
	$.ajax({
	       url: 'AuthorityModify', 
	       type: 'POST',
	       dataType: 'json', 
	       data: {
	    	   userId : userId ,
	    	   authority : authority
	       },
	       success: function (data) {
	    	   console.log("data",data);
	    	   if(data == true){
	    		   adminSwalMixin({
	    				title: '授权成功！',
	    				text: "已经对"+adminState.staffAuthorityUser+"进行了授权，数据已更新",
	    				type: 'success',
	    				showConfirmButton: false,
	    				timer: 2000,
	    			});
	    		   $(".staff_authority_r_foot .btn-warning").trigger("click");
	    	   }
	       },
	       error: function (data, status, e) {
	    	   adminSwalMixin({
				title: '异常',
				text: "服务器繁忙！",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
	       }
	   }); 
	
	/*
	//添加刷新
	adminState.staffHasSearch && ($("#search_button").trigger("click"));*/
});
