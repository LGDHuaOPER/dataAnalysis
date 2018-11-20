/*
* 2018-11-20 By LGD.HuaFEEng
* 
 */
/*var and function defined*/
var dataListStore = Object.create(null);
dataListStore.state = Object.create(null);
dataListStore.state.userName = null;
dataListStore.state.pageObj = {
	pageOption: null,
	currentPage: null,
	pageCount: null,
	searchFlag: false,
	searchVal: ""
};
dataListStore.state.productCategory = [];
dataListStore.state.device_numberArr = _.isNil(store.get("futureDT2__dataList__device_numberArr")) ? [] : store.get("futureDT2__dataList__device_numberArr");
/*进度条*/
dataListStore.state.bar = {
	flag: false,
	option: {
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
	},
	Bar: null
};
/*添加修改*/
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
		if(_.indexOf(obj.exclude, _.toString(k)) == -1) obj.obj[k].value = _.trim($("#"+obj.prefix+k).val());
	});
}

function validationStoreValue(obj){
	var flag = true;
	_.forOwn(obj.obj, function(v, k){
		if(!v.isRequired) return true;
		if(_.isNil(v.value) || _.isEmpty(v.value)){
		  	dataListSwalMixin({
		  		title: obj.title,
		  		text: v.message,
		  		timer: 1600,
		  		callback: null
		  	});
			flag = false;
			return false;
		}
	});
	return flag;
}

function dataListSwalMixin(obj){
  	eouluGlobal.S_getSwalMixin()({
	 	title: obj.title,
	 	text: obj.text,
	 	/*html: '',*/
	 	type: obj.type || "info",
	 	showConfirmButton: false,
		timer: obj.timer,
	}).then(function(result){
		if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
			_.isFunction(obj.callback) && obj.callback();
		}
	});
}

// 搜索值标红
function searchValShowRed(){
	$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){
		var iText = $(this).text();
		var ireplace = "<b style='color:red'>"+dataListStore.state.pageObj.searchVal+"</b>";
		var iHtml = iText.replace(new RegExp(dataListStore.state.pageObj.searchVal, 'g'), ireplace);
		$(this).empty().html(iHtml);
	});
}

/*page preload*/

/*page onload*/
$(function(){
	tableEllipsis();

	/*初始化分页组件*/
	dataListStore.state.pageObj.currentPage = _.toNumber($("body").data("currentpage"));
	dataListStore.state.pageObj.pageCount = _.toNumber($("body").data("totalcount"));
	dataListStore.state.pageObj.searchVal = _.trim($("#search_input").val());
	dataListStore.state.pageObj.searchFlag = dataListStore.state.pageObj.searchVal !== "";

	// 分页元素ID（必填）
	// 分页配置
	dataListStore.state.pageObj.pageOption = {
	  // 每页显示数据条数（必填）
	  limit: 10,
	  // 数据总数（一般通过后端获取，必填）
	  count: dataListStore.state.pageObj.pageCount,
	  // 当前页码（选填，默认为1）
	  curr: dataListStore.state.pageObj.currentPage,
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
	    dataListStore.state.pageObj.searchFlag && searchValShowRed();
	    // 首次不执行
	    if (!obj.isFirst) {
	      // do something
	      	/*dataListState.hasSearch && searchMark($("#search_input").val().trim());
	      	$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
	      		if(_.indexOf(dataListState.sellectObj.selectItem, $(this).data("ivalue").toString()) > -1){
	      			$(this).prop("checked", true).parent().parent().addClass("warning").removeClass("info");
	      		}
	      	});*/
	      	var URLParam;
	      	if(dataListStore.state.pageObj.searchFlag){
	      		URLParam = {
	      			currentPage: obj.curr,
	      			keyword: dataListStore.state.pageObj.searchVal
	      		};
	      	}else{
	      		URLParam = {
	      			currentPage: obj.curr,
	      		};
	      	}
	      	eouluGlobal.S_settingURLParam(URLParam, false, false, false);
	    }
	  }
	};
	// 初始化分页器
	new Pagination('#pagelist', dataListStore.state.pageObj.pageOption);

	dataListStore.state.userName = $("body").data("curusername");
	/*回显选中*/
	var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem");
	if(_.isNil(selectedItem)) selectedItem = [];
	_.forEach(selectedItem, function(v, i){
		$(".g_bodyin_bodyin_body tbody input[type='checkbox'][data-iid='"+_.toNumber(v)+"']").prop("checked", true).parent().parent().addClass("warning");
	});
	$("#checkAll").prop("checked", $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length);
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
	dataListStore.update.waferId.value = _.toString($(this).data("iid"));
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
			if(data == true){
				dataListSwalMixin({
					title: "修改提示",
					text: "修改成功",
					type: "success",
					timer: 1500,
					callback: function(){
						window.location.reload();
					}
				});
			}else if(data == false){
				dataListSwalMixin({
					title: "修改提示",
					text: "修改失败",
					timer: 1500,
					callback: null
				});
			}else{
				dataListSwalMixin({
					title: "修改提示",
					text: data,
					timer: 1600,
					callback: null
				});
			}
		}, function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR)
			console.log(textStatus)
			console.log(errorThrown)
			eouluGlobal.C_server500Message();
		});
	}
});

/*删除和批量删除*/
$(document).on("click", ".operate_othertd .glyphicon-trash", function(e){
	e.stopPropagation();
	var iThat = $(this);
  	eouluGlobal.S_getSwalMixin()({
	 	title: "删除提示",
	 	text: "正在删除",
	 	/*html: '',*/
	 	type: "info",
	 	showConfirmButton: false,
	});
	$.ajax({
		type: "GET",
		url: "DataListRemove",
		data: {
			waferId: iThat.data("iid")
		},
		dataType: "json"
	}).then(function(data){
		if(data == true){
			dataListSwalMixin({
				title: "删除提示",
				text: "删除成功",
				type: "success",
				timer: 1500,
				callback: function(){
					window.location.reload();
				}
			});
		}else if(data == false){
			dataListSwalMixin({
				title: "删除提示",
				text: "删除失败",
				timer: 1500,
				callback: null
			});
		}else{
			dataListSwalMixin({
				title: "删除提示",
				text: data,
				timer: 1600,
				callback: null
			});
		}
	}, function(){
		eouluGlobal.C_server500Message();
	});
}).on("click", ".g_bodyin_bodyin_tit_l>.glyphicon-remove", function(){
	var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem");
	if(_.isNil(selectedItem) || _.isEmpty(selectedItem)) return false;
	$.ajax({
		type: "GET",
		url: "DataListRemove",
		data: {
			waferId: _.join(selectedItem, ",")
		},
		dataType: "json"
	}).then(function(data){
		if(data == true){
			dataListSwalMixin({
				title: "删除提示",
				text: "删除成功",
				type: "success",
				timer: 1500,
				callback: function(){
					store.set("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem", []);
					window.location.reload();
				}
			});
		}else if(data == false){
			dataListSwalMixin({
				title: "删除提示",
				text: "删除失败",
				timer: 1500,
				callback: null
			});
		}else{
			dataListSwalMixin({
				title: "删除提示",
				text: data,
				timer: 1600,
				callback: null
			});
		}
	}, function(){
		eouluGlobal.C_server500Message();
	});
});

/*选择Item并存储*/
$(document).on("mouseover", ".g_bodyin_bodyin_body td", function(){
	$(this).addClass("warning");
	$(this).parent().addClass("info");
}).on("mouseout", ".g_bodyin_bodyin_body td", function(){
	$(this).removeClass("warning");
	$(this).parent().removeClass("info");
}).on("click", ".g_bodyin_bodyin_body td", function(){
	$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked", !$(this).parent().find("[type='checkbox']").prop("checked")).change();
}).on("click", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(e){
	e.stopPropagation();
	$(this).parent().parent().toggleClass("warning info");
}).on("change", ".g_bodyin_bodyin_body tbody [type='checkbox']", function(){
	var ID = $(this).data("iid").toString();
	var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem");
	if(_.isNil(selectedItem)) selectedItem = [];
	$(this).prop("checked") ? selectedItem.push(ID) : _.pull(selectedItem, ID);
	selectedItem = _.uniq(selectedItem);
	store.set("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem", selectedItem);
	$("#checkAll").prop("checked", $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length);
});

$("#checkAll").on({
	click: function(){
		var that = $(this);
		var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem");
		if(_.isNil(selectedItem)) selectedItem = [];
		$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){
			$(this).prop("checked", that.prop("checked"));
			var ID = $(this).data("iid").toString();
			if(that.prop("checked")){
				$(this).parent().parent().removeClass("info").addClass("warning");
				selectedItem.push(ID);
			}else{
				$(this).parent().parent().removeClass("warning info");
				_.pull(selectedItem, ID);
			}
		});
		selectedItem = _.uniq(selectedItem);
		store.set("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem", selectedItem);
	}
});

/*跳页*/
$("#jumpText").on("input propertychange", function(){
	$(this).val($(this).val().replace(/[^\d]/g,''));
});
$("#jumpPage").on("click", function(){
	var iText = Number($("#jumpText").val());
	var currentPage = dataListStore.state.pageObj.currentPage;
	var pageCounts = dataListStore.state.pageObj.pageCount;
	if(currentPage == iText || iText <= 0 || iText>pageCounts){
	    $("#jumpText").val('');
	    return;
	}else{
		var URLParam;
		if(dataListStore.state.pageObj.searchFlag){
			URLParam = {
				currentPage: iText,
				keyword: dataListStore.state.pageObj.searchVal
			};
		}else{
			URLParam = {
				currentPage: iText,
			};
		}
		eouluGlobal.S_settingURLParam(URLParam, false, false, false);
	}
});

/*搜索全部*/
$("#search_input").on("input propertychange change", function(){
	$(this).val(_.trim($(this).val()));
}).on("keyup", function(e){
	var i = e.keyCode || e.which || e.charCode;
	if(i == 13){
		$(this).parent().parent().next().trigger("click");
	}
});
/*搜索*/
$("#search_button").on("click", function(){
	/*e.preventDefault();
	e.stopPropagation();*/
	var isearch = _.trim($("#search_input").val());
	var URLParam;
	if(_.isEmpty(isearch)){
		URLParam = {
			currentPage: 1,
		};
	}else{
		URLParam = {
			currentPage: 1,
			keyword: isearch
		};
	}
	eouluGlobal.S_settingURLParam(URLParam, false, false, false);
	return false;
});

/*上传文件全部*/
/*添加上传*/
$(".row_extra3 .well .glyphicon-plus-sign").click(function(){
	$("#add_file_Upload").val("");
	$(this).next().trigger("click");
});
/*选择文件*/
$("#add_file_Upload").on("change", function(){
	/*console.log($(this));
	console.log($(this)[0]);
	console.log($(this)[0].files);
	console.log($(this)[0].files[0]);*/
	if(dataListStore.state.bar.flag){
		dataListSwalMixin({
			title: "添加文件提示",
			text: "只可选一个上传哟，请先提交！",
			type: "warning",
			timer: 1600,
			callback: null
		});
		return false;
	}
	// dataListStore.state.bar.flag option Bar
	var size = $(this)[0].files[0].size;
	var name = $(this)[0].files[0].name;
	$(".upload_l_tit").text($(this)[0].files[0].name);
	$(".upload_l_body").text("大小："+eouluGlobal.S_getFileSize(size));
	dataListState.Bar = new ProgressBar.Circle("#upload_container", dataListState.BarOption);
	dataListState.Bar.text.style.fontFamily = '"microsoft yahei", "Arial", sans-serif';
	dataListState.Bar.text.style.fontSize = '2rem';
	
    var formData = new FormData();
    formData.enctype="multipart/form-data";
    // formData.append("ID",ID);
    formData.append("file", $(this)[0].files[0]);
    //formData.append("file",$("#serFinRepUpload")[0].files[0]);//append()里面的第一个参数file对应permission/upload里面的参数file         
    // formData.append("Operate","upload");
    $.ajax({
        type: "POST",
        async: true,  //这里要设置异步上传，才能成功调用myXhr.upload.addEventListener('progress',function(e){}),progress的回掉函数
        // accept: 'text/html;charset=UTF-8',
        accept: 'application/json; charset=utf-8',
        data: formData,
        // contentType:"multipart/form-data",
        url: "UploadFile",
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        cache: false,
        dataType: "json",
        xhr: function(){                        
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // check if upload property exists
                myXhr.upload.addEventListener('progress',function(e){                           
                    var loaded = e.loaded;                  //已经上传大小情况 
                    var total = e.total;                      //附件总大小 
                    var percent = (Math.floor(1000*loaded/total)/10)+"%";     //已经上传的百分比  
                    console.log("已经上传了："+percent);
                }, false); // for handling the progress of the upload
            }
            return myXhr;
        },                    
        success: function(data){
        	
        },
        error: function(){
        	
        },
		beforeSend: function(XMLHttpRequest){
        },
		complete: function(XMLHttpRequest, textStatus){
		    if(textStatus=="success"){
		    }
		}
    });  

	// Number from 0.0 to 1.0
	/*dataListState.Bar.animate(1.0, {
		duration: 10000
	}, function(){
		dataListSwalMixin({
			title: '上传成功！',
			text: name+" 已经上传至服务器",
			type: 'success',
			showConfirmButton: false,
			timer: 2500,
		});
	});*/
	/*dataListState.Bar.animate(0.4, {
	    duration: 800
	}, function() {
	    console.log('Animation has finished');
	});*/
	/*set(progress)*/
});
/*删除选中*/
$(".row_extra3>div:nth-child(2)>span.glyphicon-remove").click(function(){
	dataListStore.state.bar.Bar.destroy();
	$(".upload_l_tit").text("");
	$(".upload_l_body").text("");
	dataListStore.state.bar.flag = false;
});
