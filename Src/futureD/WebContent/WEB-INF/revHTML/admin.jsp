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
	<title>futureD管理员</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/pagination.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">

	<!-- build:css ../../dist/style/modules/admin/admin.min.css -->
	<link rel="stylesheet" type="text/css" href="src/style/modules/admin/admin.css"> 
	<!-- endbuild -->
</head>
<body data-curpage="admin" data-curusername="${userName}" data-userauthority="${userAuthority}" data-loginstatus='${loginStatus}'>
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r"><img src="assets/img/common/help_32px.svg" data-iicon="glyphicon-question-sign" alt="操作指引"><img src="assets/img/common/power_32px.svg" data-iicon="glyphicon-off" alt="安全退出"></div>
	</div>
	<div class="g_menu">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs bootstro" role="tablist" data-bootstro-title="管理员页面引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>分页切换区</h4><p>在这里您可以轻松地切换分页，</p><p>查看不同信息，是无刷新的哟</p></div>" data-bootstro-placement="right" data-bootstro-html="true" data-bootstro-step="0">
		    <li role="presentation" class="active" data-iclassify="staffManage"><a href="#staffManage" aria-controls="staffManage" role="tab" data-toggle="tab" title="您可以快速进行成员管理">成员管理</a></li>
		    <li role="presentation" data-iclassify="operaDailyLog"><a href="#operaDailyLog" aria-controls="operaDailyLog" role="tab" data-toggle="tab" title="您可以快速进行操作日志的查询">操作日志</a></li>
		</ul>
	</div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="管理员页面引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="">系统主页面</a></li>
					  	<li class="active">管理员</li>
					</ol>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<!-- Tab panes -->
					<div class="tab-content">
					    <div role="tabpanel" class="tab-pane fade in active" id="staffManage">
					    	<div class="staffManage_tit">
					    		<div class="staffManage_tit_l bootstro" data-bootstro-title="管理员页面引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>操作区域</h4><p>在这里您可以添加用户，删除用户，</p><p>还可以重新生成Mock数据</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="4">
					    			<img src="assets/img/common/addition_28px.svg" data-iicon="glyphicon-remove-circle" alt="添加" title="添加新用户">
					    			<img src="assets/img/common/del_32px.svg" data-iicon="glyphicon-remove" alt="删除选中" title="删除选中" style="margin-left: 15px;">
					    			<!-- <span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
					    			<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> -->
					    		</div>
					    		<div class="staffManage_tit_r bootstro" data-bootstro-title="管理员页面引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>搜索区域</h4><p>在这里您可以搜索关键词</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
					    			<div class="staffManage_tit_r_in">
					    				<!-- <div class="input-group">
					    				    <div class="input-group-btn">
					    				        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="请选择">请选择 <span class="caret"></span></button>
					    				        <ul class="dropdown-menu">
					    				          	<li data-iclass="td__user_name"><a href="javascript:;">用户名</a></li>
					    				          	<li data-iclass="td__telephone"><a href="javascript:;">电话</a></li>
					    				          	<li data-iclass="td__email"><a href="javascript:;">Email</a></li>
					    				          	<li data-iclass="td__role_id"><a href="javascript:;">角色</a></li>
					    				          	<li role="separator" class="divider"></li>
					    				        </ul>
					    				    </div>/btn-group
					    				    <input type="text" class="form-control" aria-label="输入框" data-isearch="search_button" disabled="disabled">
					    				    <input type="date" class="form-control" aria-label="日期选择框" disabled="disabled">
					    				</div>/input-group
					    				<input type="button" class="btn btn-primary" id="search_button" value="搜索"> -->
					    				<div class="form-inline">
					    				  	<div class="form-group has-feedback">
					    				  	  	<div class="input-group">
					    				  	    	<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
					    				  	    	<input type="text" class="form-control" id="search_input" placeholder="请输入关键词查找" value="${keyword}">
					    				  	  	</div>
					    				  	  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
					    				  	</div>
					    				  	<button class="btn btn-default" disabled="disabled" id="search_button">搜索</button>
					    				</div>
					    			</div>
					    		</div>
					    	</div>
					    	<div class="staffManage_body">
					    		<table class="table table-striped bootstro" data-bootstro-title="管理员页面引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>信息区域</h4><p>主要信息展示都在这里啦！</p><p>可以添加、修改、删除，以及授权管理</p><p>翻页是无刷新的哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="3">
					    			<thead>
					    				<tr>
					    					<th><input type="checkbox" id="checkAll"></th>
					    					<th>序号</th>
					    					<th>用户名</th>
					    					<th>性别</th>
					    					<th>电话</th>
					    					<th>Email</th>
					    					<th>角色</th>
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
					    	</div><!-- staffManage_body end -->
					    </div>
					    <div role="tabpanel" class="tab-pane fade" id="operaDailyLog">
					    	<div class="operaDailyLog_tit">
					    		<div class="operaDailyLog_tit_l">
					    			<button type="button" class="btn btn-default export_select" aria-label="Left Align" disabled="disabled">
					    			  	<span class="glyphicon glyphicon-export" aria-hidden="true"></span> 导出选中
					    			</button>
					    			<button type="button" class="btn btn-primary export_current" aria-label="Left Align">
					    			  	<span class="glyphicon glyphicon-export" aria-hidden="true"></span> 导出所有
					    			</button>
					    		</div>
					    		<div class="operaDailyLog_tit_r">
					    			<div>
					    				<div class="form-inline">
					    				  	<div class="form-group has-feedback">
					    				  	  	<div class="input-group">
					    				  	    	<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
					    				  	    	<input type="text" class="form-control" id="search_input2" placeholder="请输入关键词查找">
					    				  	  	</div>
					    				  	  	<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
					    				  	</div>
					    				  	<button class="btn btn-default" disabled="disabled" id="search_button2">搜索</button>
					    				</div>
					    			</div>
					    		</div>
					    	</div>
					    	<div class="operaDailyLog_body">
					    		<table class="table table-striped">
					    			<thead>
					    				<tr>
					    					<th><input type="checkbox" id="checkAll2"></th>
					    					<th>序号</th>
					    					<th>操作账号</th>
					    					<th>页面</th>
					    					<th>操作记录</th>
					    					<th>操作日期</th>
					    					<th>IP地址</th>
					    					<th>地理位置</th>
					    				</tr>
					    			</thead>
					    			<tbody>
					    			</tbody>
					    		</table>
					    		<div class="futureDT2_page_wrapper">
					    			<div class="futureDT2_page">
					    				<ol class="pagination" id="pagelist2"></ol><span class="futureDT2_page_span">&nbsp;到<input type="text" id="jumpText2">页&nbsp;<input type="button" class="btn btn-primary" value="确定" id="jumpPage2"></span>
					    			</div>
					    		</div>
					    	</div><!-- operaDailyLog_body end -->
					    </div><!-- operaDailyLog end -->
					</div>
					
				</div><!-- g_bodyin_bodyin end -->
			</div>
		</div>
	</div>
	<div class="futureDT2_bg_cover"></div>
	<div class="staff_addition">
		<div class="staff_addition_l">
			<div class="staff_addition_menu">
				<div class="staff_addition_menu_in">添加成员</div>
			</div>
		</div><div class="staff_addition_r">
			<div class="staff_addition_r_tit">详细信息</div>
			<div class="staff_addition_r_body">
				<div class="staff_addition_r_bodyin">
					<div class="container-fluid">
						<div class="row refresh">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control" placeholder="请输入用户名" id="staff_addition_user_name"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row refresh">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请输入密码" id="staff_addition_password"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row refresh">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请再次输入密码" id="staff_addition_password2"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><select id="staff_addition_sex" class="form-control isRequired">
						  		<option value="请选择性别" disabled selected>请选择性别</option>
						  		<option value="男">男</option>
						  		<option value="女">女</option>
						  	</select></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></div>
						</div>
						<div class="row refresh">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="tel" class="form-control" placeholder="请输入联系方式" id="staff_addition_telephone"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row refresh">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="email" class="form-control" placeholder="请输入电子邮箱" id="staff_addition_email"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><select id="staff_addition_role_id" class="form-control isRequired">
						  		<option value="请选择用户角色" disabled selected>请选择用户角色</option>
						  		<option value="1">成员</option>
						  		<option value="2">管理员</option>
						  		<!-- <option value="3">超级管理员</option> -->
						  	</select></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></div>
						</div>
					</div>
				</div>
			</div><!-- staff_addition_r_body end -->
			<div class="staff_addition_r_foot">
				<input type="button" value="提交" class="btn btn-primary" disabled>
				<input type="button" value="关闭" class="btn btn-warning">
			</div>
		</div>
	</div><!-- staff_addition end -->
	<div class="staff_update">
		<div class="staff_update_l">
			<div class="staff_update_menu">
				<div class="staff_update_menu_in">修改成员</div>
			</div>
		</div><div class="staff_update_r">
			<div class="staff_update_r_tit">详细信息</div>
			<div class="staff_update_r_body">
				<div class="staff_update_r_bodyin">
					<div class="container-fluid">
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="text" class="form-control" placeholder="请输入用户名" id="staff_update_user_name" ></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<!-- <div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请输入密码" id="staff_update_password"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6 has-feedback"><input type="password" class="form-control isRequired" placeholder="请再次输入密码" id="staff_update_password2"><span class="glyphicon glyphicon-eye-open form-control-feedback" aria-hidden="true"></span></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></div>
						</div> -->
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><select id="staff_update_sex" class="form-control isRequired">
						  		<option value="请选择性别" disabled selected>请选择性别</option>
						  		<option value="男">男</option>
						  		<option value="女">女</option>
						  	</select></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="tel" class="form-control" placeholder="请输入联系方式" id="staff_update_telephone"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1"></div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><input type="email" class="form-control" placeholder="请输入电子邮箱" id="staff_update_email"></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
						<div class="row">
						  	<div class="col-sm-1 col-md-1 col-lg-1">*</div>
						  	<div class="col-sm-6 col-md-6 col-lg-6"><select id="staff_update_role_id" class="form-control isRequired">
						  		<option value="请选择用户角色" disabled selected>请选择用户角色</option>
						  		<option value="1">成员</option>
						  		<option value="2">管理员</option>
						  		<option value="3">超级管理员</option>
						  	</select></div>
						  	<div class="col-sm-5 col-md-5 col-lg-5"></div>
						</div>
					</div>
				</div>
			</div><!-- staff_update_r_body end -->
			<div class="staff_update_r_foot">
				<input type="button" value="提交" class="btn btn-primary" disabled>
				<input type="button" value="关闭" class="btn btn-warning">
			</div>
		</div>
	</div><!-- staff_update end -->
	<div class="staff_authority">
		<div class="staff_authority_l">
			<div class="staff_authority_menu">
				<div class="staff_authority_menu_in">授权管理</div>
			</div>
		</div><div class="staff_authority_r">
			<div class="staff_authority_r_tit"></div>
			<div class="staff_authority_r_body">
				<div class="staff_authority_r_bodyin">
					<div class="container-fluid">
						<div class="table-responsive">
							<table class="table table-striped table-bordered table-hover table-condensed">
								<thead>
									<tr>
										<th>一级</th>
										<th>权限与分配</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div><!-- staff_authority_r_body end -->
			<div class="staff_authority_r_foot">
				<input type="button" value="提交" class="btn btn-primary">
				<input type="button" value="关闭" class="btn btn-warning">
			</div>
		</div>
	</div><!-- staff_authority end -->
	<script src="assets/script/libs/jquery-3.3.1.min.js"></script>
	<script src="assets/script/libs/bootstrap.min.js"></script>
	<script src="assets/script/libs/lodash.min.js"></script>
	<script src="assets/script/libs/store.legacy.min.js"></script>
	<script src="assets/script/libs/moment-with-locales.min.js"></script>
	<script src="assets/script/libs/sweetalert2.min.js"></script>
	<script src="assets/script/libs/a_polyfill_for_ES6_Promises_for_IE11_and_Android.js"></script>
	<script src="assets/script/libs/pagination.min.js"></script>
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>

	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->
	
	<!-- build:js ../../dist/script/modules/admin/admin.min.js -->
	<script src="src/script/modules/admin/admin.js"></script>
	<!-- endbuild -->
</body>
</html>