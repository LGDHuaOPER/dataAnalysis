
/*
* 2018-11-20 By LGD.HuaFEEng
* 
 */
/*var and function defined*/
var dataListStore = Object.create(null);
dataListStore.state = Object.create(null);
dataListStore.state.productCategory = [];
dataListStore.state.device_numberArr = _.isNil(store.get("futureDT2__dataList__device_numberArr")) ? [] : store.get("futureDT2__dataList__device_numberArr");

dataListStore.addition = Object.create(null);

dataListStore.update = Object.create(null);
dataListStore.update.productCategory = {
	value: null,
	isRequired: true,
	message: "产品类别必选！",
	reg: null
};
dataListStore.update.testEndDate = {
	value: null,
	isRequired: true,
	message: "测试完成时间必选！",
	reg: null
};
dataListStore.update.description = {
	value: null,
	isRequired: false
};
dataListStore.update.waferId = {
	value: null,
	isRequired: true,
	message: "操作错误！晶圆ID异常！",
	reg: null
};

function tableEllipsis(){
	// 表格自适应出现省略号
	var $table = $("div.g_bodyin_bodyin_body>table");
	var len = $table.find("th:visible").length;
	var itemWid = _.floor(($table.innerWidth() - 50)/(len - 1));
	eouluGlobal.C_tableEllipsis({
		container: $("div.g_bodyin_bodyin_body>table"),
		widthArr: _.fill(_.fill(Array(len), itemWid), 50, 0, 1)
	});
}

function injectStoreValue(obj){
	_.forOwn(obj.obj, function(v, k){
		if(_.indexOf(obj.exclude, _.toString(k)) > -1) return true;
		obj[k] = _.trim($("#"+obj.prefix+k).val());
	});
}

function validationStoreValue(obj){
	var flag = true;
	_.forOwn(obj.obj, function(v, k){
		if(_.isNil(v.value) || _.isEmpty(v.value)){
		  	eouluGlobal.S_getSwalMixin()({
			 	title: obj.title,
			 	text: v.message,
			 	/*html: '',*/
			 	type: "info",
			 	showConfirmButton: false,
				timer: 1600,
			}).then(function(result){
				if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
					_.isFunction(obj.callback) && obj.callback();
				}
			});
			flag = false;
			return false;
		}
	});
	return flag;
}

/*page preload*/

/*page onload*/
$(function(){
	tableEllipsis();
});

/*event handler*/
$(window).on("resize", function(){
	tableEllipsis();

	/*缓存产品名称*/
	$(".device_number_td").each(function(){
		dataListStore.state.device_numberArr.push($(this).data("ivalue").toString());
	});
	dataListStore.state.device_numberArr = _.uniq(dataListStore.state.device_numberArr);

	/*缓存产品类别*/
	$(".data_c_c .category_span").each(function(){
		dataListStore.state.productCategory.push($(this).attr("value"));
	});
	dataListStore.state.productCategory = _.uniq(dataListStore.state.productCategory);
});

/*添加修改打开关闭*/
$(".g_bodyin_bodyin_tit_l>.glyphicon-remove-circle").click(function(){
	$(".futureDT2_bg_cover, .futureDT2_addition").slideDown(200);
	$(".futureDT2_addition_l, .futureDT2_addition_r").height($(".futureDT2_addition").height());
});
$(".futureDT2_addition_r_foot .btn-warning, .futureDT2_update_r_foot .btn-warning").click(function(){
	var $iparent = $(this).parents("[data-iparent]");
	$(".futureDT2_bg_cover").slideUp(200);
	$iparent.slideUp(200);
});
$(document).on("click", ".operate_othertd>.glyphicon-edit", function(e){
	e.stopPropagation();
	var iThat = $(this).parent();
	$(".futureDT2_bg_cover, .futureDT2_update").slideDown(200);
	$(".futureDT2_update_l, .futureDT2_update_r").height($(".futureDT2_update").height());
	dataListStore.update.waferId.value = $(this).data("iid");
	var productCategory = iThat.siblings(".product_category_td").data("ivalue");
	var testEndDate = iThat.siblings(".test_end_date_td").data("ivalue");
	var description = iThat.siblings(".description_td").data("ivalue");
	// $("#futureDT2_update_data_format").val(iThat.siblings(".td_data_format").data("ivalue"));
	$("#futureDT2_update_productCategory").val(productCategory);
	$("#futureDT2_update_testEndDate").val(testEndDate);
	$("#futureDT2_update_description").val(description);
	$("#futureDT2_update_productCategory").each(function(i, el){
		new Awesomplete(el, {
			list: _.cloneDeep(dataListStore.state.productCategory),
			minChars: 1,
			maxItems: 13,
			autoFirst: true
		});
	});
});

/*添加修改提交*/
$(".futureDT2_addition_r_foot .btn-primary, .futureDT2_update_r_foot .btn-primary").click(function(){
	var iparent = $(this).parents("[data-iparent]").data("iparent");
	if(_.isEqual(iparent, "addition")){

	}else if(_.isEqual(iparent, "update")){
		injectStoreValue({
			obj: dataListStore.update,
			exclude: ["waferId"],
			prefix: "futureDT2_update_"
		});
		var flag = validationStoreValue({
			obj: dataListStore.update,
			title: "修改提示"
		});
		if(!flag) return false;
		var ajaxData = {};
		_.forOwn(dataListStore.update, function(v, k){
			ajaxData[k] = v.value;
		});
		$.ajax({
			type: "POST",
			url: "DataListUpdate",
			data: ajaxData,
			dataType: "json"
		}).then(function(data){
			console.log(typeof data)
		}, function(){

		});
	}
});