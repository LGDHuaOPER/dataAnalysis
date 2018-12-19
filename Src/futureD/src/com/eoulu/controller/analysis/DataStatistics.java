package com.eoulu.controller.analysis;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class DataStatistics
 */
@WebServlet(description = "数据分析", urlPatterns = { "/DataStatistics" })
public class DataStatistics extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataStatistics() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		String[] waferId = request.getParameterValues("waferId[]");
		String[] waferNO = request.getParameterValues("waferNO[]");
		Map<String,Object> map = new HashMap<>();
		map.put("waferId", waferId);
		map.put("waferNO", waferNO);
		request.setAttribute("datas", new Gson().toJson(map));
		request.getRequestDispatcher("/WEB-INF/html/dataStatistics.jsp").forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
