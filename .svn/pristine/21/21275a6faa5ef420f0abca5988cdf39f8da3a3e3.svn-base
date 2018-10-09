package com.eoulu.controller.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.entity.WaferDO;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class DataListUpdate
 */
@WebServlet(description = "数据列表修改", urlPatterns = { "/DataListUpdate" })
public class DataListUpdate extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataListUpdate() {
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
		WaferService service = new WaferServiceImpl();
		String productCategory = request.getParameter("productCategory")==null?"":request.getParameter("productCategory").trim();
		int testOperator = request.getParameter("testOperator")==null?0:Integer.parseInt(request.getParameter("testOperator"));
		String testEndDate = request.getParameter("testEndDate")==null?"":request.getParameter("testEndDate");
		String description = request.getParameter("description")==null?"":request.getParameter("description").trim();
		int waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		WaferDO wafer = new WaferDO();
		wafer.setDescription(description);
		wafer.setTestEndDate(testEndDate);
		wafer.setTestOperator(testOperator);
		wafer.setProductCategory(productCategory);
		wafer.setWaferId(waferId);
		response.getWriter().write(new Gson().toJson(service.update(wafer)));
		
	}

}
