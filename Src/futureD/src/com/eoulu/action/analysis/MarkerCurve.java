package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class MarkerCurve
 */
@WebServlet(description = "marker曲线数据", urlPatterns = { "/MarkerCurve" })
public class MarkerCurve extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MarkerCurve() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		AnalysisService service = new AnalysisServiceImpl();
		String[] curveTypeId = request.getParameterValues("curveTypeId[]");
		String sParameter = request.getParameter("sParameter")==null?"S11":request.getParameter("sParameter"),
				module = "TCF";
		//int waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		Map<String, Object> map = service.getMarkerCurve(curveTypeId, sParameter,module);
		response.getWriter().write(new Gson().toJson(map));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	
}
