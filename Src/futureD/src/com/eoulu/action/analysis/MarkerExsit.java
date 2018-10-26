package com.eoulu.action.analysis;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class MarkerExsit
 */
@WebServlet(description = "marker是否存在", urlPatterns = { "/MarkerExsit" })
public class MarkerExsit extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MarkerExsit() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String marker = request.getParameter("markerName")==null?"":request.getParameter("markerName").trim(),
				sParameter = request.getParameter("sParameter")==null?"":request.getParameter("sParameter").trim(),
						waferId = request.getParameter("waferId")==null?"":request.getParameter("waferId").trim();
		AnalysisService service = new AnalysisServiceImpl();
		response.getWriter().write(new Gson().toJson(service.getMarkerExsit(Integer.parseInt(waferId), marker, "TCF", sParameter)));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
