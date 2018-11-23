<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- 为移动设备添加 viewport -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, minimum-scale=1, user-scalable=no">
	<title>futureD数据对比</title>
	<link rel="stylesheet" href="../style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="../style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="../style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="../style/common/pagination.min.css" type="text/css">
	<link rel="stylesheet" href="../style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="../style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="../style/modules/dataCompare/dataCompare.css" type="text/css">
</head>
<body data-curpage="dataCompare">
	<div class="g_logo"><img src="../img/modules/dataList/logo.png" alt="logo"></div>
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
		<div class="g_info_r bootstro" data-bootstro-title="数据对比引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以进行搜索，跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><span class="glyphicon glyphicon-off" aria-hidden="true"></span></div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="数据对比引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></div>
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
						    							<th><input type="checkbox" id="checkAll"></th>
						    							<th>产品类别</th>
						    							<th>设备/产品类型</th>
						    							<th>批次编号</th>
						    							<th>晶圆编号</th>
						    							<th>合格率</th>
						    							<th>测试时间</th>
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
						    			</div><!-- body_div end -->
						    		</div>
						    		<div class="home_dataCompare_bottom">
						    			<div class="left_div bootstro" data-bootstro-title="数据对比引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>被选中的数据</h4><p>被选中的数据将会放在这里，以便查阅</p></div>" data-bootstro-placement="top" data-bootstro-html="true" data-bootstro-step="3">
						    				选中的数据
						    				<table class="table table-striped">
						    					<thead>
						    						<th>产品类别</th>
						    						<th>设备/产品类型</th>
						    						<th>批次编号</th>
						    						<th>晶圆编号</th>
						    						<th>合格率</th>
						    					</thead>
						    					<tbody></tbody>
						    				</table>
						    			</div>
						    			<div class="right_div bootstro" data-bootstro-title="数据对比引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>共有参数列表</h4><p>被选中的数据的共有参数将会放在这里，选择不同的参数将会有不同的规则来分析数据</p></div>" data-bootstro-placement="top" data-bootstro-html="true" data-bootstro-step="4">
						    				<div class="panel panel-info">
						    				  	<div class="panel-heading">
						    				    	<h3 class="panel-title">共有参数</h3>
						    				  	</div>
						    				  <div class="panel-body">
						    				   		<!-- List group -->
						    				   		<ul class="list-group" id="home_param_ul">
						    				   		    <li class="list-group-item" data-iparam="TotalYield"><span class="badge">选中</span>Total Yield</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数2"><span class="badge">选中</span>共有参数2</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数3"><span class="badge">选中</span>共有参数3</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数4"><span class="badge">选中</span>共有参数4</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数5"><span class="badge">选中</span>共有参数5</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数6"><span class="badge">选中</span>共有参数6</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数7"><span class="badge">选中</span>共有参数7</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数8"><span class="badge">选中</span>共有参数8</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数9"><span class="badge">选中</span>共有参数9</li>
						    				   		    <li class="list-group-item" data-iparam="共有参数10"><span class="badge">选中</span>共有参数10</li>
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
	<script src="../script/libs/jquery-3.3.1.min.js"></script>
	<script src="../script/libs/bootstrap.min.js"></script>
	<script src="../script/libs/lodash.min.js"></script>
	<script src="../script/libs/store.legacy.min.js"></script>
	<script src="../script/libs/moment-with-locales.min.js"></script>
	<script src="../script/libs/sweetalert2.min.js"></script>
	<script src="../script/libs/a_polyfill_for_ES6_Promises_for_IE11_and_Android.js"></script>
	<script src="../script/common/futureDT2session.js"></script>
	<script src="../script/common/pagination.min.js"></script>
	<script src="../script/libs/newhighcharts.js"></script>	
	<script src="../script/libs/highcharts-axis-arrow.js"></script>
	<script src="../script/libs/highcharts-more.js"></script>
	<script src="../script/libs/histogram-bellcurve.js"></script>
	<script src="../script/libs/bootstro.js"></script>
	<script src="../script/common/futureD_bootstro.js"></script>
	<script src="../script/common/futureD_config.js"></script>
	<script src="../script/common/mock.js"></script>
	<!-- <script src="../script/libs/progressbar.min.js"></script> -->
	<script src="../script/modules/dataCompare/dataCompareRenderChart.js"></script>
	<script src="../script/libs/drawWaferMap.js"></script>
	<script src="../script/modules/dataCompare/dataCompare.js"></script>
</body>
</html>