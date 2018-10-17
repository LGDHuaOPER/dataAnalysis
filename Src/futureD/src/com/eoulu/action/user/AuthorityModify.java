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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		UserService service = new UserServiceImpl();
		String userId = request.getParameter("userId")==null?"0":request.getParameter("userId");
		String authority = request.getParameter("authority")==null?"":request.getParameter("authority");
		boolean flag = service.updateAuthority(authority, Integer.parseInt(userId));
		if(flag){
			new LogServiceImpl().insertLog(request.getSession().getAttribute("userName").toString(), "管理员", "修改"+service.getUserName(Integer.parseInt(userId))+"的权限", request.getSession());
		}
		response.getWriter().write(new Gson().toJson(flag));
	}

}
