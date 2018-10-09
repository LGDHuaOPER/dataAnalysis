package com.eoulu.action.user;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.UserService;
import com.eoulu.service.impl.UserServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Authority
 */
@WebServlet(description = "所有权限", urlPatterns = { "/Authority" })
public class Authority extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Authority() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		UserService service = new UserServiceImpl();
		int  userId = request.getParameter("userId")==null?0:Integer.parseInt(request.getParameter("userId"));
		response.getWriter().write(new Gson().toJson(service.listAuthority(userId)));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		UserService service = new UserServiceImpl();
		int  userId = 2;
		String authority = "1,2";
//		System.out.println(service.listAuthority(userId));
		System.out.println(service.updateAuthority(authority, userId));
	}

}
