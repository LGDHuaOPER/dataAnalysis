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
	<title>futureD工程分析</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/pagination.min.css" type="text/css">

	<!-- build:css ../../dist/style/modules/projectAnalysis/projectAnalysis.min.css -->
	<link rel="stylesheet" href="src/style/modules/projectAnalysis/projectAnalysis.css" type="text/css">
	<!-- endbuild -->

</head>
<body data-curpage="projectAnalysis"  data-curusername="${userName}" data-userauthority="${userAuthority}" data-loginstatus='${loginStatus}'>
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_m">
			<div class="g_info_m_in">
				<div class="form-inline">
				  	<div class="form-group has-feedback">
				  	  	<div class="input-group">
				  	    	<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
				  	    	<input type="text" class="form-control" id="search_input" placeholder="请输入关键词查找">
				  	  	</div>
				  	  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
				  	</div>
				  	<button class="btn btn-default" disabled="disabled" id="search_button">搜索</button>
				</div>
			</div>
		</div>
		<%-- <div class="g_info_r bootstro" data-bootstro-title="工程分析引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以进行搜索，跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><span class="glyphicon glyphicon-off" aria-hidden="true"></span></div> --%>
		<!-- 管理员 -->
		<div class="g_info_r bootstro" data-bootstro-title="数据对比引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以进行搜索，跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>
			<div class="dropdown user_dropdown">
			  <button id="userLabel"  type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			      <img src="assets/img/common/admin_32px.svg" >
			  </button>
			  <ul id="menu1" class="dropdown-menu" aria-labelledby="userLabel">
		          <li class="curusername"></li>
		          <li role="separator" class="divider"></li>
		          <li class="Information"><a href="#">资料与账号</a></li>
		          <li class="AdminOperat"><a href="#">管理员操作</a></li>
		       </ul>
		    </div>
			<!-- <img src="assets/img/common/admin_32px.svg" data-iicon="glyphicon-user" alt="管理员"> -->
			<img src="assets/img/common/help_32px.svg" data-iicon="glyphicon-question-sign" alt="操作指引">
			<img src="assets/img/common/power_32px.svg" data-iicon="glyphicon-off" alt="安全退出">
		</div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_body_ll">
			<div class="g_bodyin">
				<div class="g_bodyin_tit bootstro" data-bootstro-title="工程分析引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
					<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
					<div class="g_bodyin_tit_r">
						<ol class="breadcrumb">
						  	<li><a href="HomeInterface">系统主页面</a></li>
						  	<li class="active">工程分析</li>
						</ol>
					</div>
				</div>
				<div class="g_bodyin_body">
					<div class="g_bodyin_body_top bootstro" data-bootstro-title="工程分析引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>数据池</h4><p>所有的原始数据都在这里啦，您可以进行选择，</p><p>被选择的数据将会成为待分析待查阅数据</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
						<div class="g_bodyin_bodyin">
							<div class="g_bodyin_bodyin_body">
								<table class="table table-striped">
									<thead>
										<tr>
											<th><input type="checkbox" id="checkAll"></th>
											<th>产品类别</th>
											<th>产品名称</th>
											<th>批次编号</th>
											<th>晶圆编号</th>
											<th>器件类型</th>
											<th>良品率</th>
											<th>测试完成时间</th>
											<th>上传者</th>
											<th>描述</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
								<div class="futureDT2_page_wrapper">
									<div class="futureDT2_page">
										<ol class="pagination" id="pagelist"></ol><span class="futureDT2_page_span">&nbsp;到<input type="text" id="jumpText">页&nbsp;<input type="button" class="btn btn-primary" value="确定" id="jumpPage"></span>
									</div>
								</div>
							</div><!-- g_bodyin_bodyin_body end -->
						</div>
					</div>
					<div class="g_bodyin_body_bottom bootstro" data-bootstro-title="工程分析引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>被选中的数据</h4><p>被选中的数据将会放在这里，以便查阅</p></div>" data-bootstro-placement="top" data-bootstro-html="true" data-bootstro-step="3">
						需要分析的数据：
						<table class="table table-striped">
							<thead>
								<tr>
									<th>产品类别</th>
									<th>产品名称</th>
									<th>批次编号</th>
									<th>晶圆编号</th>
									<th>器件类型</th>
									<th>良品率</th>
									<th>测试完成时间</th>
									<th>上传者</th>
									<th>描述</th>
									<th  title="双击全部删除" class="g_bodyin_body_bottom_del_all">删除选中</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div><!-- g_bodyin_body_bottom end -->

				</div><!-- g_bodyin_body end -->
			</div><!-- g_bodyin end -->
		</div><!-- g_body_ll end -->
		<div class="g_body_rr">
			<div class="g_body_rr_tit"></div>
			<div class="g_body_rr_body bootstro" data-bootstro-title="工程分析引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>分析曲线</h4><p>在这里您可以选择要分析的曲线，需要首先选择数据哟，然后点击 Analyze 按钮</p></div>" data-bootstro-placement="left" data-bootstro-html="true" data-bootstro-step="4">
				<div class="g_body_rr_body_item" data-icurvetype="DC">
					&nbsp;<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> DC
					<div class="g_body_rr_body_itemin">
						<div>ID-VD</div>
						<div>ID-VG</div>
					</div>
				</div>
				<div class="g_body_rr_body_item" data-icurvetype="RTP">
					&nbsp;<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> RTP
					<div class="g_body_rr_body_itemin">
						<div>BTI</div>
						<div>HCI</div>
					</div>
				</div>
				<div class="g_body_rr_body_item" data-icurvetype="RF-S2P">
					&nbsp;<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> RF-S2P
					<div class="g_body_rr_body_itemin">
						<div>SP2</div>
					</div>
				</div>
				<div class="g_body_rr_body_btn"><input type="button" class="btn btn-primary" value="Analyze" disabled></div>
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
	<script src="assets/script/libs/pagination.min.js"></script>

	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/projectAnalysis/projectAnalysis.min.js -->
	<script src="src/script/modules/projectAnalysis/projectAnalysis.js"></script>
	<!-- endbuild -->
</body>
</html>