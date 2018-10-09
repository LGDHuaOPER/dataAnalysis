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
	<link rel="stylesheet" type="text/css" href="./common/css/common.css">  
	 <link rel="stylesheet" type="text/css" href="index/css/index.css">  
	<link rel="stylesheet" type="text/css" href="index/css/Plugin/paging.css"> 
	<link rel="stylesheet" type="text/css" href="./common/font-awesome-4.5.0/css/font-awesome.min.css">
	
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
			<div class="header">
				<ul class="header_ul navList">
					<li class="header_li1 active " id="header_dataList">
						<img src="index/img/index.png"/>
						<span id="header_index">数据列表</span>						
					</li>
					<li class="header_li2" id="header_Map">
						<img src="index/img/map.png" />
						<span >map图</span>						
					</li>
					<li class="header_li3" id="header_Correlationplot">
						<img src="index/img/Correlation.png"/>
						<span >相关性图</span>						
					</li>
					<li class="header_li4"  id="header_Yplot">
						<img src="index/img/Yield.png"/>
						<span >成品率图</span>						
					</li>
					<li class="header_li5" id="header_CPK">
						<img src="index/img/cpk.png"/>
						<span >CPK图</span>						
					</li>
					<li class="header_li5" id="header_Splot"> 
						<img src="index/img/Histogram.png"/>
						<span>直方图</span>						
					</li>
					<li class="header_li6" id="header_wafer">
						<img src="index/img/wafer.png"/>
						<span id="header_waferdata">Wafer数据</span>						
					</li>
					<li class="header_li7" id="header_Xplot">
						<img src="index/img/box.png"/>
						<span id="header_box">箱线图</span>						
					</li>
					<li class="header_li8" id="header_Analysis">
						<img src="index/img/fenxi.png"/>
						<span id="header_box">工程分析</span>						
					</li>
				</ul>
			</div>
			<div class="content">
				<form id="top_text_from" name="top_text_from" method="post" action="../DataList">
					<div class="table_tool_title">
						<div class="positionicoBox"><img src="index/img/positionico.png" class="positionico" /></div> <span class="currentPosition">当前位置：</span><span class="">首页/数据列表</span>
					</div>
					<div class="table_toolbox">
						<div class="table_tool">
							<div id="add_but"  name="add_but"><img src="index/img/add.png"/></div>
							<div id="recycle" name="recycle"><img src="index/img/recycle.png"/></div>
						</div>
						<div class="serchbox">
							<div class="serch">
								<span class="searchNumber hidden">${searchNumber}</span>
								<span class="selectSearchType hidden">${selectSearchType}</span>
								<span class="selectParameters hidden">${selectParameters}</span>
								<span class="startTimeShow hidden">${Starttime}</span>
								<span class="endTimeShow hidden">${endtime}</span>
								<span class="UserName hidden"></span>
											
								<input type="text" name="" class="searchContent" value="" placeholder="请输入关键词查询"/>
								<input type="date" class="searchTime startTime">
								<input type="date" class="searchTime endTime" id="endTime">
								<div class="searchOK">
									<div class="searchbtn"><img src="index/img/serach.png"></div>
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
								<td style="display:none"><input type="checkbox" class="chk"  id="select${wtd.wafer_id }" name="checkToDelete" value="${wtd.wafer_id }"></td>
								<td class="chooseTd"><div class="StateChange" ></div></td>
								<td class="getProductCatgories showField"  >${wtd.product_category}</td>
								<td class="getDeviceID " style="display:none">${wtd.device_number}</td>	
								<td class="getLotID showField">${wtd.lot_number}</td>
								<td class="getWaferID showField" >${wtd.wafer_number}</td>
								<td class="getDietype"  style="display:none">${wtd.die_type}</td>
								<td class=""  style="display:none">${wtd.qualified}</td>
								<td class="showField">${wtd.qualified_rate}</td>
								<td class="testend showField">${wtd.test_end_date}</td>
								<td class=""  style="display:none">${wtd.gmt_create}</td>
								<td  class="testOperator showField" >${wtd.test_operator}</td>
								<td  class="editor"  style="display:none">${wtd.archive_user}</td>
								<td class="introduce showField">${wtd.description}</td>
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
				<!-- 添加文件 -->
				<form name="myform" action="../ReadFile" method="post"	enctype="multipart/form-data">
					<div class="addPage">
						<div class="addPage_title">
							<span class="addPage_title_cont">上传</span>
							<span class="addPage_title_close">X</span>
						</div>
						<div class="UploadContent">
							<div class="UploadContent_left">
								
							</div>
							<div class="UploadContent_middle">
								<p class="p1">三安.txt<p>
								<p class="p2">大小：50mb<p>
							</div>
							<div class="UploadContent_right">
								<div class="UploadContent_right_loading">
									<div class="circleChart" id="upload_num"></div>
									<p>上传中</p>
								</div>
								<div class="UploadContent_right_loadover">
									<div><img src="index/img/over.png"/>上传成功</div>
									<p class="UploadTime"></p>
									<input type="button"  id="upload_next" value="下一步">
								</div>
							</div>
						</div>
						<div class="UploadBox">
							<input type="button"  id="fu_UploadFile_cover" value="上传文件">
							<input type="file" name="fu_UploadFile" value="上传文件" class="scan"  id="fu_UploadFile" >
							<p class="p1">点击/拖拽一个文件到这里上传<p>
							<p class="p2">支持EXCEL、TXT数据格式<p>
						</div>
						<div class="UploadDataBox">
							<div class="ProduceType">
								<div class="ProduceTypeTit">
									<img src="index/img/prompt.png" /><span>产品类别</span>
								</div>
								<input type="text" name="productcatagories" id="productcatagories">
								<select name="bh" id="bh"  onchange="document.getElementById('productcatagories').value=this.options[this.selectedIndex].text">    
									<option value="没有产品类别">--请选择--</option>
								</select>
							</div>
							<div class="DataFormatSel">
								<div class="DataFormatTit">
									<img src="index/img/prompt.png" /><span>数据格式</span>
								</div>
								<select name="dataFormat" id="DataFormat">    
									<option value="1">EOULU标准数据</option>
									<option value="2">博达微数据</option>
									<option value="3">Excel格式</option>
									<option value="4">TXT数据格式</option>
								 </select>
							</div>
							<div class="Introducet">
								<div class="introducetit">
									<span>描述</span>
								</div>
								<textarea id="introduce" name="introduce" cols="79" rows="8"></textarea>
							</div>
							<div class="addPageBtn">
								<input type="text" id="DiaryUsername1" name="DiaryUsername1" value="" type="hidden" style="display:none" >
								<input type="button" name="submit" value="提交" id="addSubmit" class="finish" onclick="upload()">
							</div>
						</div>
						
					</div>					
					<input type="hidden" class="hideProgressflag"></td>
				
				</form>
				<!-- 编辑页面 -->
				<form method="post" class="WaferTestInfoUpdateServlet">
					<div class="EditBox editPage">
						<div class="EditBox_Icon"><div class="iconimg"><img src="index/img/editicon.png"/></div></div>
						<div class="EditCont_left">
							<ul>
								<li class="produceTypeLi">
									<span class="Edit_title"><sapn class="color_red">*</sapn>产品类别</span>
									<input type="text" id="produceType" name="produceType" >
									<select name="produceType"   class="produceType"   onchange="document.getElementById('produceType').value=this.options[this.selectedIndex].text">    
								  		<c:forEach items="${categoryList}" var="categoryList" varStatus="status">
											<option value="">${categoryList.product_category}</option>
										</c:forEach>	
									</select>
								</li>
								<li class="testOperatorLi">
									<span class="Edit_title"><sapn class="color_red">*</sapn>测试员</span>
									
									<select name="testOperator"   class="testOperator"  >    
								  		<c:forEach items="${userList}" var="userList" varStatus="status">
											<option value="${userList.user_id}">${userList.user_name}</option>
										</c:forEach>
									</select>
								</li>
								<li class="produceTypeLi">
									<span class="Edit_title"><sapn class="color_red">*</sapn>测量完成时间</span>
									<input type="date" id="TestEndTime" name="TestEndTime"  placeholder="yyyy-mm-dd">
									<input type="text" style="display:none;" id="waferID" name="waferID"> 
									<input type="text" style="display:none;" id="Dietype" name="Dietype">
								</li>
							</ul>
						</div>
						<div class="EditCont_right">
							<span class="Edit_title introducetit">描述</span>
							<textarea id="introduce" name="introduce" cols="22"rows="7"></textarea>
						</div>
						<div class="EditBtn">
							<input type="text" id="DiaryUsername1" name="DiaryUsername1" value="" type="hidden" style="display:none" >
							<input type="button" value="确定" class="finish timeTest">
							<input type="button" value="取消" class="close-btn">
						</div>
					</div>
				</form>
				<div class="cover"></div>
				<div class="PromptBoxCover"></div>
				<div class="copyright">copyright&copy;2018 苏州伊欧陆系统集成有限公司</div>
				<div class=" PromptBox" >
					<div class="msg_tit" >
						<img src="./common/img/yes1.png" class="icon_ok"/>
						<span class="msg_tit_cont" >上传成功!</span>
						<img src="./common/img/close.png"  class="icon_close"/ >
					</div>
					<img src="./common/img/right1.png"  class="bigicon"/>
					<span class="PromptBox_msg msg1">
						恭喜您，上传成功!
					</span>
					<span class="PromptBox_msg msg2">
					</span>
				</div>
		</div>
			<!-- content结束 -->
			<div class="type" style="display:none;"></div>
		</div>		
		<div >
			
		</div>
<!--悬浮框列表的点击事件-->
<!-- 各个模块的权限管理 -->

<script src="./common/js/jquery-1.11.3.min.js"></script>
 <script src="index/js/Plugin/circleChart.min.js"></script>
<script type="text/javascript">
	var AuthorityColumn = '${userAuthority}';
	//console.log(AuthorityColumn);
	//当前用户
	var UserName = '${userName}';
	var AllPage = '${totalPage}';   //总页数
	var CurrentPage = '${currentPage}';   //当前页数
	console.log(CurrentPage);
	
	//添加弹框显示
	var productcatagories = '${productcatagories}'; //产品类别
	var usernames = '${usernames}';   //归档人
	
	var SearchNumber = '${searchNumber}';   
	var endtime = '${endtime}';   
	var selectSearchType = '${selectSearchType }';   
	var selectParameters = '${selectParameters}';  
	var Starttime = '${Starttime}';
	
	var keyword = '${keyword}';   //搜索后返回字段
	
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
			$(".icon_ok").attr("src","common/img/yes1.png");
			$(".bigicon").attr("src","common/img/right1.png");
		}
		else{
			$(".icon_ok").attr("src","common/img/error.png");
			$(".bigicon").attr("src","common/img/warn.png");
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
<script src="index/js/Plugin/ajaxfileupload.js"></script>
  <script src="./common/js/responseLoading.js"></script>  
   <script src="index/js/Plugin/query.js"></script>
 <script src="index/js/Plugin/paging.js"></script> 
 <script src="index/js/index.js"></script>
 <script src="index/js/action.js"></script>

</body>
</html>