package com.eoulu.action.login;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import com.eoulu.util.Md5Util;
import com.google.gson.Gson;

/**
 * Servlet implementation class Login
 */
@WebServlet(description = "登陆", urlPatterns = { "/Login" })
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
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
		String userName = request.getParameter("userName")==null?"":request.getParameter("userName"),
				password = request.getParameter("password")==null?"":request.getParameter("password"),
						loginStatus = request.getParameter("loginStatus")==null?"":request.getParameter("loginStatus");
		password = Md5Util.md5(password);
		UserService service = new UserServiceImpl();
		String compare = "";
		if(!"".equals(userName)){
			compare = service.getPassword(userName);
			System.out.println("compare:"+compare);
		}
		String result = "";
		if(!"".equals(userName) && !"".equals(password) && compare.equals(password)){
			result = "success";
			HttpSession session = request.getSession();
			session.setMaxInactiveInterval(-1);//设置session永不过期
			session.setAttribute("userName", userName);
			session.setAttribute("loginStatus", loginStatus);
			List<String> userAuthority =  service.getAuthority(userName);
			session.setAttribute("userAuthority", userAuthority);
//			new iPLocation().getIPAndCity(request);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			service.updateLoginDate(userName, df.format(new Date()));
		}else{
			result = "fail";
		}
		new LogServiceImpl().delete();
		response.getWriter().write(new Gson().toJson(result));
	}
	
}
