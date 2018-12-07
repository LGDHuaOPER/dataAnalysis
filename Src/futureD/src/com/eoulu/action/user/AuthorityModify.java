package com.eoulu.action.user;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.eoulu.service.UserService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.UserServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class AuthorityModify
 */
@WebServlet(description = "权限修改", urlPatterns = { "/AuthorityModify" })
public class AuthorityModify extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AuthorityModify() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		HttpSession session = request.getSession();
		UserService service = new UserServiceImpl();
		String userId = request.getParameter("userId") == null ? "0" : request.getParameter("userId"),
				authority = (request.getParameter("authority") == null || "".equals(request.getParameter("authority")))
						? "" : request.getParameter("authority"),
				userName = session.getAttribute("userName").toString();
		int roleId = service.getRoleId(Integer.parseInt(userId));
		if ("".equals(authority)) {
			if (roleId == 2 || roleId == 3) {
				authority += "17";
			}
		} else {
			if (roleId == 2 || roleId == 3) {
				authority += ",17";
			}
		}
		boolean flag = service.updateAuthority(authority, Integer.parseInt(userId));
		if (flag) {
			List<String> userAuthority = service.getAuthority(userName);
			session.setAttribute("userAuthority", userAuthority);
			new LogServiceImpl().insertLog(userName, "管理员", "修改" + service.getUserName(userId) + "的权限",
					request.getSession());
		}
		response.getWriter().write(new Gson().toJson(flag));
	}

}
