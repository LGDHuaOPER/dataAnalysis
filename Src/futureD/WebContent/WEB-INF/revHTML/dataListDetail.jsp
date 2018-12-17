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
	<title>futureD数据列表-详细信息</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/jquery.contextMenu.min.css" type="text/css">

	<!-- build:css ../../dist/style/modules/dataListDetail/dataListDetail.min.css -->
	<link rel="stylesheet" href="src/style/modules/dataListDetail/dataListDetail.css" type="text/css">
	<!-- endbuild -->

</head>
<body data-curpage="dataListDetail" data-curusername='${userName}' data-result='${result}' data-webparam='${webParam}' data-waferid='${waferId}' data-dataformat='${dataFormat}' data-userauthority="${userAuthority}">
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="详细信息引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1">
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
	<div class="g_menu bootstro" data-bootstro-title="详细信息引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>分页区域</h4><p>在这里您可以选择不同的分页查看操作，切换分页是无刷新的哟</p></div>" data-bootstro-placement="right" data-bootstro-html="true" data-bootstro-step="0">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs" role="tablist">
		    <li role="presentation" class="active" data-iclassify="allDetail"><a href="#allDetail" aria-controls="allDetail" role="tab" data-toggle="tab" title="您可以快速查看该晶圆的参数数据">参数数据</a></li>
		    <li role="presentation" data-iclassify="vectorMap"><a href="#vectorMap" aria-controls="vectorMap" role="tab" data-toggle="tab" title="您可以快速预览矢量数据">矢量数据</a></li>
		    <li role="presentation" data-iclassify="parameterMap"><a href="#parameterMap" aria-controls="parameterMap" role="tab" data-toggle="tab" title="您可以快速预览参数分布统计">参数分布统计</a></li>
		</ul>
	</div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="详细信息引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，或者跳转数据列表页面。</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
				<div class="g_bodyin_tit_r">
					<div class="container-fluid">
						<div class="row">
							<div class="col-sm-12 col-md-6 col-lg-6">
								<ol class="breadcrumb">
								  	<li><a href="HomeInterface">系统主页面</a></li>
								  	<li><a href="DataList">数据列表</a></li>
								  	<li class="active">详细信息</li>
								</ol>
							</div>
							<div class="col-sm-12 col-md-6 col-lg-6 webParam">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<!-- Tab panes -->
					<div class="tab-content">
					    <div role="tabpanel" class="tab-pane fade in active" id="allDetail">
					    	<div class="allDetail_tit"></div>
					    	<div class="allDetail_body">
					    		<div class="table_head">
					    			<table class="table table-striped table-bordered table-hover table-condensed">
					    				<thead></thead>
					    			</table>
					    		</div>
					    		<div class="table_body">
					    			<table class="table table-striped table-bordered table-hover table-condensed">
					    				<tbody></tbody>
					    			</table>
					    		</div>
					    	</div>
					    	<div class="allDetail_foot"></div>
					    </div>
					    <div role="tabpanel" class="tab-pane fade" id="vectorMap">
					    	<div class="vectorMap_in">
			    		    	<div class="vectorMap_l">
			    		    		<div class="container-fluid">
			    		    			<!-- 信息 -->
			    		    			<div class="row">
			    		    				<div class="col-sm-12 col-md-12 col-lg-6">
			    		    					<!-- 合格信息 -->
			    		    					<div class="qualifiedInformation_div">
						    		    			<div class="panel panel-info">
						    		    			  	<div class="panel-heading">
						    		    			    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>合格信息
						    		    			  	</div>
						    		    			  	<div class="panel-body">
						    		    			    	<table class="table table-striped table-bordered table-hover table-condensed">
						    		    			    		<tbody>
						    		    			    			<tr>
						    		    			    				<td>所选参数</td>
						    		    			    				<td>ALL</td>
						    		    			    			</tr>
						    		    			    			<tr>
						    		    			    				<td>良率</td>
						    		    			    				<td></td>
						    		    			    			</tr>
						    		    			    			<tr>
						    		    			    				<td>合格数</td>
						    		    			    				<td></td>
						    		    			    			</tr>
						    		    			    			<tr>
						    		    			    				<td>不合格数</td>
						    		    			    				<td></td>
						    		    			    			</tr>
						    		    			    		</tbody>
						    		    			    	</table>
						    		    			  	</div>
						    		    			</div>
						    		    		</div>
						    		    		<!-- 合格信息end -->
			    		    				</div>
			    		    				<div class="col-sm-12 col-md-12 col-lg-6">
			    		    					<!-- 坐标信息 -->
			    		    					<div class="coordinateInformation_div">
			    		    						<div class="panel panel-info">
			    		    						  	<div class="panel-heading">
			    		    						    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>坐标信息
			    		    						    	<span class="glyphicon glyphicon-ok" id="filterMap" aria-hidden="true" title="过滤"></span>
			    		    						  	</div>
			    		    						  	<div class="panel-body">
			    		    						    	<table class="table table-striped table-bordered table-hover table-condensed">
			    		    						    		<tbody>
			    		    						    			<tr>
			    		    						    				<td>坐标</td>
			    		    						    				<td>（0:0）</td>
			    		    						    			</tr>
			    		    						    			<tr>
			    		    						    				<td>Subdie</td>
			    		    						    				<td><select id="SubdieSel" class="form-control">
			    		    						    					<option value="AllSubdie">AllSubdie</option>
			    		    						    				</select></td>
			    		    						    			</tr>
			    		    						    			<tr>
			    		    						    				<td>Group</td>
			    		    						    				<td><select id="GroupSel" class="form-control">
			    		    						    					<option value="AllGroup">AllGroup</option>
			    		    						    				</select></td>
			    		    						    			</tr>
			    		    						    			<tr>
			    		    						    				<td>DieType</td>
			    		    						    				<td><select id="DieTypeSel" class="form-control">
			    		    						    					<option value="AllDieType">AllDieType</option>
			    		    						    				</select></td>
			    		    						    			</tr>
			    		    						    		</tbody>
			    		    						    	</table>
			    		    						  	</div>
			    		    						</div>
			    		    					</div>
			    		    					<!-- 坐标信息end -->
			    		    				</div>
			    		    			</div>
			    		    			<!-- 信息end -->
			    		    			<div class="row all_charts_rows">
			    		    				<div class="col-sm-12 col-md-12 col-lg-12 ID_VD_col">
			    		    					<div class="panel panel-info">
			    		    					  	<div class="panel-heading">
			    		    					    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>ID_VD
			    		    					  	</div>
			    		    					  	<div class="panel-body">
			    		    					    	<div class="panel_chart_body"></div>
			    		    					    	<div class="panel_chart_foot"></div>
			    		    					  	</div>
			    		    					</div><!-- ID_VD end -->
			    		    				</div>
			    		    				<div class="col-sm-12 col-md-12 col-lg-12 OutputCurve_col">
			    		    					<div class="panel panel-info">
			    		    					  	<div class="panel-heading">
			    		    					    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>OutputCurve
			    		    					  	</div>
			    		    					  	<div class="panel-body">
			    		    					    	<div class="panel_chart_body"></div>
			    		    					    	<div class="panel_chart_foot"></div>
			    		    					  	</div>
			    		    					</div><!-- OutputCurve end -->
			    		    				</div>
			    		    				<div class="col-sm-12 col-md-12 col-lg-12 SP2_col">
			    		    					<div class="panel panel-info">
			    		    					  	<div class="panel-heading">
			    		    					    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>SP2
			    		    					  	</div>
			    		    					  	<div class="panel-body">
			    		    					    	<div class="panel_chart_body"></div>
			    		    					    	<div class="panel_chart_foot"></div>
			    		    					  	</div>
			    		    					</div><!-- SP2RF end -->
			    		    				</div>
			    		    				<div class="col-sm-12 col-md-12 col-lg-12 MOS_Cgg_Vgs_Vds_ext_col">
			    		    					<div class="panel panel-info">
			    		    					  	<div class="panel-heading">
			    		    					    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>MOS_Cgg_Vgs_Vds_ext
			    		    					  	</div>
			    		    					  	<div class="panel-body">
			    		    					    	<div class="panel_chart_body"></div>
			    		    					    	<div class="panel_chart_foot"></div>
			    		    					  	</div>
			    		    					</div><!-- MOS_Cgg_Vgs_Vds_ext end -->
			    		    				</div>
			    		    				<div class="col-sm-12 col-md-12 col-lg-12 Noise_MOS_Normal_col">
			    		    					<div class="panel panel-info">
			    		    					  	<div class="panel-heading">
			    		    					    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>Noise_MOS_Normal
			    		    					  	</div>
			    		    					  	<div class="panel-body">
			    		    					    	<div class="panel_chart_body"></div>
			    		    					    	<div class="panel_chart_foot"></div>
			    		    					  	</div>
			    		    					</div><!-- Noise_MOS_Normal end -->
			    		    				</div>
			    		    			</div>
			    		    		</div>
			    		    	</div>
			    		    	<div class="vectorMap_r">
			    		    		<!-- 坐标图 -->
			    		    		<div class="positionFlag_div">
			    		    			<img src="" alt="坐标图" height="100" width="100">
			    		    		</div>
			    		    		<canvas id="canvas_vectorMap"></canvas>
			    					<div id="in" style="position: absolute; z-index: 10;"></div>
			    		    	</div>
					    	</div>
					    </div><!-- vectorMap end -->
					    <div role="tabpanel" class="tab-pane fade" id="parameterMap">
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

					    	<div class="panel panel-info panel_gaussiandistribution" data-iallstatistics="gaussiandistribution">
					    	  	<div class="panel-heading">
					    	    	<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>高斯分布图
					    	  	</div>
					    	  	<div class="panel-body">
					    	    	
					    	  	</div>
					    	</div>

					    </div><!-- parameterMap end -->
					</div><!-- tab-content end -->
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
	<!-- <script src="assets/script/libs/progressbar.min.js"></script> -->
	<script src="assets/script/libs/newhighcharts.js"></script>	
	<script src="assets/script/libs/highcharts-axis-arrow.js"></script>
	<script src="assets/script/libs/highcharts-more.js"></script>
	<script src="assets/script/libs/histogram-bellcurve.js"></script>
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>
	<script src="assets/script/libs/drawingSmith.js"></script>
	<script src="assets/script/libs/jquery-contextMenu/jquery.contextMenu.min.js"></script>
	<script src="assets/script/libs/jquery-contextMenu/jquery.ui.position.min.js"></script>
	<script src="assets/script/libs/numeral/numeral.min.js"></script>
	<!-- 下面一条手动替换，不构建 -->
	<!--<script src="assets/script/libs/drawWaferMap.js"></script>-->
	<script src="src/script/modules/common/drawWaferMap.js"></script>

	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataCompare/dataCompareRenderChart.min.js -->
	<script src="src/script/modules/dataCompare/dataCompareRenderChart.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataListDetail/dataListDetail.min.js -->
	<script src="src/script/modules/dataListDetail/dataListDetail.js"></script>
	<!-- endbuild -->
</body>
</html>