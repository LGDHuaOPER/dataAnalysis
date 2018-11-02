package com.eoulu.controller.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.transfer.PageDTO;

/**
 * Servlet implementation class RecycleBin
 */
@WebServlet(description = "回收站", urlPatterns = { "/RecycleBin" })
public class RecycleBin extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RecycleBin() {
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
		page.setPageCount(service.countWafer(keyword,Parameter,1));
		page.setCurrentPage(currentPage<page.getTotalPage()?currentPage:1);
		request.setAttribute("waferList", service.listWafer(page, keyword,Parameter,1));
		if(!"".equals(keyword)){
			request.setAttribute("keyword", keyword);
		}
		request.setAttribute("currentPage", currentPage);
		request.setAttribute("totalPage", page.getTotalPage());
		request.getRequestDispatcher("").forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
