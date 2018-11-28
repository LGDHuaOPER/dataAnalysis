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
		String userId = request.getParameter("userId")==null?"":request.getParameter("userId");
		boolean flag = false;
		if("".equals(userId)){
			response.getWriter().write(new Gson().toJson(flag));
			return;
		}
		UserService service = new UserServiceImpl();
		 flag = service.remove(userId);
		if(flag){
			new LogServiceImpl().insertLog(request.getSession().getAttribute("userName").toString(), "管理员", "删除用户:"+service.getUserName(userId), request.getSession());
		}
		response.getWriter().write(new Gson().toJson(flag));
		
	}

}
