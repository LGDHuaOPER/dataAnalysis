<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<jsp:useBean id="now" class="java.util.Date" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>futureD登录页面</title>
		<link  rel="stylesheet" href="./css/admin.css" />
	</head>
	<body>
		<!-- 	头部开始  top.jsp-->
		<!--若使用此结果，缺少头部导航样式可去top.css里面复制过来  -->
		 <div class="home_head">
			<div class="headL">futureD数据管理与数据分析</div>
			<div class="headR">
				<div class="signOut">退出</div>
				<div class="helpManual"></div>
				<div class="account">${userName}</div>
				
			</div>
		 </div> 
		<!-- 换上top.jsp报错500，你可以再调试下 -->
		<%-- 	<%@include file="/futureD/Top/top.jsp"%> --%>
		<%-- <jsp:include   page="top.jsp" flush="true"/> --%>
		<div class="admin_body">
			<div class="breadNav">
				<span class="projectName">futureD /</span>
				<span class="breadSecond">管理员</span>
				<span class="breadThird"></span>
			</div>
			<div class="adminContent1">
				<div class="adminMember">
					<span class="adminMember_title">你可以快速进行成员管理</span>
					<div class="adminMember_bg"><img src="./image/adminMember.png" alt=""></div>
				</div>
	
				<div class="adminRecord">
					<span class="adminRecord_title">你可以快速查看操作日志</span>
					<div  class="adminRecord_bg"><img src="./image/adminRecord.png" alt=""></div>
				</div>
			</div>
	
			<div class="adminContent2">
				<div class="adminMember_top">
					<div class="addMember"><img src="./image/adminMember_add.png" alt=""></div>
					<div class="searchMember">
						<input type="text" value="" placeholder="请输入关键词查找" class="searchMember_input">
						<span class="searchMember_btn"></span>
					</div>
				</div>
				<div class="adminMember_body">
					<div class="adminMember_tableTitle">
						<ul>
							<li class="check_title"><input type="checkbox"></li>
							<li class="num_title">序号</li>
							<li class="account_title">用户名</li>
							<li class="sex_title">性别</li>
							<li class="phone_title">联系电话</li>
							<li class="email_title">电子邮箱</li>
							<li class="part_title">角色</li>
							<li class="active_title">操作</li>
						</ul>
					</div>
					<div class="adminMember_tableContent">
						<ul>
							<li class="check_content"><input type="checkbox"></li>
							<li class="num_content">1</li>
							<li class="account_content">lw123</li>
							<li class="sex_content">男</li>
							<li class="phone_content">12345678965</li>
							<li class="email_content">12334566@eoulu.com</li>
							<li class="part_content">超级管理员</li>
							<li class="active_content">
								<span class="edit"><img src="./image/edit.png" alt=""></span>
								<span class="delete"><img src="./image/delete.png" alt=""></span>
								<span class="right"><img src="./image/right.png" alt=""></span>
							</li>
						</ul>
						
						
	
					</div>
				</div>
				<!--成员管理跳页组件  -->
				<div class="adminMember_jumpPage">
					 
				</div>
			
			<div class="adminContent3">
				<div class="adminRecord_top">
					<div class="exportRecord_Icon"><img src="./image/exportRecord.png" alt=""></div>
					<div class="searchRecord">
						<input type="text" value="" placeholder="请输入关键词查找" class="searchRecord_input">
						<span class="searchRecord_btn"></span>
					</div>
				</div>
				<div class="adminRecord_body">
					<div class="adminRecord_tableTitle">
						<ul>
							<li class="check_title"><input type="checkbox"></li>
							<li class="num_title">序号</li>
							<li class="account_title">操作账号</li>
							<li class="whichPage_title">页面</li>
							<li class="record_title">操作记录</li>
							<li class="date_title">操作日期</li>
							<li class="time_title">操作时间</li>
							<li class="IpNum_title">IP地址</li>
							<li class="position_title">地理位置</li>
						</ul>
					</div>
					<div class="adminRecord_tableContent">
						<ul>
							<li class="check_content"><input type="checkbox"></li>
							<li class="num_content">1</li>
							<li class="account_content">lw123</li>
							<li class="whichPage_content">数据列表</li>
							<li class="record_content">上传-数据文件-Eoulu12334</li>
							<li class="date_content">2018-09-26</li>
							<li class="time_content">11:43</li>
							<li class="IpNum_content">117.42.455.135</li>
							<li class="position_content">苏州</li>
						</ul>
						
						
	
					</div>
				</div>
				<!--  -->
				<div class="adminRecord_jumpPage">
				<!--  日志跳页组件-->		
				</div>
				</div>
			</div>
			
		</div>
		<!--添加*************  -->
		<div class="addMember_box">
			<div class="addMemberBox_title">
				<span class="tite_L">添加成员信息</span>
				<span class="tite_R"></span>
			</div>
			<div class="addMemberBox_Content">
				<ul>
					<li>
						<p>
							<span class="add_spanTitle">用户名</span>
							<input type="text" class="add_userName add_input">
						</p>
						<p>
							<span class="add_spanTitle">性别</span>
							<select name="" id=""  class="add_userSex add_select">
								<option value="">未选择</option>
								<option value="男">男</option>
								<option value="女">女</option>
							</select>
						</p>
					</li>
				</ul>
				<ul>
					<li>
						<p>
							<span class="add_spanTitle">联系电话</span>
							<input type="text" class="add_input">
						</p>
						<p>
							<span class="add_spanTitle">电子邮箱</span>
							<input type="text" class="add_input">
						</p>
					</li>
				</ul>
				<ul>
					<li>
						<p>
							<span class="add_spanTitle">角色</span>
							<select name="" id=""  class="add_userSex add_select">
								<option value="">未选择</option>
								<option value="男">成员</option>
								<option value="女">管理员</option>
								<option value="女">超级管理员</option>
							</select>
						</p>
					</li>
				</ul>
			</div>
			<div class="addMember_btn">
				<span class="add_OK">确定</span>
				<span class="add_Cancle">取消</span>
			</div>
		</div>
		<!--修改*************  -->
		<div class="editMember_box">
			<div class="editMemberBox_title">
				<span class="tite_L">修改成员信息</span>
				<span class="tite_R"></span>
			</div>
			<div class="editMemberBox_Content">
				<ul>
					<li>
						<p>
							<span class="edit_spanTitle">用户名</span>
							<input type="text" class="edit_userName edit_input">
						</p>
						<p>
							<span class="edit_spanTitle">性别</span>
							<select name="" id=""  class="edit_userSex edit_select">
								<option value="">未选择</option>
								<option value="男">男</option>
								<option value="女">女</option>
							</select>
						</p>
					</li>
				</ul>
				<ul>
					<li>
						<p>
							<span class="edit_spanTitle">联系电话</span>
							<input type="text" class="edit_input">
						</p>
						<p>
							<span class="edit_spanTitle">电子邮箱</span>
							<input type="text" class="edit_input">
						</p>
					</li>
				</ul>
				<ul>
					<li>
						<p>
							<span class="edit_spanTitle">角色</span>
							<select name="" id=""  class="edit_userSex edit_select">
								<option value="">未选择</option>
								<option value="男">成员</option>
								<option value="女">管理员</option>
								<option value="女">超级管理员</option>
							</select>
						</p>
					</li>
				</ul>
			</div>
			<div class="editMember_btn">
				<span class="edit_OK">确定</span>
				<span class="edit_Cancle">取消</span>
			</div>
		</div>
		<!--授权*************  -->
		<div class="giveRight_box">
			<div class="giveRightBox_title">
				<span class="tite_L">授权管理</span>
				<span class="tite_R"></span>
			</div>
			<div class="giveRightBox_Content">
				<div>
					<ul>
						<li>
							<p class="giveRightBox_ContentL">
								<input type="checkbox">
								<span class="whichPage_right">数据列表</span>
							</p>
							<p class="giveRightBox_ContentR">
								<input type="checkbox"><span class="whichRight">添加数据</span>
								<input type="checkbox"><span class="whichRight">删除数据</span>
								<input type="checkbox"><span class="whichRight">修改数据</span>
								<input type="checkbox"><span class="whichRight">回收站</span>
							</p>
						</li>
					</ul>
					<ul>
						<li>
							<p class="giveRightBox_ContentL">
								<input type="checkbox">
								<span class="whichPage_right">数据列表</span>
							</p>
							<p class="giveRightBox_ContentR">
								<input type="checkbox"><span class="whichRight">添加数据</span>
								<input type="checkbox"><span class="whichRight">删除数据</span>
								<input type="checkbox"><span class="whichRight">修改数据</span>
								<input type="checkbox"><span class="whichRight">回收站</span>
							</p>
						</li>
					</ul>
					<ul>
						<li>
							<p class="giveRightBox_ContentL">
								<input type="checkbox">
								<span class="whichPage_right">数据列表</span>
							</p>
							<p class="giveRightBox_ContentR">
								<input type="checkbox"><span  class="whichRight">添加数据</span>
								<input type="checkbox"><span  class="whichRight">删除数据</span>
								<input type="checkbox"><span  class="whichRight">修改数据</span>
								<input type="checkbox"><span  class="whichRight">回收站</span>
							</p>
						</li>
					</ul>
				</div>
				<div class="chooseAll">
					<input type="checkbox">
					<span class="chooseAll_title">选择所有</span>
				</div>
			</div>
	
			<div class="giveRightBox_btn">
				<span class="right_OK">确定</span>
				<span class="right_Cancle">取消</span>
			</div>
		</div>
		<!--mask*************  -->
		<div class="mask"></div>
		
		<!--jq文件路径你看着调整  -->
		<script src="./Login/js/jquery-3.3.1.min.js"></script>
		<script src="./js/admin.js"></script>
	</body>
</html>