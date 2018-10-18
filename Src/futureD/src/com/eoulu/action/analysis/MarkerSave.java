package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class MarkerSave
 */
@WebServlet(description = "marker与计算公式存储", urlPatterns = { "/MarkerSave" })
public class MarkerSave extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MarkerSave() {
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

		String[] marker = request.getParameterValues("marker[]");
		String[] calculation = request.getParameterValues("calculation[]");
		String[] customParameter = request.getParameterValues("customParameter[]");
		String[] calculationResult = request.getParameterValues("calculationResult[]");
		String waferId = request.getParameter("waferId")==null?"":request.getParameter("waferId");
		String sParameter = request.getParameter("sParameter")==null?"":request.getParameter("sParameter"),module="TCF";
		AnalysisService service = new AnalysisServiceImpl();
		response.getWriter().write(new Gson().toJson(service.saveMarker(marker, calculation, customParameter, calculationResult, waferId, sParameter, module)));
	}

}
