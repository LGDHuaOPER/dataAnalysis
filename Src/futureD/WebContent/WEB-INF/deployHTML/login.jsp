<%@ page language="java" contentType="text/html; charset=utf-8"	pageEncoding="utf-8"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<!-- <meta charset="UTF-8"> -->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- 为移动设备添加 viewport -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, minimum-scale=1, user-scalable=no">
	<link rel="shortcut icon" href="assets/img/common/futureDT2.ico"/>
	<link rel="bookmark" href="assets/img/common/futureDT2.ico"/>
	<title>futureD数据管理与数据分析</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css" />
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css" />
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css" />
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css" />

	<link rel="stylesheet" href="dist/style/modules/login/login-4a28ca53f2.min.css">
</head>
<body>
	<div class="container-fluid">
		<div class="login_pan">
			<div class="login_panin">
	    		<fieldset><legend>登录</legend>
	    			<div class="container-fluid">
	    				<div class="message_div">
	    				</div>
	    				<div class="form-group has-feedback">
	    				  	<div class="input-group">
	    				    	<span class="input-group-addon"><span class="glyphicon glyphicon-user" aria-hidden="true"></span></span>
	    				    	<input type="text" class="form-control" id="login_user" aria-describedby="user_sr_only" placeholder="请输入账号" autocomplete="new-password" />
	    				  	</div>
	    				  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
	    				  	<span id="user_sr_only" class="sr-only">账号</span>
	    				</div>
	    				<div class="form-group has-feedback">
	    				  	<div class="input-group">
	    				    	<span class="input-group-addon"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span></span>
	    				    	<input type="password" class="form-control" id="login_password" aria-describedby="password_sr_only" placeholder="请输入密码" autocomplete="new-password" />
	    				  	</div>
	    				  	<span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span>
	    				  	<span id="password_sr_only" class="sr-only">密码</span>
	    				</div>
	    				<div class="save_login_div">
	    					<input type="checkbox" />使用安全模式（在公共场合请勾选）
	    				</div>
	    				<div class="button_div">
		    				<button type="button" class="btn btn-default" disabled="disabled">登录</button>
	    				</div>
	    				<!-- <div class="button_div2">
	    						    				<button type="button" class="btn btn-info" data-env="offline">访客登录</button>
	    				</div> -->
	    				<div class="copy_div">
	    					<span>版本号：V1.2.0.181217</span>
	    				</div>
	    			</div><!-- container-fluid end -->
	    		</fieldset>
			</div>
		</div>
	</div>
	<script src="assets/script/libs/jquery-3.3.1.min.js"></script>
	<script src="assets/script/libs/bootstrap.min.js"></script>
	<script src="assets/script/libs/lodash.min.js"></script>
	<script src="assets/script/libs/store.legacy.min.js"></script>
	<script src="assets/script/libs/moment-with-locales.min.js"></script>
	<script src="assets/script/libs/sweetalert2.min.js"></script>
	<script src="assets/script/libs/a_polyfill_for_ES6_Promises_for_IE11_and_Android.js"></script>

	<script src="dist/script/modules/common/futureD_config-655af31173.min.js"></script>

	<script src="dist/script/modules/common/globalConf-96187585ff.min.js"></script>
	
	<script src="dist/script/modules/login/login-93e45bd16c.min.js"></script>
</body>
</html>