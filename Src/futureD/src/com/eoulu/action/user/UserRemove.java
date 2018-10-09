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
 * Servlet implementation class UserRemove
 */
@WebServlet(description = "删除用户", urlPatterns = { "/UserRemove" })
public class UserRemove extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserRemove() {
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
		response.setContentType("text/html;charset=utf-8");
		int userId = request.getParameter("userId")==null?0:Integer.parseInt(request.getParameter("userId"));
		
		UserService service = new UserServiceImpl();
		
		response.getWriter().write(new Gson().toJson(service.remove(userId)));
		
	}

}
