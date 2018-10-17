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
 * Servlet implementation class AnalysisFile
 */
@WebServlet(description = "曲线文件", urlPatterns = { "/AnalysisFile" })
public class AnalysisFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AnalysisFile() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		AnalysisService service = new AnalysisServiceImpl();
		String[] wafer = request.getParameterValues("wafer[]");
		Map<String, Object> map = service.getCurveFile(wafer);
		response.getWriter().write(new Gson().toJson(map));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
