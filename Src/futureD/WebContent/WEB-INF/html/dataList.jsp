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
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, minimum-scale=1, user-scalable=no">]
	<link rel="shortcut icon" href="./eoulu.ico"/>
	<link rel="bookmark" href="./eoulu.ico"/>
	<title>futureD数据列表</title>
	<link rel="stylesheet" href="src/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="src/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="src/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="src/style/common/pagination.min.css" type="text/css">
	<link rel="stylesheet" href="src/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="src/style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="src/style/libs/awesomplete_all.css" type="text/css">
	<link rel="stylesheet" href="src/style/common/futureDT2AddUpdate.css" type="text/css">
	<link rel="stylesheet" href="src/style/modules/dataList/dataList.css" type="text/css">
</head>
<body data-curpage="dataList">
	<div class="g_logo"><img src="src/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="数据列表引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><span class="glyphicon glyphicon-off" aria-hidden="true"></span></div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="数据列表引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="index.html">系统主页面</a></li>
					  	<li class="active">数据列表</li>
					</ol>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_tit bootstro" data-bootstro-title="数据列表引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>操作区域</h4><p>在这里您可以添加上传数据，删除选中数据,重新生成mock数据</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
						<div class="g_bodyin_bodyin_tit_l"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true" title="上传添加新数据"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" title="删除选中"></span><span class="glyphicon glyphicon-refresh" aria-hidden="true" title="重新生成mock数据"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" title="跳转至回收站" style="display: none;"></span></div>
						<div class="g_bodyin_bodyin_tit_r">
							<div>
								<form class="form-inline">
								  	<div class="form-group has-feedback">
								  	  	<div class="input-group">
								  	    	<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
								  	    	<input type="text" class="form-control" id="search_input" placeholder="请输入关键词查找">
								  	  	</div>
								  	  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
								  	</div>
								  	<button class="btn btn-default" disabled="disabled" id="search_button">搜索</button>
								</form>
							</div>
						</div>
					</div>
					<div class="g_bodyin_bodyin_body">
						<table class="table table-striped bootstro" data-bootstro-title="数据列表引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>主数据区域</h4><p>所有的数据都在这里进行显示以及管理</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="3">
							<thead>
								<tr class="bootstro" data-bootstro-title="数据列表引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>表格头部区域</h4><p>这里显示数据的产品名称、批次编号等，最后一列是操作，您可以对单条数据进行修改、查看详情、删除</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="4">
									<th><input type="checkbox" id="checkAll"></th>
									<th>产品名称</th>
									<th>批次编号</th>
									<th>晶圆编号</th>
									<th>合格率</th>
									<th>测试时间</th>
									<th>上传者</th>
									<th>描述</th>
									<th>操作</th>
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
		</div>
	</div>
	<div class="futureDT2_bg_cover"></div>
	<div class="futureDT2_addition" data-iparent="addition">
		<div class="futureDT2_addition_l">
			<div class="futureDT2_addition_menu">
				<div class="futureDT2_addition_menu_in">上传文件</div>
			</div>
		</div><div class="futureDT2_addition_r">
			<div class="futureDT2_addition_r_tit">详细信息</div>
			<div class="futureDT2_addition_r_body">
				<div class="futureDT2_addition_r_bodyin">
					<div class="container-fluid">
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6">
						  		<select id="futureDT2_addition_data_format" class="form-control isRequired">
						  			<option value="请选择数据格式" disabled selected>请选择数据格式</option>
						  			<option value="0">EOULU标准数据</option>
						  			<option value="1">博达微数据</option>
						  			<option value="2">新Excel格式</option>
						  			<option value="3">TXT数据格式</option>
						  		</select>
						  	</div>
						  	<div class="col-sm-5 col-md-5 col-lg-5 info_div"></div>
						</div>
						<!-- <div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请输入密码" id="futureDT2_addition_password"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div> -->
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="text" id="futureDT2_addition_product_category" class="form-control isRequired" placeholder="请输入或选择产品名称"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5 info_div"></div>
						</div>
						<div class="row row_extra2">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-10 col-md-10 col-lg-10"><textarea id="futureDT2_addition_td_description" rows="2" class="form-control" maxlength="100" placeholder="最多输入100个字符"></textarea></div>
						</div>
					</div><!-- container-fluid end -->
					<div class="container-fluid">
						<div class="container-fluid_in">
							<div class="container-fluid_in_tit">添加文件</div>
							<div class="container-fluid_in_body">
								<div class="container-fluid">
									<div class="row row_extra3">
										<div class="col-sm-12 col-md-6 col-lg-6">
											<div class="well">
												<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span><input type="file" id="add_file_Upload" accept="aplication/zip, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"><br>
												点击/拖拽文件到这里上传<br>
												<small>支持Excel、TXT等数据格式</small>
											</div>
										</div>
										<div class="col-sm-12 col-md-6 col-lg-6">
											<div class="alert alert-info" role="alert">
											  	<div class="container-fluid">
											  		<div class="row">
											  			<div class="col-sm-12 col-md-8 col-lg-i8">
											  				<div class="upload_l_tit"></div>
											  				<div class="upload_l_body"></div>
											  			</div>
											  			<div class="col-sm-12 col-md-4 col-lg-4">
											  				<div id="upload_container"></div>
											  			</div>
											  		</div>
											  	</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div><!-- futureDT2_addition_r_body end -->
			<div class="futureDT2_addition_r_foot">
				<input type="button" value="提交" class="btn btn-primary" disabled>
				<input type="button" value="关闭" class="btn btn-warning">
			</div>
		</div>
	</div><!-- futureDT2_addition end -->
	<div class="futureDT2_update" data-iparent="update">
		<div class="futureDT2_update_l">
			<div class="futureDT2_update_menu">
				<div class="futureDT2_update_menu_in">修改信息</div>
			</div>
		</div><div class="futureDT2_update_r">
			<div class="futureDT2_update_r_tit">详细信息</div>
			<div class="futureDT2_update_r_body">
				<div class="futureDT2_update_r_bodyin">
					<div class="container-fluid">
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6">
						  		<select id="futureDT2_update_data_format" class="form-control isRequired">
						  			<option value="请选择数据格式" disabled selected>请选择数据格式</option>
						  			<option value="0">EOULU标准数据</option>
						  			<option value="1">博达微数据</option>
						  			<option value="2">新Excel格式</option>
						  			<option value="3">TXT数据格式</option>
						  		</select>
						  	</div>
						  	<div class="col-sm-5 col-md-5 col-lg-5 info_div"></div>
						</div>
						<!-- <div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请输入密码" id="futureDT2_update_password"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div> -->
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="text" id="futureDT2_update_product_category" class="form-control isRequired" placeholder="请输入或选择产品名称"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5 info_div"></div>
						</div>
						<div class="row row_extra">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-10 col-md-10 col-lg-10"><textarea id="futureDT2_update_td_description" rows="3" class="form-control" maxlength="100" placeholder="最多输入100个字符"></textarea></div>
						</div>
					</div>
				</div>
			</div><!-- futureDT2_update_r_body end -->
			<div class="futureDT2_update_r_foot">
				<input type="button" value="提交" class="btn btn-primary" disabled>
				<input type="button" value="关闭" class="btn btn-warning">
			</div>
		</div>
	</div><!-- futureDT2_update end -->
	<script src="src/script/libs/jquery-3.3.1.min.js"></script>
	<script src="src/script/libs/bootstrap.min.js"></script>
	<script src="src/script/libs/lodash.min.js"></script>
	<script src="src/script/libs/store.legacy.min.js"></script>
	<script src="src/script/libs/moment-with-locales.min.js"></script>
	<script src="src/script/libs/sweetalert2.min.js"></script>
	<script src="src/script/libs/a_polyfill_for_ES6_Promises_for_IE11_and_Android.js"></script>
	<script src="src/script/common/futureDT2session.js"></script>
	<script src="src/script/common/pagination.min.js"></script>
	<script src="src/script/libs/awesomplete.min.js"></script>
	<script src="src/script/libs/progressbar.min.js"></script>
	<script src="src/script/libs/bootstro.js"></script>
	<script src="src/script/common/futureD_bootstro.js"></script>
	<script src="src/script/common/futureD_config.js"></script>
	<script src="src/script/common/mock.js"></script>
	<script src="src/script/modules/dataList/dataList.js"></script>
</body>
</html>