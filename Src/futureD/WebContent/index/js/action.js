/*公共的函数*/
	var storage=window.localStorage;
	var selectwafer = '';
	var waferSerialIDStr = '';
	var typeStr = '';
	var selectwafer1 = '';
	function jumpChar(){
		 selectwafer = storage.seeWaferID.replace(/;/g,' ');
		 waferSerialIDStr = storage.WaferID.replace(/;/g,' ');
		 typeStr =  storage.typeStr.replace(/;/g,' ');
		 selectwafer1 = storage.selectwafer1.replace(/;/g,' ');
	}
//2 获取状态参数函数
	var selectState = '';
	var FoldState1 = '';
	var FoldState2 = '';
	var selectDataState = [];
	function getStateParam(){
		selectDataState = []
		 selectState = $('.MultiSelection .selectSpan').text();
		if($('#fa-button1').hasClass('fa-minus-square')){
			 FoldState1 = '展开';
		}else{
			 FoldState1 = '折叠';
		}
		if($('#fa-button2').hasClass('fa-minus-square')){
			 FoldState2 = '展开';
		}else{
			 FoldState2 = '折叠';
		}
		for(var i = 0;i<$('.BgcolorSelect').length;i++){
			var idnum = $('.BgcolorSelect').eq(i).find('.chk').attr('value');
			selectDataState.push(idnum);
		}
	}
//3前端缓存参数函数
	
	function StateParamLocal(){
        	getStateParam();
            storage["selectState"]=selectState;
            storage.FoldState1=FoldState1;
            storage.FoldState2=FoldState2;
            storage.selectDataState=selectDataState;
            
	};
//4	页面加载几个状态的回显
	var storage=window.localStorage;

//6清掉缓存，设置初始状态
	function SetInit(){
         //写入b字段
         storage.selectState='单选';
         storage.FoldState1='展开';
         storage.FoldState2='展开';
         storage.selectDataState='';
	}
//7
	function paramLi(){
		for(var i= 0;i<$('.putcolor').length;i++){
  			var getWaferID = $('.putcolor').eq(i).find('.getWaferID').text();
  			var getDietype = $('.putcolor').eq(i).find('.getDietype').text();
  			var selectwafer = getWaferID+'------'+getDietype;
  			$('.putcolor').eq(i).find('.getWaferID').attr('selectwafer',selectwafer);
  			var num_value = $('.putcolor').eq(i).find('.chk').attr('value');
  			var typeStr = '<li class="indexType'+ num_value+'">'+num_value+'</li>';
  			var selectwafer1 = '<li class="index'+num_value +'">'+selectwafer+
  			'<b class="del'+num_value+' fa fa-minus-square"></b><input type="hidden" value="a"></li>';
  			$('.putcolor').eq(i).find('.getWaferID').attr('typeStr',typeStr);
  			$('.putcolor').eq(i).find('.getWaferID').attr('selectwafer1',selectwafer1);
  		}
	}
//设置在主页面选中的数据信息的缓存
	function setWaferParam(){
		//设置浏览器缓存，点击map图把数据带过去
	    storage.singleOrMultiParam = '单一参数';
	    storage.singleOrMultiParam_name = 'singleParamter';
	}
//选中的加上颜色，其余的去掉颜色，加上禁选
function deleteBgColorSelect($this){
	$this.parent().parent().removeClass('Bgcolor').addClass('BgcolorSelect');
	$this.parent().parent().siblings().removeClass('BgcolorSelect').addClass('Bgcolor');
}

//map图        1个或2个数据才可以看
$(document).on('click','#header_Map',function(){
	if(storage.WaferID.length == '0'){
		PromptBox("error","提示信息!","请选择相应数据!","","");
		return;
	}
	var selectwafer = '';
	var waferSerialIDStr = '';
	var typeStr = '';
	var selectwafer1 = '';
	var dataFormat = '';
	var device = '';
	var lot= '';
	if(storage.WaferID.length == '1'){
		selectwafer = storage.seeWaferID;
		waferSerialIDStr = storage.WaferID;
		typeStr = storage.typeStr;
		selectwafer1 = storage.selectwafer1;
		dataFormat = storage.dataFormat;
		device = storage.device;
		lot = storage.lot;
	}else if(storage.WaferID.length == '2'){
		selectwafer = storage.seeWaferID.replace(/;/g,' ');
		waferSerialIDStr = storage.WaferID.replace(/;/g,' ');
		typeStr = storage.typeStr.replace(/;/g,' ');
		selectwafer1 = storage.selectwafer1.replace(/;/g,' ');
		dataFormat = storage.dataFormat.replace(/;/g,' ');
		device = storage.device.replace(/;/g,' ');
		lot = storage.lot.replace(/;/g,' ');
	}else if(storage.WaferID.length >= '3'){
		//多选的时候跳转到第一个晶圆的所有参数
			var arr1 = storage.seeWaferID.split(';');
			var arr2 = storage.WaferID.split(';');
			var arr3 = storage.typeStr.split(';');
			var arr4 = storage.selectwafer1.split(';');
			var arr5 = storage.dataFormat.split(';');
			var arr6 = storage.device.split(';');
			var arr7 = storage.lot.split(';');
			selectwafer = arr1[0];
			waferSerialIDStr = arr2[0];
			typeStr = arr3[0];
			selectwafer1 = arr4[0];
			dataFormat =  arr5[0];
			device = arr6[0];
			lot = arr7[0];
	}
	if(dataFormat == 3|| dataFormat ==4 ){
		 StateParamLocal();
		 PromptBox("error","提示信息!","数据格式暂无法绘制Map！","","");
		 return
	}
	StateParamLocal();
	var currentPage = $('.ui-paging-count').text();     //currentpageParam
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
	var actionUrl=currentHref+"/paramdiedata?selectwafer="+selectwafer+
	"&waferSerialIDStr="+waferSerialIDStr+
	"&allParamter=allParamter"+
	"&typeStr="+typeStr+
	"&selectwafer1="+selectwafer1+
	"&device="+device+
	"&lot="+lot+
	"&currentPage="+currentPage;
	setWaferParam();
	window.location.href=actionUrl;
});
//相关性图
$(document).on('click','#header_Correlationplot',function(){
	if(storage.WaferID.length == '0'){
		PromptBox("error","提示信息!","请选择相应数据!","","");
		return;
	}
	var selectwafer = '';
	var waferSerialIDStr = '';
	selectwafer = storage.seeWaferID.replace(/;/g,' ');
	waferSerialIDStr = storage.WaferID.replace(/;/g,' ');
	StateParamLocal();
	var currentPage = $('.ui-paging-count').text(); 
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
	var actionUrl=currentHref+"/Correlation.do?selectwafer="+selectwafer+"&waferSerialIDStr="+waferSerialIDStr+"&currentPage="+currentPage;
	setWaferParam();
	window.location.href=actionUrl;	
});
//成品率
$(document).on('click','#header_Yplot',function(){
	if(storage.WaferID.length == '0'){
		PromptBox("error","提示信息!","请选择相应数据!","","");
		return;
	}
	jumpChar();
	StateParamLocal();
	var seeWaferIDStr = '';
	var WaferIDStr = '';
	selectwafer = storage.seeWaferID.replace(/;/g,' ');
	waferSerialIDStr = storage.WaferID.replace(/;/g,' ');
	storage.param = '';
	var a='clearAll';
	var currentPage = $('.ui-paging-count').text(); 
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
  	var actionUrl=currentHref+"/EdmChart/Yield.jsp?selectwafer="+selectwafer+"&ShowChart=YieldGraph&flag="+a+"&waferSerialIDStr="+waferSerialIDStr+"&typeStr="+typeStr+"&fromindex=fromindex"+"&selectwafer1="+selectwafer1+"&currentPage="+currentPage;
  	window.location.href=actionUrl;
});
//cpk图
$(document).on('click','#header_CPK',function(){
	if(storage.WaferID.length == '0'){
		return;
	}
	jumpChar();
	StateParamLocal();
	//console.log(currentHref);
	
	
	var a='clearAll';
	var currentPage = $('.ui-paging-count').text(); 
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
  	var actionUrl=currentHref+"/EdmChart/CPK-h.jsp?waferId="+selectwafer+"&waferSerialIDStr="+waferSerialIDStr+"&typeStr="+typeStr+"&selectwafer1="+selectwafer1+"&currentPage="+currentPage;
  	setWaferParam();
  	window.location.href=actionUrl;
});   
//直方图
$(document).on('click','#header_Splot',function(){
	var storage = window.localStorage;
	storage.isClick = '0';
  	storage.leftrange = '';
  	storage.rightrange = '';
  	storage.SID = '';
  	storage.param = '';
  	storage.Straightmap = '';
  	storage.isShow = '0';
	if(storage.WaferID.length == '0'){
		return;
	}
	jumpChar();
	StateParamLocal();
	var currentPage = $('.ui-paging-count').text(); 
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
	var actionUrl=currentHref+"/Histogram?selectwafer="+selectwafer+"&ShowChart=HistoGram"+"&waferSerialIDStr="+waferSerialIDStr+"&typeStr="+typeStr+"&selectwafer1="+selectwafer1+"&currentPage="+currentPage;
	setWaferParam();
	window.location.href=actionUrl;
});
//wafer图
$(document).on('click','#header_wafer',function(){
		if(storage.WaferID.length == '0'){
			PromptBox("error","提示信息!","请选择相应数据!","","");
			return;
		}
		/*var dataFormatArr = [];
		for(var i = 0 ; i < $("#table1 .BgcolorSelect").length ; i++ ){
			dataFormatArr.push( $("#table1 .BgcolorSelect").eq(i).find(".hideDataFormat").text())
		}*/
		var dataFormatArr = storage.dataFormat;
		var dataFormat =  dataFormatArr.split(";")[0];
		console.log(dataFormat);
		if(dataFormat == 2 ){
			 PromptBox("error","提示信息!","此数据格式暂无wafer数据！","","");
			 StateParamLocal();
			 return
		}
		window.localStorage.removeItem("dataFormat");
		window.localStorage.setItem("dataFormat",dataFormatArr);
		//var dataFormat = $("#table1 .BgcolorSelect").eq(0).find(".hideDataFormat").text();
		 var seeWaferID_temp = storage.seeWaferID.split(';')[0];
		 seeWaferID = seeWaferID_temp.slice(0,seeWaferID_temp.indexOf('------'));
		 DieType = seeWaferID_temp.slice(seeWaferID_temp.indexOf('------')+6,seeWaferID_temp.length);
		 fileName =  '';
		 StateParamLocal();
		 var currentPage = $('.ui-paging-count').text(); 
		 //缓存
		 var Wafer_Type = seeWaferID+'------'+DieType;
		 storage.Wafer_TypeCome = Wafer_Type;
		 $.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
		 var add = currentHref+"/WaferDieServlet.do?WaferID="+seeWaferID+"&pageNum=1&fileName="+fileName+"&DieType="+DieType+"&currentPage="+currentPage+"&dataFormat="+dataFormat;
		 setWaferParam();
		 console.log(add)
		 window.location.href=add;
});
//箱线图
$(document).on('click','#header_Xplot',function(){
	if(storage.WaferID.length == '0'){
		PromptBox("error","提示信息!","请选择相应数据!","","");
		return;
	}
	jumpChar();
	StateParamLocal();
	var a='clearAll';
	var currentPage = $('.ui-paging-count').text(); 
	//var currentHref = window.location.href.split("/")[2];
	$.Response_Load.Before("页面加载提示","页面跳转中！",200);  //页面加载动画
  	var actionUrl=currentHref+"/BoxPlot?selectwafer="+selectwafer+"&waferSerialIDStr="+waferSerialIDStr+"&typeStr="+typeStr+"&selectwafer1="+selectwafer+"&currentPage="+currentPage;
  	setWaferParam();
  	window.location.href=actionUrl;
});
//全选——全不选
$(document).on('click','#btnSelectAll',function(){
  	if(this.value=='全选'){
  		this.value='全不选';
  		$('.putcolor').addClass('BgcolorSelect');   
  		//计数
  		var num = $('.putcolor').length;
  	}else{
  		if(this.value=='全不选'){
  			this.value='全选';
  			$('.chk').each(function(){
  				$('.chk').parent().parent().removeClass('BgcolorSelect');  
  				$(this).prop('checked',false)
  			});
  		}
  	}
  });

/*单选和多选的功能*/
$(document).on('click','.selectSpan',function(){
		if($(this).text() == '多选'){
			$(this).text('').text('单选');
			$(".putcolor").removeClass('BgcolorSelect');
		}else{
			$(this).text('').text('多选');
		}
})
//存储选中的数据 跳页时使用


//搜索的切换
$(document).on('change','.serchbox .serchoption',function(){
	if($(this).find('option:selected').val() == '完成时间'){
		$('.searchContent').hide();
		$('.serchbox img').hide();
		$('.searchTime').show();
	}else{
		$('.searchContent').show();
		$('.serchbox img').show();
		$('.searchTime').hide();
	}
})

//单选多选去掉
$(document).on('click','.selectCancel ',function(){
	$(".BgcolorSelect").removeClass('BgcolorSelect');
	$('.changePage .waferData').text('').text(WaferIDArr.length)
	SetInit();
	storage.seeWaferID = '';
	storage.WaferID = '';
})


function getall(){
	var selectSearchType = "ProductCatgories";
	var selectParameters = "nonvalue";
	var currentpage =1;
	var endtime = "0";
	window.location.href=currentHref+"/GetSelectDataListPage?currentpage="+currentpage+"&selectSearchType="+selectSearchType+
	"&selectParameters="+selectParameters+"&searchNumber=0&endtime="+endtime;
}
//搜索
$(document).on('click','.searchOK',function(){
	$(".BgcolorSelect").removeClass('BgcolorSelect');
	storage.seeWaferID = '';
	storage.WaferID = '';
	//搜索
	var selectParameters =   $('.searchContent').val(); 
	var selectSearchType = $('.serchbox .serchoption').find('option:checked').attr('text');
	var startTime =   $('.startTime').val(); 
	var endtime =   $('.endTime').val(); 
	var searchNumber = 0;
	if(selectParameters == ""){
		window.location.href=currentHref+"/DataList"
	}
	else {
		var Parameter = "product_category,lot_number,wafer_number,qualified_rate,test_end_date,test_operator,description"
	   window.location.href= currentHref+"/DataList?currentPage=1&keyword="+selectParameters+"&Parameter="+Parameter ;
	}
})
//页面加载的时候搜索的回显
$(function(){
	/*StateRender();*/
	paramLi();
	/*var searchNumber  =  $('.searchNumber').text();
	var selectSearchType = $('.selectSearchType').text();
	var selectParameters = $('.selectParameters').text();
	if(selectParameters == 'nonvalue'){
		selectParameters = '';
	}
	var startTime =   $('.startTimeShow').text(); 
	var endtime =   $('.endTimeShow').text(); 
	var selectTypeArr = [];
	if(selectSearchType == 'TestEnd'){
		$('.searchContent').hide();
		$('.searchTime').show();
		$('.startTime').val('').val(startTime); 
		$('.endTime').val('').val(endtime); 
	}else{
		$('.searchContent').show();
		$('.searchTime').hide();
		$('.searchContent').val('').val(selectParameters);
	}
	$('.searchLeft select').find('option[text="'+selectSearchType+'"]').attr('selected',true);*/
	
	$('.searchContent').val('').val(keyword);
	if(keyword != ""){
		if( $(".putcolor").length >= 1){
			var reg = new RegExp("(" + keyword + ")", "g");
			for(var i = 0 ; i < $(".putcolor").length ; i++){
				for(var j = 0 ; j < $(".putcolor").eq(i).find(".showField").length ; j++){
					var str = $(".putcolor").eq(i).find(".showField").eq(j).text();
					var newstr = str.replace(reg, "<font color=red>$1</font>");
					$(".putcolor").eq(i).find(".showField").eq(j).text("").html(newstr);
				}
				
			}
		}
	}
})
//导航的添加
$(document).on('click','#add_but',function(){
		$('.cover').show();
		$(".addPage").css({height: "260px"});
		$(".UploadDataBox,.UploadContent").hide();
		$('.addPage,.UploadBox').show();
		$(".UploadDataBox #productcatagories,#fu_UploadFile").val("");
		$(".UploadDataBox #DataFormat option").removeAttr("selected");
		$(".UploadDataBox #introduce").val("");
});
//添加框的关闭
$(document).on('click','.addPage_title_close',function(){
	$('.cover').hide();
	$('.addPage').hide();
})
//回收站
$(document).on('click','#recycle',function(){
	 $.Response_Load.Before("页面加载提示","页面跳转中！",200);
	var actionUrl=currentHref+"/RecycleServlet";
	window.location.href=actionUrl;
});

//小眼睛事件
 $(document).on('click','.waferDisplay',function(){
		 if($(".MultiSelection .selectSpan").text() == "单选"){
			 $(this).parent().parent().removeClass('Bgcolor').addClass('BgcolorSelect');
				$(this).parent().parent().siblings().removeClass('BgcolorSelect').addClass('Bgcolor');
		 }
		 else{
			 $(this).parent().parent().removeClass('Bgcolor').addClass('BgcolorSelect');
		 }	
		setWaferParam();
		var ID = $(this).parent().parent().find('.chk').val();
		  var waferDisplays=$('.waferDisplay');
		  var dataFormat = $(this).parent().parent().find(".hideDataFormat").text();
				console.log("dataFormat==="+dataFormat) 
		  for(var i=0;i<waferDisplays.length;i++){
			 var operatorCell=this.parentNode.parentNode.getElementsByTagName('td')[4];

			 var getProductCatgories=this.parentNode.parentNode.getElementsByTagName('td')[1].innerText;

			 var getDeviceID=this.parentNode.parentNode.getElementsByTagName('td')[2].innerText;

			 var getLotID=this.parentNode.parentNode.getElementsByTagName('td')[3].innerText;

			

			 var DieType1=this.parentNode.parentNode.getElementsByTagName('td')[5];

			 var seeWaferID =	encodeURIComponent(operatorCell.innerText);
			
			 var DieType =	DieType1.innerText;
			
			 
			 var fileName =encodeURIComponent(''+getDeviceID+getLotID+seeWaferID +getProductCatgories);
			 StateParamLocal();
			 var add = currentHref+"/WaferDieServlet.do?WaferID="+seeWaferID+"&pageNum=1&fileName="+fileName+"&DieType="+DieType+"&ID="+ID+"&dataFormat="+dataFormat;
			 window.location.href=add;
		}
})
//跳页时候单、多选不变
$(document).on('click','#Gotojump,#upPage,#nextPage',function(){
	var singleOrMultiple = $('.MultiSelection .selectSpan').text();
	storage.selectState = singleOrMultiple;
})
/*------------------分页选数据---------------------------*/
//1点击数据
 var seeWaferIDStr = storage.seeWaferID;
 var WaferIDStr = storage.WaferID;	
 var typeStr = storage.typeStr;
 var selectwafer1 = storage.selectwafer1;
 var device = storage.device;
 var lot = storage.lot;
 
// console.log(typeStr)
 // console.log(selectwafer1)
 var WaferArr = [];
 var WaferIDArr = [];
 var typeStrArr = [];
 var selectwafer1Arr = [];
 var dataFormatArr = [];
 var deviceArr =[];//产品类型
 var lotArr =[];//lot
 if(seeWaferIDStr != '' && seeWaferIDStr != undefined){ WaferArr = seeWaferIDStr.split(';'); }
 if(WaferIDStr != '' && WaferIDStr != undefined){ WaferIDArr = WaferIDStr.split(';'); }
 if(typeStr != '' && typeStr != undefined){ typeStrArr = typeStr.split(';'); }
 if(selectwafer1 != '' && selectwafer1 != undefined){ selectwafer1Arr = selectwafer1.split(';'); }
 if(dataFormatArr != '' && dataFormatArr != undefined){ dataFormatArr = dataFormatArr.split(';'); }
 if(device != '' && device != undefined){ device = device.split(';'); }
 if(lot != '' && lot != undefined){ lot = lot.split(';'); }
 function ClearcurrentPageParam(){
	 for(var i = 0;i<$('.putcolor').length;i++){
			for(var j = 0;j<WaferIDArr.length;j++){
				if($('.putcolor').eq(i).find('.chk').val() == WaferIDArr[j]){
					WaferIDArr.splice(j,1);
					WaferArr.splice(j,1);
					typeStrArr.splice(j,1);
					selectwafer1Arr.splice(j,1);
					deviceArr.splice(j,1);
					lotArr.splice(j,1);
				}
			}
		}
 }
 function ArrToParamStr(){
	 	storage.seeWaferID = WaferArr.join(';');
		storage.WaferID = WaferIDArr.join(';');
		storage.typeStr = typeStrArr.join(';');
		storage.selectwafer1 = selectwafer1Arr.join(';');
		storage.dataFormat = dataFormatArr.join(';');
		storage.device = deviceArr.join(';');
		storage.lot = lotArr.join(';');
 }
 function ClearAll(){
	 	WaferIDArr = [];
		WaferArr = [];
		dataFormatArr = [];
		storage.seeWaferID = '';
		storage.WaferID = '';
		storage.typeStr = '';
		storage.selectwafer1 = '';
		storage.dataFormat = '';
		storage.device = '';
		storage.lot = '';
 }
$(document).on('click','.putcolor td:not(.operatingTd)',function(){
		var state = $(this).parents(".putcolor").find(".chooseTd .StateChange").attr("state");
		console.log(state)
		if(state =="true"){      //true说明选中
			$(this).parents(".putcolor").find(".chooseTd .StateChange").removeClass("newState").attr("state",false);
			$(this).parents(".putcolor").removeClass("BgcolorSelect");
		}
		else{
			$(this).parents(".putcolor").find(".chooseTd .StateChange").addClass("newState").attr("state",true);
			$(this).parents(".putcolor").addClass("BgcolorSelect");
		}
		
		
	var dataFormat = $(this).parent().find(".hideDataFormat").text();
	//console.log(dataFormat);
	if($(this).parent().hasClass('BgcolorSelect')){
		//从未选中到选中
		if($('.MultiSelection .selectSpan').text() == '单选'){
			WaferArr.splice(0,WaferArr.length);
			WaferIDArr.splice(0,WaferIDArr.length);
			typeStrArr.splice(0,typeStrArr.length);
			typeStrArr.splice(0,typeStrArr.length);
			deviceArr.splice(0,deviceArr.length);
			lotArr.splice(0,lotArr.length);
			
			WaferArr.push($(this).parent().find('.getWaferID').attr('selectwafer'));
			WaferIDArr.push($(this).parent().find('.chk').val());
			typeStrArr.push($(this).parent().find('.getWaferID').attr('typestr'));
			selectwafer1Arr.push($(this).parent().find('.chk').attr('selectwafer1'));
			deviceArr.push($(this).find('.getDeviceID').text());
			lotArr.push($(this).find('.getLotID').text());
			dataFormatArr=[];
			dataFormatArr.push(dataFormat);
		}else{//多选
			for(i = 0;i<WaferIDArr.length;i++){
				if($(this).parent().find('.chk').val() == WaferIDArr[i]){
					WaferIDArr.splice(i,1);
					WaferArr.splice(i,1);
					typeStrArr.splice(i,1);
					selectwafer1Arr.splice(i,1);
					deviceArr.splice(i,1);
					lotArr.splice(i,1);
					dataFormatArr.splice(i,1);
				}
			}
			WaferArr.push($(this).parent().find('.getWaferID').attr('selectwafer'));
			WaferIDArr.push($(this).parent().find('.chk').val());
			typeStrArr.push($(this).parent().find('.getWaferID').attr('typestr'));
			selectwafer1Arr.push($(this).parent().find('.chk').attr('selectwafer1'));
			deviceArr.push($(this).find('.getDeviceID').text());
			lotArr.push($(this).find('.getLotID').text());
			dataFormatArr.push(dataFormat);
		}
	}else{
		//console.log(WaferIDArr);
		//console.log(dataFormatArr);
		for(i = 0;i<WaferIDArr.length;i++){
			if($(this).parent().find('.chk').val() == WaferIDArr[i]){
				WaferIDArr.splice(i,1);
				WaferArr.splice(i,1);
				typeStrArr.splice(i,1);
				selectwafer1Arr.splice(i,1);
				deviceArr.splice(i,1);
				lotArr.splice(i,1);
				dataFormatArr.splice(i,1);
			}
		}
	}
	
	var SelectNum = 0;
	for(var i = 0;i<$('.putcolor').length;i++){
		for(var j = 0;j<WaferIDArr.length;j++){
			if($('.putcolor').eq(i).find('.chk').val() == WaferIDArr[j]){
				SelectNum++;
			}
		}
	}
	console.log(SelectNum);
	if(SelectNum == 10){
		$(" .allchoose .StateChange").addClass("newState").attr("state",true);
	}
	else{
		$(" .allchoose .StateChange").removeClass("newState").attr("state",false);
	}
	StateParamLocal();
	ArrToParamStr();
	$('.waferData').text('').text(WaferIDArr.length);
})
//2点击全选+3点击全不选
$(document).on('click','.allchoose .StateChange',function(){
	var state = $(this).attr("state");
	if(state =="true"){      //true说明选中
		$(this).removeClass("newState").attr("state",false);
		$(".putcolor .chooseTd .StateChange").removeClass("newState").attr("state",false);
		$(".putcolor").removeClass("BgcolorSelect");
	}
	else{
		
		$(this).addClass("newState").attr("state",true);
		$(".putcolor .chooseTd .StateChange").addClass("newState").attr("state",true);
		$(".putcolor").addClass("BgcolorSelect");
	}
	
	if($('.putcolor').hasClass('BgcolorSelect')){
		for(var i = 0;i<$('.putcolor').length;i++){
			for(var j = 0;j<WaferIDArr.length;j++){
				if($('.putcolor').eq(i).find('.chk').val() == WaferIDArr[j]){
					WaferIDArr.splice(j,1);
					WaferArr.splice(j,1);
					typeStrArr.splice(j,1);
					selectwafer1Arr.splice(j,1);
					deviceArr.splice(j,1);
					lotArr.splice(j,1);
				}
			}
			WaferArr.push($('.putcolor').eq(i).find('.getWaferID').attr('selectwafer'));
			WaferIDArr.push($('.putcolor').eq(i).find('.chk').val());
			typeStrArr.push($('.putcolor').eq(i).find('.getWaferID').attr('typestr'));
			selectwafer1Arr.push($('.putcolor').eq(i).find('.chk').attr('selectwafer1'));
			deviceArr.push($('.putcolor').eq(i).find('.getDeviceID').text());
			lotArr.push($('.putcolor').eq(i).find('.getLotID').text());
		}
	}else {
		ClearcurrentPageParam();
	}
	ArrToParamStr();
})
//4点击单选
$(document).on('click','.MultiSelection .selectSpan ',function(){
	ClearAll();
	$(".putcolor").removeClass('BgcolorSelect');
	$('.waferData').text('').text(WaferIDArr.length);
})
//5点击单、多选的取消
$(document).on('click','.MultiSelection .selectCancel',function(){
	ClearAll();
	$('.waferData').text('').text(WaferIDArr.length);
})
//6页面加载选后数据回显
$(function(){
	var WaferID = storage.WaferID;
	if(WaferID !== '' && WaferID !== undefined ){
		WaferIDArr = WaferID.split(';');
		dataFormatArr = storage.dataFormat.split(';');
		$('.waferData').text('').text(WaferIDArr.length);
		
	}else{
		$('.waferData').text('').text('0');
	}
	var SelectNum = 0;
	for(var i = 0;i<$('.putcolor').length;i++){
		for(var j = 0;j<WaferIDArr.length;j++){
			if($('.putcolor').eq(i).find('.chk').val() == WaferIDArr[j]){
				SelectNum++;
				$('.putcolor').eq(i).addClass('BgcolorSelect');
				$('.putcolor').eq(i).find(".StateChange ").addClass("newState").attr("state",true);
			}
		}
	}
	if(SelectNum == 10){
		$(" .allchoose .StateChange").addClass("newState").attr("state",true);
	}
})
$(document).on('click','.delete_but',function(){
	var self = $(this);
	var endtime = document.getElementById("endTime").value; 
	var username=UserName;
	var WaferIDAndDieType = $(this).parent().parent().find('.chk').val();
	function test() {
		console.log("inthis")
		var  selectwafer = storage.seeWaferID;
		var   waferSerialIDStr = storage.WaferID;
		var  typeStr =  storage.typeStr;
		var   selectwafer1 = storage.selectwafer1; 
		var  deviceStr =  storage.device;
		var   lotStr = storage.lot; 
		var  seeWaferIDArr = [];
		var  WaferIDArr = [];
		var  typeArr = [];
		var  selectwafer1Arr = [];
		//var  deviceArr = [];
		//var  lotArr = [];
		if(selectwafer != '' || selectwafer != undefined )seeWaferIDArr = selectwafer.split(';');
		if(waferSerialIDStr != '' || waferSerialIDStr != undefined )WaferIDArr = waferSerialIDStr.split(';');
		if(typeStr != '' || typeStr != undefined )typeArr = typeStr.split(';');
		if(selectwafer1 != '' || selectwafer1 != undefined )selectwafer1Arr = selectwafer1.split(';');
		
		//if(deviceStr != '' || deviceStr != undefined )deviceArr = deviceStr.split(';');
		//if(lotStr != '' || lotStr != undefined )lotArr = lotStr.split(';');
		for(var i = 0;i<WaferIDArr.length;i++){
			if(self.parent().parent().find('.chk').val() == WaferIDArr[i]){
				seeWaferIDArr.splice(i,1);
				WaferIDArr.splice(i,1);
				typeArr.splice(i,1);
				selectwafer1Arr.splice(i,1);
				//deviceArr.splice(j,1);
				//lotArr.splice(j,1);
			}
		}
		storage.seeWaferID = seeWaferIDArr.join(';');
		storage.WaferID = WaferIDArr.join(';');
		storage.typeStr = typeArr.join(';');
		storage.selectwafer1 = deviceArr.join(';');
		 $.ajax({
		      type : 'GET',
		      url : "DataListRemove",
		      dataType : 'json',
		      data : {
		    	  waferId :   WaferIDAndDieType
		      },
		      success : function (data) {
		    	  console.log(data == "true")
		    	if(data == true){
		    		window.location.href=currentHref+"/DataList"
		    	}
		      },
		      error : function () {
		      }
		  });
		
    	//window.location.href =currentHref+"/DataListRemove?waferId="+WaferIDAndDieType;
	}
	PromptBox("error","删除文件!","请注意,删除后会移入回收站!","是否继续删除",test);
})