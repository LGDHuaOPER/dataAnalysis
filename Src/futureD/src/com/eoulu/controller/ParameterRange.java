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

import com.eoulu.service.GaussianService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.YieldService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.eoulu.service.impl.YieldServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class ParameterRange
 */
@WebServlet(description = "参数以及参数范围", urlPatterns = { "/ParameterRange" })
public class ParameterRange extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ParameterRange() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim();
		HistogramService histogram = new HistogramServiceImpl();
		List<String> paramList  = histogram.getWaferParameter(waferIdStr);
		YieldService yieldService = new YieldServiceImpl();
		
		Map<String,List<Double>> rangeList = yieldService.getRangeList(waferIdStr, paramList);
		Map<String,Object> result = new HashMap<>();
		result.put("paramList", paramList);
		result.put("rangeList", rangeList);
		response.getWriter().write(new Gson().toJson(result));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
