package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
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
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class GaussianDistribution
 */
@WebServlet(description = "高斯分布", urlPatterns = { "/GaussianDistribution" })
public class GaussianDistribution extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GaussianDistribution() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String parameter = request.getParameter("parameter")==null?"":request.getParameter("parameter").trim();
		double left = request.getParameter("leftRange")==null?0:Double.parseDouble(request.getParameter("leftRange")),
				right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal")),
				waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		Map<String,Object> result = new HashMap<>();
		List<String> paramList = null;
		if(!"".equals(parameter)){
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}else{
			HistogramService histogram = new HistogramServiceImpl();
			paramList =  histogram.getWaferParameter(waferId+"");	
		}
		GaussianService service = new GaussianServiceImpl();
		Map<String, List<Double>> rangeList = service.getRangList(paramList, waferId+"");
		List<Double> ls = null;
		for (int j=0,size=paramList.size();j<size;j++) {
			ls = rangeList.get(paramList.get(j));
			left = "".equals(parameter)?ls.get(0):left;
			right = "".equals(parameter)?ls.get(1):right;
			result.put(paramList.get(j), service.getGaussian(waferId, paramList.get(j), left, right, equal));
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
