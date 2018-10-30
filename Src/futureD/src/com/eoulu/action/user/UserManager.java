package com.eoulu.action.user;

import java.io.IOException;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.UserService;
import com.eoulu.service.impl.UserServiceImpl;
import com.eoulu.transfer.PageDTO;
import com.google.gson.Gson;

/**
 * Servlet implementation class UserManager
 */
@WebServlet(description = "用户管理", urlPatterns = { "/UserManager" })
public class UserManager extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserManager() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		UserService service = new UserServiceImpl();
		
		String keyword = request.getParameter("keyword")==null?"":request.getParameter("keyword");
		String currentPage = request.getParameter("currentPage")==null?"1":request.getParameter("currentPage");
		PageDTO page = new PageDTO();
		page.setCurrentPage(Integer.parseInt(currentPage));
		page.setRow(10);
		page.setPageCount(service.countUser( keyword));
		String userName = request.getSession().getAttribute("userName").toString();
		String userId = service.getUserId(userName)==null?"0":service.getUserId(userName);
		Hashtable<String, Object> table = new Hashtable<>();
		table.put("userList", service.listUserByPage(page,  keyword));
		table.put("currentPage", currentPage);
		table.put("totalPage", page.getTotalPage());
		table.put("allRole", service.listRole());
		table.put("currentRole", service.getRoleName(Integer.parseInt(userId)));
		
		response.getWriter().write(new Gson().toJson(table));
		
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}