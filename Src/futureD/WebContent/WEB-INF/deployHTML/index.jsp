<%@ page language="java" contentType="text/html; charset=utf-8"	pageEncoding="utf-8"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- 为移动设备添加 viewport -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, minimum-scale=1, user-scalable=no">
	<link rel="shortcut icon" href="assets/img/common/futureDT2.ico"/>
	<link rel="bookmark" href="assets/img/common/futureDT2.ico"/>
	<title>futureD数据管理与数据分析主页面</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">

	<link rel="stylesheet" href="dist/style/modules/index/index-898d10b4bc.min.css">
</head>
<body data-curpage="index" data-curusername="${userName}" data-userauthority="${userAuthority}">
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l bootstro" data-bootstro-title="系统主页面引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>欢迎来到futureD系统</h4><p>接下来我将带你熟悉整个系统。</p><p>点击下一步或者键盘方向键可以控制页面引导</p><p>点击页面右上角问号可以重新查看</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="系统主页面引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>这里是操作工具栏</h4><p>分别是1、管理员页面（如果有权限）2、页面引导3、安全退出</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="3">
		<div class="dropdown user_dropdown">
		  	<button id="userLabel" class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		      	<img src="assets/img/common/admin_32px.svg" >
		  	</button>
		  	<ul id="menu1" class="dropdown-menu" aria-labelledby="userLabel">
	          	<li class="curusername">${userName}</li>
	          	<li role="separator" class="divider"></li>
	          	<li class="Information"><a>资料与账号</a></li>
	          	<li class="AdminOperat"><a>管理员操作</a></li>
	       	</ul>
	    </div>
		<!-- <img src="assets/img/common/admin_32px.svg" data-iicon="glyphicon-user" alt="管理员"> --><img src="assets/img/common/help_32px.svg" data-iicon="glyphicon-question-sign" alt="操作指引" title="操作指引"><img src="assets/img/common/power_32px.svg" data-iicon="glyphicon-off" alt="安全退出" title="安全退出"><!-- <span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><span class="glyphicon glyphicon-off" aria-hidden="true"></span> --></div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li class="active">系统主页面</li>
					</ol>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_tit bootstro" data-bootstro-title="系统主页面引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>欢迎词</h4><p>这里显示您的用户名和欢迎词</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1">${userName}，您好！欢迎使用futureD数据管理与分析系统</div>
					<div class="g_bodyin_bodyin_body">
						<div class="container-fluid">
							<div class="row bootstro" data-bootstro-title="系统主页面引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>各功能模块入口</h4><p>这里是各功能模块的入口，点击可以进入各模块（如果有权限）</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
								<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
									<div class="section_in">
										<div class="thumbnail" data-ipage="DataList">
									      	<img src="assets/img/modules/index/dataList.png" alt="数据列表" width="185">
									      	<div class="caption">
									        	<h3>数据列表</h3>
									        	<p>展示管理的数据的属性</p>
									      	</div>
									    </div>
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
									<div class="section_in">
										<div class="thumbnail" data-ipage="ProjectAnalysis">
									      	<img src="assets/img/modules/index/projectAnalysis.png" alt="工程分析" width="199">
									      	<div class="caption">
									        	<h3>工程分析</h3>
									        	<p>进一步加工处理曲线数据</p>
									      	</div>
									    </div>
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
									<div class="section_in">
										<div class="thumbnail" data-ipage="DataCompare">
									      	<img src="assets/img/modules/index/dataStatistics.png" alt="数据对比" width="183">
									      	<div class="caption">
									        	<h3>数据对比</h3>
									        	<p>对比统计不同晶圆、参数</p>
									      	</div>
									    </div>
									</div>
								</div>
							</div><!-- row end -->
						</div>
					</div><!-- g_bodyin_bodyin_body end -->
				</div>
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
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>

	<script src="dist/script/modules/common/futureD_config-655af31173.min.js"></script>

	<script src="dist/script/modules/common/globalConf-96187585ff.min.js"></script>
	
	<script src="dist/script/modules/index/index-ad031da1a3.min.js"></script>
</body>
</html>