
var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3]; //当前网址
$(".top").load(currentHref+"/common/top.html");

$(document).on("click",".chooseTd .StateChange",function(){
	var state = $(this).attr("state");
	if(state =="true"){      //true说明选中
		$(this).removeClass("newState").attr("state",false);
		$(this).parents(".putcolor").removeClass("BgcolorSelect");
	}
	else{
		$(this).addClass("newState").attr("state",true);
		$(this).parents(".putcolor").addClass("BgcolorSelect");
	}
})
//跳页
$(document).on("click",".Gotojump",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	var jumpNumber = document.getElementsByClassName("ui-paging-count")[0].value;
	pagejump(jumpNumber);
});
$(document).on("click",".pagenum",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	var jumpNumber = $(this).text();
	pagejump(jumpNumber);
});
//首页
$(document).on("click",".js-page-first",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	firstPage();
});
//上一页
$(document).on("click",".js-page-prev",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	 upPage();
});
//下一页
$(document).on("click",".js-page-next",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	nextPage();
});
//尾页
$(document).on("click",".js-page-last",function(){
	$.Response_Load.Before("数据加载提示","数据加载中！",200);  //页面加载动画
	lastPage();
});



Array.prototype.in_array=function(e){
var r=new RegExp(','+e+',');
return (r.test(','+this.join(this.S)+','));};



if(AuthorityColumn ==""){$("#table1 tr td").hide();  $("#page").hide()}
/*else{
	AuthorityColumn = AuthorityColumn.replace('[',"").replace(']',"").split(", {");
	var showTd=[];
	for(var a = 0 ; a < AuthorityColumn.length ; a++){
		var authority_id = AuthorityColumn[a].match(/=(\S*)}/)[1];
		showTd.push(authority_id);
	}
	for(var b = 1 ; b < 13 ; b++){
		if(!showTd.in_array(b)){
			$("#table1 tr.table1Tit td:nth-child("+(b+2)+")").hide();
			$("#table1 tr.putcolor td:nth-child("+(b+3)+")").hide();
		}
	}
}*/


if(CurrentPage<1){
	CurrentPage = 1;
}
if(AllPage==null || AllPage==""){
	AllPage=0;
}
$('#pageToolbar').Paging({pagesize:"1",current:CurrentPage,count:AllPage,toolbar:true});

//判断session  跳转页面
if(UserName == null || UserName == "" ){
	window.location.href = currentHref+"/logerror.jsp"
}
else{
	$(".u-span").text("").text("当前用户："+UserName);
	$(".UserName").text(UserName);
	$("#DiaryUsername,#productOperator,#DiaryUsername1").val(UserName);
	$(".changePage .currentpage").text(CurrentPage);
	$(".changePage .allpage").text(AllPage);
}


$(function(){
//	if(productcatagories){
//		productcatagories = productcatagories.replace("[", "").replace("]", "").split(",");
//		var str = "";
//		for(var i = 0 ; i < productcatagories.length ; i++){
//			str += "<option value='"+productcatagories[i]+"'>"+productcatagories[i]+"</option>";
//		}
//		$(".produceTypeLi .produceType").append(str);
//	}
//	if(usernames){
//		usernames = usernames.replace("[", "").replace("]", "").split(",");
//		var str = "";
//		 for(var i = 0 ; i < usernames.length ; i++){
//			str += "<option value='"+usernames[i]+"'>"+usernames[i]+"</option>";
//		}
//		$(".testOperatorLi .testOperator").append(str); 
//		//测试栏添加默认选项
//		var testOper = document.getElementById("testOperator");
//		testOper.value = testOper.options[0].value;
//	}
	
	$(document).on("click","#help",function(){
		window.open(currentHref+"/common/futureD数据管理系统使用手册.html"); 
	});
	
})

var Parameter = "product_category,lot_number,wafer_number,qualified_rate,test_end_date,test_operator,description";
//跳页部分
function pagejump(jumpNumber){
	if(jumpNumber==null || jumpNumber==0){
		jumpNumber=CurrentPage;
	}
	else if(jumpNumber >= AllPage ){
		jumpNumber == AllPage
	}
	console.log(jumpNumber);
	if(keyword == ""){
		var href= currentHref+'/DataList?currentPage='+jumpNumber;
	}
	else{
		var href= currentHref+'/DataList?currentPage='+jumpNumber+"&keyword="+keyword+"&Parameter="+Parameter;
	}
	window.location.href=href;
}

//界面跳转
function lastPage(){
	if(keyword == ""){
		var href= currentHref+'/DataList?currentPage='+AllPage;
	}
	else{
		var href= currentHref+'/DataList?currentPage='+AllPage+"&keyword="+keyword+"&Parameter="+Parameter;
	}
	window.location.href=href;
}
function firstPage(){
	if(keyword == ""){
		var href= currentHref+'/DataList?currentPage=1';
	}
	else{
		var href= currentHref+'/DataList?currentPage=1'+"&keyword="+keyword+"&Parameter="+Parameter;
	}
	window.location.href=href;
}

//上一页  下一页
  var current_page_last  = parseFloat(CurrentPage ) -1;
  var current_page_next  = parseFloat(CurrentPage ) +1;
  if(current_page_next > AllPage){
	  current_page_next  = AllPage;
  }
  else if(current_page_last<=0){
	  current_page_last = 0;
  }
function upPage(){
	if(keyword == ""){
		var href= currentHref+'/DataList?currentPage='+current_page_last;
	}
	else{
		var href=  currentHref+'/DataList?currentPage='+current_page_last+"&keyword="+keyword+"&Parameter="+Parameter;
	}
	window.location.href=href;
};
function nextPage(){
	if(keyword == ""){
		var href= currentHref+'/DataList?currentPage='+current_page_next;
	}
	else{
		var href= currentHref+'/DataList?currentPage='+current_page_next+"&keyword="+keyword+"&Parameter="+Parameter;
	}
	window.location.href=href;
};

$(document).on("click","#table1 .edit",function(){
	$(".cover,.EditBox").show();
	$(".EditBox #produceType").val($(this).parent().parent().find(".getProductCatgories").text());
	$(".EditBox #testPerson").val("").val($(this).parent().parent().find(".testOperator").text());
	$(".EditBox #TestEndTime").val($(this).parent().parent().find(".testend").text());
	$(".EditBox #introduce").text($(this).parent().parent().find(".introduce").text());
	$(".EditBox #waferID").val($(this).parent().parent().find(".getWaferID").text());
	$(".EditBox #Dietype").val($(this).parent().parent().find(".getDietype").text());
});

$(document).on('click','.close-btn',function(){		
	$('.addPage').hide();
	$('.EditBox').hide();
	$('.cover').hide();
});

$(document).on('click','.top_tool_li4',function(){	  	
	 function test() {
		 $.ajax({
		      type : 'GET',
		      url : "Logon",
		      dataType : 'json',
		      success : function (data) {
		    	 window.location.replace(currentHref+"/Login/login.jsp");
		 		 event.returnValue=false;
		      },
		      error : function () {
		      }
		  });
     }
	 PromptBox("error","提示信息!","确定要退出吗？","",test);
});

$(document).on('click','.top_tool_li1',function(){		
	var showorhide = $('.top_tool_li1').attr("flag");
	console.log(showorhide)
	if(showorhide == "true"){
		$(".top_tool_li1 dl").show({duration: 400});
		$(this).removeAttr("flag").attr("flag","false");
	}
	else{
		console.log("inini")
		$(".top_tool_li1 dl").hide();
		$(this).removeAttr("flag").attr("flag","true");
	}
});
 $("body").not(".top_tool_li1").click(function(){		
	$(".top_tool_li1 dl").hide();
	$(".top_tool_li1").attr("flag","true");
});


function check(radioValue) {
	document.getElementById("hidetext").value = radioValue;
	if(radioValue == 'TestEnd'){
		$('#date').css('display','inline-block');
	}
}

$(document).on('click','#fu_UploadFile_cover',function(){	
	$("#fu_UploadFile").click();
})
$(document).on('change','#fu_UploadFile',function(){
	var stratTime = new Date().getTime();
	var path = $("#fu_UploadFile").val();
	if(path.indexOf("\\") > 0){
		var FileName = path.split("\\")[path.split("\\").length-1];
	}
	//$("#fu_UploadFile_cover").val(FileName);
	$(".UploadContent_middle .p1").text(FileName);
	//圆弧进度条与下一步的切换
	$(".UploadContent_right_loadover").hide();
	$(".UploadContent .UploadContent_right_loading").show({duration: 400});
	$(".UploadContent").show({duration: 400});
	$(".addPage").animate({height: "400px"});
	$("#upload_num").circleChart({
        value:  100,
        color:"#32c462",
        size: 70,
        text: 0,
        widthRatio :0.1,
        startAngle :75,
        redraw : true,
        onDraw: function(el, circle) {
            circle.text(Math.round(circle.value) + "%");
            if(Math.round(circle.value) == 100){
            	var endTime = new Date().getTime();
            	var time = ((endTime - stratTime) /1000).toFixed(2);
            	$(".UploadTime").text("(耗时:"+time+"s)")
            	$(".UploadContent .UploadContent_right_loading").hide();
            	$(".UploadContent_right_loadover").show({duration: 400});
            }
        },
    });
})
$(document).on("click","#upload_next",function(){
	$(".UploadContent,.UploadBox").hide();
	$(".UploadDataBox").show({duration: 500});
})

function upload() {
	if($('#productcatagories').val()== ''){
		PromptBox("error","提示信息!","请输入产品类别！","","");
		return false;
	}
    var path = document.getElementById("fu_UploadFile").value;
    if ($.trim(path) == "") {
    	PromptBox("error","提示信息!","请选择要上传的文件！","","");
    	return false; 
    }
    $(".Progress_num").html("0%");
	$(".ProgressBar2").css("width","142px"); //初始化样式
	$(".addPage input,.addPage textarea").attr("readonly","readonly");
	$(".addPage select").attr("disabled","disabled");
    $('#addSubmit,.close-btn').css('background','gray');
	$('#addSubmit,.close-btn').attr('disabled',true);
	
    var result_msg = "";
    var productcatagories = $(".addPage #productcatagories").val();
    var testOperator = $(".addPage #productOperator ").val();
    var details = $(".addPage #introduce ").val();
    var DiaryUsername = $(".addPage #DiaryUsername").val();
    var DataFormat = $("#DataFormat").val();
    
    $(".hideProgressflag").val("false");
    $('.Progress').show();
    $('.loadgif').show();
    if(path.indexOf("\\") > 0){
		var FileName = path.split("\\")[path.split("\\").length-1];
	}
	else{
		var FileName = path;
	}
    $(".Progress_fileName").text(FileName);
    var timer = setInterval(function(){
    	$.ajax({
     	      type : 'GET',
     	      url : "Progress",
     	      data : {
     	    	 FileName : FileName  
     	      },
     	      dataType : 'json',
     	      success : function (data) {
     	    	 console.log(data);
     	    	 var flag = $(".hideProgressflag").val();
     	    	 if(flag == "true"){
     	    		$(".Progress_num").html("100%");
     				$(".ProgressBar2").css("width",0);
     				$(".addPage input,.addPage textarea").not("#fu_UploadFile_cover").removeAttr("readonly");
     				$(".addPage select").removeAttr("disabled");
     	    		$('.Progress,.loadgif').hide();
     	    		clearInterval(timer);
     	    	 }
     	    	 else{
     	    		var ProgressBarWidth = parseFloat($(".ProgressBar1").width())* (1 - parseFloat(data)/100);
     	    		$(".ProgressBar2").animate({width:ProgressBarWidth},45,function(){
     	    			$(".Progress_num").html(data);
     	    		});
     	    	 }
     	      },
		      error : function () {
		    	  PromptBox("error","提示信息!","服务器繁忙，请稍后重试!","","");
		      }
     	  });
    },50);
      $.ajaxFileUpload({
        url: 'DataSave',  //这里是服务器处理的代码
        type: 'post',
        secureuri: false, //一般设置为false
        fileElementId: 'fu_UploadFile', // 上传文件的id、name属性名
        dataType: 'json', //返回值类型，一般设置为json、application/json
        data: {
        	productcatagories : productcatagories ,
        	testOperator : testOperator ,
        	details : details ,
        	DiaryUsername : DiaryUsername ,
        	dataFormat : DataFormat ,
        }, //传递参数到服务器
        success: function (data, status) {
        	console.log(data);
        	$(".hideProgressflag").val("true");
        	var flag = data.flag;
        	var status = data.status;
        	var status3 = status;
        	if(status3!=null){
        		if(status3 == ""){
        			alertArray="添加文件成功！";
        		}
        		else{
        			var error = status3.split(";");
        			for(var i=0;i<error.length;i++){
        				array.push(error[i]);
        			}
        		}
        		if(array.length >0 && array.length <=3){
        			for(var i=0;i<array.length;i++){
        				Array+="<p>"+array[i]+"</p>";
        			}
        			var alertArray = Array;
        		}
        		else if(array.length >3){
        			alertArray="部分导入成功，未导入文件有"+array.length +"个";
        		}
        	}
        	if(flag == 'true2' && flag !=null)
        	{
       			PromptBox("success","提示信息!",alertArray,"",function(){
              		  window.location.href=currentHref+"/GetSelectDataListPage?currentpage="+CurrentPage+"&selectSearchType="+selectSearchType+"&selectParameters="+selectParameters+"&searchNumber=0&endtime="+endtime+"&selectwafer=add";
           	  	});
        	}
        	else if(flag !=null && flag == 'true1' )
        	{
        		PromptBox("error","提示信息!",status,"",function(){
            		  window.location.href=currentHref+"/GetSelectDataListPage?currentpage="+CurrentPage+"&selectSearchType="+selectSearchType+"&selectParameters="+selectParameters+"&searchNumber=0&endtime="+endtime+"&selectwafer=add";
         	  	});
        	}
        	$('.Progress,.loadgif').hide();
			clearInterval(timer);
        },
        error: function (data, status, e) {
        	$('.Progress,.loadgif').hide();
			clearInterval(timer);
			PromptBox("error","提示信息!","上传组件错误，请检察网络!","","");
        }
    }); 
      
}

//编辑页面
 $('.timeTest').click(function(){
	var produceType = $(".EditBox #produceType").val();
	var testPerson = $(".EditBox .testOperator option:selected").attr("value");
	var introduce = $(".EditBox #introduce").val();
	var TestEndTime = $(".EditBox #TestEndTime").val();
	var waferID = $(".EditBox #waferID").val();
	var Dietype = $(".EditBox #Dietype").val();
	var DiaryUsername1 = $(".EditBox #DiaryUsername1").val();
	if(produceType == ""){
		  PromptBox("error","提示信息!","请输入产品类别!","","");
		  return false;
	}
	if(testPerson == ""){
		  PromptBox("error","提示信息!","请输入测试员!","","");
		  return false;
	}
	if(TestEndTime == ""){
		  PromptBox("error","提示信息!","请输入测量完成时间!","","");
		  return false;
	}
	$.ajax({
	     type : 'POST',
	     url : "DataListUpdate",
	     data : {
	    	 productCategory : produceType ,  
	    	 testOperator : testPerson ,
	    	 description : introduce ,
	    	 testEndDate : TestEndTime ,
	    	 waferId : waferID ,
	     },
	     dataType : 'json',
	     success : function (data) {
	    	 console.log(data);
	   		 if(data){
	   			window.location.href=currentHref+"/DataList"
	   		 }
	     },
	     error : function () {
	   	  PromptBox("error","提示信息!","请稍后重试!","","");
	     }
	 });
}); 
 
 $(".WaferTestInfoUpdateServlet").attr("action",currentHref+'/WaferTestInfoUpdateServlet');

//浏览器弹窗
var array=[];
var Array="";

function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}


$(document).on("click",".top .title,.gotoIndex",function(){
	var url = getUrl();
	window.location.href=url;
})





