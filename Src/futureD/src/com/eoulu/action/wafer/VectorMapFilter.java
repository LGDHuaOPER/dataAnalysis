package com.eoulu.action.wafer;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferMapService;
import com.eoulu.service.impl.WaferMapServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class VectorMapFilter
 */
@WebServlet(description = "矢量map 过滤", urlPatterns = { "/VectorMapFilter" })
public class VectorMapFilter extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VectorMapFilter() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		String subdieName = request.getParameter("subdie")==null?"":request.getParameter("subdie"),
				deviceGroup = request.getParameter("deviceGroup")==null?"":request.getParameter("deviceGroup");
		WaferMapService service = new WaferMapServiceImpl();
		response.getWriter().write(new Gson().toJson(service.getVectorMap(waferId, subdieName, deviceGroup)));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
