package com.eoulu.action.user;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.entity.UserDO;
import com.eoulu.service.UserService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.UserServiceImpl;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.BaseEncrypt;
import com.eoulu.util.Md5Util;
import com.google.gson.Gson;

/**
 * Servlet implementation class UserOperate
 */
@WebServlet(description = "用户的添加/修改", urlPatterns = { "/UserOperate" })
public class UserOperate extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserOperate() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String result = "";
		response.setContentType("text/html;charset=utf-8");
		int userId = request.getParameter("userId")==null?0:Integer.parseInt(request.getParameter("userId"));
		String userName = request.getParameter("userName")==null?"":request.getParameter("userName");
		String password = request.getParameter("password")==null?"":request.getParameter("password");
		String sex = request.getParameter("sex")==null?"":request.getParameter("sex");
		String telephone = request.getParameter("telephone")==null?"":request.getParameter("telephone");
		String email = request.getParameter("email")==null?"":request.getParameter("email");
		int roleId = request.getParameter("roleId")==null?0:Integer.parseInt(request.getParameter("roleId"));
		if(!"".equals(password)){
			password = Md5Util.md5(password);
		}
		UserService service = new UserServiceImpl();
		UserDO user = new UserDO();
		user.setUserId(userId);
		user.setUserName(userName);
		user.setPassword(password);
		user.setSex(sex);
		user.setTelephone(telephone);
		user.setEmail(email);
		user.setRoleId(roleId);
		
		if( userId == 0 ){
			result = service.saveUser(user);
			
		}else{
			result = service.updateUser(user)?"修改成功！":"修改失败！";
		}
		String description = "";
		if("添加成功！".equals(result)){
			description = "创建用户"+userName;
		}
		if("修改成功！".equals(result)){
			description = "修改用户"+userName+"的信息";
		}
		
		new LogServiceImpl().insertLog(request.getSession().getAttribute("userName").toString(), "管理员", description, request.getSession());
		response.getWriter().write(new Gson().toJson(result));
		
	}
	
	public static void main(String[] args) {
		int userId = 3;

		String userName = "TEST123";
		String password = "EOULU2017";
		String sex = "男";
		String telephone = "1235";
		String email = "test";
		int roleId = 2;
		if(!"".equals(password)){
			password = Md5Util.md5(password);
		}
		System.out.println(password);
		UserService service = new UserServiceImpl();
		UserDO user = new UserDO();
		user.setUserId(userId);
		user.setUserName(userName);
		user.setPassword(password);
		user.setSex(sex);
		user.setTelephone(telephone);
		user.setEmail(email);
		user.setRoleId(roleId);
		String result = "";
//		if( userId == 0 ){
//			result = service.saveUser(user);
//		}else{
//			result = service.updateUser(user)?"修改成功！":"修改失败！";
//		}
//		System.out.println(result);
//		System.out.println(service.remove(userId));
		PageDTO page = new PageDTO();
		page.setCurrentPage(1);
		page.setRow(10);
//		System.out.println(service.listUserByPage(page, "操作账户", "Ad"));
//		System.out.println(service.countUser("操作账户", "Ad"));
	}

}
