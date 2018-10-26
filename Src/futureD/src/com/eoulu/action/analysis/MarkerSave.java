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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String coordinateId = request.getParameter("coordinateId") == null ? ""
				: request.getParameter("coordinateId").trim(),
				markerKey = request.getParameter("markerKey") == null ? "" : request.getParameter("markerKey"),
				 sParam = request.getParameter("sParameter") == null ? "" :
				 request.getParameter("sParameter").trim(),
				waferId = request.getParameter("waferId") == null ? "" : request.getParameter("waferId"),
				module = "TCF";
		String curveTypeStr[] = request.getParameterValues("curveTypeStr[]");

		boolean flag = false;
		AnalysisService service = new AnalysisServiceImpl();
		if ("X".equals(markerKey)) {
			flag = service.saveMarkerByX(Integer.parseInt(waferId), module, Integer.parseInt(coordinateId), curveTypeStr, sParam);
		}
		if ("Y".equals(markerKey)) {
			flag = service.saveMarkerByY(Integer.parseInt(waferId), module, Integer.parseInt(coordinateId), curveTypeStr, sParam);
		}
		
		boolean flag2 = service.updateCalculation(Integer.parseInt(waferId),Integer.parseInt(coordinateId));
		
		response.getWriter().write(new Gson().toJson(flag && flag2));
	}

}
