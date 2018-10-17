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
 * Servlet implementation class UserNameQuery
 */
@WebServlet(description = "用户是否已经存在", urlPatterns = { "/UserNameQuery" })
public class UserNameQuery extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserNameQuery() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String userName = request.getParameter("userName")==null?"":request.getParameter("userName").trim();
		UserService service = new UserServiceImpl();
		String status = "";
		if(!"".equals(service.getUserId(userName))){
			status = "用户已存在！";
		}
	
		response.getWriter().write(new Gson().toJson(status));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
