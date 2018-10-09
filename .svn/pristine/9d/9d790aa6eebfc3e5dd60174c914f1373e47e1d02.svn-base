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
 * Servlet implementation class DataList
 */
@WebServlet(description = "数据列表", urlPatterns = { "/DataList" })
public class DataList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataList() {
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
		page.setCurrentPage(currentPage);
		page.setRow(10);
		page.setPageCount(service.countWafer(keyword,Parameter));
		request.setAttribute("waferList", service.listWafer(page, keyword,Parameter));
		if(!"".equals(keyword)){
			request.setAttribute("keyword", keyword);
		}
		
		request.setAttribute("currentPage", currentPage);
		request.setAttribute("totalPage", page.getTotalPage());
		request.setAttribute("userList", service.getAllUser());
		request.setAttribute("categoryList", service.getProductCategory());
		request.getRequestDispatcher("./index/index.jsp").forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public static void main(String[] args) {
		WaferService service = new WaferServiceImpl();
		String keyword = "";
		int currentPage = 1;
		PageDTO page = new PageDTO();
		page.setCurrentPage(currentPage);
		page.setRow(10);
		//page.setPageCount(service.countWafer(keyword));
//		System.out.println( service.listWafer(page, keyword));
		//System.out.println(service.countWafer(keyword));
		System.out.println(page.getTotalPage());
//		System.out.println(service.getAllUser());
//		System.out.println(service.remove("2"));
		
	}
}
