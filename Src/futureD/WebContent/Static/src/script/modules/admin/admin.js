/*variable defined*/
var adminSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var adminState = new Object();
adminState.futureDT2__session = store.get("futureDT2__session");
adminState.staffUpdateUser = "";
adminState.staffAuthorityUser = "";
adminState.adminRoleMap = {
	"1": "成员",
	"2": "管理员",
	"3": "超级管理员"
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
adminState.operatePageArr = ["管理员", "数据列表", "工程分析", "数据统计"];
adminState.operateDescriptionArr = ["添加", "修改", "删除", "查询"];
adminState.cityIpMap = {
	"北京": {
		"ip": "123.125.71.73",
		"inde": 0
	},
	"上海": {
		"ip": "114.80.166.240",
		"inde": 1
	},
	"天津": {
		"ip": "125.39.9.34",
		"inde": 2
	},
	"重庆": {
		"ip": "106.95.255.253",
		"inde": 3
	},
	"苏州": {
		"ip": "58.192.191.255",
		"inde": 4
	},
	"成都": {
		"ip": "218.89.23.4",
		"inde": 5
	}
};
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

function adminRender(cur, reset, signalDelete){
	var futureDT2__userDB;
	adminState.staffPageObj.currentPage = cur;
	if(reset){
		futureDT2__userDB = futuredGlobal.S_getAdmin_staff();
		store.set("futureDT2__userDB", futureDT2__userDB);
	}else{
		futureDT2__userDB = store.get("futureDT2__userDB");
	}
	if(!futureDT2__userDB){
		adminSwalMixin({
			title: '异常',
			text: "mock数据失败！请登录",
			type: 'error',
			showConfirmButton: false,
			timer: 2000,
		});
		adminState.staffPageObj.currentPage = 0;
		adminState.staffPageObj.pageCount = 0;
		adminState.staffPageObj.itemLength = 0;
		window.location.assign("login.html");
	}else{
		var futureDT2__userDBArr = [];
		_.forOwn(futureDT2__userDB, function(o){
			futureDT2__userDBArr.push(o);
		});
		var futureDT2__userDBChunkArr = _.chunk(futureDT2__userDBArr, 10);
		var str = '';
		if(futureDT2__userDBChunkArr[cur-1] == undefined){
			adminSwalMixin({
				title: '异常',
				text: "mock数据失败！无数据",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
		}else{
			_.forEach(futureDT2__userDBChunkArr[cur-1], function(v, i, arr){
				var iRole = _.find(adminState.adminRoleMap, function(vv, ii){ return ii == v.role_id.value;});
				str+='<tr>'+
						'<td class="not_search"><input type="checkbox" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></td>'+
						'<td data-itext="'+((cur-1)*10+i+1)+'">'+((cur-1)*10+i+1)+'</td>'+
						'<td class="td__user_name" title="'+v.user_name.value+'" data-itext="'+v.user_name.value+'" data-ivalue="'+v.user_name.value+'">'+v.user_name.value+'</td>'+
						'<td class="td__sex" title="'+v.sex.value+'" data-itext="'+v.sex.value+'" data-ivalue="'+v.sex.value+'">'+v.sex.value+'</td>'+
						'<td class="td__telephone" title="'+v.telephone.value+'" data-itext="'+v.telephone.value+'" data-ivalue="'+v.telephone.value+'">'+v.telephone.value+'</td>'+
						'<td class="td__email" title="'+v.email.value+'" data-itext="'+v.email.value+'" data-ivalue="'+v.email.value+'">'+v.email.value+'</td>'+
						'<td class="td__role_id" data-ivalue="'+v.role_id.value+'" title="'+iRole+'" data-itext="'+iRole+'">'+iRole+'</td>'+
						'<td class="td__password not_search" data-ivalue="'+v.password.value+'">'+v.password.value+'</td>'+
						'<td class="td__authority not_search" data-ivalue="'+v.authority.value+'"></td>'+
						'<td class="td__operate not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" title="修改" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span><span class="glyphicon glyphicon-user" aria-hidden="true" title="授权" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" title="删除" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span></td>'+
					'</tr>';
			});
		}
		$(".staffManage_body tbody").empty().append(str);
		adminState.staffPageObj.pageCount = futureDT2__userDBChunkArr.length;
		adminState.staffPageObj.itemLength = futureDT2__userDBArr.length;

		if(signalDelete == true){
			_.forEach(adminState.staffSellectObj.selectItem, function(val){
				$(".staffManage_body tbody .td__user_name[title='"+String(val)+"']").siblings("td:eq(0)").children("input").prop("checked", true).parent().parent().addClass("warning").removeClass("info");
			});
			$("#checkAll").prop("checked", adminState.staffPageObj.itemLength == adminState.staffSellectObj.selectItem.length);
			adminState.staffSellectObj.selectAll = $("#checkAll").prop("checked");
		}

	}
}

function operateRendaer(cur){
	var iArr = _.cloneDeep(adminState.operateChunkArr[cur - 1]);
	var str = '';
	_.forEach(iArr, function(v, i, arr){
		str+='<tr>'+
				'<td class="not_search"><input type="checkbox" data-ivalue="'+v.log_id.value+'"></td>'+
				'<td data-itext="'+((cur-1)*10+i+1)+'">'+((cur-1)*10+i+1)+'</td>'+
				'<td title="'+v.user_name.value+'" data-itext="'+v.user_name.value+'">'+v.user_name.value+'</td>'+
				'<td title="'+v.page.value+'" data-itext="'+v.page.value+'">'+v.page.value+'</td>'+
				'<td title="'+v.description.value+'" data-itext="'+v.description.value+'">'+v.description.value+'</td>'+
				'<td title="'+v.gmt_create.value+'" data-itext="'+v.gmt_create.value+'">'+v.gmt_create.value+'</td>'+
				'<td title="'+v.ip_address.value+'" data-itext="'+v.ip_address.value+'">'+v.ip_address.value+'</td>'+
				'<td title="'+v.location.value+'" data-itext="'+v.location.value+'">'+v.location.value+'</td>'+
			'</tr>';
	});
	$(".operaDailyLog_body tbody").empty().append(str);
}

/*page onload*/
$(function(){
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

	$(".staffManage_tit_l>.glyphicon-refresh").click(function(){
		adminRender(1, true);
	});

	/*批量删除*/
	$(".staffManage_tit_l .glyphicon-trash").click(function(){
		var ifutureDT2__userDB = store.get("futureDT2__userDB");
		if(!ifutureDT2__userDB){
			adminSwalMixin({
				title: '异常',
				text: "mock数据失败！请登录",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			window.location.assign("login.html");
			return false;
		}

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

		var curUserSession = adminState.futureDT2__session;
		if(_.isNil(curUserSession)){
			adminSwalMixin({
				title: '异常',
				text: "删除数据失败！请登录",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			window.location.assign("login.html");
			return false;
		}else{
			adminState.staffSellectObj.selectItem.map(function(val, ind, arr){
				if(ifutureDT2__userDB[val].role_id.value == "3"){
					adminSwalMixin({
						title: '异常',
						text: "超级管理员不能被删除！",
						type: 'error',
						showConfirmButton: false,
						timer: 2000,
					});
					return false;
				}
			});
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
		  	var IDArr = adminState.staffSellectObj.selectItem;
		  	var iText = 1;
		  	if(adminState.staffSellectObj.selectAll){
		  		iText = 0;
		  	}
		  	
		  	_.forEach(IDArr, function(val){
		  		delete ifutureDT2__userDB[val];
		  		store.set("futureDT2__userDB", _.cloneDeep(ifutureDT2__userDB));
		  	});
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
		var iThat = $(this);
		if(iThat.parent().siblings(".td__role_id").data("ivalue") == 3){
			adminSwalMixin({
				title: '异常',
				text: "超级管理员不能被删除",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			return false;
		}
		var curUserSession = adminState.futureDT2__session;
		if(_.isNil(curUserSession)){
			adminSwalMixin({
				title: '异常',
				text: "删除数据失败！请登录",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			window.location.assign("login.html");
			return false;
		}else{
			if(iThat.parent().siblings(".td__role_id").data("ivalue") > curUserSession.data.role_id.value){
				adminSwalMixin({
					title: '异常',
					text: "权限不足，您删除不了角色等级大于您的用户",
					type: 'error',
					showConfirmButton: false,
					timer: 2000,
				});
				return false;
			}
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
		  	var iText;
		  	if(adminState.staffPageObj.currentPage < adminState.staffPageObj.pageCount){
		  		iText = adminState.staffPageObj.currentPage;
		  	}else if(adminState.staffPageObj.itemLength%10 != 1){
		  		iText = adminState.staffPageObj.currentPage;
		  	}else{
		  		iText = adminState.staffPageObj.currentPage - 1;
		  	}
		  	var ID = iThat.data("iname").toString();

		  	var ifutureDT2__userDB = store.get("futureDT2__userDB");
		  	if(!ifutureDT2__userDB){
		  		adminSwalMixin({
		  			title: '异常',
		  			text: "mock数据失败！请登录",
		  			type: 'error',
		  			showConfirmButton: false,
		  			timer: 2000,
		  		});
		  		window.location.assign("login.html");
		  		return false;
		  	}
		  	delete ifutureDT2__userDB[ID];
		  	store.set("futureDT2__userDB", _.cloneDeep(ifutureDT2__userDB));
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
		}else{
			$(".staff_update #staff_update_role_id option[value='请选择用户角色']").prop({
				"selected": true
			}).parent().removeAttr("readonly").prop("disabled", false);
			$(".staff_update #staff_update_role_id option[value='3']").prop("disabled", true);
		}
		var curUserSession = adminState.futureDT2__session;
		if(_.isNil(curUserSession)){
			adminSwalMixin({
				title: '异常',
				text: "修改数据失败！请登录",
				type: 'error',
				showConfirmButton: false,
				timer: 2000,
			});
			window.location.assign("login.html");
			return false;
		}else{
			if(iThat.parent().siblings(".td__role_id").data("ivalue") > curUserSession.data.role_id.value){
				adminSwalMixin({
					title: '异常',
					text: "权限不足，您修改不了超级管理员",
					type: 'error',
					showConfirmButton: false,
					timer: 2000,
				});
				return false;
			}
		}

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
			$(this).prop("checked", that.prop("checked"));
			that.prop("checked") ? ($(this).parent().parent().removeClass("info").addClass("warning")) : ($(this).parent().parent().removeClass("warning info"));
		});
		adminState.staffSellectObj.selectAll = that.prop("checked");
		if(that.prop("checked")){
			adminState.staffSellectObj.selectItem = [];
			_.forOwn(store.get("futureDT2__userDB"), function(v, k, obj){
				adminState.staffSellectObj.selectItem.push(k.toString());
			});
		}else{
			adminState.staffSellectObj.selectItem = [];
		}
	}
});

/*搜索组件开始*/
$(".staffManage_tit_r_in .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
});

$("#search_button").on("click", function(){
	var isearch = $("#search_input").val().trim();
	$(".staffManage_body tbody td:not(.not_search)").each(function(){
		var iiText = _.isNil($(this).data("itext")) ? "" : $(this).data("itext");
		$(this).empty().text(iiText);
	});
	if(isearch == ""){
		adminState.staffHasSearch = false;
		return false;
	}else{
		$(".staffManage_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
		adminState.staffHasSearch = true;
		return false;
	}
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

$("#staff_addition_user_name").on("input propertychange change", function(){
	var newUser = $("#staff_addition_user_name").val().trim();
	if(newUser == ""){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
		$(this).parent().next().empty().append(str);
		return false;
	}
	var ifutureDT2__userDB = store.get("futureDT2__userDB");
	var str;
	if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
		ifutureDT2__userDB = futuredGlobal.S_getAdmin_staff();
	}

	if(!_.isNil(_.find(ifutureDT2__userDB, function(vv, kk){
		return kk == newUser;
	}))){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
	}else{
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		staffSubmitBtn($(this), "addition");
	}
	$(this).parent().next().empty().append(str);
});

$("#staff_update_user_name").on("input propertychange change", function(){
	var newUser = $("#staff_update_user_name").val().trim();
	if(newUser == ""){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_update_r_foot>.btn-primary").prop("disabled", true);
		$(this).parent().next().empty().append(str);
		return false;
	}
	var ifutureDT2__userDB = store.get("futureDT2__userDB");
	if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
		ifutureDT2__userDB = futuredGlobal.S_getAdmin_staff();
	}
	var userArr = [];
	_.forOwn(ifutureDT2__userDB, function(val, ke){
		if(ke != adminState.staffUpdateUser) userArr.push(ke);
	});
	if(_.indexOf(userArr, newUser) > -1){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>';
		$(".staff_update_r_foot>.btn-primary").prop("disabled", true);
	}else{
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		staffSubmitBtn($(this), "update");
	}
	$(this).parent().next().empty().append(str);
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
	var newUser = $("#staff_addition_user_name").val().trim();
	var ifutureDT2__userDB = store.get("futureDT2__userDB");
	if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
		ifutureDT2__userDB = futuredGlobal.S_getAdmin_staff();
	}
	var inItem;
	_.forOwn(ifutureDT2__userDB, function(val){
		inItem = val;
		return false;
	});

	if(!_.isNil(_.find(ifutureDT2__userDB, function(vv, kk){
		return kk == newUser;
	}))){
		adminSwalMixin({
			title: '添加成员异常',
			text: "该成员已存在！请更改",
			type: 'error',
			showConfirmButton: false,
			timer: 2500,
		});
		return false;
	}

	var maxID = Number(_.last(_.sortBy(ifutureDT2__userDB, function(o) { return o.user_id.value; })).user_id.value) + 1;
	var merObj = _.cloneDeep(inItem);
	merObj.user_name.value = newUser;
	merObj.user_id.value = maxID;
	merObj.telephone.value = $("#staff_addition_telephone").val().trim();
	merObj.sex.value = $("#staff_addition_sex").val().trim();
	merObj.role_id.value = $("#staff_addition_role_id").val().trim();
	merObj.password.value = $("#staff_addition_password").val().trim();
	merObj.last_login.value = null;
	merObj.gmt_create.value = moment().format("YYYY-MM-DD HH:mm:ss");
	merObj.email.value = $("#staff_addition_email").val().trim();
	merObj.current_login.value = null;
	merObj.authority.value = [];
	var item = {};
	item[newUser] = merObj;
	store.set("futureDT2__userDB", _.assign(ifutureDT2__userDB, item));
	adminSwalMixin({
		title: '添加成员成功',
		text: "成员已添加，现在可以使用该账户登录了",
		type: 'success',
		showConfirmButton: false,
		timer: 2500,
	});
	$(".staff_addition_r_foot .btn-warning").trigger("click");
	setTimeout(function(){
		window.location.reload();
	}, 2000);
});

$(".staff_update_r_foot>.btn-primary").click(function(){
	var newUser = $("#staff_update_user_name").val().trim();
	var ifutureDT2__userDB = store.get("futureDT2__userDB");
	if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
		ifutureDT2__userDB = futuredGlobal.S_getAdmin_staff();
	}
	var inItem = _.find(ifutureDT2__userDB, function(vv, kk){
		return kk == adminState.staffUpdateUser;
	});
	var userArr = [];
	_.forOwn(ifutureDT2__userDB, function(val, ke){
		if(ke != adminState.staffUpdateUser) userArr.push(ke);
	});

	if(_.indexOf(userArr, newUser) > -1){
		adminSwalMixin({
			title: '修改成员异常',
			text: "您修改了用户名，修改后的用户名重复！请更改",
			type: 'error',
			showConfirmButton: false,
			timer: 2500,
		});
		return false;
	}

	delete ifutureDT2__userDB[adminState.staffUpdateUser];
	var maxID = Number(_.last(_.sortBy(ifutureDT2__userDB, function(o) { return o.user_id.value; })).user_id.value) + 1;
	var merObj = _.cloneDeep(inItem);
	merObj.user_name.value = newUser;
	merObj.user_id.value = maxID;
	merObj.telephone.value = $("#staff_update_telephone").val().trim();
	merObj.sex.value = $("#staff_update_sex").val().trim();
	merObj.role_id.value = $("#staff_update_role_id").val().trim();
	merObj.password.value = $("#staff_update_password").val().trim();
	/*merObj.last_login.value = null;*/
	/*merObj.gmt_create.value = moment().format("YYYY-MM-DD HH:mm:ss");*/
	merObj.email.value = $("#staff_update_email").val().trim();
	/*merObj.current_login.value = null;*/
	/*merObj.authority.value = [];*/
	var item = {};
	item[newUser] = merObj;
	store.set("futureDT2__userDB", _.assign(ifutureDT2__userDB, item));
	if(adminState.futureDT2__session.data.user_name.value == adminState.staffUpdateUser){
		var iitem = {};
		iitem.expires = adminState.futureDT2__session.expires;
		iitem.data = merObj;
		store.set('futureDT2__session', iitem);
	}
	adminSwalMixin({
		title: '修改成员成功',
		text: "成员已修改，现在可以使用该账户登录了",
		type: 'success',
		showConfirmButton: false,
		timer: 2500,
	});
	$(".staff_update_r_foot .btn-warning").trigger("click");
	setTimeout(function(){
		window.location.reload();
	}, 2000);
});

/*操作日志*/
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  	/*e.target // newly activated tab
  	e.relatedTarget // previous active tab*/
  	$(".g_info .glyphicon-question-sign").show();
  	if($(e.target).parent().data("iclassify") == "operaDailyLog"){
  		$(".g_info .glyphicon-question-sign").hide();
  		if(!adminState.hasRequestData){
  			var ifutureDT2__userDB = store.get("futureDT2__userDB");
  			if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
  				adminSwalMixin({
  					title: '异常',
  					text: "Mock数据失败！请登录",
  					type: 'error',
  					showConfirmButton: false,
  					timer: 2000,
  				});
  				window.location.assign("login.html");
  				return false;
  			}
  			var futuredAdminOperArr = [];
  			var hasUserArr = [];
  			_.forOwn(ifutureDT2__userDB, function(v, k, obj){
  				hasUserArr.push(k);
  			});
  			var futureDT2__admin__operation = store.get("futureDT2__admin__operation");
  			if(_.isNil(futureDT2__admin__operation)){
  				futureDT2__admin__operation = futuredGlobal.S_getAdmin_operation();
  				_.times(63, function(i){
  					var copyObj = _.cloneDeep(futureDT2__admin__operation[0]);
  					var ii = String(i+1);
  					_.forOwn(copyObj, function(v, k, obj){
  						if(v.detail === null){
  							obj[k].value = _.padEnd(v.value, v.value.length+ii.length, ii);
  						}else{
  							switch(v.detail)
  							{
  							case "user_name":
  								obj[k].value = hasUserArr[(i%hasUserArr.length)];
  							  	break;
  							case "page":
  								obj[k].value = adminState.operatePageArr[(i%adminState.operatePageArr.length)];
  							  	break;
  							case "description":
  								obj[k].value = adminState.operateDescriptionArr[(i%adminState.operateDescriptionArr.length)] + ii;
  							  	break;
  							case "time":
  							  	obj[k].value = moment().add(Number(ii), 'days').format("YYYY-MM-DD HH:mm:ss");
  							  	break;
  							case "ip_address":
  								obj[k].value = _.find(adminState.cityIpMap, function(iv, ik){
  									return iv.inde == (i%6);
  								}).ip;
  								break;
  							default:
  							/*地理位置*/
  							  	obj[k].value = _.findKey(adminState.cityIpMap, function(iv, ik){
  							  		return iv.inde == (i%6);
  							  	});
  							}
  						}
  					});
  					futuredAdminOperArr.push(copyObj);
  				}); /*times end*/
  				/*mock数据结束*/
  				store.set("futureDT2__admin__operation", _.cloneDeep(futuredAdminOperArr));
  			}else{
  				futuredAdminOperArr = futureDT2__admin__operation;
  			}
  			
  			adminState.operateChunkArr = _.chunk(futuredAdminOperArr, 10);
  			adminState.operatePageObj.pageCount = adminState.operateChunkArr.length;
  			adminState.operatePageObj.itemLength = futuredAdminOperArr.length;
  			
  			var cur = 1;
  			if(adminState.operatePageObj.pageCount == 0){
  				cur = 0;
  			}
  			adminState.operatePageObj.currentPage = cur;
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
  			      	adminState.operateHasSearch && ($("#search_button2").trigger("click"));
  			      	$(".operaDailyLog_body tbody [type='checkbox']").each(function(){
  			      		if(_.indexOf(adminState.operateSellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
  			      			$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
  			      		}
  			      	});
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
	var isearch = $("#search_input2").val().trim();
	if(isearch == ""){
		$(".operaDailyLog_body tbody td:not(.not_search)").each(function(){
			var iiText = _.isNil($(this).data("itext")) ? "" : $(this).data("itext");
			$(this).empty().text(iiText);
		});
		adminState.operateHasSearch = false;
		return false;
	}else{
		$(".operaDailyLog_body tbody td:not(.not_search)").each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
		adminState.operateHasSearch = true;
		return false;
	}
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

/*导出*/
$("button.export_current").click(function(){
	window.open("../static/admin_export_current.xlsx");
});

$("button.export_select").click(function(){
	if(adminState.operateSellectObj.selectAll){
		window.open("../static/admin_export_select_all.xlsx");
	}else{
		window.open("../static/admin_export_select_one.xlsx");
	}
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
			_.forEach(store.get("futureDT2__admin__operation"), function(v, i, arr){
				adminState.operateSellectObj.selectItem.push(v.log_id.value.toString());
			});
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
	
	var curUserSession = adminState.futureDT2__session;
	if(_.isNil(curUserSession)){
		adminSwalMixin({
			title: '异常',
			text: "修改数据失败！请登录",
			type: 'error',
			showConfirmButton: false,
			timer: 2000,
		});
		window.location.assign("login.html");
		return false;
	}else{
		if(iThat.parent().siblings(".td__role_id").data("ivalue") > curUserSession.data.role_id.value){
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
	}
	$(".futureDT2_bg_cover, .staff_authority").slideDown(250);
	var iTd = iThat.parent();
	adminState.staffAuthorityUser = iTd.siblings(".td__user_name").data("ivalue").toString();
	var authority = iTd.siblings(".td__authority").data("ivalue");
	if(!adminState.authorityRender){
		var str = '';
		_.forOwn(futuredGlobal.S_getAdmin_authorityMap(), function(val, key, obj){
			str+='<tr>'+
					'<td><span><input type="checkbox">'+key+'</span></td>'+
					'<td>';
			_.forEach(val, function(v, i, arr){
				str+='<span><input type="checkbox" data-ivalue="'+v.authority_id+'">'+v.authority_name+'</span>';
			});
			str+='</td></tr>';
		});
		$(".staff_authority_r_bodyin tbody").empty().append(str);
		adminState.authorityRender = true;
	}
	$(".staff_authority_r_tit").text("详细信息 - "+adminState.staffAuthorityUser);

	$(".staff_authority_r_bodyin tbody span>input").each(function(){
		$(this).prop("checked", false);
	});
	_.forEach(authority, function(o){
		$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input[data-ivalue='"+o+"']").prop("checked", true);
	});
	$(".staff_authority_r_bodyin tbody tr").each(function(){
		$(this).children("td:eq(0)").find("input").prop("checked", $(this).children("td:eq(1)").find("input").length == $(this).children("td:eq(1)").find("input").filter(":checked").length);
	});

	$(".staff_authority_l, .staff_authority_r").height($(".staff_authority").height());
});

$(".staff_authority_r_foot .btn-warning").click(function(){
	$(".futureDT2_bg_cover, .staff_authority").slideUp(250);
	adminState.staffAuthorityUser = "";
});

$(document).on("change", ".staff_authority_r_bodyin tbody td:nth-child(1) span>input", function(){
	$(this).parent().parent().next().find("input").prop("checked", $(this).prop("checked"));
});

$(document).on("change", ".staff_authority_r_bodyin tbody td:nth-child(2) span>input", function(){
	$(this).parent().parent().prev().find("input").prop("checked", $(this).parent().parent().find("input").length == $(this).parent().parent().find("input").filter(":checked").length);
});

$(".staff_authority_r_foot .btn-primary").click(function(){
	var ifutureDT2__userDB = store.get("futureDT2__userDB");
	if(_.isEmpty(ifutureDT2__userDB) || _.isNil(ifutureDT2__userDB)){
		adminSwalMixin({
			title: '异常',
			text: "mock数据失败！请登录",
			type: 'error',
			showConfirmButton: false,
			timer: 2000,
		});
		window.location.assign("login.html");
	}else{
		var iArr = [];
		$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input:checked").each(function(){
			iArr.push($(this).data("ivalue"));
		});
		ifutureDT2__userDB[adminState.staffAuthorityUser].authority.value = iArr;
		store.set("futureDT2__userDB", _.cloneDeep(ifutureDT2__userDB));
		adminSwalMixin({
			title: '授权成功！',
			text: "已经对"+adminState.staffAuthorityUser+"进行了授权，数据已更新",
			type: 'success',
			showConfirmButton: false,
			timer: 2000,
		});
		$(".staff_authority_r_foot .btn-warning").trigger("click");
		adminState.staffPageObj.pageOption.curr = adminState.staffPageObj.currentPage;
		new Pagination(adminState.staffPageObj.selector, adminState.staffPageObj.pageOption);
		adminRender(adminState.staffPageObj.currentPage, false);
		adminState.staffHasSearch && ($("#search_button").trigger("click"));
	}
});

/*var a = [{
	alphabetic_coordinate: "0:0",
	bin: "1",
	die_number: 1,
	value: 0.00023
}, {
	alphabetic_coordinate: "1:0",
	bin: "255",
	die_number: 2,
	value: 0.00023
}, {
	alphabetic_coordinate: "2:0",
	bin: "1",
	die_number: 3,
	value: 0.00023
}, {
	alphabetic_coordinate: "0:1",
	bin: "-1",
	die_number: 4,
	value: 0.00023
}, {
	alphabetic_coordinate: "0:2",
	bin: "1",
	die_number: 5,
	value: 0.00023
}];
_.reduce(a, function(result, va, i){
	var item = {};
	item[va.alphabetic_coordinate] = va.value;
	result.push(item);
	return result;
}, []);*/