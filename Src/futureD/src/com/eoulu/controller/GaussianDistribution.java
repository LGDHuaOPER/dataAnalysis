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
		double left = request.getParameter("leftRange")==null?100000000:Double.parseDouble(request.getParameter("leftRange")),
				right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal"));
			String	waferIdStr = request.getParameter("waferIdStr")==null?"0":request.getParameter("waferIdStr");
		Map<String,Object> result = new HashMap<>(),map = null,paramMap=null,waferMap=null;
		List<String> paramList = null;
		String[] waferAtt = waferIdStr.split(",");

		GaussianService service = new GaussianServiceImpl();
		if(!"".equals(parameter)){
			for(int i=0,length=waferAtt.length;i<length;i++){
				
				map = new HashMap<>();
				map.put("waferId", waferAtt[i]);
				map.put("left", left);
				map.put("right", right);
				map.put("equal", equal);
				map.put("param", parameter);
				result.put(waferAtt[i], service.getGaussian(map));
			}
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		HistogramService histogram = new HistogramServiceImpl();
		String[] paramAtt = request.getParameterValues("paramAtt[]");
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				
				paramList.add(paramAtt[i]);
			}
		}else{
			paramList  = histogram.getWaferParameter(waferIdStr);
		}
		Map<String, List<Double>> rangeList = service.getRangList(paramList, waferIdStr);
		List<Double> ls = null;
		for (int j=0,size=paramList.size();j<size;j++) {
			ls = rangeList.get(paramList.get(j));
			left = "".equals(parameter)?ls.get(0):left;
			right = "".equals(parameter)?ls.get(1):right;
			map = new HashMap<>();
			map.put("left", left);
			map.put("right", right);
			map.put("param", paramList.get(j));
			waferMap = new HashMap<>();
			for(int i=0,length=waferAtt.length;i<length;i++){
				map.put("waferId", waferAtt[i]);
				paramMap = service.getGaussian(map);
				waferMap.put(waferAtt[i], paramMap);
			}
			result.put(paramList.get(j), waferMap);
		}

		response.getWriter().write(new Gson().toJson(result));
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public static void main(String[] args) {
		String parameter = "";
		double left = 0,
				right= 0.000006;
		int equal = 8,
				waferId = 575;
		Map<String,Object> result = new HashMap<>(),map = null;
		List<String> paramList = null;
		GaussianService service = new GaussianServiceImpl();
		if(!"".equals(parameter)){
			map = new HashMap<>();
			map.put("waferId", waferId);
			map.put("left", left);
			map.put("right", right);
			map.put("equal", equal);
			map.put("param", parameter);
			result.put(parameter, service.getGaussian(map));
			return;
		}
		HistogramService histogram = new HistogramServiceImpl();
		paramList =  histogram.getWaferParameter(waferId+"");	
		Map<String, List<Double>> rangeList = service.getRangList(paramList, waferId+"");
		List<Double> ls = null;
		for (int j=1,size=paramList.size();j<size;j++) {
			System.out.println(paramList.get(j));
			ls = rangeList.get(paramList.get(j));
			left = "".equals(parameter)?ls.get(0):left;
			right = "".equals(parameter)?ls.get(1):right;
			map = new HashMap<>();
			map.put("waferId", waferId);
			map.put("left", left);
			map.put("right", right);
			map.put("param", paramList.get(j));
			result.put(paramList.get(j), service.getGaussian(map));
//			if(service.getGaussian(map).containsKey("status")){
////				System.out.println(new Gson().toJson(result));
//				break;
//			}
//			result.put(paramList.get(j), service.getGaussian(map));
		}
	System.out.println(new Gson().toJson(result));
	}
	
}
