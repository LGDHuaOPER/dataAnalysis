/*variable defined*/
var adminSwalMixin = swal.mixin({
  	confirmButtonClass: 'btn btn-success',
  	cancelButtonClass: 'btn btn-danger',
  	buttonsStyling: true,
	animation: false,
	customClass: 'animated zoomIn'
});

var adminState = new Object();
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
adminState.operateSellectObj = {
	selectAll: false,
	selectItem: []
};

function staffSubmitBtn(That){
	if($(".staff_addition_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length == 0){
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", false);
	}else if($(".staff_addition_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length == 1){
		if(That.parent().next().children(".glyphicon-info-sign").length){
			$(".staff_addition_r_foot>.btn-primary").prop("disabled", false);
		}else{
			$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
		}
	}else{
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
	}
}

function adminRender(cur, reset){
	var futureDT2__userDB;
	adminState.staffPageObj.currentPage = cur;
	if(reset){
		futureDT2__userDB = futuredGlobal.S_getAdmin_staff();
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
						'<td data-itext="'+((cur*0)+i+1)+'">'+((cur*0)+i+1)+'</td>'+
						'<td class="td__user_name" title="'+v.user_name.value+'" data-itext="'+v.user_name.value+'">'+v.user_name.value+'</td>'+
						'<td class="td__sex" title="'+v.sex.value+'" data-itext="'+v.sex.value+'">'+v.sex.value+'</td>'+
						'<td class="td__telephone" title="'+v.telephone.value+'" data-itext="'+v.telephone.value+'">'+v.telephone.value+'</td>'+
						'<td class="td__email" title="'+v.email.value+'" data-itext="'+v.email.value+'">'+v.email.value+'</td>'+
						'<td class="td__role_id" data-ivalue="'+v.role_id.value+'" title="'+iRole+'" data-itext="'+iRole+'">'+iRole+'</td>'+
						'<td class="td__operate not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" title="修改" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span><span class="glyphicon glyphicon-user" aria-hidden="true" title="授权" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" title="删除" data-ivalue="'+v.user_id.value+'" data-iname="'+v.user_name.value+'"></span></td>'+
					'</tr>';
			});
		}
		$(".staffManage_body tbody").empty().append(str);
		adminState.staffPageObj.pageCount = futureDT2__userDBChunkArr.length;
		adminState.staffPageObj.itemLength = futureDT2__userDBArr.length;
	}
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
		  	var ID = iThat.data("iname");

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
		  	adminRender(iText, false);
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
	$("#checkAll").prop("checked", ($(".staffManage_body tbody [type='checkbox']").filter(":checked").length == $(".staffManage_body tbody [type='checkbox']").length));
	var iname = $(this).data("iname");
	$(this).prop("checked") ? adminState.staffSellectObj.selectItem.push(iname) : _.pull(adminState.staffSellectObj.selectItem, iname);
	adminState.staffSellectObj.selectItem = _.uniq(adminState.staffSellectObj.selectItem);
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
				adminState.staffSellectObj.selectItem.push(k);
			});
		}else{
			adminState.staffSellectObj.selectItem = [];
		}
	}
});

$("#search_button").on("click", function(){
	var isearch = $("[data-isearch='search_button']:visible").val().trim();
	$(".staffManage_body tbody td:not(.not_search)").each(function(){
		var iiText = _.isNil($(this).data("itext")) ? "" : $(this).data("itext");
		$(this).empty().text(iiText);
	});
	if(isearch == ""){
		adminState.staffHasSearch = false;
		return false;
	}else{
		var iclass = $(".staffManage_tit_r_in li[data-iclass].iclass").data("iclass");
		$(".staffManage_body tbody td."+iclass).each(function(){
			var iText = $(this).text();
			var ireplace = "<b style='color:red'>"+isearch+"</b>";
			var iHtml = iText.replace(new RegExp(isearch, 'g'), ireplace);
			$(this).empty().html(iHtml);
		});
		adminState.staffHasSearch = true;
		return false;
	}
});

$(document).on("click", ".staffManage_tit_r_in li[data-iclass]", function(){
	$(this).addClass("iclass").siblings().removeClass("iclass");
	$(this).parent().prev().attr("title", $(this).children().text()).html($(this).children().text()+' <span class="caret"></span>');
	$("[data-isearch='search_button']:visible").prop("disabled", false);
});

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
	if($(this).val().trim() === "" || $(this).val() == null){
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
	}else{
		if($(this).is("#staff_addition_password2")){
			if($("#staff_addition_password").val() != $("#staff_addition_password2").val()){
				str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> 两次输入不一致';
				$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
			}else{
				str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
				var That = $(this);
				staffSubmitBtn(That);
			}
		}else{
			str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
			var That = $(this);
			staffSubmitBtn(That);
		}
	}
	$(this).parent().next().empty().append(str);
});

$("#staff_addition_telephone").on("input propertychange change", function(){
	if($(this).val() == ""){
		var iThat = $(this);
		staffSubmitBtn(iThat);
		$(this).parent().next().empty();
		return false;
	}
	var str;
	var iReg1 = new RegExp(eouluGlobal.S_getRegExpList("mobile").newRegExp);
	var iReg2 = new RegExp(eouluGlobal.S_getRegExpList("telephone").newRegExp);
	if(iReg1.test($(this).val()) || iReg2.test($(this).val())){
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		var That = $(this);
		staffSubmitBtn(That);
	}else{
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
	}
	$(this).parent().next().empty().append(str);
});

$("#staff_addition_email").on("input propertychange change", function(){
	if($(this).val() == ""){
		var iThat = $(this);
		staffSubmitBtn(iThat);
		$(this).parent().next().empty();
		return false;
	}
	var str;
	var iReg = new RegExp(eouluGlobal.S_getRegExpList("email").newRegExp);
	if(iReg.test($(this).val())){
		str = '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
		var That = $(this);
		staffSubmitBtn(That);
	}else{
		str = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
		$(".staff_addition_r_foot>.btn-primary").prop("disabled", true);
	}
	$(this).parent().next().empty().append(str);
});

$(".has-feedback .form-control-feedback").click(function(){
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