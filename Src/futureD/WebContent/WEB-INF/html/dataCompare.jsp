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
	<title>futureD数据对比</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/pagination.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">
	
	<!-- build:css ../../dist/style/modules/dataCompare/dataCompare.min.css -->
	<link rel="stylesheet" href="src/style/modules/dataCompare/dataCompare.css" type="text/css">
	<!-- endbuild -->
	
</head>
<body data-curpage="dataCompare" data-curusername="${userName}" data-userauthority="${userAuthority}" >
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
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="数据对比引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="index.html">系统主页面</a></li>
					  	<li class="active">数据对比</li>
					</ol>
					<span class="glyphicon glyphicon glyphicon-share-alt" aria-hidden="true" title="返回" data-ipage="g_bodyin_bodyin_bottom_1"></span>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_top bootstro" data-bootstro-title="数据对比引导：第六步" data-bootstro-content="<div class='well well-sm'><h4>分析工具</h4><p>在选择完数据、共有参数后，即可选择相应的工具进行分析，还可以直接查看所有统计哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="5">
						<div class="g_bodyin_bodyin_top_wrap">
							<!-- Nav tabs -->
							<ul class="nav nav-tabs" role="tablist">
							    <li role="presentation" class="active"><a href="#home_dataCompare" aria-controls="home_dataCompare" role="tab" data-toggle="tab">主页面</a></li>
							    <!-- <li role="presentation"><a href="#map_good_rate_distribution" aria-controls="map_good_rate_distribution" role="tab" data-toggle="tab">Map良率分布</a></li>
							    <li role="presentation"><a href="#map_color_order_distribution" aria-controls="map_color_order_distribution" role="tab" data-toggle="tab">Map色阶分布</a></li>
							    <li role="presentation"><a href="#good_rate" aria-controls="good_rate" role="tab" data-toggle="tab">良品率图</a></li>
							    <li role="presentation"><a href="#histogram" aria-controls="histogram" role="tab" data-toggle="tab">直方图</a></li>
							    <li role="presentation"><a href="#boxlinediagram" aria-controls="boxlinediagram" role="tab" data-toggle="tab">箱线图</a></li>
							    <li role="presentation"><a href="#CPK" aria-controls="CPK" role="tab" data-toggle="tab">CPK图</a></li>
							    <li role="presentation"><a href="#correlationgraph" aria-controls="correlationgraph" role="tab" data-toggle="tab">相关性图</a></li>
							    <li role="presentation"><a href="#all_statistics" aria-controls="all_statistics" role="tab" data-toggle="tab">所有统计</a></li> -->
							</ul>
						</div>
					</div><!-- g_bodyin_bodyin_top end -->
					<div class="g_bodyin_bodyin_bottom">
						<div class="tab-content">
						    <div role="tabpanel" class="tab-pane fade in active" id="home_dataCompare">
						    	<div class="home_dataCompare_wrap">
						    		<div class="home_dataCompare_top bootstro" data-bootstro-title="数据对比引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>数据池</h4><p>所有的原始数据都在这里啦，您可以进行选择，</p><p>被选择的数据将会成为待分析待查阅数据</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
						    			<div class="body_div">
						    				<table class="table table-striped">
						    					<thead>
						    						<tr>
						    							<th><input type="checkbox" id="checkAll" checkAll="false"></th>
						    							<th>产品类别</th>
						    							<th>产品名称</th>
						    							<th>批次编号</th>
						    							<th>晶圆编号</th>
						    							<th>器件类型</th>
						    							<th>良品率</th>
						    							<th>测试完成时间</th>
						    							<th>测试员</th>
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
						    			</div><!-- body_div end -->
						    		</div>
						    		<div class="home_dataCompare_bottom">
						    			<div class="left_div bootstro" data-bootstro-title="数据对比引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>被选中的数据</h4><p>被选中的数据将会放在这里，以便查阅</p></div>" data-bootstro-placement="top" data-bootstro-html="true" data-bootstro-step="3">
						    				选中的数据
						    				<table class="table table-striped">
						    					<thead>
						    						<th>产品类别</th>
						    						<th>产品名称</th>
						    						<th>批次编号</th>
						    						<th>晶圆编号</th>
						    						<th>器件类型</th>
						    						<th>良品率</th>
						    						<th title="双击全部删除" class="home_dataCompare_bottom_del_all">删除选中</th>
						    					</thead>
						    					<tbody></tbody>
						    				</table>
						    			</div>
						    			<div class="right_div bootstro" data-bootstro-title="数据对比引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>共有参数列表</h4><p>被选中的数据的共有参数将会放在这里，选择不同的参数将会有不同的规则来分析数据</p></div>" data-bootstro-placement="top" data-bootstro-html="true" data-bootstro-step="4">
						    				<div class="panel panel-info">
						    				  	<div class="panel-heading">
						    				    	<h3 class="panel-title">共有参数  <span class="badge allchoose"  ischoose="false">全选</span></h3>
						    				    	
						    				  	</div>
						    				  <div class="panel-body">
						    				   		<!-- List group -->
						    				   		<ul class="list-group" id="home_param_ul">
						    				   		    <!--<li class="list-group-item" data-iparam="TotalYield"><span class="badge">选中</span>Total Yield</li>
						    				   		     <li class="list-group-item" data-iparam="共有参数2"><span class="badge">选中</span>共有参数2</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数3"><span class="badge">选中</span>共有参数3</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数4"><span class="badge">选中</span>共有参数4</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数5"><span class="badge">选中</span>共有参数5</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数6"><span class="badge">选中</span>共有参数6</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数7"><span class="badge">选中</span>共有参数7</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数8"><span class="badge">选中</span>共有参数8</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数9"><span class="badge">选中</span>共有参数9</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数10"><span class="badge">选中</span>共有参数10</li> -->
						    				   		</ul>
						    				  </div>
						    				</div>
						    			</div>
						    		</div>
						    	</div>
						    </div>
						    <!-- Map良率分布 -->
						    <div role="tabpanel" class="tab-pane fade" id="map_good_rate_distribution">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
								<!-- <div class="panel panel-info">
								  	<div class="panel-heading">
								    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Panel title
								  	</div>
								  	<div class="panel-body">
								    	<div class="container-fluid">
								    		<div class="row">
								    			<div class="col-sm-6 col-md-3 col-lg-3"></div>
								    		</div>
								    	</div>
								  	</div>
								</div> -->
						    </div><!-- Map良率分布 end -->
						    <!-- Map色阶分布 -->
						    <div role="tabpanel" class="tab-pane fade" id="map_color_order_distribution">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- Map色阶分布end -->
						    <!-- 良品率图 -->
						    <div role="tabpanel" class="tab-pane fade" id="good_rate">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- 良品率图end -->
						    <!-- 直方图 -->
						    <div role="tabpanel" class="tab-pane fade" id="histogram">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- 直方图end -->
						    <!-- 箱线图 -->
						    <div role="tabpanel" class="tab-pane fade" id="boxlinediagram">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- 箱线图end -->
						    <!-- CPK图 -->
						    <div role="tabpanel" class="tab-pane fade" id="CPK">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- CPK图end -->
						    <!-- 相关性图 -->
						    <div role="tabpanel" class="tab-pane fade" id="correlationgraph">
						    	<div class="single_div_in"></div>
						    	<div class="mix_div_in"></div>
						    </div><!-- 相关性图end -->
						    <!-- 所有统计 -->
						    <div role="tabpanel" class="tab-pane fade" id="all_statistics">
						    	<div class="panel panel-info panel_map_good_rate_distribution" data-iallstatistics="map_good_rate_distribution">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Map良率分布
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_map_color_order_distribution" data-iallstatistics="map_color_order_distribution">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Map色阶分布
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_good_rate" data-iallstatistics="good_rate">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>良品率图
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_histogram" data-iallstatistics="histogram">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>直方图
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_boxlinediagram" data-iallstatistics="boxlinediagram">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>箱线图
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_CPK" data-iallstatistics="CPK">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>CPK图
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>

						    	<div class="panel panel-info panel_correlationgraph" data-iallstatistics="correlationgraph">
						    	  	<div class="panel-heading">
						    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>相关性图
						    	  	</div>
						    	  	<div class="panel-body">
						    	    	
						    	  	</div>
						    	</div>
						    </div><!-- 所有统计end -->
						 </div>
					</div><!-- g_bodyin_bodyin_bottom end -->
				</div><!-- g_bodyin_bodyin end -->
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
	<script src="assets/script/libs/newhighcharts.js"></script>	
	<script src="assets/script/libs/highcharts-axis-arrow.js"></script>
	<script src="assets/script/libs/highcharts-more.js"></script>
	<script src="assets/script/libs/histogram-bellcurve.js"></script>
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>
	<script src="assets/script/libs/numeral/numeral.min.js"></script>
	
	<!-- 下面一条手动替换，不构建 -->
	<!--<script src="assets/script/libs/drawWaferMap.js"></script>-->
	<script src="assets/script/modules/common/drawWaferMap.js"></script>
	
	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataCompare/dataCompareRenderChart.min.js -->
	<script src="src/script/modules/dataCompare/dataCompareRenderChart.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataCompare/dataCompare.min.js -->
	<script src="src/script/modules/dataCompare/dataCompare.js"></script>
	<!-- endbuild --> 
</body>
</html>