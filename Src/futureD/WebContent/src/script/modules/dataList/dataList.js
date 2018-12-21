/*
* 2018-11-20 By LGD.HuaFEEng
* 
 */
/*var and function defined*/
var dataListStore = Object.create(null);
dataListStore.state = Object.create(null);
dataListStore.state.userName = null;
dataListStore.state.additionFinishFlag = false;
dataListStore.state.additionErrorFlag = false;
dataListStore.state.pageObj = {
	pageOption: null,
	currentPage: null,
	pageCount: null,
	searchFlag: false,
	searchVal: ""
};
dataListStore.state.authorityJQDomMap = {
	"管理员": [$('.g_info_r .AdminOperat')],
	"上传": [$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove-circle']")],
	"删除": [$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove']"), $(".operate_othertd [data-iicon='glyphicon-remove']")],
	"回收站": [$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-trash']")],
	"修改": [$(".operate_othertd [data-iicon='glyphicon-edit']")],
	"详细数据": [$(".operate_othertd [data-iicon='glyphicon-eye-open']")]
};
dataListStore.state.productCategory = [];
/*dataListStore.state.device_numberArr = _.isNil(store.get("futureDT2Online__dataList__device_numberArr")) ? [] : store.get("futureDT2Online__dataList__device_numberArr");*/
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
dataListStore.state.uploadClassify = null;
/*添加修改*/
dataListStore.addition = Object.create(null);
dataListStore.addition.file = {
	value: null,
	isRequired: false,
	reg: null
};
dataListStore.addition.productCategory = {
	value: null,
	isRequired: true,
	message: "产品类别必填！",
	reg: null
};
dataListStore.addition.dataFormat = {
	value: null,
	isRequired: true,
	message: "数据格式必选！",
	reg: null
};
dataListStore.addition.description = {
	value: null,
	isRequired: false,
	reg: null
};
dataListStore.addition.fileName = {
	value: null,
	isRequired: true,
	message: "文件必需！请检查或先上传",
	reg: null
};
dataListStore.addition.filePath = {
	value: null,
	isRequired: true,
	message: "文件上传异常！请重试",
	reg: null
};
dataListStore.addition.lastModified = {
	value: null,
	isRequired: true,
	message: "文件修改时间异常，请删除或刷新后重新选择文件",
	reg: null
};

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
	if(obj.isNull === true){
		_.forOwn(obj.obj, function(v, k){
			obj.obj[k].value = null;
		});
	}else{
		var extr;
		if(_.isNil(obj.extra) || _.isEmpty(obj.extra)) {
			extr = [];
		}else{
			extr = obj.extra.key;
		}
		_.forOwn(obj.obj, function(v, k){
			if(_.indexOf(obj.exclude, _.toString(k)) == -1 && _.indexOf(extr, _.toString(k)) == -1) {
				obj.obj[k].value = _.trim($("#"+obj.prefix+k).val());
			}
		});
		_.forEach(extr, function(v, i){
			obj.obj[v].value = obj.extra.value[i];
		});
	}
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
	 	html: obj.html,
	 	type: obj.type || "info",
	 	showConfirmButton: obj.showConfirmButton || false,
		timer: obj.timer,
	}).then(function(result){
		if(result.value){
			_.isFunction(obj.confirmCallback) && obj.confirmCallback();
		}else if(result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer){
			/*result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.timer || result.dismiss == swal.DismissReason.cancel*/
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

function additionUpdateIsSubmit(classify){
	if($(".futureDT2_"+classify).find("span.glyphicon-info-sign").length){
		$(".futureDT2_"+classify+"_r_foot>.btn-primary").prop("disabled", true);
	}else{
		$(".futureDT2_"+classify+"_r_foot>.btn-primary").prop("disabled", false);
	}
}

/*实时获取进度*/
function getProgress(value){
	value = value || 0;
	setTimeout(function(){
		$.ajax({
			type: "GET",
			url: "LoadProgress",
			// async: false,
			data: {
				fileName: dataListStore.addition.fileName.value
			},
			dataType: "text",
			success: function(res){
				var resp = res.match(/\d+/);
				console.log(res);
				if(_.isNil(resp)) getProgress(0);
				value = _.floor(resp[0], 1);
				/*dataListStore.state.additionProgress+= _.random(0, 99-dataListStore.state.additionProgress, true);
				dataListStore.state.additionProgress = _.floor(dataListStore.state.additionProgress*10)/10;*/
				$("div.futureDT2_addition_r_progress .progress-bar").attr("aria-valuenow", value).css("width", value+"%").text(value+"%");
				if(dataListStore.state.additionErrorFlag === true){
					eouluGlobal.S_getSwalMixin()({
						showConfirmButton: false,
						title: "提交进度",
						text: "提交出错，进度请求中止！",
						timer: 1800,
						type: "error"
					});
					dataListStore.state.additionErrorFlag = false;
				}else if(dataListStore.state.additionFinishFlag){
					$("div.futureDT2_addition_r_progress .progress-bar").attr("aria-valuenow", 100).css("width", "100%").text("100%");
					dataListStore.state.additionFinishFlag = false;
				}else{
					getProgress(value);
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log(jqXHR)
				console.log(textStatus)
				console.log(errorThrown)
			}
		});
	}, 50);
}

function barDestroy(){
	if(dataListStore.state.bar.flag){
		dataListStore.state.bar.Bar.destroy();
		dataListStore.state.bar.flag = false;
	}
	$(".upload_l_tit").text("");
	$(".upload_l_body").text("");
	$(".row_extra3>div:nth-child(2)>span.glyphicon-remove, .row_extra3>div:nth-child(2)>span.glyphicon-ok, .row_extra3>div:nth-child(2)>span.glyphicon-open").hide();
}

/*选择文件后的处理*/
function showBarAndOther(obj){
	var fileObj = obj.fileObj;
	$(".row_extra3>div:nth-child(2)>span.glyphicon-remove, .row_extra3>div:nth-child(2)>span.glyphicon-open").show();
	$(".row_extra3>div:nth-child(2)>span.glyphicon-ok").hide();
	$(".upload_l_tit").text(fileObj.name);
	$(".upload_l_body").text("大小："+eouluGlobal.S_getFileSize(fileObj.size));
	if(!dataListStore.state.bar.flag){
		dataListStore.state.bar.Bar = new ProgressBar.Circle("#upload_container", dataListStore.state.bar.option);
		dataListStore.state.bar.flag = true;
	}
	dataListStore.state.bar.Bar.text.style.fontFamily = '"microsoft yahei", "Arial", sans-serif';
	dataListStore.state.bar.Bar.text.style.fontSize = '2rem';
	dataListStore.addition.file.value = fileObj;
	dataListStore.addition.fileName.value = null;
	dataListStore.addition.filePath.value = null;
	/*dataListState.Bar.animate(0.4, {
	    duration: 800
	}, function() {
	    console.log('Animation has finished');
	});*/
	/*set(progress)*/
}

/*上传文件的ajax*/
function dataListFileUpload(obj){
	var formData = obj.formData,
	successOther = obj.successOther,
	errorOther = obj.errorOther;
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
                	if(e.lengthComputable){
                		var loaded = e.loaded;                  //已经上传大小情况 
                		var total = e.total;                      //附件总大小 
                		var floatPer = Math.floor(100*loaded/total)/100;
                		var percent = (Math.floor(1000*loaded/total)/10)+"%";     //已经上传的百分比  
                		// console.log("已经上传了："+percent);
                		// Number from 0.0 to 1.0
                		dataListStore.state.bar.Bar.animate(floatPer, {
                			duration: 1
                		}, function(){
                			if(floatPer == 1 || floatPer == 1.0){
                				dataListSwalMixin({
                					title: "上传完成！",
                					text: "服务器已经接收完 "+dataListStore.addition.file.value.name+"，请记得提交",
                					type: "success",
                					timer: 2000,
                					callback: null
                				});
                			}
                		});
                	}                         
                }, false); // for handling the progress of the upload
            }
            return myXhr;
        },
		/*xhr: function() {
			var xhr = new window.XMLHttpRequest();
			//Upload progress, request sending to server
			xhr.upload.addEventListener("progress", function(evt) {
				console.log("in Upload progress");
				console.log("Upload Done");
			}, false);
			//Download progress, waiting for response from server
			xhr.addEventListener("progress", function(e) {
				console.log("in Download progress");
				if (e.lengthComputable) {
					//percentComplete = (e.loaded / e.total) * 100;
					percentComplete = parseInt((e.loaded / e.total * 100), 10);
					console.log(percentComplete);
					$('#bulk-action-progbar').data("aria-valuenow", percentComplete);
					$('#bulk-action-progbar').css("width", percentComplete + '%');

				} else {
					console.log("Length not computable.");
				}
			}, false);
			return xhr;
		},*/
        success: function(data){
        	if(!_.isNil(data) && !_.isEmpty(data)){
        		_.forOwn(data, function(v, k){
        			dataListStore.addition.fileName.value = k;
        			dataListStore.addition.filePath.value = v;
        		});
        		$(".row_extra3>div:nth-child(2)>span.glyphicon-ok").show();
        		$(".row_extra3>div:nth-child(2)>span.glyphicon-remove, .row_extra3>div:nth-child(2)>span.glyphicon-open").hide();
        	}else{
        		dataListSwalMixin({
        			title: "处理失败！",
        			text: dataListStore.addition.file.value.name+" 已经上传至服务器，但是处理失败",
        			type: "error",
        			timer: 2000,
        			callback: null
        		});
        		barDestroy();
        		dataListStore.addition.file.value = null;
        	}
        	successOther && _.isFunction(successOther) && successOther(data);
        },
        error: function(){
        	errorOther && _.isFunction(errorOther) && errorOther(data);
        },
		beforeSend: function(XMLHttpRequest){
			eouluGlobal.C_btnDisabled($(".futureDT2_addition_r_foot .btn-primary"), true, "正在上传...");
        },
		complete: function(XMLHttpRequest, textStatus){
		    if(textStatus=="success"){
		    }
		    eouluGlobal.C_btnAbled($(".futureDT2_addition_r_foot .btn-primary"), true, "提交");
		}
    });
}
/*page preload*/

/*page onload*/
$(function(){
	/*判断权限*/
	eouluGlobal.C_pageAuthorityCommonHandler({
		authorityJQDomMap: _.cloneDeep(dataListStore.state.authorityJQDomMap),
		callback: function(){
			$(".g_bodyin_bodyin_tit_l>img:visible").each(function(i, el){
				if(i>0) $(el).css("margin-left", "15px");
				if($(el).is("[data-iicon='glyphicon-trash']")) $(el).css("margin-left", "12px");
			});
			$(".g_bodyin_bodyin_body tbody>tr").each(function(i, el){
				$(el).find("td.operate_othertd img:visible").each(function(ii, ele){
					if(ii>0) $(ele).css("margin-left", "5px");
				});
			});
		}
	});
	/*判断权限end*/

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

	/*缓存产品名称*/
	/*$(".device_number_td").each(function(){
		dataListStore.state.device_numberArr.push($(this).data("ivalue").toString());
	});
	dataListStore.state.device_numberArr = _.uniq(dataListStore.state.device_numberArr);
	store.set("futureDT2Online__dataList__device_numberArr", _.cloneDeep(dataListStore.state.device_numberArr));*/

	/*缓存产品类别*/
	$(".data_c_c .category_span").each(function(){
		dataListStore.state.productCategory.push($(this).attr("value"));
	});
	dataListStore.state.productCategory = _.uniq(dataListStore.state.productCategory);
	$("#futureDT2_addition_productCategory, #futureDT2_update_productCategory").each(function(i, el){
		new Awesomplete(el, {
			list: _.cloneDeep(dataListStore.state.productCategory),
			minChars: 1,
			maxItems: 13,
			autoFirst: true
		});
	});
});

/*event handler*/
$(window).on("resize", function(){
	tableEllipsis();
});

/*添加修改打开关闭*/
$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove-circle']").click(function(){
	$(".futureDT2_bg_cover, .futureDT2_addition").slideDown(200);
	$(".futureDT2_addition_l, .futureDT2_addition_r").height($(".futureDT2_addition").height());
	barDestroy();
	/*回显验证*/
	$("div.futureDT2_addition_r_bodyin .isRequired").trigger("change");
});
$(".futureDT2_addition_r_foot .btn-warning, .futureDT2_update_r_foot .btn-warning").click(function(){
	var $iparent = $(this).parents("[data-iparent]");
	$(".futureDT2_bg_cover").slideUp(200);
	$iparent.slideUp(200);
	var classify = $iparent.data("iparent");
	injectStoreValue({
		obj: dataListStore[classify],
		isNull: true
	});
	$("div.futureDT2_addition_r_progress").slideUp(30);
});
$(document).on("click", ".operate_othertd>[data-iicon='glyphicon-edit']", function(e){
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
	/*回显验证*/
	$("div.futureDT2_update_r_bodyin .isRequired").trigger("change");
});

// 解决冲突
// function add0(m){return m<10?'0'+m:m }
// //时间戳转化成时间格式
// function timeFormat(timestamp){
// //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
//   var time = new Date(timestamp);
//   var year = time.getFullYear();
//   var month = time.getMonth()+1;
//   var date = time.getDate();
//   var hours = time.getHours();
//   var minutes = time.getMinutes();
//   var seconds = time.getSeconds();
//   return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
// }
// 解决冲突结束


/*添加修改提交*/
$(".futureDT2_addition_r_foot .btn-primary, .futureDT2_update_r_foot .btn-primary").click(function(){
	var iparent = $(this).parents("[data-iparent]").data("iparent");
	if(_.isEqual(iparent, "addition")){
		var lastModified;
		if(_.isNil(dataListStore.addition.file.value)){
			lastModified = null;
		}else{
			lastModified = moment(dataListStore.addition.file.value.lastModified).format("YYYY-MM-DD HH:mm:ss");
			if(_.isNil(lastModified) || _.isEmpty(lastModified)){
				lastModified = moment(dataListStore.addition.file.value.lastModifiedDate.getTime()).format("YYYY-MM-DD HH:mm:ss");
			}
		}
		console.log("lastModified",lastModified);
		injectStoreValue({
			obj: dataListStore.addition,
			exclude: ["file", "fileName", "filePath"],
			prefix: "futureDT2_addition_",
			extra: {
				key: ["lastModified"],
				value: [lastModified]
			}
		});
		var flag1 = validationStoreValue({
			obj: dataListStore.addition,
			title: "添加提示"
		});
		if(!flag1) return false;
		var ajaxData1 = {};
		_.forOwn(dataListStore.addition, function(v, k){
			if(k != "file") ajaxData1[k] = v.value;
		});
		eouluGlobal.C_btnDisabled($(".futureDT2_addition_r_foot .btn-primary"), true, "提交中...");
		/*显示进度条*/
		dataListStore.state.additionFinishFlag = false;
		dataListStore.state.additionErrorFlag = false;
		$("div.futureDT2_addition_r_progress").slideDown(30);
		$("div.futureDT2_addition_r_progress .progress-bar").attr("aria-valuenow", 0).css("width", "0%").text("0%");
		getProgress(0);
		/*$.ajax({
			type: "POST",
			url: "UploadStorage",
			data: ajaxData1,
			dataType: "json"
		}).then(function(data){
			dataListStore.state.additionFinishFlag = true;
			dataListSwalMixin({
				title: "添加提示",
				text: data,
				timer: 1500,
				callback: null
			});
			eouluGlobal.C_btnAbled($(".futureDT2_addition_r_foot .btn-primary"), true, "提交");
			if(data.indexOf("有误") > -1 || data.indexOf("未接收") > -1){
				barDestroy();
			}else if(data.indexOf("成功") > -1){
				$(".futureDT2_addition_r_foot .btn-warning").trigger("click");
				eouluGlobal.S_settingURLParam({
					currentPage: 1
				}, false, false, false);
			}
		}, function(){
			eouluGlobal.C_server500Message();
			eouluGlobal.C_btnAbled($(".futureDT2_addition_r_foot .btn-primary"), true, "提交");
		});*/

		/*新方法*/
		eouluGlobal.S_XHR({
			status200: function(data){
				console.log(data);
				data = _.toString(data).replace(/^"/, "").replace(/"$/, "");
				console.log(data)
				console.log(typeof data)
				var imess_text,
				imess_html;
				if(data.indexOf("文件夹") > -1){
					imess_html = '<div class="container-fluid">'+data+'<div><img src="assets/img/modules/dataList/fileSuffix.png" /></div></div>';
					imess_text = void(0);
				}else{
					imess_text = data;
					imess_html = void(0);
				}
				dataListSwalMixin({
					title: "添加提示",
					html: imess_html,
					text: imess_text,
					timer: 10000,
					showConfirmButton: true,
					callback: function(){
						eouluGlobal.S_settingURLParam({
							currentPage: 1
						}, false, false, false);
					},
					confirmCallback: function(){
						eouluGlobal.S_settingURLParam({
							currentPage: 1
						}, false, false, false);
					}
				});
				dataListStore.state.additionFinishFlag = true;
				dataListStore.state.additionErrorFlag = false;
				if(data.indexOf("有误") > -1 || data.indexOf("未接收") > -1 || data.indexOf("失败") > -1){
					barDestroy();
				}else if(data.indexOf("成功") > -1){
					$(".futureDT2_addition_r_foot .btn-warning").trigger("click");
				}
			},
			statusError: function(xhr, statusText){
				console.log(statusText);
				console.log(xhr);
				eouluGlobal.C_server500Message({
					callback: null
				});
				dataListStore.state.additionFinishFlag = false;
				dataListStore.state.additionErrorFlag = true;
			},
			readyState4: function(readyState, xhr, status){
				eouluGlobal.C_btnAbled($(".futureDT2_addition_r_foot .btn-primary"), true, "提交");
			},
			type: "POST",
			postObject: {
				url: "UploadStorage",
				data: ajaxData1,
				classify: "form",
				responseType: "text"
			}
		});
		/*新方法end*/

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
					timer: 1800,
					callback: null
				});
			}
		}, function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR)
			console.log(textStatus)
			console.log(errorThrown)
			eouluGlobal.C_server500Message({
				callback: null
			});
		});
	}
});

/*删除和批量删除*/
$(document).on("click", ".operate_othertd [data-iicon='glyphicon-remove']", function(e){
	e.stopPropagation();
	var iThat = $(this);
  	eouluGlobal.S_getSwalMixin()({
	 	title: "确定删除吗？",
	 	text: "删除后将放入回收站",
	 	/*html: '',*/
	 	type: "warning",
	 	showCancelButton: true,
	  	confirmButtonText: '确定，删除！',
	  	cancelButtonText: '不，取消！',
	  	reverseButtons: false
	}).then(function(result){
		if (result.value) {
			// {value: true}
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
							var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem") || [];
							_.pull(selectedItem, iThat.data("iid").toString());
							store.set("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem", selectedItem);
							if($(".g_bodyin_bodyin_body tbody>tr").length == 1){
								var URLParam,
								icurPage = $("body").data("currentpage") - 1 == 0 ? 1 : ($("body").data("currentpage") - 1);
								if(dataListStore.state.pageObj.searchFlag){
									URLParam = {
										currentPage: icurPage,
										keyword: dataListStore.state.pageObj.searchVal
									};
								}else{
									URLParam = {
										currentPage: icurPage,
									};
								}
								eouluGlobal.S_settingURLParam(URLParam, false, false, false);
							}else{
								window.location.reload();
							}
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
				eouluGlobal.C_server500Message({
					callback: null
				});
			});
		} else if (result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel) {
		  	dataListSwalMixin({
		  		title: "删除提示",
		  		text: "取消了，不作处理",
		  		timer: 1500,
		  		callback: null
		  	});
		}
	});
}).on("click", ".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove']", function(){
	var selectedItem = store.get("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem");
	if(_.isNil(selectedItem) || _.isEmpty(selectedItem)) return false;
  	eouluGlobal.S_getSwalMixin()({
	 	title: "确定删除吗？",
	 	text: "将删除选中的"+selectedItem.length+"条数据，删除后将放入回收站",
	 	/*html: '',*/
	 	type: "warning",
	 	showCancelButton: true,
	  	confirmButtonText: '确定，删除！',
	  	cancelButtonText: '不，取消！',
	  	reverseButtons: false
	}).then(function(result){
		if (result.value) {
			// {value: true}
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
							var URLParam,
							icurPage;
							if(selectedItem.length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length){
								/*如果是都在本页删除*/
								if($(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length == $(".g_bodyin_bodyin_body tbody input[type='checkbox']").length){
									/*如果全部删除了*/
									icurPage = $("body").data("currentpage") - 1 == 0 ? 1 : ($("body").data("currentpage") - 1);
								}else{
									icurPage = $("body").data("currentpage");
								}
								if(dataListStore.state.pageObj.searchFlag){
									URLParam = {
										currentPage: icurPage,
										keyword: dataListStore.state.pageObj.searchVal
									};
								}else{
									URLParam = {
										currentPage: icurPage,
									};
								}
							}else{
								if(dataListStore.state.pageObj.searchFlag){
									URLParam = {
										currentPage: 1,
										keyword: dataListStore.state.pageObj.searchVal
									};
								}else{
									URLParam = {
										currentPage: 1,
									};
								}
							}
							store.set("futureDT2Online__"+dataListStore.state.userName+"__dataList__selectedItem", []);
							eouluGlobal.S_settingURLParam(URLParam, false, false, false);
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
				eouluGlobal.C_server500Message({
					callback: null
				});
			});
		} else if (result.dismiss == swal.DismissReason.backdrop || result.dismiss == swal.DismissReason.esc || result.dismiss == swal.DismissReason.cancel) {
		  	dataListSwalMixin({
		  		title: "删除提示",
		  		text: "取消了，不作处理",
		  		timer: 1300,
		  		callback: null
		  	});
		}
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
$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){
	$(this).prev().children("input").val("");
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
	var fileObj = $(this)[0].files[0];
	showBarAndOther({
		fileObj: fileObj
	});
	dataListStore.state.uploadClassify = "select";
});
/*上传文件*/
$(".row_extra3>div:nth-child(2)>span.glyphicon-open").click(function(){
	if(_.isNil(dataListStore.addition.file.value)) return false;
    var formData = new FormData();
    formData.enctype="multipart/form-data";
    formData.append("file", dataListStore.addition.file.value);
    //formData.append("file",$("#serFinRepUpload")[0].files[0]);//append()里面的第一个参数file对应permission/upload里面的参数file         
    dataListFileUpload({
    	formData: formData
    });
});
/*删除选中*/
$(".row_extra3>div:nth-child(2)>span.glyphicon-remove").click(function(){
	barDestroy();
	dataListStore.addition.file.value = null;
	dataListStore.state.uploadClassify = null;
});

/*验证*/
$(".isRequired").on("input propertychange change", function(){
	var iVal = $(this).val();
	var str;
	var classify = $(this).parents("[data-iparent]").data("iparent");
	if(_.isNil(iVal)){
		str = "info";
	}else{
		if(iVal.trim() == ""){
			str = "info";
		}else{
			if($(this).is("#futureDT2_update_testEndDate")){
				if(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(iVal)){
					if(iVal.trim() > moment().format('YYYY-MM-DD')){
						str = "info";
					}else{
						str = "ok";
					}
				}else{
					str = "info";
				}
			}else{
				str = "ok";
			}
		}
	}
	$(this).parents("div.row").find("div.info_div").empty().append('<span class="glyphicon glyphicon-'+str+'-sign" aria-hidden="true"></span>');
	additionUpdateIsSubmit(classify);
});

/*跳转详细数据页面*/
$(document).on("click", ".operate_othertd [data-iicon='glyphicon-eye-open']", function(e){
	e.stopPropagation();
	var iThat = $(this),
	waferId = iThat.data("iid");
	$.ajax({
		type: "GET",
		url: "Examine",
		data: {
			waferId: waferId
		},
		dataType: "json"
	}).then(function(data){
		if(data === true){
			var dataFormat = iThat.parent().siblings(".data_format_td").data("ivalue");
			var webParam = iThat.parent().siblings(".device_number_td").data("ivalue") +"futureDT2OnlineDataListSplitor"+ iThat.parent().siblings(".lot_number_td").data("ivalue") +"futureDT2OnlineDataListSplitor"+ iThat.parent().siblings(".wafer_number_td").data("ivalue")+"futureDT2OnlineDataListSplitor"+ iThat.parent().siblings(".die_type_td").data("ivalue");
			eouluGlobal.S_settingURLParam({
				waferId: waferId,
				dataFormat: dataFormat,
				webParam: webParam
			}, false, false, false, "WaferData");
		}else if(data === false){
			dataListSwalMixin({
				title: "查看详细信息提示",
				text: "无被测Die数据，不能访问",
				type: "warning",
				timer: 2000,
				callback: null
			});
		}else{
			dataListSwalMixin({
				title: "查看详细信息提示",
				text: data.replace(/^"/, "").replace(/"$/, ""),
				type: "warning",
				timer: 2000,
				callback: null
			});
		}
	});
});

/*跳转至回收站*/
$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-trash']").click(function(){
	eouluGlobal.S_settingURLParam({}, false, false, false, "RecycleBin");
});

/*2018-12-4 增加拖拽上传*/
var dropFileCon = document.getElementById("dropFileCon");
dropFileCon.ondragover = function(e) {
	e.preventDefault();
	this.style.backgroundColor = "#ddd";
	this.getElementsByTagName("small")[0].innerText = "释放鼠标，立即上传！";
	return false;
};

dropFileCon.ondragenter = function(e) {
	e.preventDefault();
	this.style.backgroundColor = "#ddd";
	this.getElementsByTagName("small")[0].innerText = "释放鼠标，立即上传！";
	return false;
};

dropFileCon.ondragleave = function(e) {
	e.preventDefault();
	this.style.backgroundColor = "#f5f5f5";
	this.getElementsByTagName("small")[0].innerText = "支持Excel、TXT、zip、rar格式";
	return false;
};

dropFileCon.ondrop = function(e) {
	e.preventDefault();
	var files = e.dataTransfer.files,
	iflag = false;
	console.table && console.table(files);
	// 如果没有文件
	if(files.length < 1){
		iflag = true;
	}else if(files.length > 1){
		dataListSwalMixin({
			title: "拖拽上传提示",
			text: "一次只能选择一个文件",
			type: "info",
			timer: 1600,
			callback: null
		});
		iflag = true;
	}
	if(iflag) {
		dropFileCon.style.backgroundColor = "#f5f5f5";
		dropFileCon.getElementsByTagName("small")[0].innerText = "支持Excel、TXT、zip、rar格式";
		return false;
	}
	var fileObj = files[0]; // 获取当前的文件对象
	var formData = new FormData();
	dataListStore.addition.file.value = fileObj;
	dataListStore.state.uploadClassify = "drop";
    formData.enctype="multipart/form-data";
    formData.append("file", fileObj);
    //formData.append("file",$("#serFinRepUpload")[0].files[0]);//append()里面的第一个参数file对应permission/upload里面的参数file  
    showBarAndOther({
		fileObj: fileObj
	});  
    dataListFileUpload({
    	formData: formData,
    	successOther: function(){
    		dropFileCon.style.backgroundColor = "#f5f5f5";
    		dropFileCon.getElementsByTagName("small")[0].innerText = "支持Excel、TXT、zip、rar格式";
    	},
    	errorOther: function(){
    		dropFileCon.style.backgroundColor = "#f5f5f5";
    		dropFileCon.getElementsByTagName("small")[0].innerText = "支持Excel、TXT、zip、rar格式";
    	}
    });
	return false;
};