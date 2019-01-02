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
	<title>futureD数据统计</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">

	<!-- build:css ../../dist/style/modules/dataStatistics/dataStatistics.min.css -->
	<link rel="stylesheet" type="text/css" href="src/style/modules/dataStatistics/dataStatistics.css">
	<!-- endbuild -->
</head>
<body data-curpage="dataStatistics" data-userauthority="${userAuthority}"  data-curusername="${userName}" data-wafer='${datas}' data-loginstatus='${loginStatus}'>
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="数据统计引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1">
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
			<div class="g_bodyin_tit bootstro" data-bootstro-title="数据统计引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"><!-- <span class="glyphicon glyphicon-home" aria-hidden="true"></span> --></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="HomeInterface">系统主页面</a></li>
					  	<li><a href="ProjectAnalysis">工程分析</a></li>
					  	<li><a class="RF_SP2" >RF-SP2分析</a></li>
					  	<li class="active">数据统计</li>
					</ol>
					<span class="glyphicon glyphicon glyphicon-share-alt" aria-hidden="true" title="返回" data-ipage="g_bodyin_bodyin_bottom_1"></span>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_top">
						<div class="g_bodyin_bodyin_top_wrap">
							<div class="g_bodyin_bodyin_top_wrap_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
							<div class="g_bodyin_bodyin_top_wrap_m">
								<div class="g_bodyin_bodyin_top_wrap_m_in">
									<ul>
									</ul>
								</div>
							</div>
							<div class="g_bodyin_bodyin_top_wrap_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
						</div>
					</div><!-- g_bodyin_bodyin_top end -->
					<div class="g_bodyin_bodyin_bottom">
						<div class="g_bodyin_bodyin_bottom_1">
							<div class="g_bodyin_bodyin_bottom_l bootstro" data-bootstro-title="数据统计引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>文件和参数区域</h4><p>在这里显示的是您选择的csv文件和参数，选择图表工具切换后，这里显示您二次选择的csv文件和参数</p></div>" data-bootstro-placement="right" data-bootstro-html="true" data-bootstro-step="2">
								<div class="g_bodyin_bodyin_bottom_l_intop">
									<!-- <div class="g_bodyin_bodyin_bottom_l_item">
										<div class="g_bodyin_bodyin_bottom_l_itemin">
											<div class="g_bodyin_bodyin_bottom_l_itemin_main">WaferID01.csv<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
											<div class="g_bodyin_bodyin_bottom_l_itemin_sub">
												<div class="g_bodyin_bodyin_bottom_l_itemin_subin">1-0-RF.S2P</div>
												<div class="g_bodyin_bodyin_bottom_l_itemin_subin">2-0-RF.S2P</div>
												<div class="g_bodyin_bodyin_bottom_l_itemin_subin">3-0-RF.S2P</div>
												<div class="g_bodyin_bodyin_bottom_l_itemin_subin">4-0-RF.S2P</div>
												<div class="g_bodyin_bodyin_bottom_l_itemin_subin">5-0-RF.S2P</div>
											</div>
										</div>
									</div> -->
								</div><!-- g_bodyin_bodyin_bottom_l_intop end -->
								<div class="g_bodyin_bodyin_bottom_l_inmid"></div>
								<div class="g_bodyin_bodyin_bottom_l_inbottom">
									<div class="list-group">
									  	<!-- <a href="javascript:;" class="list-group-item active"><span class="badge">14</span>
									  										    Cras justo odio
									  	</a>
									  	<a href="javascript:;" class="list-group-item">Dapibus ac facilisis in</a><span class="badge">14</span> -->
									</div>
								</div>
							</div><!-- g_bodyin_bodyin_bottom_l end -->
							<div class="g_bodyin_bodyin_bottom_r bootstro" data-bootstro-title="数据统计引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>图表工具区域</h4><p>在这里显示的是供选择的图表，选择图表工具切换后，这里显示对应图表</p></div>" data-bootstro-placement="left" data-bootstro-html="true" data-bootstro-step="3">
								<div class="container-fluid">
									<div class="row">
										<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="histogram">
										      	<img src="assets/img/modules/dataStatistics/1.png" alt="直方图" width="198">
										      	<div class="caption">
										        	<h3>直方图</h3>
										      	</div>
										    </div>
										</div>
									  	<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="boxlinediagram">
										      	<img src="assets/img/modules/dataStatistics/2.png" alt="箱线图" width="198">
										      	<div class="caption">
										        	<h3>箱线图</h3>
										      	</div>
										    </div>
										</div>
										<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="CPK">
										      	<img src="assets/img/modules/dataStatistics/4.png" alt="CPK" width="198">
										      	<div class="caption">
										        	<h3>CPK</h3>
										      	</div>
										    </div>
										</div>
									</div><!-- row end -->
									<div class="row">
										<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="correlationgraph">
										      	<img src="assets/img/modules/dataStatistics/5.png" alt="相关性" width="198">
										      	<div class="caption">
										        	<h3>相关性</h3>
										      	</div>
										    </div>
										</div>
									  	<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="wafermap">
										      	<img src="assets/img/modules/dataStatistics/3.png" alt="晶圆图" width="198">
										      	<div class="caption">
										        	<h3>晶圆图</h3>
										      	</div>
										    </div>
										</div>
										<div class="col-sm-6 col-md-4 col-lg-4">
											<div class="thumbnail" data-ipage="g_bodyin_bodyin_bottom_2" data-ichart="gaussiandistribution">
										      	<img src="assets/img/modules/dataStatistics/6.png" alt="高斯分布图" width="198">
										      	<div class="caption">
										        	<h3>高斯分布图</h3>
										      	</div>
										    </div>
										</div>
									</div><!-- row end -->
								</div><!-- container-fluid end -->
							</div>
						</div><!-- g_bodyin_bodyin_bottom_1 end -->
						<div class="g_bodyin_bodyin_bottom_2">
							<div class="g_bodyin_bodyin_bottom_lsub">
								<div class="g_bodyin_bodyin_bottom_lsub_top">
									<!-- chart图csv -->
								</div><!-- g_bodyin_bodyin_bottom_lsub_top end -->
								<div class="g_bodyin_bodyin_bottom_lsub_mid">
									<!-- chart图param -->
								</div><!-- g_bodyin_bodyin_bottom_lsub_mid end -->
								<div class="g_bodyin_bodyin_bottom_lsub_bottom">
									<input type="button" class="btn btn-success btn-block" value="确定">
								</div><!-- g_bodyin_bodyin_bottom_lsub_bottom end -->
							</div><!-- g_bodyin_bodyin_bottom_lsub end -->
							<div class="g_bodyin_bodyin_bottom_rsub">
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_histogram" data-ishowchart="histogram">
									<!-- <div class="chartTit">直方图histogram</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_boxlinediagram" data-ishowchart="boxlinediagram">
								<!-- 	<div class="chartTit">箱线图boxlinediagram</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_CPK" data-ishowchart="CPK">
									<!-- <div class="chartTit">CPK</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_correlationgraph" data-ishowchart="correlationgraph">
									<!-- <div class="chartTit">相关性correlationgraph</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_wafermap" data-ishowchart="wafermap">
									<!-- <div class="chartTit">晶圆图wafermap</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
								<div class="g_bodyin_bodyin_bottom_rsubin g_bodyin_bodyin_bottom_gaussiandistribution" data-ishowchart="gaussiandistribution">
									<!-- <div class="chartTit">高斯分布图gaussiandistribution</div> -->
									<div class="chartBody">
										<div class="container-fluid">
											
										</div>
									</div>
								</div>
							</div><!-- g_bodyin_bodyin_bottom_rsub end -->
						</div><!-- g_bodyin_bodyin_bottom_2 end -->
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
	<!-- highcharts -->
	<script src="assets/script/libs/newhighcharts.js"></script>	
	<script src="assets/script/libs/highcharts-axis-arrow.js"></script>
	<script src="assets/script/libs/highcharts-more.js"></script>
	<script src="assets/script/libs/histogram-bellcurve.js"></script>
	<!-- highcharts end -->
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>
	<script src="assets/script/libs/numeral/numeral.min.js"></script>

	<!-- build:js ../../dist/script/modules/common/drawWaferMap.min.js -->
	<script src="src/script/modules/common/drawWaferMap.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataStatistics/dataStatisticsRender.min.js -->
	<script src="src/script/modules/dataStatistics/dataStatisticsRender.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/dataStatistics/dataStatistics.min.js -->
	<script src="src/script/modules/dataStatistics/dataStatistics.js"></script>
	<!-- endbuild -->
</body>
</html>