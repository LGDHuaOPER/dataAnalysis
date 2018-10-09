<%@ page language="java" contentType="text/html; charset=utf-8"	pageEncoding="utf-8"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	<link rel="shortcut icon" href="./eoulu.ico"/>
	<link rel="bookmark" href="./eoulu.ico"/>
	<title>futureD数据管理与分析系统</title>
	 <link rel="stylesheet" type="text/css" href="Analysis/css/Analysis.css"> 
	 <link rel="stylesheet" type="text/css" href="Analysis/css/Plugin/paging.css"> 
	
	</head>
	<body >
		<div style="display:none">
			<span class="selectState">${selectState}</span>
			<span class="pageNum ">${pageNum}</span>
			<span class="FoldState1">${FoldState1}</span>
			<span class="FoldState2">${FoldState2}</span>
			<span class="selectDataState">${selectDataState}</span>
		</div>
		<div class="contain" id="contain">
			<div class="top"></div>	
			<div class="table_tool_title">
				<span class="">futureD</span>/<span class="">工程分析</span>
			</div>
			<div class="content">
				<form id="top_text_from" name="top_text_from" method="post" action="../DeleteDataListServlet">
					<div class="table_toolbox">
						<div class="serchbox">
							<div class="serch">
								<span class="searchNumber hidden">${searchNumber}</span>
								<span class="selectSearchType hidden">${selectSearchType}</span>
								<span class="selectParameters hidden">${selectParameters}</span>
								<span class="startTimeShow hidden">${Starttime}</span>
								<span class="endTimeShow hidden">${endtime}</span>
								<span class="UserName hidden"></span>
											
								<input type="text" name="" class="searchContent" value="" placeholder="请输入关键词查询"/>
								<div class="searchOK">
									<div class="searchbtn"><img src="Analysis/img/serach.png"></div>
								</div>
								
							</div>
						</div>
					</div>
					<table border="0" cellspacing="0" cellspadding="0" id="table1">
						<tr class="table1Tit">
							<td class="allchoose"><div class="StateChange" state=false title="全选"></div></td>
							<td>产品名称</td>
							<td  style="display:none">产品类型</td>
							<td >批次编号</td>
							<td >晶圆编号</td>
							<td  style="display:none">器件类型</td>
							<td  style="display:none">合格数</td>
							<td >良品率</td>
							<td >测量完成时间</td>
							<td  style="display:none">归档时间</td>
							<td>测试员</td>
							<td style="display:none">归档人</td>
							<td class="description">描述</td>
							<td>操作</td>
						</tr>
						<c:forEach items="${waferList}" var="wtd" varStatus="status">
							<tr class="putcolor">
								<td style="display:none"><input type="checkbox" class="chk"  id="select${wtd.wafer_id }" name="checkToDelete" value="${wtd.waferSerialID }"></td>
								<td class="chooseTd"><div class="StateChange" ></div></td>
								<td class="getProductCatgories"  >${wtd.product_category}</td>
								<td class="getDeviceID" style="display:none">${wtd.device_number}</td>	
								<td class="getLotID">${wtd.lot_number}</td>
								<td class="getWaferID" >${wtd.wafer_number}</td>
								<td class="getDietype"  style="display:none">${wtd.die_type}</td>
								<td class=""  style="display:none">${wtd.qualified}</td>
								<td class="">${wtd.qualified_rate}</td>
								<td class="testend">${wtd.test_end_date}</td>
								<td class=""  style="display:none">${wtd.gmt_create}</td>
								<td  class="testOperator" >${wtd.test_operator}</td>
								<td  class="editor"  style="display:none">${wtd.archive_user}</td>
								<td class="introduce">${wtd.description}</td>
								<td class="operatingTd" >
									<img src="index/img/modify.png" title="编辑" class="edit"  name="edit">
									<img src="index/img/View.png" title="Wafer数据"  class="waferDisplay"  value="${wtd.waferID}">
									<img src="index/img/delete.png" title="删除" class="delete_but"  value="${wtd.waferSerialID }" id="delete_but" name="delete_but">
								</td>
								<td  style="display:none" class="hideDataFormat">${wtd.data_format}</td>
							</tr>
						</c:forEach>
					</table>
					<div class="PageBox">
						<div id="pageToolbar"></div>
					</div>
					<!-- 此处写一个隐藏输入框 用于存用户，然后一起传到后台做日志记录 -->
					<input type="text" id="DiaryUsername" name="DiaryUsername" value="" type="hidden" style="display:none" > 
				</form>
				<div class="cover"></div>
				<div class="PromptBoxCover"></div>
				<div class="copyright">copyright&copy;2018 苏州伊欧陆系统集成有限公司</div>
				<div class=" PromptBox" >
					<div class="msg_tit" >
						<img src="Analysis/img/yes1.png"  class="icon_ok"/>
						<span class="msg_tit_cont" >上传成功!</span>
						<img src="Analysis/img/close.png"  class="icon_close"/>
					</div>
					<img src="Analysis/img/right1.png"  class="bigicon"/>
					<span class="PromptBox_msg msg1">
						恭喜您，上传成功!
					</span>
					<span class="PromptBox_msg msg2">
					</span>
				</div>
			</div>
			<!-- content结束 -->
			<div class="AnalysisCategoryBox">
				<ul class="AnalysisCategoryBox_ul">
					<li class="AnalysisCategory_title ">
						<div class="imgbox">
							<img src="Analysis/img/arrow-right.png" class="">
							<span class="AnalysisCategory_name">DC</span>
						</div>
						<dl>
							<dd>ID-VD</dd>
							<dd>ID-VG</dd>
						</dl>
					</li>
					<li class="AnalysisCategory_title" flag="hide">
						<div class="imgbox">
							<img src="Analysis/img/arrow-right.png">
							<span class="AnalysisCategory_name">RTP</span>
						</div>
						<dl>
							<dd>BTI</dd>
							<dd>HCI</dd>
						</dl>
					</li>
					<li class="AnalysisCategory_title">
						<div class="imgbox">
							<img src="Analysis/img/arrow-right.png">
							<span class="AnalysisCategory_name">RF</span>
						</div>
						<dl>
							<dd>SP2</dd>
						</dl>
					</li>
				</ul>
				<input type="button" value="Analysis" class="AnalysisBtn">
			</div>
			
			
			<div class="type" style="display:none;"></div>
		</div>		
<!--悬浮框列表的点击事件-->
<!-- 各个模块的权限管理 -->

  <script src="./common/js/jquery-1.11.3.min.js"></script>
  <script src="Analysis/js/Plugin/circleChart.min.js"></script>
<script type="text/javascript">
	$(document).on("click",".AnalysisCategory_title",function(){
		var flag = $(this).attr("flag");
		if(flag == "hide" || !flag){  //未展开
			$(this).parent().find(".active").find(".imgbox img").removeClass("arrow_rotate_bottom").addClass("arrow_rotate_right");
			$(this).parent().find("dl").hide({duration: 400});
			$(this).addClass("active").siblings().removeClass("active");
			$(this).find(".imgbox img").removeClass("arrow_rotate_right").addClass("arrow_rotate_bottom");
			$(this).find("dl").show({duration: 400});
			$(this).siblings().attr("flag","hide");
			$(this).attr("flag","show");
		}
		else{
			$(this).find(".imgbox img").removeClass("arrow_rotate_bottom").addClass("arrow_rotate_right");
			$(this).removeClass("active");
			$(this).parent().find("dl").hide({duration: 400});
			$(this).attr("flag","hide");
		}
	})


	var AuthorityColumn = '${AuthorityColumn}';
	//console.log(AuthorityColumn)
	//当前用户
	var UserName = '${UserName}';
	var AllPage = '${AllPage}';   //总页数
	var CurrentPage = '${CurrentPage}';   //当前页数
	
	
	var SearchNumber = '${searchNumber}';   
	var endtime = '${endtime}';   
	var selectSearchType = '${selectSearchType }';   
	var selectParameters = '${selectParameters }';  
	var Starttime = '${Starttime}';
	
	//logo 及数据列表跳转路径
	function getUrl(){
		var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3]; //当前网址
		var currentpage ='${CurrentPage}';
		var selectSearchType ='${selectSearchType}';
		var selectParameters ='${selectParameters}';
		var searchNumber ='${searchNumber}';
		var endtime ='${endtime}';
		var selectwafer ='${selectwafer}';
		var url = currentHref+"/GetSelectDataListPage?currentpage="+currentpage+"&selectSearchType="+selectSearchType+"&selectParameters="+selectParameters+"&searchNumber="+searchNumber+"&endtime="+endtime+"&selectwafer="+selectwafer;         
		return url;
	}
	
	//弹窗
	function PromptBox(status,title,msg1,msg2,callback){
		$(".PromptBoxCover").show();
		$(".PromptBox #PromptBox_btn").remove();
		if(status =="success"){
			$(".icon_ok").attr("src","Analysis/img/yes1.png");
			$(".bigicon").attr("src","Analysis/img/right1.png");
		}
		else{
			$(".icon_ok").attr("src","Analysis/img/error.png");
			$(".bigicon").attr("src","Analysis/img/warn.png");
		}
		$(".PromptBox .msg_tit_cont").text(title);
		$(".PromptBox .msg1").text(msg1);
		$(".PromptBox .msg2").text(msg2);
		if(msg2 ==""){
			$(".PromptBox #PromptBox_btn").css("margin-top","30px");
			$(".PromptBox .msg1").css("margin-top","30px");
		}
		else{
			$(".PromptBox #PromptBox_btn").css("margin-top","20px");
			$(".PromptBox .msg1").css("margin-top","20px");
		}
		if (typeof (callback) == 'function') {
			var str = '<input type="button" id="PromptBox_btn" value="确定" />';
	       $(".PromptBox").append(str);
	       $(document).on("click",".PromptBox #PromptBox_btn",function(){
	    	   callback();
	        })
      	}
		else{
			var str = '<input type="button" id="PromptBox_btn" value="确定" />'
	        $(".PromptBox").append(str)
	        $(document).on("click",".PromptBox #PromptBox_btn",function(){
	        	$(".PromptBox").hide();
	        	$(".PromptBoxCover").hide();
	        })
		}
		$(".PromptBox .icon_close").click(function(){
	    	$(".PromptBox").hide();
	    	$(".PromptBoxCover").hide();
	    })
		$(".PromptBox").show();
	}
//当前页面路径
	var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3]; //当前网址
	
		
	</script>

   <script src="./common/js/responseLoading.js"></script>   
    <script src="Analysis/js/Plugin/query.js"></script>
 	<script src="Analysis/js/Plugin/paging.js"></script> 
 <script src="Analysis/js/Analysis.js"></script>


</body>
</html>
