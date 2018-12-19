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
	<title>futureD工程分析-RF-SP2分析</title>
	<link rel="stylesheet" href="assets/style/common/reset.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/bootstro.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/sweetalert2.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/animate.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/awesomplete_all.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/jquery.contextMenu.min.css" type="text/css">
	<link rel="stylesheet" href="assets/style/libs/jquery-ui/jquery-ui-Draggable_Droppable.min.css" type="text/css">

	<!-- build:css ../../dist/style/modules/RF_SP2/RF_SP2.min.css -->
	<link rel="stylesheet" href="src/style/modules/RF_SP2/RF_SP2.css" type="text/css">
	<!-- endbuild -->
</head>
<body data-curpage="RF_SP2" data-curusername="${userName}" data-userauthority="${userAuthority}" data-wafer='${wafer}'>
	<div class="g_logo"><img src="assets/img/modules/dataList/logo.png" alt="logo"></div>
	<div class="g_info">
		<div class="g_info_l">futureD数据管理与分析</div>
		<div class="g_info_r bootstro" data-bootstro-title="RF-SP2引导：第二步" data-bootstro-content="<div class='well well-sm'><h4>工具区域</h4><p>在这里您可以跳转管理员页面（如果有权限），再次查看页面引导，或安全退出系统</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="1">
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
			<!-- <img src="assets/img/common/admin_32px.svg" data-iicon="glyphicon-user" alt="管理员"> --><img src="assets/img/common/help_32px.svg" data-iicon="glyphicon-question-sign" alt="操作指引" title="操作指引"><img src="assets/img/common/power_32px.svg" data-iicon="glyphicon-off" alt="安全退出" title="安全退出">
		</div>
	</div>
	<div class="g_menu"></div>
	<div class="g_body">
		<div class="g_bodyin">
			<div class="g_bodyin_tit bootstro" data-bootstro-title="RF-SP2引导：第一步" data-bootstro-content="<div class='well well-sm'><h4>路径导航栏</h4><p>在这里您可以跳转系统页面，或者跳转工程分析页面，点击右边图标可以跳转数据统计页面。</p><p>跳转前记得保存信息哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="0">
				<div class="g_bodyin_tit_l"><img src="assets/img/common/home_24px.svg" data-iicon="glyphicon-home" alt="主页"></div>
				<div class="g_bodyin_tit_r">
					<ol class="breadcrumb">
					  	<li><a href="HomeInterface">系统主页面</a></li>
					  	<li><a href="ProjectAnalysis">工程分析</a></li>
					  	<li class="active">RF-SP2分析</li>
					</ol>
					<span class="glyphicon glyphicon-stats" aria-hidden="true" title="进入数据统计功能"></span>
				</div>
			</div>
			<div class="g_bodyin_body">
				<div class="g_bodyin_bodyin">
					<div class="g_bodyin_bodyin_top bootstro" data-bootstro-title="RF-SP2引导：第三步" data-bootstro-content="<div class='well well-sm'><h4>分页区域</h4><p>在这里您可以切换分页查看操作，切换是无刷新的哟</p></div>" data-bootstro-placement="bottom" data-bootstro-html="true" data-bootstro-step="2">
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
							<div class="g_bodyin_bodyin_bottom_l bootstro" data-bootstro-title="RF-SP2引导：第四步" data-bootstro-content="<div class='well well-sm'><h4>CSV文件区域</h4><p>在这里显示的是您在工程分析选择的数据。</p><p>切换到TCF分页后，在这里显示的是CSV文件和参数计算区域，参数计算区域点击表格行可以弹出计算器。</p></div>" data-bootstro-placement="right" data-bootstro-html="true" data-bootstro-step="3">
								<div class="g_bodyin_bodyin_bottom_l_intop">
								</div>
								<div class="g_bodyin_bodyin_bottom_l_inbottom"><input type="checkbox">全选/全不选</div>
							</div><!-- g_bodyin_bodyin_bottom_l end -->
							<div class="g_bodyin_bodyin_bottom_r bootstro" data-bootstro-title="RF-SP2引导：第五步" data-bootstro-content="<div class='well well-sm'><h4>图表区域</h4><p>在这里显示的是图例，双击某个图例可以查看大图。</p><p>切换到TCF分页后，在这里显示的是具有标记Marker点功能的图表</p></div>" data-bootstro-placement="left" data-bootstro-html="true" data-bootstro-step="4">
								<div class="container-fluid fourChart_div">
									<img src="assets/img/common/detail_24px.svg" alt="" title="查看所有图例" id="RFSP2SmallLegend">
									<div class="row">
										<div class="col-sm-12 col-md-6 col-lg-6">
											<div class="chartWarp" id="picture_box1" data-itargetchart="S11_chart_S">
												<div id="picture1top" class="picturetop"></div>
												<div id="picture1bottom" class="picturebottom">
													<div class="picturebottom_in">
														<div class="picturebottom_in_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
														<div class="picturebottom_in_m">
															<div class="picturebottom_in_m_in">
																<ul>
																	<li class="">
																		<div class="pictureline">
																			<p></p>
																		</div>
																		<div class="smithdata">
																			<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S11</span>)</p>
																			<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>
																		</div>
																	</li>
																</ul>
															</div>
														</div><!-- picturebottom_in_m end -->
														<div class="picturebottom_in_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
													</div>
												</div><!-- picturebottom end -->
											</div>
										</div>
									  	<div class="col-sm-12 col-md-6 col-lg-6">
									  		<div class="chartWarp" id="picture_box2" data-itargetchart="S12_chart_S" data-iclassify="S12" data-iflag="initial">
									  			<div id="picture2top" class="picturetop"></div>
									  			<div id="picture2bottom" class="picturebottom">
									  				<div class="picturebottom_in">
														<div class="picturebottom_in_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
														<div class="picturebottom_in_m">
															<div class="picturebottom_in_m_in">
																<ul>
																	<li class="">
																		<div class="pictureline">
																			<p></p>
																		</div>
																		<div class="smithdata">
																			<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S12</span>)</p>
																			<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>
																		</div>
																	</li>
																</ul>
															</div>
														</div><!-- picturebottom_in_m end -->
														<div class="picturebottom_in_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
													</div><!-- picturebottom_in end -->
									  			</div>
									  		</div><!-- chartWarp end -->
									  	</div>
									</div><!-- row end -->
									<div class="row">
										<div class="col-sm-12 col-md-6 col-lg-6">
											<div class="chartWarp" id="picture_box3" data-itargetchart="S21_chart_S" data-iclassify="S21" data-iflag="initial">
												<div id="picture3top" class="picturetop"></div>
												<div id="picture3bottom" class="picturebottom">
													<div class="picturebottom_in">
														<div class="picturebottom_in_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
														<div class="picturebottom_in_m">
															<div class="picturebottom_in_m_in">
																<ul>
																	<li class="">
																		<div class="pictureline">
																			<p></p>
																		</div>
																		<div class="smithdata">
																			<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S21</span>)</p>
																			<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>
																		</div>
																	</li>
																</ul>
															</div>
														</div><!-- picturebottom_in_m end -->
														<div class="picturebottom_in_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
													</div><!-- picturebottom_in end -->
												</div>
											</div><!-- chartWarp end -->
										</div>
									  	<div class="col-sm-12 col-md-6 col-lg-6">
									  		<div class="chartWarp" id="picture_box4" data-itargetchart="S22_chart_S">
									  			<div id="picture4top" class="picturetop"></div>
									  			<div id="picture4bottom" class="picturebottom">
									  				<div class="picturebottom_in">
														<div class="picturebottom_in_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
														<div class="picturebottom_in_m">
															<div class="picturebottom_in_m_in">
																<ul>
																	<li class="">
																		<div class="pictureline">
																			<p></p>
																		</div>
																		<div class="smithdata">
																			<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S22</span>)</p>
																			<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>
																		</div>
																	</li>
																</ul>
															</div>
														</div><!-- picturebottom_in_m end -->
														<div class="picturebottom_in_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
													</div><!-- picturebottom_in end -->
									  			</div>
									  		</div><!-- chartWarp end -->
									  	</div>
									</div>
								</div><!-- container-fluid end -->
								<div class="container-fluid signalChart_div">
									<div class="signalChart_div_tit">
										<button type="button" class="btn btn-default backover">
										  	<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> 返回
										</button>
										<button type="button" class="btn btn-default open_del_indicatrix">
										  	<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> 查看/删除区间
										</button>
									</div>
									<div class="signalChart_div_body">
										<div id="S11_chart_S" data-iclassify="S11" data-iflag="initial"></div>
										<div id="S12_chart_S" data-iflag="initial" data-iclassify="S12"></div>
										<div id="S21_chart_S" data-iflag="initial" data-iclassify="S21"></div>
										<div id="S22_chart_S" data-iclassify="S22" data-iflag="initial"></div>
									</div>
									<div class="signalChart_div_foot">
						  				<div class="signalChart_div_foot_in">
											<div class="signalChart_div_foot_in_l"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
											<div class="signalChart_div_foot_in_m">
												<div class="signalChart_div_foot_in_m_in">
													<ul>
														<!-- <li class="">
															<div class="pictureline">
																<p></p>
															</div>
															<div class="smithdata">
																<p class="smithdata1"><span class="Smith_Paramter">1-0-S Paramter</span> (<span class="Smith_Msg1">S22</span>)</p>
																<p class="smithdata2"><span class="Smith_Paramter">1-0-S Paramter</span> : <span class="Smith_Msg2">(0.83,-0.50),25.50GHz</span></p>
															</div>
														</li> -->
													</ul>
												</div>
											</div><!-- signalChart_div_foot_in_m end -->
											<div class="signalChart_div_foot_in_r"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
										</div><!-- signalChart_div_foot_in end -->
									</div><!-- signalChart_div_foot end -->
								</div><!-- signalChart_div end -->
							</div>
						</div><!-- g_bodyin_bodyin_bottom_1 end -->
						<div class="g_bodyin_bodyin_bottom_2">
							<div class="g_bodyin_bodyin_bottom_lsub">
								<div class="g_bodyin_bodyin_bottom_lsub_top">
								</div>
								<div class="g_bodyin_bodyin_bottom_lsub_bottom">
									<table class="table table-striped table-bordered table-hover table-condensed">
										<thead>
											<tr>
												<th>参数</th>
												<th>值</th>
												<th>公式</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div><!-- g_bodyin_bodyin_bottom_lsub_bottom end -->
							</div><!-- g_bodyin_bodyin_bottom_lsub end -->
							<div class="g_bodyin_bodyin_bottom_rsub">
								<div class="g_bodyin_bodyin_bottom_rsubin">
									<div class="g_bodyin_bodyin_bottom_rsubin_tit">
										<button type="button" class="btn btn-default">
										  	<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> 打开Marker设置
										</button>
										<div class="buildMarker">
											<div class="buildMarker_body">
												<div class="container-fluid">
													<div class="row">
														<div class="col-sm-6 col-md-4 col-lg-4">以x/y为Key</div>
														<div class="col-sm-6 col-md-4 col-lg-4">
															<select id="comfirm_key_sel" class="form-control">
																<option value="请选择">请选择</option>
																<option value="x">x</option>
																<option value="y">y</option>
															</select>
														</div>
														<div class="col-sm-12 col-md-4 col-lg-4">
															<input type="button" class="btn btn-primary" id="comfirm_key" value="确定">
														</div>
													</div>
													<table class="table table-striped table-bordered table-hover table-condensed">
														<thead>
															<tr>
																<th>Marker</th>
																<th>Marker.X(Mhz)</th>
																<th>Marker.Y(dB)</th>
																<th>Key</th>
															</tr>
														</thead>
														<tbody>
														</tbody>
													</table>
												</div>
											</div>
											<div class="buildMarker_foot">
												<div class="buildMarker_footin">
													<input type="button" class="btn btn-primary" value="提交">
													<input type="button" class="btn btn-success" value="应用到其余die" title="应用到当前晶圆的其余die">
												</div>
											</div>
										</div>
									</div><!-- g_bodyin_bodyin_bottom_rsubin_tit end -->
									<div class="g_bodyin_bodyin_bottom_rsubin_body">
										<div id="markerChart"></div>
									</div>
									<div class="g_bodyin_bodyin_bottom_rsubin_foot">
										<div class="container-fluid">
											<div class="row">
												<div class="col-sm-12 col-md-12 col-lg-12"></div>
											</div>
											<div class="row">
												<div class="col-sm-12 col-md-12 col-lg-12"></div>
											</div>
										</div>
									</div><!-- g_bodyin_bodyin_bottom_rsubin_foot end -->
								</div>
							</div><!-- g_bodyin_bodyin_bottom_rsub end -->
						</div><!-- g_bodyin_bodyin_bottom_2 end -->
					</div><!-- g_bodyin_bodyin_bottom end -->
				</div><!-- g_bodyin_bodyin end -->
			</div>
		</div>
	</div>
	<!-- 额外内容 -->
	<div class="RF_SP2_cover"></div>
	<div class="subAddParam">
		<div class="subAddParam_tit">添加参数<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>
		<div class="subAddParam_body">
			<div class="container-fluid">
				<div class="row addParam">
					<div class="col-sm-4 col-md-2 col-lg-2">参数名称</div>
					<div class="col-sm-8 col-md-8 col-lg-8">
						<input type="text" class="form-control" id="calc_text"><button type="button" class="btn btn-default awesomplete_btn" aria-label="Left Align"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span></button>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-4 col-md-2 col-lg-2">表达式</div>
					<div class="col-sm-8 col-md-4 col-lg-4"><textarea id="clac_textarea" rows="10" class="form-control"></textarea></div>
					<div class="col-sm-12 col-md-6 col-lg-6">
						<div class="calcin">
							<div class="container-fluid">
								<div class="row">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：sin(3)" data-ivalue="sin()" data-ipos="-1">sin</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：cos(3)" data-ivalue="cos()" data-ipos="-1">cos</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：tan(3)" data-ivalue="tan()" data-ipos="-1">tan</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：ln(9)" data-ivalue="ln()" data-ipos="-1">ln</div></div>
								</div>
								<div class="row">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：sin(3°)" data-ivalue="sin(°)" data-ipos="-2">sin角度</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：cos(3°)" data-ivalue="cos(°)" data-ipos="-2">cos角度</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：tan(3°)" data-ivalue="tan(°)" data-ipos="-2">tan角度</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：log(3)(9)" data-ivalue="log()()" data-ipos="-3">log</div></div>
									
								</div>
								<div class="row">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：3!" data-ivalue="()!" data-ipos="-2">!</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="π" data-ipos="0">π</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="e" data-ipos="0">e</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：3^2" data-ivalue="()^()" data-ipos="-4">^</div></div>
								</div>
								<div class="row">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="(" data-ipos="0">(</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue=")" data-ipos="0">)</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="规则：√3" data-ivalue="√()" data-ipos="-1">√</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" title="打开/关闭数组软键盘" data-ivalue="Number">Num</div></div>
								</div>
								<div class="row toggleRow">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="0" data-ipos="0">0</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="1" data-ipos="0">1</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="2" data-ipos="0">2</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="3" data-ipos="0">3</div></div>
								</div>
								<div class="row toggleRow">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="4" data-ipos="0">4</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="5" data-ipos="0">5</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="6" data-ipos="0">6</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="7" data-ipos="0">7</div></div>
								</div>
								<div class="row toggleRow">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="8" data-ipos="0">8</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="9" data-ipos="0">9</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="." data-ipos="0">.</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="退格" data-ipos="0">退格</div></div>
								</div>
								<div class="row">
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="+" data-ipos="0">+</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="-" data-ipos="0">-</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="*" data-ipos="0">*</div></div>
									<div class="col-sm-3 col-md-3 col-lg-3"><div class="clac_item" data-ivalue="/" data-ipos="0">/</div></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="subAddParam_foot">
			<div class="subAddParam_footin">
				<input type="button" class="btn btn-primary" value="确定">
				<input type="button" class="btn btn-warning" value="取消">
			</div>
		</div>
	</div>
	<!-- 查看区间 -->
	<div class="indicatrix_div">
		<div class="indicatrix_tit">查看/删除区间（此面板可拖动）<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>
		<div class="indicatrix_body">
			<div class="container-fluid">
				<fieldset>
					<legend>高于区间 <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></legend>
					<table class="table table-striped table-bordered table-hover table-condensed" id="upflag_table">
						<thead>
							<tr>
								<th>X1值</th>
								<th>X2值</th>
								<th>Y0值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</fieldset>
				<fieldset>
					<legend>低于区间 <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></legend>
					<table class="table table-striped table-bordered table-hover table-condensed" id="lowflag_table">
						<thead>
							<tr>
								<th>X1值</th>
								<th>X2值</th>
								<th>Y0值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</fieldset>
			</div>
		</div>
		<div class="indicatrix_foot">
			<div class="indicatrix_footin">
				<input type="button" class="btn btn-success" value="确定并应用" disabled>
				<input type="button" class="btn btn-warning" value="取消">
				<input type="button" class="btn btn-danger" value="删除所有并重置">
			</div>
		</div>
	</div><!-- 查看区间end -->
	<div class="reRenderBtnDiv">
		<input type="button" class="btn btn-success" value="重新绘制">
	</div>
	<!-- 所有图例 -->
	<div class="allLegends">
		<div class="allLegends_tit">查看所有图例（此面板可拖动）<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>
		<div class="allLegends_body">
			<div class="container-fluid">
				
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
	<script src="assets/script/libs/awesomplete.min.js"></script>
	<script src="assets/script/libs/bootstro.js"></script>
	<script src="assets/script/common/futureD_bootstro.js"></script>
	<script src="assets/script/libs/highcharts_6.2.0.js"></script>
	<script src="assets/script/libs/highcharts-more.js"></script>
	<script src="assets/script/libs/highcharts-axis-arrow.js"></script>
	<script src="assets/script/libs/jquery-contextMenu/jquery.contextMenu.min.js"></script>
	<script src="assets/script/libs/jquery-contextMenu/jquery.ui.position.min.js"></script>
	<script src="assets/script/libs/jquery-ui/jquery-ui-Draggable_Droppable.min.js"></script>
	<!-- 下面一条手动替换，不构建 -->
	<script src="assets/script/libs/drawingSmith.js"></script>

	<!-- build:js ../../dist/script/modules/common/futureD_config.min.js -->
	<script src="src/script/modules/common/futureD_config.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/common/globalConf.min.js -->
	<script src="src/script/modules/common/globalConf.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/RF_SP2/RF_SP2.min.js -->
	<script src="src/script/modules/RF_SP2/RF_SP2.js"></script>
	<!-- endbuild -->

	<!-- build:js ../../dist/script/modules/RF_SP2/RF_SP2_render.min.js -->
	<script src="src/script/modules/RF_SP2/RF_SP2_render.js"></script>
	<!-- endbuild -->
</body>
</html>