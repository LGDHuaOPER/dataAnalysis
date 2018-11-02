package com.eoulu.action.list;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.transfer.PageDTO;
import com.google.gson.Gson;

/**
 * Servlet implementation class DataListAjax
 */
@WebServlet(description = "数据列表", urlPatterns = { "/DataListAjax" })
public class DataListAjax extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataListAjax() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		
		String keyword = request.getParameter("keyword")==null?"":request.getParameter("keyword");
		String Parameter = request.getParameter("Parameter")==null?"":request.getParameter("Parameter");
		int currentPage = request.getParameter("currentPage")==null?1:Integer.parseInt(request.getParameter("currentPage"));
		
		WaferService service = new WaferServiceImpl();
		PageDTO page = new PageDTO();
		page.setRow(10);
		page.setPageCount(service.countWafer(keyword,Parameter,0));
		page.setCurrentPage(currentPage<page.getTotalPage()?currentPage:1);

		Map<String,Object> result = new HashMap<>();
		result.put("waferInfo", service.listWafer(page, keyword,Parameter,0));
		result.put("currentPage", currentPage);
		result.put("totalPage", page.getTotalPage());
		
		response.getWriter().write(new Gson().toJson(result));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
