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
		<link  rel="stylesheet" type="text/css" href="./css/login.css" />
	</head>
	<body>
		<div class="home_head">
			<div class="headL">futureD数据管理与数据分析</div>
			<div class="headR">
				<div class="signOut">退出</div>
				<div class="helpManual"></div>
				<div class="account">${userName}</div>
			</div>
		</div>
		<!-- 文件路径需检测下 -->
		<script src="../common/js/jquery-3.3.1.min.js"></script>
		<script src="./js/home.js"></script>
		<script>
		  $('.signOut').click(function(){
			  window.location.href="../Login/login.jsp"
		  })
		</script>
	</body>
</html>