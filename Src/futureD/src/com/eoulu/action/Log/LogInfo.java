package com.eoulu.action.Log;

import java.io.IOException;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.LogService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.transfer.PageDTO;
import com.google.gson.Gson;

/**
 * Servlet implementation class LogInfo
 */
@WebServlet(description = "日志信息", urlPatterns = { "/LogInfo" })
public class LogInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogInfo() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		LogService service = new LogServiceImpl();
		int currentPage = request.getParameter("currentPage")==null?0:Integer.parseInt(request.getParameter("currentPage"));
		String keyword = request.getParameter("keyword")==null?"":request.getParameter("keyword");
		PageDTO page = new PageDTO();
		int totalCount = service.countLog(keyword);
		page.setRow(10);
		page.setPageCount(totalCount);
		currentPage = currentPage<=page.getTotalPage()?currentPage:1;
		page.setCurrentPage(currentPage);
		Hashtable<String, Object> table = new Hashtable<>();
		table.put("logList", service.listLog(page,keyword));
		table.put("currentPage", currentPage);
		table.put("totalCount", totalCount);
		table.put("totalPage", page.getTotalPage());
		response.getWriter().write(new Gson().toJson(table));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
