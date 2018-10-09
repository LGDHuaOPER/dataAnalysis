<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<jsp:useBean id="now" class="java.util.Date" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>futureD主页面</title>
		<link rel="stylesheet" type="text/css" href="../common/css/common.css"> 
		<link  rel="stylesheet" type="text/css" href="./css/home.css" />
	</head>
	<body>
		<div class="top"></div>	 
		<div class="home_body">
			<div class="navIcon">
				<div class="dataList"><img src="./image/dataList.png" alt=""><span>数据列表</span></div>
				<div class="engineringAnalysis"><img src="./image/engineringAnalysis.png" alt=""><span>工程分析</span></div>
				<div class="dataStatistics"><img src="./image/dataStatistics.png" alt=""><span>数据统计</span></div>
			</div>
		</div>
		<div class="PromptBoxCover"></div>
		<div class=" PromptBox" >
			<div class="msg_tit" >
				<img src="../common/img/yes1.png" class="icon_ok"/>
				<span class="msg_tit_cont" >上传成功!</span>
				<img src="../common/img/close.png"  class="icon_close"/ >
			</div>
			<img src="../common/img/right1.png"  class="bigicon"/>
			<span class="PromptBox_msg msg1">
				恭喜您，上传成功!
			</span>
			<span class="PromptBox_msg msg2">
			</span>
		</div>
		<script src="../common/js/jquery-3.3.1.min.js"></script>
		<script src="./js/home.js"></script>
	</body>
</html>