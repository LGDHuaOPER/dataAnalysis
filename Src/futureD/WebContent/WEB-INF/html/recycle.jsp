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
	<title>futureD数据列表--回收站</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/pagination.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/awesomplete_all.css" type="text/css">
	<link rel="stylesheet" href="assets/style/common/futureDT2AddUpdate.css" type="text/css">
	<!-- 变 -->
	<link rel="stylesheet" href="src/style/modules/recycle/recycle.css" type="text/css">
</head>
<body data-curpage="recycle" data-curusername="${userName}" data-waferlist="${waferList}" data-currentpage="${currentPage}" data-totalpage="${totalPage}" data-totalcount="${totalCount}" data-userauthority="${userAuthority}">
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="回收站引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><span class="glyphicon glyphicon-off" aria-hidden="true"></span></div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="回收站引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>可以跳转回数据列表页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="HomeInterface">系统主页面</a></li>
					  	<li><a href="DataList">数据列表</a></li>
					  	<li class="active">回收站</li>
					</ol>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_tit bootstro" data-bootstro-title="回收站引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>操作区域</h4><p>在这里您可以永久删除选中数据或者恢复选中数据</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
						<div class="g_bodyin_bodyin_tit_l"><img src="assets/img/common/del_32px.svg" data-iicon="glyphicon-remove" alt="删除选中" title="永久删除选中"><img src="assets/img/common/recovery_32px.svg" data-iicon="glyphicon-share-alt" alt="恢复选中" title="恢复选中"></div>
						<div class="g_bodyin_bodyin_tit_r">
							<div>
								<form class="form-inline">
								  	<div class="form-group has-feedback">
								  	  	<div class="input-group">
								  	    	<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
								  	    	<input type="text" class="form-control" id="search_input" placeholder="请输入关键词查找" value="${keyword}">
								  	  	</div>
								  	  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
								  	</div>
								  	<button class="btn btn-primary" id="search_button">搜索</button>
								</form>
							</div>
						</div>
					</div>
					<div class="g_bodyin_bodyin_body">
						<table class="table table-striped bootstro" data-bootstro-title="回收站引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>主数据区域</h4><p>所有的数据都在这里进行显示以及管理</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="3">
							<thead>
								<tr class="bootstro" data-bootstro-title="回收站引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>表格头部区域</h4><p>这里显示数据的产品名称、批次编号等，最后一列是操作，您可以对单条数据进行永久删除或者恢复</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="4">
									<th><input type="checkbox" id="checkAll" title="选中/不选中本页"></th>
									<th>产品名称</th>
									<th>批次编号</th>
									<th>晶圆编号</th>
									<th>良品率</th>
									<th>测试完成时间</th>
									<th>测试员</th>
									<th>描述</th>
									<th>操作</th>
									<th class="hide">产品类别</th>
									<th class="hide">数据格式</th>
									<th class="hide">器件类型</th>
								</tr>
							</thead>
							<tbody>
								<!-- 主页面数据 -->
								<c:forEach var="waferListItem" items="${waferList}" varStatus="status">
									<tr>
										<td class="not_search"><input type="checkbox" data-iid="${waferListItem['wafer_id']}"></td>
										<td class="device_number_td" data-ivalue="${waferListItem['device_number']}" title="${waferListItem['device_number']}">${waferListItem['device_number']}</td>
										<!-- 批次编号 -->
										<td class="lot_number_td" data-ivalue="${waferListItem['lot_number']}" title="${waferListItem['lot_number']}">${waferListItem['lot_number']}</td>
										<td class="wafer_number_td" data-ivalue="${waferListItem['wafer_number']}" title="${waferListItem['wafer_number']}">${waferListItem['wafer_number']}</td>
										<td class="qualified_rate_td" data-ivalue="${waferListItem['qualified_rate']}" title="${waferListItem['qualified_rate']}">${waferListItem['qualified_rate']}</td>
										<td class="test_end_date_td" data-ivalue="${waferListItem['test_end_date']}" title="${waferListItem['test_end_date']}">${waferListItem['test_end_date']}</td>
										<td class="test_operator_td" data-ivalue="${waferListItem['test_operator']}" title="${waferListItem['test_operator']}">${waferListItem['test_operator']}</td>
										<td class="description_td" data-ivalue="${waferListItem['description']}" title="${waferListItem['description']}">${waferListItem['description']}</td>
										<td class="not_search operate_othertd"><img src="assets/img/common/del_24px.svg" data-iid="${waferListItem['wafer_id']}" data-iicon="glyphicon-remove" alt="删除" title="永久删除"><img src="assets/img/common/recovery_24px.svg" data-iid="${waferListItem['wafer_id']}" data-iicon="glyphicon-share-alt" alt="恢复" title="恢复"></td>
										<td class="not_search product_category_td hide" data-ivalue="${waferListItem['product_category']}"></td>
										<td class="not_search data_format_td hide" data-ivalue="${waferListItem['data_format']}"></td>
										<td class="not_search die_type_td hide" data-ivalue="${waferListItem['die_type']}"></td>
									</tr>
								</c:forEach>
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
		</div>
	</div>
	
	<script src="assets/script/libs/jquery-3.3.1.min.js"></script>
	<script src="assets/script/libs/bootstrap.min.js"></script>
	<script src="assets/script/libs/lodash.min.js"></script>
	<script src="assets/script/libs/store.legacy.min.js"></script>
	<script src="assets/script/libs/moment-with-locales.min.js"></script>
	<script src="assets/script/libs/sweetalert2.min.js"></script>
	<script src="assets/script/libs/a_polyfill_for_ES6_Promises_for_IE11_and_Android.js"></script>
	<script src="assets/script/libs/pagination.min.js"></script>
	<script src="assets/script/libs/awesomplete.min.js"></script>
	<script src="assets/script/libs/progressbar.min.js"></script>
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>
	<!-- 变 -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<script src="src/script/modules/common/globalConf.js"></script>
	<script src="src/script/modules/recycle/recycle.js"></script>
</body>
</html>