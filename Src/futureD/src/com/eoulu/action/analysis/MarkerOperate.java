package com.eoulu.action.analysis;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
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
 * Servlet implementation class MarkerOperate
 */
@WebServlet(description = "marker的增删改", urlPatterns = { "/MarkerOperate" })
public class MarkerOperate extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MarkerOperate() {
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
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		Map<String, String[]> paramMap = request.getParameterMap();
		String classify = request.getParameter("classify") == null ? "" : request.getParameter("classify").trim(),
						curveTypeId = request.getParameter("curveTypeId") == null ? "":request.getParameter("curveTypeId");
		int waferId = request.getParameter("waferId") == null ? 0 : Integer.parseInt(request.getParameter("waferId"));

		AnalysisService service = new AnalysisServiceImpl();
		boolean flag = false;
		switch (classify) {
		case "add":
			flag = service.insertMarker(paramMap, waferId,"TCF");
			response.getWriter().write(new Gson().toJson(flag));
			break;

		case "modify":
			flag = service.updateMarker(paramMap, waferId,"TCF");
			response.getWriter().write(new Gson().toJson(flag));
			break;

		case "remove":
			flag = service.deleteMarker(curveTypeId);
			response.getWriter().write(new Gson().toJson(flag));
			break;
		}

	}

}
