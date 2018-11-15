package com.eoulu.controller.analysis;

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
 * Servlet implementation class DataAnalysis
 */
@WebServlet(description = "工程分析", urlPatterns = { "/ProjectAnalysis" })
public class ProjectAnalysis extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProjectAnalysis() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//		String keyword = request.getParameter("keyword")==null?"":request.getParameter("keyword");
//		int currentPage = request.getParameter("currentPage")==null?1:Integer.parseInt(request.getParameter("currentPage"));
//		String Parameter = request.getParameter("Parameter")==null?"":request.getParameter("Parameter");
//		WaferService service = new WaferServiceImpl();
//		PageDTO page = new PageDTO();
//		page.setCurrentPage(currentPage);
//		page.setRow(10);
//		page.setPageCount(service.countWafer(keyword,Parameter,0));
//		request.setAttribute("waferList", service.listWafer(page, keyword,Parameter,0));
//		if(!"".equals(keyword)){
//			request.setAttribute("keyword", keyword);
//		}
//		
//		request.setAttribute("currentPage", currentPage);
//		request.setAttribute("totalPage", page.getPageCount());
		request.getRequestDispatcher("./Analysis/Analysis.jsp").forward(request, response);
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
