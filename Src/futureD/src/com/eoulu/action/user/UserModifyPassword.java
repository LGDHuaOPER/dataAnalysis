package com.eoulu.action.user;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.UserService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.UserServiceImpl;
import com.eoulu.util.Md5Util;
import com.google.gson.Gson;

/**
 * Servlet implementation class UserModifyPassword
 */
@WebServlet(description = "用户修改个人密码", urlPatterns = { "/UserModifyPassword" })
public class UserModifyPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserModifyPassword() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String password = request.getParameter("password") == null ? "" : request.getParameter("password");
		String userName = request.getSession().getAttribute("userName").toString(), status = "";
		password = Md5Util.md5(password);
		UserService service = new UserServiceImpl();
		if (password.equals(service.getPassword(userName))) {
			status = "新密码与旧密码不能一致！";
		} else {
			boolean flag = service.updatePassword(password, userName);
			if (flag) {
				status = "修改成功！";
				new LogServiceImpl().insertLog(userName, "用户信息", "修改密码", request.getSession());
			} else {
				status = "修改失败！";
			}
		}
		response.getWriter().write(new Gson().toJson(status));
	}

}
