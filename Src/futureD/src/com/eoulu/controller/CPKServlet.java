package com.eoulu.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.CPKService;
import com.eoulu.service.impl.CPKServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class CPKServlet
 */
@WebServlet(description = "CPK图", urlPatterns = { "/CPKServlet" })
public class CPKServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CPKServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		CPKService service = new CPKServiceImpl();
		int waferId = request.getParameter("waferId") == null ? 0 : Integer.parseInt(request.getParameter("waferId"));
		String parameter = request.getParameter("parameter") == null ? "" : request.getParameter("parameter");
		Map<String, List<Double>> result = new HashMap<>();
		if (!"".equals(parameter)) {
			List<Double> ls = service.getCPK(waferId, parameter);
			result.put(parameter, ls);
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		
		List<String> paramList = service.getParameter(waferId);
		for (String param : paramList) {
			result.put(param, service.getCPK(waferId, param));
		}
		response.getWriter().write(new Gson().toJson(result));
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
