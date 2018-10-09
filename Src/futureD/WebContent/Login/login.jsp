<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<jsp:useBean id="now" class="java.util.Date" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>futureD登录页面</title>
		<link  rel="stylesheet" type="text/css" href="./css/login.css" />
	</head>
	<body>
		<div class="login_contain">
			<div class="contain_title">账号密码登录</div>
				<ul>
					<li class=" msgBox">
						<img  src="./image/msgicon.png"  class="msgBox_icon"/>
						<span class="msgBox_cont"></span>
					</li>
					<li class="use-psd firstli">
						<!--autocomplete="off" 取消自动填充-->
						<input type="text" name="username"  autofocus="autofocus" id="username"  placeholder="请输入账号" autocomplete="off"/>
					</li>
					<li class="use-psd">
						<input type="password" id="password1" name="" style="display:none;">
						<input type="password" name="psd" id="psd" placeholder="请输入密码" autocomplete="new-password"/>
						<img  src="./image/showpsd.png" class="psd_change" flag="show"/>
					</li>
					<li class="sub-res">
						<input type="submit" value="登录" class="sub" disabled="disabled"> 
					</li>
					<li class="toolbox">
						<!-- <div class="Remember">
							<input type="checkbox" id="rem_psd" value="" checked="checked"/>	
							<span id="rem_psd_msg">记住密码</span>
						</div> -->
						<div class="VersionBox">版本号：V1.0.0.180926</div>
					</li>
				</ul>
		</div>
		<div class="copyright">copyright&copy;2018 苏州伊欧陆系统集成有限公司</div>
		<script src="./js/jquery-3.3.1.min.js"></script>
		<script src="./js/login.js"></script>
	</body>
</html>